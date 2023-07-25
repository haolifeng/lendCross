
const Type1TxParser = artifacts.require('Type1TxParser');
const {
   updateScAddr
} = require('./libs')

const config = require('config');
const configPath = config.isMain ? __dirname + '/../../gconfig/scAddrs_main.json' : __dirname + '/../../gconfig/scAddrs_test.json';
module.exports = async function (deployer) {

   await  deployer.deploy(Type1TxParser);
   const Type1TxParserInst = await Type1TxParser.deployed();
   const scAddr_type1TxParser = Type1TxParserInst.address;

   updateScAddr('Type1TxParser', scAddr_type1TxParser, configPath);

};
