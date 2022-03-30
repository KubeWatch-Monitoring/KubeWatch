import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import { indexRoutes } from "./routes/index-routes";
import { podRoutes } from "./routes/pod-routes";
import { helpers } from "./utils/handlebar-util";

import exphbs from "express-handlebars";
import {
  sessionUserSettings,
  Settings,
  Style,
} from "./utils/session-middleware.index";

import { promRoutes } from "./routes/prom-routes";

declare module "express-session" {
  interface SessionData {
    style: Style;
    display: Settings;
  }
}

declare global {
  namespace Express {
    interface Request {
      settings: Settings;
    }
  }
}

export const app = express();
const hbs = exphbs.create({
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
app.use(
  session({
    secret: "casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(sessionUserSettings);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", indexRoutes);
app.use("/pods", podRoutes);
// app.use("/prom-metrics", promRoutes);
app.use("/prom-metrics", indexRoutes);

const cors = require("cors");
app.use(cors());
