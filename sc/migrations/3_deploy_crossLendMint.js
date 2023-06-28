
const CrossLendMint = artifacts.require('CrossLendMint');
const {
   updateScAddr
} = require('./libs')

module.exports = async function (deployer) {
   
   await deployer.deploy(CrossLendMint);

   const CrossLendMintInst = await CrossLendMint.deployed();
   const scAddr_crossLendMint = CrossLendMintInst.address;

   updateScAddr('CrossLendMint', scAddr_crossLendMint);
   

};
