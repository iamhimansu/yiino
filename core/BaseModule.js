class BaseModule {

    constructor(app) {
        this.controllerNameSpace = '';
        this.id = '';
        this.version = '';
        this.moduleName = '';
        this.moduleVersion = '';
        this.basePath = __dirname;
        this.app = app;
        this.base = null;
    }

    init() {
        console.log('In base module');
    }

    getBasePath() {
        return this.basePath;
    }
}

module.exports = BaseModule;