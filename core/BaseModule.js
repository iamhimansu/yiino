class BaseModule {

    constructor(app) {
        this.controllerNameSpace = '';
        this.id = '';
        this.version = '';
        this.moduleName = '';
        this.moduleVersion = '';
        this.basePath = __dirname;
        this.app = app;
    }

    init(){

    }
}

module.exports = BaseModule;