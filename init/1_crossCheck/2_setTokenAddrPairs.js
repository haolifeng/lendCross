const config = require('../config');

const admin = require('../../wallet');

const crossCheckObj = require('./crossCheckObj');


const setTokenAddrsPairs = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        if(lendConfig[ctokenName]){
            let tokenAddrPair = {
                underlyingToken:params[ctokenName].underlying.toLowerCase(),
                ctokenAddr:lendConfig[ctokenName].toLowerCase(),
            }
            tokenAddrPairs.push(tokenAddrPair)
        }


    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    let ret = await crossCheckObj.setTokenAddrPairs(admin, tokenAddrPairs);
    console.log('ret: ', ret);
    return ret.status === 1;

}


module.exports = setTokenAddrsPairs