const config = require('../config');

const admin = require('../../../wallet');

const crossCheckObj = require('./crossCheckObj');

const f = async ()=>{


    let tokenAddrPairs = [{
        underlyingToken:"0x89a3e1494bc3db81dadc893ded7476d33d47dcbd",
        ctokenAddr:"0x5b52896ae248c603c21a2e962d19d82fc8ff3647",
    }]

    let ret = await crossCheckObj.setTokenAddrPairs(admin, tokenAddrPairs);
    console.log('ret: ', ret);

};

f();