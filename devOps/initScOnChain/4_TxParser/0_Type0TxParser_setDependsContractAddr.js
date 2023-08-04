const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
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

const all = async ()=>{
    let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
    let ret = await tx0TxParser.setDependsContractAddr(admin, crossCheckScAddr, crossLendRepayScAddr, crossLendMintScAddr);
    console.log('ret: ', ret);
}

const setCheckScAddr = async ()=>{
    let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
    let ret = await tx0TxParser.setDependCrossCheckAddr(admin, crossCheckScAddr);
    console.log('ret: ', ret);
}
const setLendRepayScAddr = async ()=>{
    let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
    let ret = await tx0TxParser.setDependLendRepayAddr(admin, crossLendRepayScAddr);
    console.log('ret: ', ret);
}
const setLendMintScAddr = async ()=>{
    let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
    let ret = await tx0TxParser.setDependLendMintAddr(admin, crossLendMintScAddr);
    console.log('ret: ', ret);
}
all();

/*(async function(){
    await setCheckScAddr();
    await setLendRepayScAddr();
    await setLendMintScAddr();
})()*/

