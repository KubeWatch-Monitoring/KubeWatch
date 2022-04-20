import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";

import {indexRoutes} from "./routes/index-routes";
import {podRoutes} from "./routes/pod-routes";
import {userRoutes} from "./routes/user-routes";
import {prometheusRoutes} from "./routes/prometheus-routes";
import {notificationRoutes} from "./routes/notification-routes";
import {settingsRoutes} from "./routes/settings-routes";

import {helpers} from "./utils/handlebar-util";
import {create} from 'express-handlebars';

import {sessionUserSettings, Settings, Style,} from "./utils/session-middleware.index";
import {NotificationStore} from "./model/notification";
import {SettingStore} from "./model/setting";
import {UserStore} from "./model/user";
import {PodStore} from "./model/pod";
import {PrometheusWatcher} from "./domain/prometheus-watcher";

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
            prometheusWatcher: PrometheusWatcher;
        }
    }
}

export const app = express();
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

app.use("/", indexRoutes);
app.use("/pods", podRoutes);
app.use("/users", userRoutes);
app.use("/prom-metrics", prometheusRoutes);
app.use("/notifications", notificationRoutes);
app.use("/settings", settingsRoutes);
