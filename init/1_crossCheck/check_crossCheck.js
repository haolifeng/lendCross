const config = require('../config');



const crossCheckObj = require('./crossCheckObj');

const checkTokenManagerAddr = async ()=>{
    let tokenManagerScAddr = config.appConfig.tokenManagerAddr;

    let ret = await crossCheckObj.getTokenManger();
    console.log('ret: ', ret);
    console.log('tokenMangerScAddr: ', tokenManagerScAddr);
    if(ret.toLowerCase() === tokenManagerScAddr.toLowerCase()){
        console.log('tokenManagerScAddr is samei')
    }

};

const checkWanChainID = async ()=>{
    let ret = await crossCheckObj.getwanChainID();
    console.log('ret: ', ret); //2153201998
};

const checkTokenAddrPairs = async ()=>{
    let lendConfig = config.lendConfig;
    let params = lendConfig.params;
    let tokenAddrPairs = [];
    for(let ctokenName in params){
        console.log('ctokenName: ', ctokenName, 'underlying ', params[ctokenName].underlying, 'ctokenAddr: ', lendConfig[ctokenName])
        if(lendConfig[ctokenName]) {
            let tokenAddrPair = {
                underlyingToken: params[ctokenName].underlying.toLowerCase(),
                ctokenAddr: lendConfig[ctokenName].toLowerCase(),
            }
            tokenAddrPairs.push(tokenAddrPair)
        }

    }
    console.log('tokenAddrParis: ', tokenAddrPairs)

    for(let i = 0 ; i< tokenAddrPairs.length;i++){
        let ret = await crossCheckObj.checkTokenAddrPair( tokenAddrPairs[i].underlyingToken);

        if(ret.toLowerCase() === tokenAddrPairs[i].ctokenAddr.toLowerCase()){
            console.log('the address is right')
        }else{
            console.log('ret: ', ret.toLowerCase(), '!= ctokenAddr', tokenAddrPairs[i].ctokenAddr.toLowerCase())
        }
    }
}

// 校验三个 TxParser 合约是否已被授权标记 uniqueID
const checkParsers = async ()=>{
    const parserAddrs = [
        config.scAddrs.Type0TxParser,
        config.scAddrs.Type1TxParser,
        config.scAddrs.Type2TxParser,
    ];

    for(let i = 0; i < parserAddrs.length; i++){
        let parserAddr = parserAddrs[i];
        let ret = await crossCheckObj.checkParser(parserAddr);
        console.log('parser: ', parserAddr, ' authorized: ', ret);
        if(!ret){
            console.log('WARN: parser 未授权，handlerTxWanLend 将无法标记 uniqueID 已处理');
        }
    }
}

module.exports = {
    checkTokenManagerAddr, checkWanChainID, checkTokenAddrPairs, checkParsers
}