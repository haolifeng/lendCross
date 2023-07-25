const { ethers } = require('ethers');

const config = require('./config');



let admin = ethers.Wallet.fromMnemonic(config.appConfig.words);
module.exports = admin;