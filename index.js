const Application = require('./core/Application');
const configs = require('./config/web');

const app = new Application(configs);

app.getRouter().handle();

app.run();