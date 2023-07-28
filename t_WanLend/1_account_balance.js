const cWan = require('./scObj/CWan');
const cWanUSDT = require('./scObj/CWanUSDT');
const wan = require('./scObj/Wan');

const wanUSDT = require('./scObj/WanUSDT');

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"

const f = async ()=>{
    let account1_wanUSDT_Balance = await wanUSDT.balanceOf(account1.toLowerCase());
    console.log('account1_wanUSDT_Balance: ', account1_wanUSDT_Balance.toString())

    let account2_wanUSDT_Balance = await wanUSDT.balanceOf(account2.toLowerCase());
    console.log('account2_wanUSDT_Balance: ', account2_wanUSDT_Balance.toString())

    let account1_balance = await wan.getBalance(account1);
    console.log('account1_balance: ', account1_balance.toString());
    let account2_balance = await wan.getBalance(account2);
    console.log('account2_balance: ', account2_balance.toString());



}
f();