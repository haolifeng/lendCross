const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const one = async ()=>{


    let tokenAddrPairs = [{
        underlyingToken:"0x89a3e1494bc3db81dadc893ded7476d33d47dcbd",
        ctokenAddr:"0x5b52896ae248c603c21a2e962d19d82fc8ff3647",
    }]

    let ret = await crossCheckObj.setTokenAddrPairs(admin, tokenAddrPairs);
    console.log('ret: ', ret);

};
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

    let ret = await crossCheckObj.setTokenAddrPairs(admin, tokenAddrPairs);
    console.log('ret: ', ret);






}
all();