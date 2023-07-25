
const BaseTxParseObj = require('./BaseTxParseObj')

class Type2TxParserObj extends BaseTxParseObj {
    constructor(scAddr, nodeUrl, abi){
        super(scAddr,nodeUrl,abi)
    }
}

module.exports = Type2TxParserObj;