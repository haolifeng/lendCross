const config = require('../config');
const cWan = require('./scObj/CWan');
const cWanUSDT = require('./scObj/CWanUSDT');
const wan = require('./scObj/Wan');

const wanUSDT = require('./scObj/WanUSDT');

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"

let lendMintScAddr = config.scAddrs.CrossLendMint;
let lendRepayScAddr = config.scAddrs.CrossLendRepay;

const balancesof = async (address)=>{
    console.log('User: ', address);
    let wanBalance = await wan.getBalance(address);
    console.log( 'wan Balance: ', wanBalance.toString());

    let wanUSDT_balance = await wanUSDT.balanceOf(address);
    console.log('wanUSDT Balance: ', wanUSDT_balance.toString());

    let cwanBalance = await cWan.getBalance(address);
    console.log('cWan Balance: ', cwanBalance.toString());

    let cWanUSDTBalance = await cWanUSDT.getBalance(address);
    console.log('cWanUSDT Balance: ', cWanUSDTBalance.toString());

    console.log('\n')
}
const main = async ()=>{
    let users = [account1, account2, lendMintScAddr, lendRepayScAddr];
    console.log('Account1: ---------------------');
    await balancesof(users[0]);
    console.log('Account2: ---------------------');
    await balancesof(users[1]);
    console.log('lendMintScAddr: ---------------');
    await balancesof(users[2]);

    console.log('lendRepayScAddr: ------------------');
    await balancesof(users[3]);

}
main();
