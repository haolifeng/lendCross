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
    async setTxMulParse(wallet, txParseScAddrs){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.setTxMulParse(txParseScAddrs);
        let ret = await tx.wait();
        return ret;
    }
    async txParserMap(txParserScAddr){
        let ret = await this.scInst.txParserMap(txParserScAddr);
        return ret;
    }
    async IERC20Balance(erc20Addr) {
        let erc20Balance = await this.scInst.IERC20Balance(erc20Addr);
        return erc20Balance;
    }

    async IERC20transfer(wallet, erc20Addr, recipient, amount) {
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.IERC20transfer(erc20Addr, recipient, amount,{
            gasLimit:'5000000'
        });
        let rect = await tx.wait();

        return rect;
    }
    async IERC20Approve(wallet ,erc20Addr, sender, amount) {
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.IERC20Approve(erc20Addr, sender, amount,{
            gasLimit:'9000000'
        });
        let rect = await tx.wait();

        return rect;


    }

    async sendWan(wallet, to, amount){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.sendWan(to,amount);
        let ret = await tx.wait();

    }
}
module.exports = CrossLendBaseObj;