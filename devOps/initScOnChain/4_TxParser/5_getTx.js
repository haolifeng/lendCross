const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;


const ScAddr = config.scAddrs.Type2TxParser;
const admin = require('../../../wallet');
const {
    CrossCheckObj,
    CrossLendMintObj,
    CrossLendRepayObj,
    Type0TxParserObj,
    Type1TxParserObj,
    Type2TxParserObj
} = require('../../../ScObjs')

const { crossCheck_abi,
    crossLendMint_abi,
    crossLendRepay_abi,
    Type0TxParser_abi,
    Type1TxParser_abi,
    Type2TxParser_abi,} = require('../abi');

const crossCheckScAddr = config.scAddrs.CrossCheck;
const crossLendMintScAddr = config.scAddrs.CrossLendMint;
const crossLendRepayScAddr = config.scAddrs.CrossLendRepay;

const Web3 = require('web3');
const goerilUrl = config.appConfig.eth.nodeUrl;
const goerilWeb3 = new Web3(new Web3.providers.HttpProvider(goerilUrl));

const tempConfig = require('./tempConfig');

let tx2TxParser = new Type2TxParserObj(ScAddr,wanUrl, Type2TxParser_abi);
const toMint = async()=>{
    let tx = await goerilWeb3.eth.getTransaction(tempConfig.txHash.toLendMint);
    console.log('tx: ', tx)
    /*
    * {
  blockHash: '0x855cb044a52e89190a5058493baa67ac6dc7d10d016c523724f5bae3eb8d0d0c',
  blockNumber: 9454636,
  from: '0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66',
  gas: 145518,
  gasPrice: '7284',
  maxFeePerGas: '7284',
  maxPriorityFeePerGas: '7284',
  hash: '0x54c94a65b5db142a6690a353b5d10958c3db438daea759fcb00409708e437e92',
  input: '0x257011b6000000000000000000000000000000000000000000000000006465765f313336000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000145d56ede0df1c28c30f05df200e125424fcc3124b000000000000000000000000',
  nonce: 9,
  to: '0xb8460Eeaa06Bc6668dad9fd42B661C0B96b3bE57',
  transactionIndex: 74,
  value: '0',
  type: 2,
  accessList: [],
  chainId: '0x5',
  v: '0x1',
  r: '0x8a1838126a7e814e4d0f0d120b4ce4b91e40cf882e8300b33947a0c0cc0f5f66',
  s: '0x73bdd6251c2ed73e17486baa419570cde70e7ba08afbcf746317dccce69af65e'
}
    *
    *
    * */
    let accessList = tx.accessList;
    let comAcclessList = [];
    for(let i = 0 ; i< accessList.length; i++){
        let accessItem = accessList[i];
        console.log('accessItem : ', accessItem);
        let addressK = accessItem.address;
        let storageKey = accessItem.storageKeys;
        comAcclessList.push({
            addressK: addressK, storageKey: storageKey
        })

    }

    console.log('comAcclessList :', comAcclessList);
    let td = {
        chainId: BigInt(tx.chainId),
        nonce: BigInt(tx.nonce),
        maxPriorityFeePerGas: BigInt(tx.maxPriorityFeePerGas),
        maxFeePerGas: BigInt(tx.maxFeePerGas),
        gasLimit: BigInt(tx.gas),
        to: tx.to,
        value: BigInt(tx.value),
        data: tx.input,
        accessList: comAcclessList,
        v: BigInt(tx.v),
        r: BigInt(tx.r),
        s: BigInt(tx.s)
    }
    // console.log('txData: ', td);
    let info = {
        chainId:td.chainId,
        nonce:td.nonce,
        maxPriorityFeePerGas:td.maxPriorityFeePerGas,
        maxFeePerGas:td.maxFeePerGas,
        gasLimit:td.gasLimit,
        to:td.to,
        value:td.value,
        data:td.data,
        accessList:td.accessList,
        v:td.v,
        r:td.r,
        s:td.s

    }
    console.log('info: ', info)

    let ret = await tx2TxParser.handlerTxWanLend(admin,tx.hash, tx.from, info, 2);
    console.log('ret');
}

const main = async ()=>{
    await toMint();
}

main();
