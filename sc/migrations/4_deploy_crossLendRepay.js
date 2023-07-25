
const CrossLendRepay = artifacts.require('CrossLendRepay');

const {
   updateScAddr
} = require('./libs')
module.exports = async function (deployer) {

   await  deployer.deploy(CrossLendRepay);

   const CrossLendRepayInst = await CrossLendRepay.deployed();
   const scAddr_crossLendRepay =  CrossLendRepayInst.address;

   updateScAddr('CrossLendRepay', scAddr_crossLendRepay);
   

};
