const { ethers } = require('ethers')

class BaseTxParseObj {
    constructor(scAddr, nodeUrl, abi){
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);
    }
    async setDependsContractAddr( wallet, _crossCheckAddr,  _crosssLendRepayAddr,  _crossLendMintAddr){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setDependsContractAddr(_crossCheckAddr,  _crosssLendRepayAddr,  _crossLendMintAddr);
        let ret = await tx.wait();
        return ret;
    }
    async crossCheckAddr(){
        let ret = await this.scInst.crossCheckAddr();
        return ret;
    }
    async crossLendRepayAddr(){
        let ret = await this.scInst.crossLendRepayAddr();
        return ret;
    }
    async crossLendMintAddr(){
        let ret = await this.scInst.crossLendMintAddr();
        return ret;
    }
}
module.exports = BaseTxParseObj;