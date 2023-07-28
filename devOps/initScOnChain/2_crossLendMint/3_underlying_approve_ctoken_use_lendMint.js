const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendMint;

const { crossLendMint_abi } = require('../abi');
const admin = require('../../../wallet');

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;

const {
    CrossCheckObj,CrossLendMintObj,CrossLendRepayObj,Type0TxParserObj,Type1TxParserObj,Type2TxParserObj
} = require('../../../ScObjs')

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
    let crossLendMinObj = new CrossLendMintObj(scAddr,wanUrl,crossLendMint_abi);
    for(let i = 0 ; i < tokenAddrPairs.length; i++ ){
        let underlyTokenScAddr = tokenAddrPairs[i].underlyingToken;
        if(underlyTokenScAddr === '0x0000000000000000000000000000000000000000'){
            continue;
        }
        else{
            let ret = await  crossLendMinObj.IERC
        }
    }

}
main();