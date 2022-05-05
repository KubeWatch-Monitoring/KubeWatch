import {Request, Response} from "express";

export class ClusterVisController {
    async getGraphs(req: Request, res: Response) {
        res.render("clusterVisualisation", {
            style: req.session.style,
            display: req.session.display,
        });
    }
}


export const clusterVisController = new ClusterVisController();