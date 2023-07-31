const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendRepay;

const { crossLendRepay_abi } = require('../abi');
const admin = require('../../../wallet');

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;

const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')

txParser = admin.address;

const main = async ()=>{
    let crossLendRepayObj = new CrossLendRepayObj(scAddr,wanUrl,crossLendRepay_abi);


    let ret = await crossLendRepayObj.setTxParse(admin,txParser);
    console.log('ret: ', ret)
}
main()
