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

const getTx = async () =>{
    let tx = await goerilWeb3.eth.getTransaction(tempConfig.txHash.toLendMint);
    console.log('tx: ', tx)
    return tx;
}
const toMint = async()=>{
    let tx = await getTx();
    /*
{
  blockHash: '0x89c8b5cde71189b113a0ce1f85bd1adc487b69596fa3dfb6e602a70b45d34862',
  blockNumber: 9459734,
  from: '0xdC484B57a5CC0563b42C2e3D37466b14186f501b',
  gas: 145518,
  gasPrice: '7013',
  maxFeePerGas: '7013',
  maxPriorityFeePerGas: '7013',
  hash: '0x0e215917024cbfeab2aeef899d66e256dba663852f7f8b1f0d3410322fa6bb45',
  input: '0x257011b6000000000000000000000000000000000000000000000000006465765f313336000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000145ad8cb6baa0899fdf9179b80984ca3cac75dc51c000000000000000000000000',
  nonce: 2,
  to: '0xb8460Eeaa06Bc6668dad9fd42B661C0B96b3bE57',
  transactionIndex: 69,
  value: '0',
  type: 2,
  accessList: [],
  chainId: '0x5',
  v: '0x0',
  r: '0x797a004d5a29993c1abdd8bc52ab1d2db3a722cf65c5147340464b1fa763d284',
  s: '0x72c66240eccfa3d3b461e819b4cff5d9c7f09a599132a114e1b470904ac5ee0d'
}
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
    //console.log('info: ', info)

    let ret = await tx2TxParser.handlerTxWanLend(admin,tx.hash, tx.from, info, 2, 990000);
    console.log('ret: ', ret);
/*
    let txhash = await tx2TxParser.hash(info, 2);
    console.log('txhash: ', txhash);
    console.log('tx.hash:', tx.hash)

    let sender = await tx2TxParser.getSender(info, 2);
    console.log('sender: ', sender);
    console.log('tx.from', tx.from);

    let ret = await tx2TxParser.decodeInput(info.data);
    console.log('ret: ', ret);
    console.log(ret[0].toString());
    console.log(ret[1].toString());
    console.log(ret[2].toString());

    let ret1 = await tx2TxParser.bytesToAddress(ret[2])
    console.log('ret1: ', ret1);

    let ret3 = await tx2TxParser.getCTokenAddr(ret[0]);
    console.log('ret3: ', ret3);*/

}

const main = async ()=>{
    //await getTx();
    await toMint();
}

main();
