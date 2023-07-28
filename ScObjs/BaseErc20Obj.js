let abi = require('../config/abi/abi.erc20.json')
const {ethers, BigNumber}  = require('ethers')
class BaseErc20Obj {
    constructor(url,scAddr){
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(url);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);

    }
    async balanceOf(owner){
        let ret = await this.scInst.balanceOf(owner);

        return ret;
    }
    async allowance(owner, spender){
        let ret = await this.scInst.allowance(owner, spender);
        return ret;

    }
    async name(){
        let name = await this.scInst.name();

        return name;

    }
    async symbol(){
        let symbol = await this.scInst.symbol();
        return symbol;
    }
    async decimals(){
        let decimals = await this.scInst.decimals();
        return decimals;
    }
    async transfer(wallet, to, value ){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.transfer(to, value);
        let receipt = await tx.wait();
        return receipt;

    }
    async transferFrom(wallet, from, to, value ){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.transferFrom(from,to, value);
        let receipt = await tx.wait();
        return receipt;
    }
    async approve(wallet, spender, value){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.approve(spender, value);
        let receipt = await tx.wait();

        return receipt;
    }
}
module.exports = BaseErc20Obj;