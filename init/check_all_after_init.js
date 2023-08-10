const check_crossCheck = require('./1_crossCheck/check_crossCheck');
const check_crossLendMintObj = require('./2_crossLendMint/check_crossLendMintObj');
const check_crossLendRepay = require('./3_crossLendRepay/check_crossLendRepay');
const check_txParser_depends = require('./4_TxParser/check_txParser_depends');

const run = async ()=>{
    await check_crossCheck.checkTokenAddrPairs();
    await check_crossCheck.checkTokenManagerAddr();
    await check_crossCheck.checkWanChainID();

    await check_crossLendMintObj.checkTxParse();
    await check_crossLendMintObj.checkUnderlyingToken_approve_ctoken_lendMint();

    await check_crossLendRepay.checkTxParse();
    await check_crossLendRepay.checkUnderlyingToken_approve_ctoken_lendRepay();

    await check_txParser_depends.checkTx0TxParser();
    await check_txParser_depends.checkTx1TxParser();
    await check_txParser_depends.checkTx2TxParser();

}

run();