import { Request, Response } from "express";
import { PrometheusDriver } from 'prometheus-query';


if (process.env.PROMETHEUS_CONN_STRING === undefined)
  throw new Error("Environment variable PROMETHEUS_CONN_STRING is missing");
const prom = new PrometheusDriver({
  endpoint: process.env.PROMETHEUS_CONN_STRING,
  baseURL: "/api/v1",
});

async function retrieveInstantQuery() {
  const instantQuery = 'prometheus_target_sync_length_seconds_count{scrape_job="kube-state-metrics"}';
  const instantQueryResponse = await prom.instantQuery(instantQuery);
  return instantQueryResponse.result.flat();
}

async function retrieveRangeQuery() {
  const q = 'up';
  const start = new Date().getTime() - 24 * 60 * 60 * 1000;
  const end = new Date();
  const step = 60 // 1 point every 60 seconds
  const rangeQueryResponse = await prom.rangeQuery(q, start, end, step);
  return rangeQueryResponse.result;
}

async function retrieveSeriesQuery() {
  const match = 'up';
  const start = new Date().getTime() - 24 * 60 * 60 * 1000;
  const end = new Date();
  return await prom.series(match, start, end);
}

export class PrometheusController {
  async getMetrics(req: Request, res: Response) {
    console.log("getMetrics start");
    res.render("promView", {
      style: req.session.style,
      display: req.session.display,
      rangeMetrics: await retrieveRangeQuery(),
      instantMetrics: await retrieveInstantQuery(),
      seriesMetrics: await retrieveSeriesQuery(),
    });
    console.log('getMetrics stop')
  }
}

export const promController = new PrometheusController();
