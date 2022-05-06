import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";

export class IndexController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getIndex(req: Request, res: Response) {
        await this.controllerUtil.render("index", {}, req, res);
    }
}

export const indexController = new IndexController(controllerUtil);
