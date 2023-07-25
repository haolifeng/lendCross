
const CrossLendRepay = artifacts.require('CrossLendRepay');

const {
   updateScAddr
} = require('./libs')
const config = require('config');
const configPath = config.isMain ? __dirname + '/../../gconfig/scAddrs_main.json' : __dirname + '/../../gconfig/scAddrs_test.json';
module.exports = async function (deployer) {

   await  deployer.deploy(CrossLendRepay);

   const CrossLendRepayInst = await CrossLendRepay.deployed();
   const scAddr_crossLendRepay =  CrossLendRepayInst.address;

   updateScAddr('CrossLendRepay', scAddr_crossLendRepay);
   

};
