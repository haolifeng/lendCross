const admin = require('../../wallet');
const appConfig = require('../../gconfig/appConfig');
const scAddr = require('../../gconfig/scAddr');
let config = {
    admin:admin,
    wanChain:appConfig.wantest,
    scAddr: scAddr,

}
module.exports = config;
