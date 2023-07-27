const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const main = async ()=>{


    let ret = await crossCheckObj.getwanChainID();
    console.log('ret: ', ret);


};

main();