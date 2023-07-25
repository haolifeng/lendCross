const CrossCheck = artifacts.require("CrossCheck");

const {
   updateScAddr
} = require('./libs')
const config = require('config');
const configPath = config.isMain ? __dirname + '/../../gconfig/scAddrs_main.json' : __dirname + '/../../gconfig/scAddrs_test.json';

module.exports = async function (deployer) {
   await deployer.deploy(CrossCheck);
   
   const CrossCheckInst = await CrossCheck.deployed();

   const scAddr_crossCheck = CrossCheckInst.address;

   updateScAddr('CrossCheck', scAddr_crossCheck, configPath);



   

};
