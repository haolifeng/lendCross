const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;

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

const f0 = async ()=>{
    let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
    let ret = await tx0TxParser.crossCheckAddr();

    if(ret.toLowerCase() == crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx0TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() == crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx0TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() == crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}
const f1 = async ()=>{
    let tx1TxParser = new Type1TxParserObj(type1TxParserScAddr,wanUrl, Type1TxParser_abi);
    let ret = await tx1TxParser.crossCheckAddr();

    if(ret.toLowerCase() == crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx1TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() == crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx1TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() == crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}
const f2 = async ()=>{
    let tx2TxParser = new Type2TxParserObj(type2TxParserScAddr,wanUrl, Type2TxParser_abi);
    let ret = await tx2TxParser.crossCheckAddr();

    if(ret.toLowerCase() == crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx2TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() == crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx2TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() == crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}

(async function  (){
    await f0();
    console.log('000000000000000000000000 -----------')
    await f1();
    console.log('111111111111111111111111 -------------')
    await f2();
})()

