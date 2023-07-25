let config = {
        wanChain: {
            nodeUrl: "https://nodes.wandevs.org/wan",
            chainId: 888
        },

        words: "deer funny trip dress siren crane build stomach thunder setup yellow audit",
        tokenManagerAddr: '0x9Fdf94Dff979dbECc2C1a16904bDFb41D305053A',
        tokenManagerAbi: require('./abi/abi.TokenManagerDelegate.json'),
        eth:{
            nodeUrl:"https://nodes.wandevs.org/eth",
            chainID:1
        }
};
module.exports = config;