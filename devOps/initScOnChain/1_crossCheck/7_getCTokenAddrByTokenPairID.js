const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const getCTokenAddrByTokenPairID = async (tokenPairID) =>{
    console.log('tokenPairID: ', tokenPairID);
    let CTokenAddr = await crossCheckObj.getCTokenAddrByTokenPair(tokenPairID);
    console.log('CTokenAddr: ', CTokenAddr);
}

const main = async ()=>{

    let tokenPair = 5; //etherem <-> wanchain  btc

    await getCTokenAddrByTokenPairID(tokenPair);


};

main();