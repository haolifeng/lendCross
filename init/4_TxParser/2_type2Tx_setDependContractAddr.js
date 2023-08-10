const config = require('../config');

const admin = require('../../wallet');




const crossCheckScAddr = config.scAddrs.CrossCheck;
const crossLendMintScAddr = config.scAddrs.CrossLendMint;
const crossLendRepayScAddr = config.scAddrs.CrossLendRepay;

const {tx2TxParser } = require('./txParser')
const type2setDependsContractAddr = async ()=>{

    let ret = await tx2TxParser.setDependsContractAddr(admin, crossCheckScAddr, crossLendRepayScAddr, crossLendMintScAddr);
    console.log('ret: ', ret);
}

const setCheckScAddr = async ()=>{

    let ret = await tx2TxParser.setDependCrossCheckAddr(admin, crossCheckScAddr);
    console.log('ret: ', ret);
}
const setLendRepayScAddr = async ()=>{

    let ret = await tx2TxParser.setDependLendRepayAddr(admin, crossLendRepayScAddr);
    console.log('ret: ', ret);
}
const setLendMintScAddr = async ()=>{

    let ret = await tx2TxParser.setDependLendMintAddr(admin, crossLendMintScAddr);
    console.log('ret: ', ret);
}


async function s(){
    await setCheckScAddr();
    await setLendRepayScAddr();
    await setLendMintScAddr();
}

module.exports = {
    type2setDependsContractAddr, setCheckScAddr, setLendRepayScAddr, setLendMintScAddr
}

