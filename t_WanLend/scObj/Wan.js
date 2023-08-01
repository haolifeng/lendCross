const {ethers} = require("ethers");
const config = require("../../config");

class Wan{
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.appConfig.wanChain.nodeUrl);
    }
    async getBalance(owner){
        let balance = await this.provider.getBalance(owner);
        return balance;
    }
    async transfer(wallet, to, amount){
        let signedWallet = wallet.connect(this.provider);
        const tx = await signedWallet.sendTransaction({
            to: to,
            value: amount
        })
        let ret = await tx.wait();
        return ret;
    }
}

let wan = new Wan();

module.exports = wan;