
const CrossLendRepay = artifacts.require('CrossLendRepay');

module.exports = async function (deployer) {

   await  deployer.deploy(CrossLendRepay);

   const CrossLendRepayInst = await CrossLendRepay.deployed();
   const scAddr_crossLendRepay =  CrossLendRepayInst.address;


   

};
