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

const mintWan = async ()=>{
    let ret = await cWan.mint(user2,ethers.utils.parseEther('7'))
    console.log('ret: ', ret);
}
const borrowUSDT = async () =>{
    let ret = await cWanUSDT.borrow(user2, ethers.utils.parseUnits('0.01',6));
    console.log('ret: ', ret);
}

const borrowBalanceStored = async ()=>{
    let ret = await cWanUSDT.borrowBalanceStored(user2.address);
    console.log('ret: ', ret.toString());
}

const main= async ()=>{
    //await mintWan();
    //await borrowUSDT();
    await borrowBalanceStored();
}
main();