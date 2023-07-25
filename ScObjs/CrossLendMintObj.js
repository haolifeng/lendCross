const { ethers } = require('ethers');
const CrossLendBaseObj = require('./CrossLendBaseObjObj')
class CrossLendMintObj extends  CrossLendBaseObj{
    constructor(scAddr, nodeUrl, abi){
        super(scAddr, nodeUrl, abi)
    }


}
module.exports = CrossLendMintObj;