const CrossCheck = artifacts.require("CrossCheck");

module.exports = async function (deployer) {
   await deployer.deploy(CrossCheck);
   
   const CrossCheckInst = await CrossCheck.deployed();

   const scAddr_crossCheck = CrossCheckInst.address;



   

};
