const { ethers } = require('ethers');
class CrossCheckObj {
    constructor(scAddr, nodeUrl, abi){
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);
    }
    async setTokenPairs(wallet, TokenAddrPair){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setTokenPairs(TokenAddrPair);
        let ret = await tx.wait();
        return ret;
    }
    async setTokenManager(wallet, tokenManagerScAddr) {
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setTokenManager(tokenManagerScAddr);
        let ret = await tx.wait();
        return ret;
    }

    async getTokenManger(){
        let ret = await this.scInst.TokenManagerAddr();
        return ret;
    }
    async getwanChainID(){
        let wanchainID = await this.scInst.wanChainID();
        return wanchainID.toString();
    }
    async setTokenAddrPairs(wallet, tokenAddrPairs){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setTokenAddrPairs(tokenAddrPairs);
        let ret = await tx.wait();
        return ret;
    }
    async checkTokenAddrPair(underlyingTokenAddr){
        let ctokenAddr = await this.scInst.UnderlyingTokenToCTokenMap(underlyingTokenAddr);
        return ctokenAddr.toString();
    }
    async getUnderlyingToken( tokenPairID){
        let underlyingTokenAddr = await this.scInst.getUnderlyingToken(tokenPairID);
        return underlyingTokenAddr.toString();
    }
    async getCTokenAddrByTokenPair(tokenPairID){
        let ret = await this.scInst.getCTokenAddr(tokenPairID);
        return  ret
    }
    async checkUniqeID(uniqueID){
        let ret = await this.scInst.checkUniqeID(uniqueID);
        return ret;
    }
    async setUniqueIDFinished(wallet, uniqueID){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setUniqueIDFinished(uniqueID);
        let ret = await tx.wait();
        return ret;
    }

    // 授权/撤销某个地址（通常是 TxParser 合约）标记 uniqueID 已处理
    async setParser(wallet, parser, allowed){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setParser(parser, allowed);
        let ret = await tx.wait();
        return ret;
    }
    async checkParser(parser){
        return await this.scInst.parserMap(parser);
    }

    // 撤销跨链代理合约白名单，用于应急处置
    async delCrossDelegateSc(wallet, scAddr){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.delCrossDelegateSc(scAddr);
        let ret = await tx.wait();
        return ret;
    }
    async checkCrossDelegateSc(scAddr){
        return await this.scInst.checkCrossDelegateSc(scAddr);
    }
}

module.exports = CrossCheckObj;