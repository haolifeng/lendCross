
const Type2TxParser = artifacts.require('Type2TxParser');
const {
   updateScAddr
} = require('./libs')
module.exports = async function (deployer) {

   await deployer.deploy(Type2TxParser);

   const Type2TxParserInst = await Type2TxParser.deployed();
   const scAddr_type2TxParser = Type2TxParserInst.address

   updateScAddr('Type2TxParser', scAddr_type2TxParser);

};
