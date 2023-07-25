const { ethers } = require('ethers');

const config = require('./config');



let admin = ethers.Wallet.fromMnemonic(config.words);
module.exports = admin;