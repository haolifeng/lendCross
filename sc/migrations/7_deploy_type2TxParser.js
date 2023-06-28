
const Type2TxParser = artifacts.require('Type2TxParser');
module.exports = async function (deployer) {

   await deployer.deploy(Type2TxParser);

   const Type2TxParserInst = await Type2TxParser.deployed();
   const scAddr_type2TxParser = Type2TxParserInst.address

   

};
