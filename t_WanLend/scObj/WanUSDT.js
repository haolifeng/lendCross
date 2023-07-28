const BaseErc20Obj = require('../../ScObjs/BaseErc20Obj')

const config = require('../../config')
const wanUrl = config.appConfig.wanChain.nodeUrl;

const scAddr = config.lendConfig.params.wwanUSDT.underlying;
class WanUSDT extends BaseErc20Obj{
    constructor() {
        super(wanUrl, scAddr.toLowerCase());
    }
}
let wanUSDT = new WanUSDT();
module.exports = wanUSDT