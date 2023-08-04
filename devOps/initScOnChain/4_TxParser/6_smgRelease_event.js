const config = require('../config');
const wanUrl = config.appConfig.wanChain.nodeUrl;

const Web3 = require('web3');

const crossCheckScAddr = config.scAddrs.CrossCheck;
const crossLendMintScAddr = config.scAddrs.CrossLendMint;
const crossLendRepayScAddr = config.scAddrs.CrossLendRepay;

let web3 = new Web3(new Web3.providers.HttpProvider(wanUrl));
let mint_usdt_block = 27195694;
let mint_wan_block = 27197496;
let block = mint_wan_block
//let txHash = '0x851cb8c01038ef64225387ed2ce5cf2cf1ce60ddb587785934692fc0c558ee72';

const web3EthAbi = require("web3-eth-abi");
const {BigNumber} = require("ethers");

const abiJson = {
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "name": "uniqueID",
            "type": "bytes32"
        },
        {
            "indexed": true,
            "name": "smgID",
            "type": "bytes32"
        },
        {
            "indexed": true,
            "name": "tokenPairID",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "keys",
            "type": "string[]"
        },
        {
            "indexed": false,
            "name": "values",
            "type": "bytes[]"
        }
    ],
    "name": "SmgRelease",
    "type": "event"
}
const f = async ()=> {
    let ret = await web3.eth.getPastLogs({
        fromBlock: block, toBlock: block + 1, topics: []
    })
    //console.log('ret: ', ret);
    for (let i = 0; i < ret.length; i++){
        try {
         let event = ret[i];

            let args = web3EthAbi.decodeLog(abiJson.inputs, event.data, event.topics);
        //console.log('args: ', args)
            for (var index = 0; index < abiJson.inputs.length; index++) {
                if (args.hasOwnProperty(index)) {
                    delete args[index];
                }
            }
            event.event = event.event || abiJson.name;
            event.args = args;
            delete event.data;
            delete event.topics;
            console.log('event: ', event);
            console.log(BigNumber.from(event.args['values'][0]).toString());
        } catch (e) {
            console.log('i: ', i, 'is wrong', e);
        }
    }

}

f();