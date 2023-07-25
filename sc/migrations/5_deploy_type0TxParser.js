
const Type0TxParser = artifacts.require('Type0TxParser');
const {
   updateScAddr
} = require('./libs')

module.exports = async function (deployer) {

   await deployer.deploy(Type0TxParser);

   const Type0TxParserInst = await Type0TxParser.deployed();
   const scAddr_type0TxParser = Type0TxParserInst.address;

   updateScAddr('Type0TxParser', scAddr_type0TxParser);

};
