const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const f = async ()=>{
    let tokenManagerScAddr = config.appConfig.tokenManagerAddr;

    let ret = await crossCheckObj.getTokenManger();
    console.log('ret: ', ret);
    console.log('tokenMangerScAddr: ', tokenManagerScAddr);

};

f();