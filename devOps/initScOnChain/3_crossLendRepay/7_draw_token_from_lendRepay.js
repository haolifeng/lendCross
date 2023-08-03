const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendRepay;

const { crossLendRepay_abi } = require('../abi');
const admin = require('../../../wallet');

const ctokenScAddr = config.lendConfig.w2wanUSDT
const underlyingTokenScAddr = config.lendConfig.params.w2wanUSDT.underlying.toLowerCase();

let account1 = "0xEF48C3AB7f184e469504Bdbd9C07883Ab4427c66";
let account2 = "0xdC484B57a5CC0563b42C2e3D37466b14186f501b"
const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')
const {BigNumber} = require("ethers");

let crossLendRepayObj = new CrossLendRepayObj(scAddr,wanUrl,crossLendRepay_abi);

const drawCtoken = async ()=>{
    let ctokenBalance = await crossLendRepayObj.IERC20Balance(ctokenScAddr);
    console.log('ctokenBalance: ', ctokenBalance.toString());
    if(ctokenBalance.eq(0)){
        return;
    }

    let ret = await crossLendRepayObj.IERC20transfer(admin,ctokenScAddr,account1,ctokenBalance);
    console.log('ret: ', ret);
}
const drawUnderlyingToken = async ()=>{
    let underlyingTokenBalance = await crossLendRepayObj.IERC20Balance(underlyingTokenScAddr);
    console.log('undelryingToken balance: ', underlyingTokenBalance.toString());
    if(underlyingTokenBalance.eq(0)){
        return;
    }
    let ret = await crossLendRepayObj.IERC20transfer(admin, underlyingTokenScAddr, account1,underlyingTokenBalance)
    console.log('ret: ', ret);
}
const main = async ()=>{
    //await drawCtoken();
    await drawUnderlyingToken();
}
main();