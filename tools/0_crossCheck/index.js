const config = require('../config');

const admin = require('../../wallet');

const crossCheckObj = require('./crossCheckObj');

async function checkUniqeID(uniqueID){
    try{
        console.log('in chrossCheckObj --- uniqueID', uniqueID);
        let ret = await crossCheckObj.checkUniqeID(uniqueID);
        console.log('in chrossCheckObj --- , ret: ', ret);
        return ret;
    }catch (e) {
        console.log('e: ',e);
    }

}
const uniqueID = "0x8391e9cf20b0463e6ee259d49b23ab22bf99ebf0f9c2e1e3972d2b6bff170b77";

const main = async () => {
    let ret = await checkUniqeID(uniqueID);
    console.log('ret: ', ret);
}
main();

module.exports = {
    checkUniqeID
}



