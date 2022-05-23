import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import {Pod} from "../model/pod";

export class PodController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getIndex(req: Request, res: Response) {
        let pods: Pod[] = [];

        try {
            pods = await req.app.podStore.getAllPods();
        } catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }

        await this.controllerUtil.render("listPods", {
            pods
        }, req, res);
    }

    async getPod(req: Request, res: Response) {
        const reqId = req.params.id;
        if (reqId == undefined) {
            res.status(400).end();
            return;
        }

        let pod;
        try {
            const id = String(reqId);
            pod = await req.app.podStore.getPodById(id);
        } catch (e) {
            res.status(500).end();
            return;
        }

        if (pod == null) {
            res.status(404).end();
            return;
        }

        await controllerUtil.render("podView", {pod: pod}, req, res);
    }
}

export const podController = new PodController(controllerUtil);
