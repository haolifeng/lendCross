const config = require('../../config')
const {ethers} = require("ethers");
const abi = require("../abi/CWan.json");
const scAddr = config.lendConfig.wWAN.toLowerCase();
class CWan{
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.appConfig.wanChain.nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi,this.provider);
    }
    async getBalance(owner){
        let bnBalance  = await this.scInst.balanceOf(owner);
        return bnBalance;
    }
}
let cWan = new CWan();

module.exports = cWan;