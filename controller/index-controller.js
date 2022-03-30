"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.IndexController = void 0;
const podStore_1 = require("../services/podStore");
class IndexController {
    async getIndex(req, res) {
        res.render("index", {
            style: req.session.style,
            examples: undefined,
            display: req.session.display,
            pods: await podStore_1.podStore.getAllPods(),
        });
    }
}
exports.IndexController = IndexController;
exports.indexController = new IndexController();
//# sourceMappingURL=index-controller.js.map