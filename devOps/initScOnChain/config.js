const admin = require('../../wallet');
const config = require('../../config');

module.exports = {
    admin:admin,
    wanChain:config.wanChain,
    scAddr: config.scAddrs,
    isMain: config.isMain
}
