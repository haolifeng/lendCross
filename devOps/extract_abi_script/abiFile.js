//get abi json and bytecode from the built file by truffle
const fs = require('fs');
class ABIFile{
    getAbiAndByteCode(fspath){
        try{
            const abifileContent = fs.readFileSync(fspath).toString();
            const abifileContentObj = JSON.parse(abifileContent);
            const abi=abifileContentObj.abi;
            const bytecode = abifileContentObj.bytecode;

            return {
                abi:abi,
                byteCode:bytecode
            }
        }catch (e) {
            console.log('get abi and byte code : e',e);
            return null;
        }


    }
    extractAbiFromTruffleBuild(inFsPath, outAbiFilePath, outBytecodeFilePath){
        try{
            let  abiObj = this.getAbiAndByteCode(inFsPath);
            if(abiObj){
                if(outAbiFilePath){
                    fs.writeFileSync(outAbiFilePath,JSON.stringify(abiObj.abi));
                }
                if(outBytecodeFilePath){
                    fs.writeFileSync(outBytecodeFilePath,JSON.stringify(abiObj.byteCode));
                }

            }
            return true;
        }catch (e) {
            console.log('extract abi from truffle build e',e);
            return false;
        }
    }

}

const abiFile = new ABIFile();
module.exports = abiFile;