const fs = require('fs');
function updateScAddr(scName, scAddr, configPath) {
    

    let data = fs.readFileSync(configPath);
    let config = data.toString();
    

    config = JSON.parse(config);

    console.log('config: ', config)

    config[scName] = scAddr;
    console.log('config: ', config)

    let str = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath,str);
}

module.exports = {
    updateScAddr
}