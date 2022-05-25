import {Request, Response} from "express";
import {ControllerUtil, controllerUtil} from "../utils/controller-util";

export class ClusterVisController {
    constructor(public controllerUtil: ControllerUtil) {
    }

    async getGraphs(req: Request, res: Response) {
        await this.controllerUtil.render("clusterVisualisation", {}, req, res);
    }

    async sendClusterData(req: Request, res: Response) {
        // await req.app.clusterDataStore.getClusterDataFromPrometheus();
        res.json(await req.app.clusterDataStore.getClusterData());
    }
}


export const clusterVisController = new ClusterVisController(controllerUtil);
