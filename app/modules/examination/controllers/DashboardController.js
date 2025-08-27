const WebController = require("../../../../core/web/Controller");

class DashBoardController extends WebController {

    actionIndex(){
        return this.render('index');
    }

    actionCreate(){
        return this.render('create');
    }

}

module.exports = DashBoardController;