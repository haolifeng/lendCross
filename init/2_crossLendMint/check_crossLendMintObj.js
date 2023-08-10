const config = require('../config');

const admin = require('../../wallet');

const type0TxParserScAddr = config.scAddrs.Type0TxParser;
const type1TxParserScAddr = config.scAddrs.Type1TxParser;
const type2TxParserScAddr = config.scAddrs.Type2TxParser;
const crossLendMintObj = require('./crossLendMintObj');
const {BaseErc20Obj} = require("../../ScObjs");

const wanUrl = config.appConfig.wanChain.nodeUrl;


const checkTxParse = async ()=>{

    let txParsers = [type0TxParserScAddr, type1TxParserScAddr, type2TxParserScAddr];
    console.log('txParsers: ', txParsers);

    for(let i = 0; i < txParsers.length; i++ ){
        let ret = await crossLendMintObj.txParserMap(txParsers[i]);
        console.log('ret: ', ret)
    }

    let ret = await crossLendMintObj.txParserMap(admin.address)
    console.log('admin.address : ', ret)
}
const checkUnderlyingToken_approve_ctoken_lendMint = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        if(lendConfig[ctokenName]){
            let tokenAddrPair = {
                underlyingToken:params[ctokenName].underlying.toLowerCase(),
                ctokenAddr:lendConfig[ctokenName].toLowerCase()
            }
            tokenAddrPairs.push(tokenAddrPair)
        }


    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    for(let i = 0 ; i < tokenAddrPairs.length; i++ ){
        let underlyTokenScAddr = tokenAddrPairs[i].underlyingToken;
        if(underlyTokenScAddr === '0x0000000000000000000000000000000000000000'){
            continue;
        }
        else{
            let erc20 = new BaseErc20Obj(wanUrl, underlyTokenScAddr);
            let approveNum = await erc20.allowance(crossLendMintObj.scAddr, tokenAddrPairs[i].ctokenAddr)
            let name = await erc20.name();
            console.log('erc20:', name, ' approveNum: ', approveNum.toString());
        }
    }

}

//checkUnderlyingToken_approve_ctoken_lendMint();

module.exports = {
    checkTxParse,checkUnderlyingToken_approve_ctoken_lendMint
}