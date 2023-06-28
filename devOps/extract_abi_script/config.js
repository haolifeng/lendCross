
let config =
    [
        {name:"CrossCheck",source:__dirname + "/../../sc/build/contracts/CrossCheck.json", targe:__dirname + '/abi/CrossCheck_abi.json'},
        {
            name:"CrossLendMint", source:__dirname +  "/../../sc/build/contracts/CrossLendMint.json", targe:__dirname + '/abi/CrossLendMint_abi.json'
        },
        {
            name:"CrossLendRepay", source:__dirname +  "/../../sc/build/contracts/CrossLendRepay.json", targe:__dirname + '/abi/CrossLendRepay_abi.json'
        },
        {
            name:"Type0TxParser", source:__dirname +  "/../../sc/build/contracts/Type0TxParser.json", targe:__dirname + '/abi/Type0TxParser_abi.json'
        },
        {
            name:"Type1TxParser", source:__dirname +  "/../../sc/build/contracts/Type1TxParser.json", targe:__dirname + '/abi/Type1TxParser_abi.json'
        },
        {
            name:"Type2TxParser", source:__dirname +  "/../../sc/build/contracts/Type2TxParser.json", targe:__dirname + '/abi/Type2TxParser_abi.json'
        },
    ]


module.exports = config;