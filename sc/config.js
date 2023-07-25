const appConfig_main = require('../gconfig/appConfig_main');
const appConfig_test = require('../gconfig/appConfig_test');

let isMain = false;

const appConfig = isMain ? appConfig_main : appConfig_test


let config = {
    wanChain:appConfig.wanChain,
    words: appConfig.words,
    isMain: isMain

}

module.exports = config;