const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendMint;

const { crossLendMint_abi } = require('../abi');
const admin = require('../../../wallet');

const ctokenScAddr = config.lendConfig.w2wanUSDT
const underlyingTokenScAddr = config.lendConfig.params.w2wanUSDT.underlying.toLowerCase();

const cWanAddr = config.lendConfig.w2WAN;

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"
const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')
const {BigNumber} = require("ethers");
let crossLendMinObj = new CrossLendMintObj(scAddr,wanUrl,crossLendMint_abi);



const lendWanMint = async ()=>{
    let amount = await crossLendMinObj.getWanBalance();
    console.log('wan balance: ', amount.toString());

    let ret = await crossLendMinObj.lendWanMint(admin, cWanAddr.toLowerCase(), account2, amount);
    console.log('ret: ', ret);


}
const main = async ()=>{
    await lendWanMint();
}
main();