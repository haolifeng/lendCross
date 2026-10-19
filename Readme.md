# lendCross

[English](Readme.md) | [简体中文](Readme.zh-CN.md)

A cross-chain lending middleware that lets users **deposit on a source chain (e.g. Ethereum) and receive interest-bearing cTokens on Wanchain**, and **repay their loans from any supported source chain** — without ever touching the Wanchain RPC directly.

The project sits on top of two existing systems:

* **[Wanchain cross-chain bridge](https://www.wanchain.org/)** — Storeman Group (SMG) locks/burns on the source chain and releases the corresponding asset on Wanchain.
* **[WanLend](https://wanlend.com/)** — a Compound-style lending market on Wanchain where each underlying token is wrapped as a cToken (e.g. `wanUSDT` → `w2wanUSDT`).

`lendCross` adds three pieces on top:

1. **Source-chain parsers** (`Type0TxParser` / `Type1TxParser` / `Type2TxParser`) that re-derive the source-chain tx hash, recover the signer, verify the destination is a known cross-chain delegate, and prevent replay.
2. **A configuration & replay-protection hub** (`CrossCheck`) that holds the Wanchain `TokenManager` address, the underlying↔cToken mapping per `tokenPairID`, the cross-chain delegate allow-list, and a `uniqueID` ledger.
3. **A money-handling layer** (`CrossLendMint` / `CrossLendRepay`) that, once the parser has validated a real cross-chain transfer, calls `CErc20.mint` / `CErc20.repayBorrowBehalf` on WanLend on behalf of the user and forwards the resulting cToken (or change) back to them.

A single off-chain **relayer** (this repo's `wallet.js`) drives the whole pipeline. There is no on-chain automation, no oracles, and no keepers.

---

## Features

* Supports **legacy (Type 0), EIP-2930 (Type 1) and EIP-1559 (Type 2)** source-chain transactions in a single, consistent interface.
* First-class support for both **ERC-20 assets** and **native WAN** (the zero-address sentinel `0x0…0` denotes the native coin in the configuration).
* **Replay protection** by `uniqueID == keccak256(rlp(info))`, recorded on-chain *before* any external call (checks-effects-interactions).
* **Signature malleability guard** (`s <= secp256k1n/2`) and explicit `ecrecover` checks.
* **Allow-listed destination contracts** so a buggy source-chain `to` cannot redirect user funds.
* One-line orchestration for initialization (`node init/init_all.js`) and verification (`node init/check_all_after_init.js`).
* Manual but reproducible end-to-end harness under `t_WanLend/` to walk through a complete "supply WAN, borrow wanUSDT, repay, redeem" flow.

---

## High-level flow

```
 Source chain (Ethereum / Goerli)                Wanchain
 ================================                 =============================
 user ──userLock/userBurn──▶ TokenManager        SMG listens
   to: crossDelegateSc                            │
   data: (tokenPairID, value,                    SMG releases underlying
          crossLendToken =                       to CrossLendMint /
          20-byte address of                     CrossLendRepay on Wanchain
          CrossLendMint | CrossLendRepay)         │
                                                  ▼
                                       SmgRelease(uniqueID, smgID,
                                                  tokenPairID,
                                                  keys[], values[])

                              ┌──────────────────────────┐
                              │  off-chain relayer       │
                              │  (this repo, wallet.js)  │
                              └─────────────┬────────────┘
                                            │
  1. web3.eth.getTransaction(srcTxHash)      │   Type2TxParser
  2. parse SmgRelease → actualValue          │   .handlerTxWanLend(
  3. submit:                                 │     uniquID = src tx.hash,
        info + txType + from +               │     from    = tx.from,
        actualValue + eventType              │     info, txType,
                                             │     actualValue, eventType)
                                             ▼
                              Wanchain BaseTxParser.crossOperation
                              ──────────────────────────────────────
                              1. require !checkUniqeID(uniquID)
                              2. keccak256(rlp(info)) == uniquID
                              3. ecrecover(info) == from
                              4. checkCrossDelegateSc(info.to)
                              5. setUniqueIDFinished(uniquID)   // CEI
                              6. decode info.data → tokenPairID,
                                                    crossLendTokenAddr
                              7. CrossCheck.getCTokenAddr(id)
                                             │
                              ┌──────────────┴──────────────┐
                              ▼                             ▼
                  CrossLendMint                   CrossLendRepay
                  CErc20(cToken).mint(amount)     CErc20(cToken)
                                                  .repayBorrowBehalf
                                                  (from, amount)
                  transfer new cToken            refund excess to `from`
                  delta to user
```

`actualValue` is the **net amount that actually arrived** (after the SMG fee), taken from `SmgRelease.values[0]` — not from `tx.value`, otherwise the mint's `balance >= amount` check would fail.

---

## Repository layout

```
lendCross/
├── sc/                  Solidity contracts + Truffle project
│   ├── contracts/       CrossCheck, CrossLend{Mint,Repay,Base},
│   │                    Type{0,1,2}TxParser, BaseTxParser,
│   │                    CrossLib, Interface, Migrations
│   ├── external_lib/    RLPEncode, ECVerify
│   └── migrations/      1_initial → 7_deploy_type2TxParser
├── ScObjs/              ethers.js wrappers for every on-chain contract
├── init/                one-shot on-chain initialization & verification
├── devOps/              post-deploy ops: ABI extraction, real cross-chain
│                        tx handling, emergency withdraw
├── tools/               small debug utilities (most sub-folders are
│                        0-byte placeholders)
├── t_WanLend/           manual end-to-end test harness against WanLend
├── config/              hand-edited config (RPC, mnemonic, TokenManager,
│                        ABI, WanLend market list)
├── gconfig/             generated addresses written back by migrations
├── wallet.js            single admin/relayer wallet
├── package.json
└── Readme.md            (this file)
```

---

## Smart contracts (`sc/contracts/`)

`pragma solidity ^0.7.0;` with `pragma experimental ABIEncoderV2;`.

| Contract | Role | Key external surface |
|---|---|---|
| **`CrossCheck`** | Global config + replay ledger. Owner-controlled. | `setTokenManager / setTokenAddrPairs / updateTokenAddrPair / getUnderlyingToken / getCTokenAddr / setCrossDeletagteSc / setMultiCrossDelegateSc / delCrossDeletagteSc / checkCrossDelegateSc / setParser / setUniqueIDFinished / checkUniqeID` |
| **`CrossLendBase`** | Holds funds, manages TxParser allow-list, exposes admin-only `IERC20*` helpers. | `setTxParse / delTxParse / setTxMulParse / sendWan / IERC20transfer / IERC20Approve / IERC20Balance` |
| **`CrossLendMint`** | `onlyTxParser`. `CErc20.mint` (or `CWan.mint` for native WAN) and forwards the freshly minted cToken delta to `from`. | `lendTokenMint / lendWanMint` |
| **`CrossLendRepay`** | `onlyTxParser`. `CErc20.repayBorrowBehalf` (or `CWan.repayBorrowBehalf`) and refunds any excess to `from`. | `lendTokenRepay / lendWanRepay` |
| **`BaseTxParser`** | Orchestrator: hashes, RLP-encodes, decodes, dispatches to Mint/Repay. | `setDependsContractAddr / crossOperation(eventType, data, from, actualValue)` (internal) + decode helpers |
| **`Type0TxParser`** | Parses legacy (pre-EIP-1559) source-chain txs. | `handlerTxWanLend(uniquID, from, Info, chainId, actualValue, eventType)` |
| **`Type1TxParser`** | Parses EIP-2930 access-list txs. | `handlerTxWanLend(uniquID, from, Info, txType, actualValue, eventType)` |
| **`Type2TxParser`** | Parses EIP-1559 txs. | `handlerTxWanLend(uniquID, from, Info, txType, actualValue, eventType)` |
| **`CrossLib`** | `userLock_decodeInput` / `userBurn_decodeInput` / `bytesToAddress`. | — |
| **`Interface`** | `IERC20`, `CErc20`, `CWan`, `ITokenManager`. | — |

`eventType`: `1` = `userLock` (mint path), `2` = `userBurn` (repay path).

Native WAN is detected by `underlyingTokenAddr == address(0)`.

> `RLPDecode.sol` lives under `external_lib/` but is **not referenced** by any contract — it is dead code kept around from an earlier design.

---

## JS modules

### `ScObjs/` — ethers.js wrappers

| File | Purpose |
|---|---|
| `index.js` | Aggregates and re-exports every wrapper. |
| `BaseErc20Obj.js` | Read `config/abi/abi.erc20.json`; `balanceOf/allowance/transfer/approve`. *Note: constructor signature is `(url, scAddr)` — different from every other wrapper.* |
| `BaseTxParseObj.js` | Common read interface shared by all three parser wrappers. |
| `CrossCheckObj.js` | `setTokenManager / setTokenAddrPairs / getUnderlyingToken / getCTokenAddrByTokenPair / checkUniqeID / setUniqueIDFinished / setParser / checkParser / checkCrossDelegateSc / …` |
| `CrossLendBaseObj.js` | `setTxParse / setTxMulParse / IERC20transfer / IERC20Approve / IERC20Balance / sendWan`. |
| `CrossLendMintObj.js` | `lendTokenMint / lendWanMint`. |
| `CrossLendRepayObj.js` | `lendTokenRepay / lendWanRepay`. |
| `Type2TxParserObj.js` | The **only** parser wrapper that exposes `handlerTxWanLend`, plus `hash(info, txType)` and `getSender(info, txType)`. |
| `Type0TxParserObj.js`, `Type1TxParserObj.js` | Read-only — `handlerTxWanLend` is not wrapped here yet. |

### `init/` — orchestration

* **`init/init_all.js`** — one-shot, runs all 10 setup steps in order. **Run once after every fresh deploy.**
* **`init/check_all_after_init.js`** — reads everything back from the chain and diffs against `gconfig/` + `config/`.
* `1_crossCheck/` — TokenManager, TokenAddrPairs, Parser registrations.
* `2_crossLendMint/` — TxParser allow-list + `MAX_UINT256` approvals for every underlying→cToken pair.
* `3_crossLendRepay/` — symmetric to `2_crossLendMint/`.
* `4_TxParser/` — set/verify the three dependent contract addresses on each parser.

### `devOps/` — post-deploy operations

* `extract_abi_script/` — `node devOps/extract_abi_script/index.js` exports individual ABI files to `devOps/abi/`.
* `initScOnChain/1_crossCheck/…` — individual admin commands and queries against `CrossCheck`.
* `initScOnChain/2_crossLendMint/…` — set TxParser allow-list, grant MAX approvals, manually call `lendTokenMint` / `lendWanMint`, and **emergency withdraw** (`7_draw_token_from_lendMint.js`, `8_draw_wan_from_lendMint.js`).
* `initScOnChain/3_crossLendRepay/…` — symmetric to `2_crossLendMint/`.
* `initScOnChain/4_TxParser/…` — `6_smgRelease_event.js` reads `SmgRelease` events to recover `actualValue`; `7_type2TxParse_mint_wan.js` is the real, working cross-chain mint handler.

### `tools/` — debug

* `tools/0_crossCheck/index.js` — query whether a hard-coded `uniqueID` has been processed.
* `tools/{1..9}_*/index.js` — empty placeholders for future tooling.

### `t_WanLend/` — manual end-to-end test

Walk through a complete WanLend cycle (deposit, borrow, repay, redeem) on the testnet. Each script is `node xxx.js`-runnable. See [End-to-end test](#end-to-end-test).

---

## Configuration

All user-facing knobs live under `config/`.

### `config/index.js`

```js
let isMain = false;            // flip to true to switch to mainnet
const appConfig  = isMain ? require('./config_main')    : require('./config_test');
const scAddrs    = isMain ? require('../gconfig/scAddrs_main.json')
                          : require('../gconfig/scAddrs_test.json');
const lendConfig = isMain ? require('./lendConf/config_mainnet')
                          : require('./lendConf/config_testnet');
```

### `config/config_test.js` (default, testnet)

```js
{
  wanChain: { nodeUrl: "https://nodes-testnet.wandevs.org/wan", chainID: 999 },
  words:    "",                                                   // <- fill in
  tokenManagerAddr: "0x017aB6485fF91C1A0a16B90E71f92B935B7213d3",
  tokenManagerAbi:  require('./abi/abi.TokenManagerDelegate.json'),
  eth:      { nodeUrl: "https://nodes-testnet.wandevs.org/eth",  chainID: 5 }
}
```

### `config/lendConf/config_{testnet,mainnet}.json`

Two top-level structures:

* `params` — keyed by cToken name. Each entry has `exchangeRate`, `collateralFactor`, `reserveFactor`, `decimals`, `name`, `symbol`, **`underlying`** (the Wanchain-side ERC-20 address, or `0x0…0` for native WAN), `compSpeed`, etc.
* top-level keys named after each cToken — those hold the **cToken contract address** on Wanchain.

A typical entry looks like:

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

Other top-level keys include `OracleStorage`, `Unitroller`, `Comptroller`, `PriceOracleProxy`, `CompoundLens`, `Comp`, and the `startBlock-*` markers.

### `gconfig/`

Deployment artifacts. `sc/migrations/libs.js` writes contract addresses back here after each `truffle migrate`:

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

`gconfig/scAddrs_main.json` is `{}` until the first mainnet migration runs.

### `wallet.js`

```js
const words = config.appConfig.words;
const admin = ethers.Wallet.fromMnemonic(words);   // m/44'/60'/0'/0/0
```

The same mnemonic is also used by Truffle via `sc/truffle-config.js` → `HDWalletProvider(mnemonic, nodeUrl)`. **The deployer, the contract `owner`, and the relayer are all the same key.** Fill `words` before doing anything.

---

## Install

```bash
git clone https://github.com/haolifeng/lendCross.git
cd lendCross
npm install          # or: yarn install
```

Truffle is not declared as a dependency — install it once globally:

```bash
npm install -g truffle
```

> The repo contains both `package-lock.json` and `yarn.lock` at the root, plus a separate `sc/yarn.lock`. Pick one toolchain and stick to it.

---

## Compile and deploy

All Truffle commands are run from the `sc/` directory.

```bash
cd sc
truffle compile
truffle migrate --network wantest
# or, to wipe and redeploy:
truffle migrate --network wantest --reset
```

The `wantest` network reads its RPC, `network_id` and mnemonic from `../config/`. Migration order:

1. `1_initial_migrations.js` — Truffle's `Migrations` contract.
2. `2_deploy_crossCheck.js`
3. `3_deploy_crossLendMint.js`
4. `4_deploy_crossLendRepay.js`
5. `5_deploy_type0TxParser.js`
6. `6_deploy_type1TxParser.js`
7. `7_deploy_type2TxParser.js`

Each step writes the new address back into `gconfig/scAddrs_{test,main}.json`.

---

## On-chain initialization (one-time, after each deploy)

The contracts are deployed with **no permissions and no token mappings**. Before they will work you must run the init script. It is safe to re-run.

```bash
# recommended: one-shot
node init/init_all.js

# or step-by-step (run from the repo root)
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

Verify everything afterwards:

```bash
node init/check_all_after_init.js
```

---

## Cross-chain relayer workflow

A successful cross-chain mint looks like this:

1. The user sends a `userLock` / `userBurn` on Ethereum (or any supported source chain) to the Wanchain `TokenManager` address listed in `appConfig.tokenManagerAddr`, with the 20-byte address of `CrossLendMint` or `CrossLendRepay` packed into the calldata as `crossLendToken`.
2. The SMG eventually releases the equivalent asset on Wanchain and emits `SmgRelease(uniqueID, smgID, tokenPairID, keys[], values[])`. **Use `values[0]` as `actualValue`.**
3. The relayer fetches the original source-chain tx (`web3.eth.getTransaction`), builds the right `Info` struct, and calls:
   ```js
   await tx2TxParser.handlerTxWanLend(
       admin,
       tx.hash,             // uniquID
       tx.from,             // from
       info,                // {chainId,nonce,...accessList,v,r,s}
       2,                   // txType: 0|1|2
       BigNumber.from(actualValueFromSmgRelease),
       1,                   // eventType: 1=userLock, 2=userBurn
   );
   ```
4. The on-chain parser validates, marks `uniqueID` finished, and dispatches to `CrossLendMint.lendTokenMint` / `lendWanMint` or the Repay equivalent.

The reference script in this repo is `devOps/initScOnChain/4_TxParser/7_type2TxParse_mint_wan.js`.

---

## End-to-end test

A reproducible, manual walk-through of the WanLend side. Run from the repo root in the listed order:

```bash
node t_WanLend/1_account_balance.js                              # baseline
node t_WanLend/2_send_wan_and_wanUSDT_to_crossMint.js            # 1 WAN + 1 wanUSDT
node t_WanLend/3_send_wan_and_wanUSDT_to_crossRepay.js
node t_WanLend/5_underlying_approve_ctoken_use_user.js           # MAX_UINT256 approves
node t_WanLend/6_account2_mint_wan_and_borrow_usdt.js            # supply 7 WAN, borrow 0.01 wanUSDT
node t_WanLend/7_account1_mint_usdt.js                           # supply 5 wanUSDT
node t_WanLend/4_account2_redeem_wanUSDT.js                      # redeem cWan / cWanUSDT
```

Two test accounts are derived from the same mnemonic:

* `account1` (admin)  — `m/44'/60'/0'/0/0`
* `account2` (user2)  — `m/44'/60'/0'/0/1`

---

## Security notes & trust assumptions

* **Single-key trust model.** The deployer, the contract `owner`, the relayer, and the relayer's signing key are all the same HD path. A compromised `wallet.js` mnemonic can mint against any user, withdraw all contract balances, and rewrite every allow-list.
* **`setTxMulParse` adds `admin.address` to the `onlyTxParser` allow-list**, so the owner can also call `lendTokenMint` / `lendTokenRepay` directly, bypassing the parser. Treat the `owner` as fully trusted.
* **The relayer is the only off-chain actor.** There is no on-chain automation, no oracle, no keeper. If the relayer goes down, no further cross-chain mints/repays can be processed.
* **No timelock, no multisig, no on-chain nonce check on `handlerTxWanLend`.** The relayer is expected to ensure correct ordering and uniqueness; the on-chain `uniqueID` check only prevents replays of the *same* source tx.
* **`actualValue` is provided off-chain** by the relayer. The on-chain code only checks `balance >= actualValue`, so the relayer must take its value from the canonical `SmgRelease` event.
* **Native WAN is a sentinel.** `underlying == 0x0…0` means "this is native WAN, use the `CWan` path". Mixing this up will silently misroute tokens.
* **Defensive coding choices that *are* in place:**
  * `setUniqueIDFinished` is called *before* the external `crossOperation` (CEI).
  * `s <= secp256k1n/2` is enforced to defeat signature malleability.
  * All `IERC20` return values are checked; ETH transfers use `call` and check the returned bool.
  * Solidity 0.7 — the compiler itself adds overflow/underflow checks.
  * `bytesToAddress` enforces `len == 20`.
  * `TokenManager` is required to be non-zero in `getUnderlyingToken`.

---

## Known issues

* **`sc/build/` is gitignored.** All Node scripts `require('../sc/build/contracts/*.json')`. You **must** `truffle compile` before running anything under `init/`, `tools/` or `devOps/initScOnChain/`.
* **`isMain` is a hard-coded constant in `config/index.js`**, not an environment variable.
* **Mainnet config key mismatch.** `config/config_main.js` writes `wanChain.chainId` (lowercase `d`), but `sc/truffle-config.js` reads `wanChain.chainID` (uppercase `D`). Switching to mainnet today yields `network_id: undefined` in Truffle.
* **Truffle is not in `dependencies`** and `sc/` has no `package.json`. Install it globally.
* **`Type0TxParserObj` / `Type1TxParserObj` do not wrap `handlerTxWanLend`** — only `Type2TxParserObj` does. Calling them directly requires raw ethers plumbing.
* **`ScObjs/CrossCheckObj.js#setTokenPairs` is a stale name.** The on-chain method is `setTokenAddrPairs`.
* **`devOps/initScOnChain/4_TxParser/5_type2TxParse_mint_usdt.js` calls `decodeInput(...)`, which does not exist on the wrapper.** That script is in a half-finished state; the working one is `7_type2TxParse_mint_wan.js`.
* **`BaseErc20Obj` constructor signature is `(url, scAddr)`**, the rest of the wrappers use `(scAddr, nodeUrl, abi)`. Easy footgun.
* **`RLPDecode.sol` is unreferenced dead code** under `sc/contracts/external_lib/`.
* **`package.json` declares `"license": "ISC"` but the actual `LICENSE` file is Apache-2.0.** The file on disk is authoritative.

---

## License

Apache License 2.0 — see `LICENSE`.
