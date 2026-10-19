const config = require('../config');

const admin = require('../../wallet');

const crossCheckObj = require('./crossCheckObj');

// 安全修复：CrossCheck 的 uniqueID 只有 owner / 已授权的 TxParser 可以标记，
// 这里把三个 TxParser 合约授权为可标记 uniqueID 的 parser
const setParsers = async ()=>{
    const parserAddrs = [
        config.scAddrs.Type0TxParser,
        config.scAddrs.Type1TxParser,
        config.scAddrs.Type2TxParser,
    ];

    let result = true;
    for(let i = 0; i < parserAddrs.length; i++){
        let parserAddr = parserAddrs[i];
        if(!parserAddr){
            console.log('parserAddr is empty, skip: ', i);
            result = false;
            continue;
        }
        console.log('setParser: ', parserAddr);
        let ret = await crossCheckObj.setParser(admin, parserAddr, true);
        console.log('ret: ', ret);
        result = result && ret.status === 1;
    }
    return result;
}

module.exports = setParsers;
