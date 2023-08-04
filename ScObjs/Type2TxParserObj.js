
const BaseTxParseObj = require('./BaseTxParseObj')

class Type2TxParserObj extends BaseTxParseObj {
    constructor(scAddr, nodeUrl, abi){
        super(scAddr,nodeUrl,abi)
    }
    async handlerTxWanLend(wallet,  uniquID,  from,    info, txType ,actualValue){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.handlerTxWanLend(uniquID,from, info,  txType,actualValue,{
            gasLimit:'5000000'
        });
        let ret = await tx.wait();
        return ret;
    }
    async hash(info, txType){
        let hashBytes = await this.scInst.hash(info, txType);
        return hashBytes;
    }
    async getSender(info, txType){
        let sender = await this.scInst.getSender(info, txType);
        return sender;
    }
    async decodeInput(data){
        let ret = await this.scInst.decodeInput(data);
        return ret;
    }
    async bytesToAddress(crossLendToken){
        let ret = await this.scInst.bytesToAddress(crossLendToken);
        return ret;
    }
    async getCTokenAddr(tokenPairID){
        let ret = await this.scInst.getCTokenAddr(tokenPairID);
        return ret;
    }
}

module.exports = Type2TxParserObj;