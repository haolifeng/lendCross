const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const getUnderlyingTokenByTokenPairID = async (tokenPairID) =>{
    console.log('tokenPairID: ', tokenPairID);
    let underlyingTokenAddr = await crossCheckObj.getUnderlyingToken(tokenPairID);
    console.log('underlyingTokenAddr: ', underlyingTokenAddr);
}

const main = async ()=>{

    let tokenPair = 39; //avax <-> wanchain  AVAX
    tokenPair = 98 ; // bnb
    tokenPair = 90 ; //avax wan<->moonbase
    await getUnderlyingTokenByTokenPairID(tokenPair);


};

main();