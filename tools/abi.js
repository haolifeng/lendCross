const CrossCheckJson = require('../sc/build/contracts/CrossCheck');

const CrossLendMintJson = require('../sc/build/contracts/CrossLendMint');

const CrossLendRepayJson = require('../sc/build/contracts/CrossLendRepay');

const Type0TxParserJson = require('../sc/build/contracts/Type0TxParser');
const Type1TxParserJson = require('../sc/build/contracts/Type1TxParser');
const Type2TxParserJson = require('../sc/build/contracts/Type2TxParser');

module.exports = {
    crossCheck_abi: CrossCheckJson.abi,
    crossLendMint_abi: CrossLendMintJson.abi,
    crossLendRepay_abi: CrossLendRepayJson.abi,
    Type0TxParser_abi : Type0TxParserJson.abi,
    Type1TxParser_abi: Type1TxParserJson.abi,
    Type2TxParser_abi: Type2TxParserJson.abi,
}