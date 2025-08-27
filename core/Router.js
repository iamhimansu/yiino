const {route} = require("express/lib/application");
const path = require("path");

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
        router.use((req, res, next) => {
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

            const BaseModule = require('./BaseModule')

            const modulePath = path.join(ROOT, moduleClass.class + ".js");
            let ModuleClass = require(modulePath);
            ModuleClass = class extends ModuleClass {
                constructor(app) {
                    super(app);
                    this.base = new BaseModule(app); // optional composition
                }

                init() {
                    // call parent module init
                    if (super.init) super.init();

                    // also call base core module init
                    if (this.base && this.base.init) this.base.init();
                }
            };

            const m = new ModuleClass(this.application);
            m.init();
            console.log(m.basePath)
            return
                ;
            console.log(module, controller, action);
            next();
        });

        //mount router into app
        this.application.express.use(router);
    }

    //private method
    #parseRoute(pathname) {

        let module = null;
        let controller = null;
        let action = "index";

        const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

        if (parts.length === 1) {
            controller = parts[0];
        } else if (parts.length === 2) {
            controller = parts[0];
            action = parts[1];
        } else if (parts.length >= 3) {
            module = parts[0];
            controller = parts[1];
            action = parts[2];
        }
        return {module, controller, action};

    }
}

module.exports = Router;