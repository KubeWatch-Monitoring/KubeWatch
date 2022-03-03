"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.IndexController = void 0;
const exampleStore_1 = require("../services/exampleStore");
class IndexController {
    async getIndex(req, res) {
        res.render("index", {
            style: req.session.style,
            examples: await exampleStore_1.exampleStore.getAll(req.session.display),
            display: req.session.display,
        });
    }
}
exports.IndexController = IndexController;
exports.indexController = new IndexController();
//# sourceMappingURL=index-controller.js.map