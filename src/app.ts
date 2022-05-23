import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";

import * as IndexRoutes from "./routes/index-routes";
import * as PodRoutes from "./routes/pod-routes";
import * as NotificationRoutes from "./routes/notification-routes";
import * as SettingsRoutes from "./routes/settings-routes";
import * as DbAvailabilityRoutes from "./routes/db-availability-routes";
import * as ClusterVisRoutes from "./routes/cluster-vis-routes";
import * as PrometheusRoutes from "./routes/prometheus-routes";

import {helpers} from "./utils/handlebar-util";
import {create} from 'express-handlebars';

import {sessionUserSettings, Settings, Style,} from "./utils/session-middleware.index";
import {NotificationStore} from "./model/notification";
import {SettingStore} from "./model/setting";
import {PodStore} from "./model/pod";
import {ThresholdMonitor} from "./domain/threshold-monitor";
import {NotificationManager} from "./domain/notification-manager";
import {ClusterDataStore} from "./model/cluster-data";
import {ChartSettingStore} from "./model/chart-setting";
import {EnvironmentVariables} from "./services/env-store-impl";

declare module "express-session" {
    interface SessionData {
        style: Style;
        display: Settings;
    }
}

declare global {
    namespace Express {
        interface Application {
            environmentVariables: EnvironmentVariables;
            settingsStore: SettingStore;
            notificationStore: NotificationStore;
            podStore: PodStore;
            chartSettingStore: ChartSettingStore;
            notificationManager: NotificationManager;
            prometheusWatcher: ThresholdMonitor;
            clusterDataStore: ClusterDataStore;
        }
    }
}

export const app = express();
app.disable("x-powered-by");
const hbs = create({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    helpers: {
        ...helpers,
    },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.resolve("views"));

app.use(express.static(path.resolve("public")));

if (process.env.EXPRESS_SESSION_SECRET === undefined)
    throw new Error("Environment variable EXPRESS_SESSION_SECRET is missing");
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(sessionUserSettings);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(IndexRoutes.BASE_URL, IndexRoutes.indexRoutes);
app.use(PodRoutes.BASE_URL, PodRoutes.podRoutes);
app.use(NotificationRoutes.BASE_URL, NotificationRoutes.notificationRoutes);
app.use(SettingsRoutes.BASE_URL, SettingsRoutes.settingsRoutes);
app.use(DbAvailabilityRoutes.BASE_URL, DbAvailabilityRoutes.dbAvailabilityRoutes);
app.use(ClusterVisRoutes.BASE_URL, ClusterVisRoutes.clusterVisRoutes);
app.use(PrometheusRoutes.BASE_URL, PrometheusRoutes.prometheusRoutes);
