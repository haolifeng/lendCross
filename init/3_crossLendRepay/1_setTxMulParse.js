const config = require('../config');


const admin = require('../../wallet');

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;
const crossLendRepayObj = require('./crossLendRepay');


let txParsers = [type0TxParserScAddr, type1TxParserScAddr, type2TxParserScAddr,admin.address];
const setTxMulParse = async ()=>{


    console.log('txParsers: ', txParsers);

    let ret = await crossLendRepayObj.setTxMulParse(admin,txParsers);
    console.log('ret: ', ret)
}

module.exports = setTxMulParse;
