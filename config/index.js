const appConfig_main = require('./config_main');
const appConfig_test = require('../config_test');

const scAddrs_main = require('./gconfig/scAddrs_main')
const scAddrs_test = require('./gconfig/scAddrs_test');

const lendConfig_main = require('./lendConf/config_mainnet');
const lendConfig_test = require('./lendConf/config_testnet');



let isMain = false;

const appConfig = isMain ? appConfig_main : appConfig_test;
const scAddrs = isMain ? scAddrs_main : scAddrs_test;
const lendConfig = isMain ? lendConfig_main: lendConfig_test

let config = {
    wanChain:appConfig.wanChain,
    words: appConfig.words,
    isMain: isMain,
    scAddrs:scAddrs,
    lendConfig:lendConfig,

}

module.exports = config;