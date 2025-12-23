let config = {

    wanChain: {
        nodeUrl:"https://nodes-testnet.wandevs.org/wan",
        chainID:999
    },
    words: "",
    tokenManagerAddr: '0x017aB6485fF91C1A0a16B90E71f92B935B7213d3',
    tokenManagerAbi: require('./abi/abi.TokenManagerDelegate.json'),
    eth:{
        nodeUrl:"https://nodes-testnet.wandevs.org/eth",
        chainID:5
    }
};

module.exports = config;
