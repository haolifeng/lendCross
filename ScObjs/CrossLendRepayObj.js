const { ethers } = require('ethers');
const CrossLendBaseObj = require('./CrossLendBaseObj')
class CrossLendRepayObj extends CrossLendBaseObj{
    constructor(scAddr, nodeUrl, abi){
        super(scAddr, nodeUrl, abi)
    }
    async lendTokenRepay(wallet, cToken,underlyingToken, from,  amount){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.lendTokenRepay(cToken,underlyingToken, from,  amount);
        let ret = await tx.wait();
        return ret;
    }
    async lendWanRepay(wallet, CWanAddr, from, amount){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.lendWanRepay(CWanAddr, from,  amount);
        let ret = await tx.wait();
        return ret;
    }
}

module.exports = CrossLendRepayObj;