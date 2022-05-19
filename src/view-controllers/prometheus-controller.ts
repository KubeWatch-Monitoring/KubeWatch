import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";

export class PrometheusController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async prometheusEndpoint(req: Request, res: Response) {
        const query = this.queryToString(req.query);
        const queryType = req.params.queryType;
        if (queryType === undefined) {
            res.status(400);
            res.end("");
            return;
        }
        if (query.length === 0) {
            res.status(400);
            res.end("");
            return;
        }
        const response = await fetch(`${req.app.environmentVariables.prometheusConnectionString}/api/v1/${queryType}?${query}`);
        res.end(await response.text());
    }

    private queryToString(query: any): string {
        const queryString = Object.entries(query).reduce((previous, current) => {
            if (current[1] === undefined) return previous;
            return `${previous}${current[0]}=${current[1]}&`;
        }, "");
        return queryString.substring(0, queryString.length-1);
    }
}

export const prometheusController = new PrometheusController(controllerUtil);
