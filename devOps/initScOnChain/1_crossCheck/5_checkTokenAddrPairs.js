const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');



const all = async ()=>{
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

    for(let i = 0 ; i< tokenAddrPairs.length;i++){
        let ret = await crossCheckObj.checkTokenAddrPair( tokenAddrPairs[i].underlyingToken);

        if(ret.toLowerCase() === tokenAddrPairs[i].ctokenAddr.toLowerCase()){
            console.log('the address is right')
        }else{
            console.log('ret: ', ret.toLowerCase(), '!= ctokenAddr', tokenAddrPairs[i].ctokenAddr.toLowerCase())
        }


    }


}
//all();

const f = async ()=>{


    let tokenAddrPairs = [{
        underlyingToken:"0x89a3e1494bc3db81dadc893ded7476d33d47dcbd",
        ctokenAddr:"0x5b52896ae248c603c21a2e962d19d82fc8ff3647",
    }]
    let underlyingTokenAddr = "0xc8F5b26589392fDE84eE0482e2b5a77DFbE943Fc";
    let ret = await crossCheckObj.checkTokenAddrPair(underlyingTokenAddr );
    console.log('ret: ', ret);

};
f()
