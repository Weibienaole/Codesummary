const path = require('path')
class Compiler{
    constructor(config){
        this.config = config
        this.entry = config.entry
        this.entryId = ''
        this.modules = {}
        this.root = process.cwd()
    }
    //  模块打包
    buildModule(modulePath, isMain){
        console.log(modulePath, isMain);
    }
    // 发射文件
    emitFile(){

    }
    run(){
        this.buildModule(path.resolve(this.root, this.entry), true)
        this.emitFile()
    }
}

module.exports = Compiler