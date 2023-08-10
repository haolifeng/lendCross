const config = require('../config');

const crossCheckScAddr = config.scAddrs.CrossCheck;
const crossLendMintScAddr = config.scAddrs.CrossLendMint;
const crossLendRepayScAddr = config.scAddrs.CrossLendRepay;

const {
    tx0TxParser, tx1TxParser, tx2TxParser
} = require('./txParser');


const checkTx0TxParser = async ()=>{

    let ret = await tx0TxParser.crossCheckAddr();

    if(ret.toLowerCase() === crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx0TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() === crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx0TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() === crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}
const checkTx1TxParser = async ()=>{

    let ret = await tx1TxParser.crossCheckAddr();

    if(ret.toLowerCase() === crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx1TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() === crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx1TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() === crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}
const checkTx2TxParser = async ()=>{

    let ret = await tx2TxParser.crossCheckAddr();

    if(ret.toLowerCase() === crossCheckScAddr.toLowerCase()){
        console.log('ret: ', ret, "crossCheckScAddr is same");
    }else{
        console.log('ret: ', ret.toLowerCase(), 'crossCheckScAddr is wrong', crossCheckScAddr.toLowerCase());
    }

    let crossLendMintScAddr_onChain = await tx2TxParser.crossLendMintAddr();
    if(crossLendMintScAddr_onChain.toLowerCase() === crossLendMintScAddr.toLowerCase()){
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain, "crossLendMintScAddr is same");
    }else{
        console.log('crossLendMintScAddr_onChain: ', crossLendMintScAddr_onChain.toLowerCase(), 'crossLendMintScAddr is wrong', crossLendMintScAddr.toLowerCase());
    }

    let crossLendRepayScAddr_onChain = await tx2TxParser.crossLendRepayAddr();
    if(crossLendRepayScAddr_onChain.toLowerCase() === crossLendRepayScAddr.toLowerCase()){
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain, "crossLendRepayScAddr is same");
    }else{
        console.log('crossLendRepayScAddr_onChain: ', crossLendRepayScAddr_onChain.toLowerCase(), 'crossLendRepayScAddr is wrong', crossLendRepayScAddr.toLowerCase());
    }
}

module.exports = {
    checkTx0TxParser, checkTx1TxParser, checkTx2TxParser
}

