const config = require('../config');
const wanUrl = config.wanChain.nodeUrl;

const ScAddr = config.scAddr.Type2TxParser;
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

const crossCheckScAddr = config.scAddr.CrossCheck;
const crossLendMintScAddr = config.scAddr.CrossLendMint;
const crossLendRepayScAddr = config.scAddr.CrossLendRepay;

const f = async ()=>{
    let tx2TxParser = new Type2TxParserObj(ScAddr,wanUrl, Type2TxParser_abi);
    let ret = await tx2TxParser.setDependsContractAddr(admin, crossCheckScAddr, crossLendRepayScAddr, crossLendMintScAddr);
    console.log('ret: ', ret);
}

f();

