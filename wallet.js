const ethers  = require('ethers');

const config = require('./config');

const words = config.appConfig.words;

let admin = ethers.Wallet.fromMnemonic(words);


console.log('admin.address', admin.address)

module.exports = admin;