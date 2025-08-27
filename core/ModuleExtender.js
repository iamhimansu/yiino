class ModuleExtender {
    constructor(ModuleClass, BaseModuleClass, application) {
        this.ModuleClass = ModuleClass;
        this.BaseModuleClass = BaseModuleClass;
        this.application = application;
    }

    init() {
        const ModuleClass = this.ModuleClass;
        const BaseModuleClass = this.BaseModuleClass;

        // Dynamically extend the module with the base module
        const ExtendedModule = class extends BaseModuleClass {
            constructor(app) {
                super(app);
                this.module = new ModuleClass(app);
                Object.assign(this, this.module);
            }

            init() {
                // Call BaseModule init
                if (typeof super.init === 'function') {
                    super.init();
                }

                // Call original Module's init
                if (this.module && typeof this.module.init === 'function') {
                    this.module.init();
                }
            }
        };

        const instance = new ExtendedModule(this.application);
        instance.init();

        return instance;
    }
}

module.exports = ModuleExtender;
