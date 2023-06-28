const { ethers } = require('ethers');

const appConfig = require('./gconfig/appConfig.json');

let admin = ethers.Wallet.fromMnemonic(appConfig.words);
module.exports = admin;