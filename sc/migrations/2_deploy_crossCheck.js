const CrossCheck = artifacts.require("CrossCheck");

const {
   updateScAddr
} = require('./libs')
module.exports = async function (deployer) {
   await deployer.deploy(CrossCheck);
   
   const CrossCheckInst = await CrossCheck.deployed();

   const scAddr_crossCheck = CrossCheckInst.address;

   updateScAddr('CrossCheck', scAddr_crossCheck);



   

};
