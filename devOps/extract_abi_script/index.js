const config = require('./config');


const abiFile =  require('./abiFile');
for(let i = 0; i < config.length; i++ ){
    abiFile.extractAbiFromTruffleBuild(config[i].source, config[i].targe);
}