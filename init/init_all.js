
const crossCheck = require('./1_crossCheck')
const crossLendMint = require('./2_crossLendMint');

const crossLendRepay = require('./3_crossLendRepay');

const {
    type0setDependsContractAddr
} = require('./4_TxParser/0_type0Tx_setDependContractAddr');
const {type1setDependsContractAddr } = require('./4_TxParser/1_type1Tx_setDependContractAddr');
const {type2setDependsContractAddr } = require('./4_TxParser/2_type2Tx_setDependContractAddr');

const run = async ()=>{
    try {
        console.log('1 --- crossCheck.setTokenManager -------------------------------------------');
        let r = await crossCheck.setTokenManager();

        if(r){
            console.log('1 --- crossCheck.setTokenManager -------------------------------------------success ');
        }

        console.log('2 --- crossCheck.setTokenAddrPairs -------------------------------------------');
        await crossCheck.setTokenAddrPairs();

        console.log('3 --- crossLendMint.setTxMulParse -------------------------------------------');
        await crossLendMint.setTxMulParse();
        console.log('4 --- crossLendMint.underlyingApproveCtokenUseLendMint -------------------------------------------');
        await crossLendMint.underlyingApproveCtokenUseLendMint();

        console.log('5 --- crossLendRepay.setTxMulParse -------------------------------------------');
        await crossLendRepay.setTxMulParse();

        console.log('6 --- crossLendRepay.underlyingApproveCtokenUseLendRepay -------------------------------------------');
        await crossLendRepay.underlyingApproveCtokenUseLendRepay();
        console.log('7 --- type0setDependsContractAddr -------------------------------------------');
        await type0setDependsContractAddr();
        console.log('8 --- type1setDependsContractAddr -------------------------------------------');
        await type1setDependsContractAddr();
        console.log('9 --- type2setDependsContractAddr -------------------------------------------');
        await type2setDependsContractAddr();
    }catch (e){
        console.log('e: ', e)
    }
}

run();