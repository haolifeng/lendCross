const {
    cWan, cWanUSDT, wan, wanUSDT
} = require('./scObj')

const config = require('../config');

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"

let lendMintScAddr = config.scAddrs.CrossLendMint;
let lendRepayScAddr = config.scAddrs.CrossLendRepay;

let admin = require('../wallet');
const {BigNumber, ethers} = require("ethers");


let user2 = require('./wallet_Account2');

const drawCWanUSDT = async ()=>{
    let ctokenBalance = await cWanUSDT.getBalance(user2.address);
    console.log('ctokenBalance: ', ctokenBalance.toString());
    let ret = await cWanUSDT.redeem(user2, ctokenBalance);
    console.log('ret: ', ret);
}
const drawWanUSDT = async ()=>{
    let wanUsdtBalance = await wanUSDT.balanceOf(user2.address);
    console.log('user2 wanUsdtBalance: ', wanUsdtBalance.toString());
    if(wanUsdtBalance.eq(0)){

        return;
    }
    let ret = await wanUSDT.transfer(user2, admin.address,wanUsdtBalance);
    console.log('ret: ', ret);
}

const main = async ()=>{
    //await drawWanUSDT();
    await drawCWanUSDT();

}

main();