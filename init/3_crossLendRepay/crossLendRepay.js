const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendRepay;

const { crossLendRepay_abi } = require('../abi');

const {
    CrossLendRepayObj,
} = require('../../ScObjs')


let crossLendRepayObj = new CrossLendRepayObj(scAddr,wanUrl,crossLendRepay_abi);

module.exports = crossLendRepayObj;