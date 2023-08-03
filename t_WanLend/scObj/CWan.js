const config = require('../../config')
const {ethers} = require("ethers");
const abi = require("../abi/CWan.json");
const scAddr = config.lendConfig.wWAN.toLowerCase();
class CWan{
    constructor() {
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(config.appConfig.wanChain.nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi,this.provider);
    }
    async getBalance(owner){
        let bnBalance  = await this.scInst.balanceOf(owner);
        return bnBalance;
    }
    async redeem(wallet, redeemAmount) {
        try {
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);


            let tx = await signScInst.redeem(redeemAmount, {
                gasLimit: 50000000
            });

            let ret = await tx.wait();
            return ret;


        } catch (e) {

            return false;
        }
    }
    async mint(wallet, value){
        try{
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);
            let tx = await signScInst.mint({
                value:value,
                gasLimit:50000000
            })
            let ret = await tx.wait();
            return ret;
        } catch (e) {
            console.log('e: ', e)

            return false;
        }
    }
    async borrowBalanceStored(account){
        let result = await this.scInst.borrowBalanceStored(account);
        return result;
    }
}
let cWan = new CWan();

module.exports = cWan;