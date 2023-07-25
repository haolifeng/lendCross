const config = require('../config');
const wanUrl = config.wanChain.nodeUrl;

const ScAddr = config.scAddr.Type1TxParser;
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
    let tx1TxParser = new Type1TxParserObj(ScAddr,wanUrl, Type1TxParser_abi);
    let ret = await tx1TxParser.setDependsContractAddr(admin, crossCheckScAddr, crossLendRepayScAddr, crossLendMintScAddr);
    console.log('ret: ', ret);
}

f();

