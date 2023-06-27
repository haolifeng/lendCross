let config = {
    wanChain:{
        nodeUrl:"https://nodes-testnet.wandevs.org/wan",
        chainID:999
    },
    eth:{
        nodeUrl:"https://nodes.wandevs.org/eth",
        chainID:1,
    },
    scAddr:{
        EthLegacyTx:"0xa32D1d5463B0D615c953c8d45FFcF0B903493e5B",
        EthFeeMarketEIP1559Tx:"0x1F5ed490be9cDF2c2d46D3a1638e9eead6Db2Cd2",
        EthAccessListEIP2930Tx:"0x56fAFf93bC639847E1eA14B245f0F383e18d1eC3"

    }
}

module.exports = config;