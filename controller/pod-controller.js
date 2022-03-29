"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.podController = exports.PodController = void 0;
const podStore_1 = require("../services/podStore");
class PodController {
    async getIndex(req, res) {
        res.render("listPods", {
            style: req.session.style,
            display: req.session.display,
            pods: await podStore_1.podStore.getAllPods(),
        });
    }
    async getPod(req, res) {
        const id = parseInt(req.params.id);
        const pod = await podStore_1.podStore.getPodById(id);
        res.render("podView", {
            style: req.session.style,
            display: req.session.display,
            pod: pod,
        });
    }
}
exports.PodController = PodController;
exports.podController = new PodController();
//# sourceMappingURL=pod-controller.js.map