const config = require('../config');

const admin = require('../../wallet');




const crossCheckScAddr = config.scAddrs.CrossCheck;
const crossLendMintScAddr = config.scAddrs.CrossLendMint;
const crossLendRepayScAddr = config.scAddrs.CrossLendRepay;

const {tx0TxParser } = require('./txParser')
const type0setDependsContractAddr = async ()=>{

    let ret = await tx0TxParser.setDependsContractAddr(admin, crossCheckScAddr, crossLendRepayScAddr, crossLendMintScAddr);
    console.log('ret: ', ret);
    return ret.status === 1;
}

const setCheckScAddr = async ()=>{

    let ret = await tx0TxParser.setDependCrossCheckAddr(admin, crossCheckScAddr);
    console.log('ret: ', ret);
    return ret.status === 1;
}
const setLendRepayScAddr = async ()=>{

    let ret = await tx0TxParser.setDependLendRepayAddr(admin, crossLendRepayScAddr);
    console.log('ret: ', ret);
    return ret.status === 1;
}
const setLendMintScAddr = async ()=>{

    let ret = await tx0TxParser.setDependLendMintAddr(admin, crossLendMintScAddr);
    console.log('ret: ', ret);
    return ret.status === 1;
}


async function s(){
    await setCheckScAddr();
    await setLendRepayScAddr();
    await setLendMintScAddr();
}

module.exports = {
    type0setDependsContractAddr, setCheckScAddr, setLendRepayScAddr, setLendMintScAddr
}

