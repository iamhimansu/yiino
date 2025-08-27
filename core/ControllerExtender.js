class ControllerClass {
    constructor(application, req, res) {
        this.application = application;
        this.req = req;
        this.res = res;
    }

    render(content, params = {}) {
        this.res.status(200).send(content);
    }
}