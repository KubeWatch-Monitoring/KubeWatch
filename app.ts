import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import {indexRoutes} from "./routes/index-routes";
import {podRoutes} from "./routes/pod-routes";
import {userRoutes} from "./routes/user-routes";
import {UserStore} from "./services/userStore";
import {helpers} from "./utils/handlebar-util";
import {create} from 'express-handlebars';

import {
    sessionUserSettings,
    Settings,
    Style,
} from "./utils/session-middleware.index";

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", indexRoutes);
app.use("/pods", podRoutes);
app.use("/users", userRoutes);
