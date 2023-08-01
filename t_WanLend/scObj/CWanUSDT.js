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
    async borrow(wallet, accmount){
        try{
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);

            let tx = await signScInst.borrow(accmount,{
                gasLimit:50000000
            })

            let ret = await tx.wait();
            return ret;
        }catch (e) {

            return false;
        }
    }

    async borrowBalanceStored(account){
        let result = await this.scInst.borrowBalanceStored(account);
        return result;
    }

    async mint(wallet, value){
        try{
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);
            let tx = await signScInst.mint(value,{
                gasLimit:50000000
            })
            let ret = await tx.wait();
            return ret;
        } catch (e) {
            console.log('e: ', e)

            return false;
        }
    }


}

let cWanUSDT = new CWanUSDT();

module.exports = cWanUSDT;