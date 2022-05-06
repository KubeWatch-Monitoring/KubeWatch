import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";

import * as IndexRoutes from "./routes/index-routes";
import * as PodRoutes from "./routes/pod-routes";
import * as UserRoutes from "./routes/user-routes";
import * as PrometheusRoutes from "./routes/prometheus-routes";
import * as NotificationRoutes from "./routes/notification-routes";
import * as SettingsRoutes from "./routes/settings-routes";
import * as AdminRoutes from "./routes/admin-routes";
import * as ClusterVisRoutes from "./routes/cluster-vis-routes";

import {helpers} from "./utils/handlebar-util";
import {create} from 'express-handlebars';
import {sessionUserSettings, Settings, Style,} from "./utils/session-middleware.index";
import {NotificationStore} from "./model/notification";
import {SettingStore} from "./model/setting";
import {UserStore} from "./model/user";
import {PodStore} from "./model/pod";
import {ThresholdMonitor} from "./domain/threshold-monitor";
import {NotificationManager} from "./domain/notification-manager";
import {ClusterDataStore} from "./model/cluster-data";
import {NotificationStoreImpl} from "./services/notification-store-impl";
import {UserStoreImpl} from "./services/user-store-impl";
import {MongoDbService} from "./services/mongo-db-service";
import {SettingStoreImpl} from "./services/setting-store-impl";
import {PrometheusService} from "./services/prometheus-service";
import {PodStoreImpl} from "./services/pod-store-impl";
import {ClusterDataImpl} from "./services/cluster-data-impl";

declare module "express-session" {
    interface SessionData {
        style: Style;
        display: Settings;
    }
}

declare global {
    namespace Express {
        interface Application {
            userStore: UserStore;
            settingsStore: SettingStore;
            notificationStore: NotificationStore;
            podStore: PodStore;
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
app.use(UserRoutes.BASE_URL, UserRoutes.userRoutes);
app.use(PrometheusRoutes.BASE_URL, PrometheusRoutes.prometheusRoutes);
app.use(NotificationRoutes.BASE_URL, NotificationRoutes.notificationRoutes);
app.use(SettingsRoutes.BASE_URL, SettingsRoutes.settingsRoutes);
app.use(AdminRoutes.BASE_URL, AdminRoutes.adminRoutes);
app.use(ClusterVisRoutes.BASE_URL, ClusterVisRoutes.clusterVisRoutes);

export async function setupDatabaseServices() {
    if (process.env.DB_CONN_STRING === undefined)
        throw new Error("Environment variable DB_CONN_STRING is missing");
    const mongoDbService = await MongoDbService.connect(process.env.DB_CONN_STRING);
    const notificationStore = new NotificationStoreImpl(mongoDbService);

    app.userStore = new UserStoreImpl(mongoDbService);
    app.notificationStore = notificationStore;
    app.settingsStore = new SettingStoreImpl(mongoDbService);
    app.notificationManager = new NotificationManager();
    app.notificationManager.addNotificationHandler(notificationStore);
}

export async function setupPrometheusServices() {
    if (process.env.PROMETHEUS_CONN_STRING === undefined)
        throw new Error("Environment variable PROMETHEUS_CONN_STRING is missing");

    const prometheusService = PrometheusService.connect(process.env.PROMETHEUS_CONN_STRING);
    app.podStore = new PodStoreImpl(prometheusService);
    app.clusterDataStore = new ClusterDataImpl(prometheusService);
}
