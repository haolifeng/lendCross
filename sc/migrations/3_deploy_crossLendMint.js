
const CrossLendMint = artifacts.require('CrossLendMint');

module.exports = async function (deployer) {
   
   await deployer.deploy(CrossLendMint);

   const CrossLendMintInst = await CrossLendMint.deployed();
   const scAddr_crossLendMint = CrossCheckInst.address;

   
   

};
