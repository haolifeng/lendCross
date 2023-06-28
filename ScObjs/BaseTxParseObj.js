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
        let tx = signedWallet.setDependsContractAddr(_crossCheckAddr,  _crosssLendRepayAddr,  _crossLendMintAddr);
        let ret = await tx.wait();
        return ret;
    }
}
module.exports = BaseTxParseObj;