const {
    cWan, cWanUSDT, wan, wanUSDT
} = require('./scObj')

const config = require('../config');

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"

let lendMintScAddr = config.scAddrs.CrossLendMint;
let lendRepayScAddr = config.scAddrs.CrossLendRepay;

let admin = require('../wallet');

const main = async ()=>{
     await wan.transfer(admin, lendMintScAddr, 5);
    let r = await wanUSDT.transfer(admin, lendMintScAddr, 1);
    console.log('r: ', r);
}
main();