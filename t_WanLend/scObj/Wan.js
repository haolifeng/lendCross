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
}

let wan = new Wan();

module.exports = wan;