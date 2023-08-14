const config = require('./config');


const abiFile =  require('./abiFile');
for(let i = 0; i < config.length; i++ ){
    let ret = abiFile.extractAbiFromTruffleBuild(config[i].source, config[i].targe);
    if(ret){
        console.log('finished: ', config[i].targe);
    }
}