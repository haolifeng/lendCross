let config = {

    wanChain: {
        nodeUrl:"https://nodes-testnet.wandevs.org/wan",
        chainID:999
    },
    words: "deer funny trip dress siren crane build stomach thunder setup yellow audit",
    tokenManagerAddr: '0x017aB6485fF91C1A0a16B90E71f92B935B7213d3',
    tokenManagerAbi: require('./abi/abi.TokenManagerDelegate.json'),
    eth:{
        nodeUrl:"https://nodes.wandevs.org/eth",
        chainID:1
    }
};

module.exports = config;