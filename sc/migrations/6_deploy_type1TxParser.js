
const Type1TxParser = artifacts.require('Type1TxParser');

module.exports = async function (deployer) {

   await  deployer.deploy(Type1TxParser);
   const Type1TxParserInst = await Type1TxParser.deployed();
   const scAddr_type1TxParser = Type0TxParserInst.address;

   

};
