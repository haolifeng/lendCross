const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;
const {
    Type0TxParserObj,
    Type1TxParserObj,
    Type2TxParserObj
} = require('../../ScObjs')

const {
    Type0TxParser_abi,
    Type1TxParser_abi,
    Type2TxParser_abi,
} = require('../abi');

let tx0TxParser = new Type0TxParserObj(type0TxParserScAddr,wanUrl, Type0TxParser_abi);
let tx1TxParser = new Type1TxParserObj(type1TxParserScAddr,wanUrl, Type1TxParser_abi);
let tx2TxParser = new Type2TxParserObj(type2TxParserScAddr,wanUrl, Type2TxParser_abi);
module.exports = {
    tx0TxParser, tx1TxParser, tx2TxParser
}
