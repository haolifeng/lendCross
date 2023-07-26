const { ethers } = require('ethers');
const CrossLendBaseObj = require('./CrossLendBaseObj')
class CrossLendRepayObj extends CrossLendBaseObj{
    constructor(scAddr, nodeUrl, abi){
        super(scAddr, nodeUrl, abi)
    }
}

module.exports = CrossLendRepayObj;