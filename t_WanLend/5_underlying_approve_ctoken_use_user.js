const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

console.log('wanUrl: ', wanUrl);

const admin = require('../wallet');



const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj,BaseErc20Obj
} = require('../ScObjs')
const {BigNumber} = require("ethers");

const MAX_APPROVE = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
let user2 = require('./wallet_Account2');
const scAddr = user2.address;
const main = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        let tokenAddrPair = {
            underlyingToken:params[ctokenName].underlying.toLowerCase(),
            ctokenAddr:lendConfig[ctokenName].toLowerCase(),
        }
        tokenAddrPairs.push(tokenAddrPair)

    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    for(let i = 0 ; i < tokenAddrPairs.length; i++ ){
        let underlyTokenScAddr = tokenAddrPairs[i].underlyingToken;
        if(underlyTokenScAddr === '0x0000000000000000000000000000000000000000'){
            continue;
        }
        else{

            let underlyTokenInst = new BaseErc20Obj(wanUrl,underlyTokenScAddr);
            //let ret = await underlyTokenInst.approve(user2,tokenAddrPairs[i].ctokenAddr,MAX_APPROVE);
            let ret = await underlyTokenInst.approve(admin,tokenAddrPairs[i].ctokenAddr,MAX_APPROVE);
            console.log('ret: ', ret)


        }
    }

}
main();