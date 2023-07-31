const ethers  = require('ethers');

const config = require('../config');

const words = config.appConfig.words;

let user2 = ethers.Wallet.fromMnemonic(words,"m/44'/60'/0'/0/1");
console.log('user2.address: ', user2.address)

module.exports = user2;