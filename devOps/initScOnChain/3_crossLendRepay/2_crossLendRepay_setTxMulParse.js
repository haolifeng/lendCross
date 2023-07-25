const config = require('../config');
const wanUrl = config.wanChain.nodeUrl;
const scAddr = config.scAddr.CrossLendRepay;

const { crossLendMint_abi } = require('../abi');
const admin = require('../../../wallet');

const type0TxParserScAddr = config.scAddr.Type0TxParser;
const type1TxParserScAddr = config.scAddr.Type1TxParser;
const type2TxParserScAddr = config.scAddr.Type2TxParser;

const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')

const main = async ()=>{
    let crossLendMinObj = new CrossLendMintObj(scAddr,wanUrl,crossLendMint_abi);

    let ret = await crossLendMinObj.setTxMulParse(admin,[type0TxParserScAddr, type1TxParserScAddr, type2TxParserScAddr]);
    console.log('ret: ', ret)
}

