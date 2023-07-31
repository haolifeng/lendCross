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

const main = async ()=>{
    let crossLendObj = new CrossLendRepayObj(scAddr,wanUrl,crossLendRepay_abi);
    let txParsers = [type0TxParserScAddr, type1TxParserScAddr, type2TxParserScAddr];
    console.log('txParsers: ', txParsers);


    for(let i = 0; i < txParsers.length; i++ ){
        let ret = await crossLendObj.txParserMap(txParsers[i]);
        console.log('ret: ', ret)
    }

    let ret = await crossLendObj.txParserMap(admin.address)
    console.log('admin.address : ', ret)
}
main()
