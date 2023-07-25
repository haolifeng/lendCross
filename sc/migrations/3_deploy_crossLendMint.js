
const CrossLendMint = artifacts.require('CrossLendMint');
const {
   updateScAddr
} = require('./libs')
const config = require('config');
const configPath = config.isMain ? __dirname + '/../../gconfig/scAddrs_main.json' : __dirname + '/../../gconfig/scAddrs_test.json';
module.exports = async function (deployer) {
   
   await deployer.deploy(CrossLendMint);

   const CrossLendMintInst = await CrossLendMint.deployed();
   const scAddr_crossLendMint = CrossLendMintInst.address;

   updateScAddr('CrossLendMint', scAddr_crossLendMint, configPath);
   

};
