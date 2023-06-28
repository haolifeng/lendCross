const { ethers } = require('ethers');

class CrossLendBaseObj {
    constructor(scAddr, nodeUrl, abi){
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);
    }
    async setTxParse(wallet, txParseScAddr){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = signedWallet.setTxParse(txParseScAddr);
        let ret = await tx.wait();
        return ret;
    }

}
module.exports = CrossLendBaseObj;