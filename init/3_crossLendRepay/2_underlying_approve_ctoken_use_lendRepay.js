const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendRepay;

const admin = require('../../wallet');



const {
     BaseErc20Obj
} = require('../../ScObjs')
const {BigNumber} = require("ethers");

const MAX_APPROVE = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const crossLendRepayObj = require('./crossLendRepay');

const underlyingApproveCtokenUseLendRepay = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        if(lendConfig[ctokenName]){
            let tokenAddrPair = {
                underlyingToken:params[ctokenName].underlying.toLowerCase(),
                ctokenAddr:lendConfig[ctokenName].toLowerCase()
            }
            tokenAddrPairs.push(tokenAddrPair)
        }


    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    for(let i = 0 ; i < tokenAddrPairs.length; i++ ){
        let underlyTokenScAddr = tokenAddrPairs[i].underlyingToken;
        if(underlyTokenScAddr === '0x0000000000000000000000000000000000000000'){
            continue;
        }
        else{
            let erc20 = new BaseErc20Obj(wanUrl, underlyTokenScAddr);
            let name = await erc20.name();
            let approveNum = await erc20.allowance(scAddr, tokenAddrPairs[i].ctokenAddr)
            if(approveNum.eq(0)){
                let ret = await  crossLendRepayObj.IERC20Approve(admin, tokenAddrPairs[i].underlyingToken, tokenAddrPairs[i].ctokenAddr, BigNumber.from(MAX_APPROVE));
                console.log('ret: ', ret);
                console.log('ret: ', ret);
                if(ret.status === 1){
                    console.log('name: ', name , "success" );
                }else{
                    console.log('name: ', name , "error")
                }

            }else {
                console.log('name:', name, ' approveName: ', approveNum.toString());
            }

        }
    }

}

module.exports = underlyingApproveCtokenUseLendRepay;