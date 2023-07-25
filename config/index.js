const appConfig_main = require('./config_main');
const appConfig_test = require('../config_test');

const scAddrs_main = require('./gconfig/scAddrs_main')
const scAddrs_test = require('./gconfig/scAddrs_test');

let isMain = false;

const appConfig = isMain ? appConfig_main : appConfig_test;
const scAddrs = isMain ? scAddrs_main : scAddrs_test;


let config = {
    wanChain:appConfig.wanChain,
    words: appConfig.words,
    isMain: isMain,
    scAddrs:scAddrs

}

module.exports = config;