const wanUrl = config.appConfig.wanChain.nodeUrl;
const scAddr = config.scAddrs.CrossLendMint;

const { crossLendMint_abi } = require('../abi');

const {
    CrossLendMintObj
} = require('../../ScObjs')
const config = require("../../devOps/initScOnChain/config");
let crossLendMinObj = new CrossLendMintObj(scAddr,wanUrl,crossLendMint_abi);

module.exports = crossLendMinObj;