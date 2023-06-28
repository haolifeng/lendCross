const CrossCheck = artifacts.require("CrossCheck");
const CrossLendMint = artifacts.require('CrossLendMint');
const CrossLendRepay = artifacts.require('CrossLendRepay');
const Type0TxParser = artifacts.require('Type0TxParser');
const Type1TxParser = artifacts.require('Type1TxParser');
const Type2TxParser = artifacts.require('Type2TxParser');
module.exports = async function (deployer) {
   await deployer.deploy(CrossCheck);
   await deployer.deploy(CrossLendMint);
   await  deployer.deploy(CrossLendRepay);
   await deployer.deploy(Type0TxParser);
   await  deployer.deploy(Type1TxParser);
   await deployer.deploy(Type2TxParser);

};
