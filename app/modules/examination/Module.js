class Module {

    constructor(app) {
        this.basePath = __dirname;
    }
    init() {
        console.log('Welcome to examination module')
    }
}

module.exports = Module;