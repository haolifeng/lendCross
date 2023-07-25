const config = require('../config')

const  {
    CrossCheckObj
} = require('../../../ScObjs');

const { crossCheck_abi } = require('../abi');
const nodeUrl = config.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossCheck;



let crossCheckObj = new CrossCheckObj(scAddr, nodeUrl, crossCheck_abi);

module.exports = crossCheckObj;

