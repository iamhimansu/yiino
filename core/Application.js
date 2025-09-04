const express = require('express');
const Router = require('./Router');
const Autoloader = require('./AutoLoader');
const WebController = require('./web/Controller');

class Application {
    constructor(configs) {
        this.expressApp = express;
        this.express = this.expressApp();
        this.configs = configs;
        this.router = new Router(this);
        this.autoloader = new Autoloader(this);
    }

    getRouter() {
        return this.router;
    }

    run() {
        const app = this.express;
        const configs = this.configs;
        app.listen(configs.port || 8080, () => {
            console.log(`Server started on port ${configs.port}`);
        });
    }
}

module.exports = Application;