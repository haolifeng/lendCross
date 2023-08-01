const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendMint;

const { crossLendMint_abi } = require('../abi');
const admin = require('../../../wallet');

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;

const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')

const main = async ()=>{
    let crossLendMinObj = new CrossLendMintObj(scAddr,wanUrl,crossLendMint_abi);
    let txParsers = [type0TxParserScAddr, type1TxParserScAddr, type2TxParserScAddr, admin.address];
    console.log('txParsers: ', txParsers);

    let ret = await crossLendMinObj.setTxMulParse(admin,txParsers);
    console.log('ret: ', ret)
}
main()
