const { ethers } = require('ethers');
const CrossLendBaseObj = require('./CrossLendBaseObj')
class CrossLendMintObj extends  CrossLendBaseObj{
    constructor(scAddr, nodeUrl, abi){
        super(scAddr, nodeUrl, abi)
    }

    async lendTokenMint(wallet, cToken, underlyingToken, from,  amount){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.lendTokenMint(cToken,underlyingToken, from,  amount);
        let ret = await tx.wait();
        return ret;
    }
    async lendWanMint(wallet,  CWanAddr, from,  amount){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.lendWanMint(CWanAddr, from,  amount);
        let ret = await tx.wait();
        return ret;
    }



}
module.exports = CrossLendMintObj;