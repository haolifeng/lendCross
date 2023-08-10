const config = require('../config');



const crossCheckObj = require('./crossCheckObj');

const checkTokenManagerAddr = async ()=>{
    let tokenManagerScAddr = config.appConfig.tokenManagerAddr;

    let ret = await crossCheckObj.getTokenManger();
    console.log('ret: ', ret);
    console.log('tokenMangerScAddr: ', tokenManagerScAddr);
    if(ret.toLowerCase() === tokenManagerScAddr.toLowerCase()){
        console.log('tokenManagerScAddr is samei')
    }

};

const checkWanChainID = async ()=>{
    let ret = await crossCheckObj.getwanChainID();
    console.log('ret: ', ret); //2153201998
};

const checkTokenAddrPairs = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        if(lendConfig[ctokenName]) {
            let tokenAddrPair = {
                underlyingToken: params[ctokenName].underlying.toLowerCase(),
                ctokenAddr: lendConfig[ctokenName].toLowerCase(),
            }
            tokenAddrPairs.push(tokenAddrPair)
        }

    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    for(let i = 0 ; i< tokenAddrPairs.length;i++){
        let ret = await crossCheckObj.checkTokenAddrPair( tokenAddrPairs[i].underlyingToken);

        if(ret.toLowerCase() === tokenAddrPairs[i].ctokenAddr.toLowerCase()){
            console.log('the address is right')
        }else{
            console.log('ret: ', ret.toLowerCase(), '!= ctokenAddr', tokenAddrPairs[i].ctokenAddr.toLowerCase())
        }
    }
}

module.exports = {
    checkTokenManagerAddr, checkWanChainID, checkTokenAddrPairs
}