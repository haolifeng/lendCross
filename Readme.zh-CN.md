# lendCross（跨链借贷中间件）

> [English](Readme.md) | [简体中文](Readme.zh-CN.md)
>
> **用户可以在源链（Ethereum 等）上发起存款 / 还款，资产在 Wanchain 上自动以 cToken 形式入账或代为偿还借贷，期间无需自行操作 Wanchain RPC。**

本项目是构建在两套已有系统之上的中间件：

* **[Wanchain 跨链桥](https://www.wanchain.org/)** — Storeman Group（SMG）负责在源链上锁定 / 销毁，并在 Wanchain 上释放对应资产。
* **[WanLend](https://wanlend.com/)** — Wanchain 上 Compound 风格的借贷市场，每种底层资产都被包装成 cToken（如 `wanUSDT` → `w2wanUSDT`）。

`lendCross` 在两者之上增加了三层：

1. **源链交易解析器** `Type0TxParser` / `Type1TxParser` / `Type2TxParser`：在链下重新计算源链交易的哈希、恢复签名者、校验目标地址是否在白名单、防止重放。
2. **配置 & 防重放中枢** `CrossCheck`：保存 Wanchain `TokenManager` 地址、`underlying ↔ cToken` 映射、跨链代理合约白名单，以及 `uniqueID` 处理账本。
3. **资金处理层** `CrossLendMint` / `CrossLendRepay`：在解析器验证完一次真实的跨链转账后，在 WanLend 上调用 `CErc20.mint` / `CErc20.repayBorrowBehalf`，再把新铸造的 cToken（或还款后多出的资产）转回给用户。

整个流程由一个**链下中继算子**（本仓库的 `wallet.js`）驱动：没有链上自动机器人、没有预言机、没有 Keeper。

---

## 功能特性

* 同时支持**遗留（Type 0 / legacy）、EIP-2930（Type 1）、EIP-1559（Type 2）** 三类源链交易，统一接口。
* 原生支持 **ERC-20 资产**与**原生 WAN**（在配置里以零地址 `0x0…0` 作为哨兵值表示原生币）。
* **防重放**：`uniqueID == keccak256(rlp(info))`，且在链上**先**记录到账本、**再**调用外部合约（遵循 checks-effects-interactions 模式）。
* **签名可塑性防护**：强制 `s <= secp256k1n/2`，显式做 `ecrecover` 校验。
* **目标地址白名单**：源链 `to` 必须在 `crossDelegateSc` 表中，避免有问题的源链交易把资产错转到别处。
* 一键式编排：初始化（`node init/init_all.js`）和校验（`node init/check_all_after_init.js`）。
* 在 `t_WanLend/` 提供可复现的端到端手动测试脚本（存款 → 借款 → 还款 → 赎回）。

---

## 整体流程

```
 源链（Ethereum / Goerli）                       Wanchain
 =================================                =================================
 用户 ──userLock/userBurn──▶ TokenManager        SMG 监听
   to:   crossDelegateSc                           │
   data: (tokenPairID, value,                     SMG 在 Wanchain 上释放 underlying
          crossLendToken =                         到 CrossLendMint / CrossLendRepay
          20 字节地址                              │
          = CrossLendMint | CrossLendRepay)        ▼
                                          SmgRelease(uniqueID, smgID,
                                                     tokenPairID,
                                                     keys[], values[])

                            ┌──────────────────────────────────┐
                            │   链下中继算子（relayer）         │
                            │   即本仓库的 wallet.js            │
                            └─────────────────┬────────────────┘
                                              │
  1. web3.eth.getTransaction(源链 txHash)     │   Type2TxParser
  2. 解析 SmgRelease → actualValue           │   .handlerTxWanLend(
  3. 提交：                                    │     uniquID = 源链 tx.hash,
        info + txType + from +                 │     from    = tx.from,
        actualValue + eventType                │     info, txType,
                                               │     actualValue, eventType)
                                               ▼
                              Wanchain BaseTxParser.crossOperation
                              ─────────────────────────────────────
                              1. require !checkUniqeID(uniquID)        防重放
                              2. keccak256(rlp(info)) == uniquID       哈希一致
                              3. ecrecover(info) == from                签名者匹配
                              4. checkCrossDelegateSc(info.to)         目标白名单
                              5. setUniqueIDFinished(uniquID)           CEI
                              6. decode info.data → tokenPairID,
                                                    crossLendTokenAddr
                              7. CrossCheck.getCTokenAddr(id)
                                               │
                              ┌────────────────┴────────────────┐
                              ▼                                 ▼
                   CrossLendMint                       CrossLendRepay
                   CErc20(cToken).mint(amount)         CErc20(cToken)
                                                        .repayBorrowBehalf
                                                        (from, amount)
                   把新增 cToken delta                 多余部分原路退还
                   转给用户                            给 `from`
```

`actualValue` 是**实际到账金额**（已扣除 SMG 手续费），取自 `SmgRelease.values[0]`——不要用 `tx.value`，否则 `mint` 内部的 `balance >= amount` 校验会失败。

---

## 仓库结构

```
lendCross/
├── sc/                  Solidity 合约 + Truffle 工程
│   ├── contracts/       CrossCheck, CrossLend{Mint,Repay,Base},
│   │                    Type{0,1,2}TxParser, BaseTxParser,
│   │                    CrossLib, Interface, Migrations
│   ├── external_lib/    RLPEncode, ECVerify
│   └── migrations/      1_initial → 7_deploy_type2TxParser
├── ScObjs/              每个链上合约的 ethers.js 封装
├── init/                一次性链上初始化 & 校验
├── devOps/              部署后运维：ABI 抽取、真实跨链交易处理、应急提款
├── tools/               小型调试工具（多数子目录是 0 字节占位）
├── t_WanLend/           WanLend 端到端手动测试脚本
├── config/              手写配置（RPC、助记词、TokenManager、ABI、市场清单）
├── gconfig/             部署产物地址（由 migrations 自动写回）
├── wallet.js            唯一的管理员 / 中继算子钱包
├── package.json
└── Readme.md            本文件
```

---

## 智能合约（`sc/contracts/`）

`pragma solidity ^0.7.0;` 并启用 `pragma experimental ABIEncoderV2;`。

| 合约 | 职责 | 关键对外接口 |
|---|---|---|
| **`CrossCheck`** | 全局配置 + 防重放账本，仅 owner 可写。 | `setTokenManager / setTokenAddrPairs / updateTokenAddrPair / getUnderlyingToken / getCTokenAddr / setCrossDeletagteSc / setMultiCrossDelegateSc / delCrossDeletagteSc / checkCrossDelegateSc / setParser / setUniqueIDFinished / checkUniqeID` |
| **`CrossLendBase`** | 资金保管，TxParser 白名单，owner 级别的 `IERC20*` 工具函数。 | `setTxParse / delTxParse / setTxMulParse / sendWan / IERC20transfer / IERC20Approve / IERC20Balance` |
| **`CrossLendMint`** | `onlyTxParser`。调用 `CErc20.mint`（原生 WAN 用 `CWan.mint`），把新铸造的 cToken 增量转给 `from`。 | `lendTokenMint / lendWanMint` |
| **`CrossLendRepay`** | `onlyTxParser`。调用 `CErc20.repayBorrowBehalf`（原生 WAN 用 `CWan.repayBorrowBehalf`），把多余部分退还 `from`。 | `lendTokenRepay / lendWanRepay` |
| **`BaseTxParser`** | 调度中枢：哈希、RLP 编码、calldata 解码、派发到 Mint/Repay。 | `setDependsContractAddr` + 内部 `crossOperation(eventType, data, from, actualValue)` |
| **`Type0TxParser`** | 解析 legacy（EIP-1559 之前）源链交易。 | `handlerTxWanLend(uniquID, from, Info, chainId, actualValue, eventType)` |
| **`Type1TxParser`** | 解析 EIP-2930 access-list 交易。 | `handlerTxWanLend(uniquID, from, Info, txType, actualValue, eventType)` |
| **`Type2TxParser`** | 解析 EIP-1559 交易。 | `handlerTxWanLend(uniquID, from, Info, txType, actualValue, eventType)` |
| **`CrossLib`** | `userLock_decodeInput` / `userBurn_decodeInput` / `bytesToAddress`。 | — |
| **`Interface`** | `IERC20`, `CErc20`, `CWan`, `ITokenManager`。 | — |

`eventType`：`1` = `userLock`（铸 cToken 路径），`2` = `userBurn`（代还款路径）。

原生 WAN 的判断依据是 `underlyingTokenAddr == address(0)`。

> `sc/contracts/external_lib/RLPDecode.sol` **未被任何合约引用**，是早期设计的遗留代码，保留仅作历史参考。

---

## JavaScript 模块

### `ScObjs/` — ethers.js 封装

| 文件 | 作用 |
|---|---|
| `index.js` | 统一导出。 |
| `BaseErc20Obj.js` | 读 `config/abi/abi.erc20.json`；`balanceOf/allowance/transfer/approve`。**注意：构造器签名是 `(url, scAddr)`，与其他封装不一致。** |
| `BaseTxParseObj.js` | 三个解析器封装的公共读接口。 |
| `CrossCheckObj.js` | `setTokenManager / setTokenAddrPairs / getUnderlyingToken / getCTokenAddrByTokenPair / checkUniqeID / setUniqueIDFinished / setParser / checkParser / checkCrossDelegateSc / …` |
| `CrossLendBaseObj.js` | `setTxParse / setTxMulParse / IERC20transfer / IERC20Approve / IERC20Balance / sendWan`。 |
| `CrossLendMintObj.js` | `lendTokenMint / lendWanMint`。 |
| `CrossLendRepayObj.js` | `lendTokenRepay / lendWanRepay`。 |
| `Type2TxParserObj.js` | **唯一**封装了 `handlerTxWanLend` 的解析器，另外提供 `hash(info, txType)` / `getSender(info, txType)`。 |
| `Type0TxParserObj.js`, `Type1TxParserObj.js` | 仅封装了读操作，`handlerTxWanLend` 暂未封装。 |

### `init/` — 编排

* **`init/init_all.js`** — 一键执行 10 步初始化。**每次全新部署后必须运行一次。**
* **`init/check_all_after_init.js`** — 把链上所有状态读回并与 `gconfig/` + `config/` 对比。
* `1_crossCheck/` — TokenManager、TokenAddrPairs、Parser 注册。
* `2_crossLendMint/` — TxParser 白名单 + 对每对 underlying→cToken 授权 `MAX_UINT256`。
* `3_crossLendRepay/` — 与 `2_crossLendMint/` 对称。
* `4_TxParser/` — 给三个解析器设置（并校验）三个依赖合约地址。

### `devOps/` — 部署后运维

* `extract_abi_script/` — `node devOps/extract_abi_script/index.js` 把每个合约的 ABI 导出到 `devOps/abi/`。
* `initScOnChain/1_crossCheck/…` — 针对 `CrossCheck` 的单步操作与查询。
* `initScOnChain/2_crossLendMint/…` — 设置 TxParser 白名单、授权 MAX、手动触发 `lendTokenMint` / `lendWanMint`、**应急提款**（`7_draw_token_from_lendMint.js`、`8_draw_wan_from_lendMint.js`）。
* `initScOnChain/3_crossLendRepay/…` — 与 `2_crossLendMint/` 对称。
* `initScOnChain/4_TxParser/…` — `6_smgRelease_event.js` 读取 `SmgRelease` 事件以恢复 `actualValue`；`7_type2TxParse_mint_wan.js` 是真实可用的跨链 mint 调用脚本。

### `tools/` — 调试

* `tools/0_crossCheck/index.js` — 查询某个硬编码的 `uniqueID` 是否已被处理。
* `tools/{1..9}_*/index.js` — 占位目录，暂无内容。

### `t_WanLend/` — 端到端测试

按顺序执行即可走完一次完整的 WanLend 周期（存款 → 借款 → 还款 → 赎回）。详见 [端到端测试](#端到端测试)。

---

## 配置

所有可调整的旋钮都在 `config/` 目录下。

### `config/index.js`

```js
let isMain = false;            // 改为 true 即切到主网
const appConfig  = isMain ? require('./config_main')    : require('./config_test');
const scAddrs    = isMain ? require('../gconfig/scAddrs_main.json')
                          : require('../gconfig/scAddrs_test.json');
const lendConfig = isMain ? require('./lendConf/config_mainnet')
                          : require('./lendConf/config_testnet');
```

### `config/config_test.js`（默认 / 测试网）

```js
{
  wanChain: { nodeUrl: "https://nodes-testnet.wandevs.org/wan", chainID: 999 },
  words:    "",                                                   // <- 必填
  tokenManagerAddr: "0x017aB6485fF91C1A0a16B90E71f92B935B7213d3",
  tokenManagerAbi:  require('./abi/abi.TokenManagerDelegate.json'),
  eth:      { nodeUrl: "https://nodes-testnet.wandevs.org/eth",  chainID: 5 }
}
```

### `config/lendConf/config_{testnet,mainnet}.json`

顶层有两个并列结构：

* `params`：以 cToken 名作为 key，每个条目包含 `exchangeRate`、`collateralFactor`、`reserveFactor`、`decimals`、`name`、`symbol`、`compSpeed`、**`underlying`**（Wanchain 侧的 ERC-20 地址；原生 WAN 为 `0x0…0`）等。
* 顶层与 cToken 同名的 key：保存该 cToken 在 Wanchain 上的**合约地址**。

典型条目：

```jsonc
"w2wanUSDT": {
  "exchangeRate":     "200000000000000000000000000",
  "collateralFactor": "750000000000000000",   // 75%
  "reserveFactor":    0.1,
  "name":             "Wanchain USDT",
  "symbol":           "wanUSDT",
  "decimals":         6,
  "underlying":       "0x3d5950287B45f361774e5Fb6E50D70Eea06bC167",
  "compSpeed":        32
}
```

其它顶层字段还有 `OracleStorage`、`Unitroller`、`Comptroller`、`PriceOracleProxy`、`CompoundLens`、`Comp` 以及各 `startBlock-*` 标记。

### `gconfig/`

部署产物。`sc/migrations/libs.js` 会在每次 `truffle migrate` 后把新地址写回：

```jsonc
// gconfig/scAddrs_test.json
{
  "CrossCheck":     "0x82640eCC1E638b9C3Cab7D663E34e05C308c1697",
  "CrossLendMint":  "0xD24f200C4C847C5afd05244D210837b4e74dC146",
  "CrossLendRepay": "0x9F04c7e80297fCa5a3D77D28Ecaa561d4825b3c5",
  "Type0TxParser":  "0x9065BA060aC1A94795155b76d1C724FAD457EeC5",
  "Type1TxParser":  "0x287851866f99C9A4f4a8B8d0385a1Ec924172298",
  "Type2TxParser":  "0xB3FCC2e4d5d853936b109AcDB56C7a1C46d0FA9A"
}
```

`gconfig/scAddrs_main.json` 在首次主网部署前为 `{}`。

### `wallet.js`

```js
const words = config.appConfig.words;
const admin = ethers.Wallet.fromMnemonic(words);   // m/44'/60'/0'/0/0
```

同一助记词也会被 Truffle 通过 `sc/truffle-config.js` → `HDWalletProvider(mnemonic, nodeUrl)` 使用。**部署者、合约 `owner`、中继算子三者是同一个私钥。** 在做任何操作前请先填好 `words`。

---

## 安装

```bash
git clone https://github.com/haolifeng/lendCross.git
cd lendCross
npm install          # 或: yarn install
```

Truffle 并未声明在依赖中，请全局安装一次：

```bash
npm install -g truffle
```

> 仓库根目录同时含有 `package-lock.json` 和 `yarn.lock`，`sc/` 下还有一份 `yarn.lock`。请只选用其中一种工具链并保持一致。

---

## 编译与部署

Truffle 命令均在 `sc/` 目录下执行。

```bash
cd sc
truffle compile
truffle migrate --network wantest
# 若要清空后重新部署：
truffle migrate --network wantest --reset
```

`wantest` 网络从 `../config/` 读取 RPC、`network_id` 与助记词。迁移顺序：

1. `1_initial_migrations.js` — Truffle 自带的 `Migrations` 合约。
2. `2_deploy_crossCheck.js`
3. `3_deploy_crossLendMint.js`
4. `4_deploy_crossLendRepay.js`
5. `5_deploy_type0TxParser.js`
6. `6_deploy_type1TxParser.js`
7. `7_deploy_type2TxParser.js`

每一步都会把新地址写回 `gconfig/scAddrs_{test,main}.json`。

---

## 链上初始化（每次部署后必做）

合约部署完成后**没有任何权限、没有 token 映射**，必须先运行初始化脚本。重复执行是安全的。

```bash
# 推荐：一键执行
node init/init_all.js

# 或：单步执行（仓库根目录下）
node devOps/initScOnChain/1_crossCheck/1_setTokenManager.js
node devOps/initScOnChain/1_crossCheck/4_setTokenAddrPairs.js
node devOps/initScOnChain/1_crossCheck/3_setParsers.js
node devOps/initScOnChain/2_crossLendMint/1_setTxMulParse.js
node devOps/initScOnChain/2_crossLendMint/3_underlying_approve_ctoken_use_lendMint.js
node devOps/initScOnChain/3_crossLendRepay/1_setTxMulParse.js
node devOps/initScOnChain/3_crossLendRepay/3_underlying_approve_ctoken_use_lendRepay.js
node devOps/initScOnChain/4_TxParser/0_Type0TxParser_setDependsContractAddr.js
node devOps/initScOnChain/4_TxParser/1_Type1TxParser_setDependsContractAddr.js
node devOps/initScOnChain/4_TxParser/2_Type2TxParser_setDependsContractAddr.js
```

完成后回读校验：

```bash
node init/check_all_after_init.js
```

---

## 跨链中继算子工作流

一次成功的跨链 mint 流程如下：

1. 用户在 Ethereum（或其他受支持的源链）上向 `appConfig.tokenManagerAddr` 所指的 Wanchain `TokenManager` 发起 `userLock` / `userBurn`，calldata 中将 `CrossLendMint` 或 `CrossLendRepay` 的 20 字节地址作为 `crossLendToken` 传入。
2. SMG 验证后在 Wanchain 上释放等额资产，并发出 `SmgRelease(uniqueID, smgID, tokenPairID, keys[], values[])`。**`actualValue` 取 `values[0]`。**
3. 中继算子从源链 RPC 拉回原始交易（`web3.eth.getTransaction`），构造对应的 `Info` 结构体，然后调用：
   ```js
   await tx2TxParser.handlerTxWanLend(
       admin,
       tx.hash,             // uniquID
       tx.from,             // from
       info,                // {chainId,nonce,...accessList,v,r,s}
       2,                   // txType: 0|1|2
       BigNumber.from(smgReleaseValues[0]),
       1,                   // eventType: 1=userLock, 2=userBurn
   );
   ```
4. 链上解析器依次校验、把 `uniqueID` 标记为已处理，然后派发到 `CrossLendMint.lendTokenMint` / `lendWanMint` 或对应的 Repay 函数。

本仓库的参考实现：`devOps/initScOnChain/4_TxParser/7_type2TxParse_mint_wan.js`。

---

## 端到端测试

在仓库根目录按顺序执行以下脚本，即可走完一次完整的 WanLend 借贷周期：

```bash
node t_WanLend/1_account_balance.js                              # 查看基线余额
node t_WanLend/2_send_wan_and_wanUSDT_to_crossMint.js            # 转入 1 WAN + 1 wanUSDT
node t_WanLend/3_send_wan_and_wanUSDT_to_crossRepay.js
node t_WanLend/5_underlying_approve_ctoken_use_user.js           # 全部 underlying → cToken 授权
node t_WanLend/6_account2_mint_wan_and_borrow_usdt.js            # 抵押 7 WAN，借 0.01 wanUSDT
node t_WanLend/7_account1_mint_usdt.js                           # 提供 5 wanUSDT 流动性
node t_WanLend/4_account2_redeem_wanUSDT.js                      # 赎回 cWan / cWanUSDT
```

两个测试账户从同一助记词派生：

* `account1`（admin）— 派生路径 `m/44'/60'/0'/0/0`
* `account2`（user2）— 派生路径 `m/44'/60'/0'/0/1`

---

## 安全说明与信任假设

* **单密钥信任模型。** 部署者、合约 `owner`、中继算子、签名私钥四者合一。如果 `wallet.js` 中的助记词泄露，攻击者可以任意 mint、提取合约中所有余额、改写所有白名单。
* **`setTxMulParse` 同时把 `admin.address` 加入 `onlyTxParser` 白名单**，这意味着 owner 可以绕过解析器直接调用 `lendTokenMint` / `lendTokenRepay`。请将 `owner` 视为完全可信。
* **唯一的链下角色就是中继算子。** 没有任何链上自动机制、预言机或 Keeper。一旦中继算子停机，新的跨链 mint/repay 都无法处理。
* **没有时间锁、没有多签、`handlerTxWanLend` 也没有链上 nonce 校验。** 顺序与唯一性由中继算子在链下保证；链上 `uniqueID` 校验只能防止**同一条**源链交易被重放。
* **`actualValue` 由中继算子链下提供。** 链上只校验 `balance >= actualValue`，因此中继算子**必须**从规范事件 `SmgRelease` 取值，不要用源链 `tx.value`。
* **原生 WAN 是零地址哨兵。** `underlying == 0x0…0` 表示走 `CWan` 路径。混淆这一规则会导致资产被错误路由。
* **已有的防御性设计：**
  * `setUniqueIDFinished` 在外部 `crossOperation` 之前调用（CEI）。
  * 强制 `s <= secp256k1n/2` 防止签名可塑性。
  * 所有 `IERC20` 返回值都被检查；ETH 转账使用 `call` 并检查返回值。
  * Solidity 0.7 由编译器本身提供算术溢出 / 下溢检查。
  * `bytesToAddress` 强制 `len == 20`。
  * `getUnderlyingToken` 内部对 `TokenManager` 做了非零地址校验。

---

## 已知问题

* **`sc/build/` 被 `.gitignore` 忽略。** 所有 Node 脚本都 `require('../sc/build/contracts/*.json')`。**在运行 `init/`、`tools/` 或 `devOps/initScOnChain/` 下的任何脚本之前必须先 `truffle compile`。**
* **`isMain` 是 `config/index.js` 里的硬编码常量**，不是环境变量。
* **主网配置 key 大小写不一致。** `config/config_main.js` 写的是 `wanChain.chainId`（小写 d），而 `sc/truffle-config.js` 读的是 `wanChain.chainID`（大写 D）。当前切到主网会导致 Truffle 的 `network_id` 变成 `undefined`。
* **Truffle 没有声明在 `dependencies` 里，`sc/` 也没有自己的 `package.json`**，需要全局安装。
* **`Type0TxParserObj` / `Type1TxParserObj` 没有封装 `handlerTxWanLend`**，目前只有 `Type2TxParserObj` 有；直接调用这两个解析器需要自行走 ethers API。
* **`ScObjs/CrossCheckObj.js` 里的 `setTokenPairs` 是旧名字。** 链上正确的方法名是 `setTokenAddrPairs`。
* **`devOps/initScOnChain/4_TxParser/5_type2TxParse_mint_usdt.js` 调用了不存在的 `decodeInput(...)`**。该脚本处于半完成状态；可用的脚本是 `7_type2TxParse_mint_wan.js`。
* **`BaseErc20Obj` 的构造器签名是 `(url, scAddr)`**，与其他封装的 `(scAddr, nodeUrl, abi)` 不一致，容易踩坑。
* **`sc/contracts/external_lib/RLPDecode.sol` 是未被引用的死代码。**
* **`package.json` 中 `"license": "ISC"`，但实际的 `LICENSE` 文件是 Apache-2.0。** 以仓库内的 `LICENSE` 文件为准。

---

## 许可证

Apache License 2.0 — 详见 `LICENSE`。
