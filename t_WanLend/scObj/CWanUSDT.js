const {ethers } = require('ethers')
const config = require('../../config')

const abi = require('../abi/CErc20.json');

const scAddr = config.lendConfig.wwanUSDT.toLowerCase();
class CWanUSDT{
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.appConfig.wanChain.nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi,this.provider);
    }
    async getBalance(address){
        let bnBalance  = await this.scInst.balanceOf(address);
        return bnBalance;
    }
}

let cWanUSDT = new CWanUSDT();

module.exports = cWanUSDT;