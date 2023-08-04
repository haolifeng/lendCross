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
const {BigNumber} = require("ethers");
const goerilUrl = config.appConfig.eth.nodeUrl;
const goerilWeb3 = new Web3(new Web3.providers.HttpProvider(goerilUrl));



let tx2TxParser = new Type2TxParserObj(ScAddr,wanUrl, Type2TxParser_abi);
let ethTxHash = "0x20b07228b8bce7cfd558649d257940a9e7a667146e5515dc50e8511c27763e86";
const getTx = async () =>{
    let tx = await goerilWeb3.eth.getTransaction(ethTxHash);
    console.log('tx: ', tx)
    return tx;
}
const getInf=  (tx)=>{
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
    return info;
}
const toMint = async()=>{
    let tx = await getTx();
    let info =  getInf(tx);


    //console.log('info: ', info)
    let eventType = 2;  // 1-- userLock; 2 -- userBurn
   let ret = await tx2TxParser.handlerTxWanLend(admin,tx.hash, tx.from, info, 2, BigNumber.from('2900000000000000000'), eventType);
    console.log('ret: ', ret);



}
const getInfoOnChain = async ()=>{
    let tx = await getTx();
    let info =  getInf(tx);
    let txhash = await tx2TxParser.hash(info, 2);
   console.log('txhash: ', txhash);
   console.log('tx.hash:', tx.hash)

   let sender = await tx2TxParser.getSender(info, 2);
   console.log('sender: ', sender);
   console.log('tx.from', tx.from);

    let ret = await tx2TxParser.userBurn_decodeInput(info.data);
    console.log('ret: ', ret);
    console.log(ret[0].toString());
    console.log(ret[1].toString());
    console.log(ret[2].toString());

    let ret1 = await tx2TxParser.bytesToAddress(ret[2])
    console.log('ret1: ', ret1);

    let ret3 = await tx2TxParser.getCTokenAddr(ret[0]);
    console.log('ret3: ', ret3);

}

const main = async ()=>{
     //await getTx();
     await toMint();
}

main();
