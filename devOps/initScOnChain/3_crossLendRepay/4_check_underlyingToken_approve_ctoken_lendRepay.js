const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const crossLendScAddr = config.scAddrs.CrossLendRepay;

const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj,
    BaseErc20Obj
} = require('../../../ScObjs')
const {BigNumber} = require("ethers");
const admin = require("../../../wallet");


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
            let erc20 = new BaseErc20Obj(wanUrl, underlyTokenScAddr);
            let approveNum = await erc20.allowance(crossLendScAddr, tokenAddrPairs[i].ctokenAddr)

            let name = await erc20.name();

            console.log('erc20:', name, ' approveNum: ', approveNum.toString());

        }
    }

}
main();