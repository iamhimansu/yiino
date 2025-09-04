const path = require("path");
const ModuleExtender = require('./ModuleExtender');
const BaseModule = require('./BaseModule')

class Router {
    /**
     * @param application Application
     */
    constructor(application) {
        this.application = application;
        this.routes = {
            referer: null, redirect: null, url: null,
        };
        this.router = application.expressApp.Router();
    }

    handle() {
        const router = this.router;

        // log all requests
        router.use(async (req, res, next) => {
            this.routes.referer = req.url;

            console.log(this.routes);

            const {module, controller, action} = this.#parseRoute(req.url);

            if (!module || !controller) {
                res.writeHead(404, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Route not found"}));
            }

            let moduleClass = null;
            try {
                moduleClass = this.application.configs.modules[module];
                if (!moduleClass) {
                    throw Error(`${module} not found`);
                }
            } catch (e) {
                res.writeHead(404, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: e}));
            }

            const path = require("path");
            const ROOT = path.resolve(__dirname, "..");

            const modulePath = path.join(ROOT, moduleClass.class);

            let ModuleClass = require(modulePath);

            const Module = new ModuleExtender(ModuleClass, BaseModule, this.application).init();

            /**
             * Get controllers directory
             */
            const controllersDirectory = path.join(Module.basePath, 'controllers');

            /**
             * Get controller
             */

            const controllerPath = path.join(controllersDirectory, this.#capitalize(controller) + 'Controller.js');

            const ControllerClass = require(controllerPath);

            const controllerInstance = new ControllerClass(this.application, req, res);

            const actionMethod = 'action' + this.#capitalize(action);
            await controllerInstance[actionMethod]();

            next();
        });

        //mount router into app
        this.application.express.use(router);
    }

    //private method
    #parseRoute(pathname) {

        let module = null;
        let controller = 'dashboard';
        let action = "index";

        const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

        if (parts.length === 1) {
            module = parts[0];
        } else if (parts.length === 2) {
            module = parts[0];
            controller = parts[1];
        } else if (parts.length >= 3) {
            module = parts[0];
            controller = parts[1];
            action = parts[2];
        }
        return {module, controller, action};

    }

    #capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

module.exports = Router;