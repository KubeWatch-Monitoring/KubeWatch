import { Request, Response } from 'express';

export class ClusterDataController {
    async sendClusterData(req: Request, res: Response) {
        res.json(await req.app.clusterData.getClusterData());
    }
}

export const clusterDataController = new ClusterDataController();