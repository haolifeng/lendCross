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
}

module.exports = CrossCheckObj;