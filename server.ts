import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ExpressHandlebars } from "express-handlebars";

import indexHandler from "./routes/Index/index";
import bookingDetailHandler from "./routes/BookingDetail/bookingDetail";

import * as url from "url";
import { PrismaClient } from "@prisma/client";
import { auth, requiresAuth } from "express-openid-connect";
import UserSessionManager from "./routes/helper/userSession/userSession";

import locationGenerate from "./routes/test/createMockData/mockLocation";
import routeGenerate from "./routes/test/createMockData/mockRoute";
import busHouseGenerate from "./routes/test/createMockData/mockBusHouse";
import usersGenerate from "./routes/test/createMockData/mockUser";
import busGenerate from "./routes/test/createMockData/mockBus";
import routeDetailGenerate from "./routes/test/createMockData/mockRouteDetail";

import checkUser from "./routes/db/checkUser";
import searchRouteAPI from "./routes/db/searchRoute";
import searchRouteHandler from "./routes/Search/search";
import userDashboardHandler from "./routes/UserDashboard/UserDashboard";
import createTicket from "./routes/Ticket/ticket";
import bodyParser from "body-parser";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const sessionManager = new UserSessionManager();
export { sessionManager };

dotenv.config();
const app: Express = express();

const handlebars = new ExpressHandlebars({
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials`,
  defaultLayout: "layout",
  extname: "hbs",
});

const port = process.env.PORT || 8000;
const configAuth = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRETE,
  baseURL: `http://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: "https://dev-j07rhfbc.us.auth0.com",
};
if (!process.env.BASE_URL && process.env.NODE_ENV !== "production") {
  configAuth.baseURL = `http://localhost:${port}`;
}
if (process.env.RENDER_EXTERNAL_URL) {
  configAuth.baseURL = process.env.RENDER_EXTERNAL_URL;
}

app.use(auth(configAuth));
app.use(bodyParser.urlencoded({ extended: false }))

const bodyPraseObj = bodyParser.json();

app.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  res.locals.userName = req.oidc.user ? req.oidc.user.name : null;
  next();
}, checkUser);

const prisma = new PrismaClient();
prisma.$connect();
export { prisma };

app.use(express.static(__dirname + "/public"));

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

app.get("/", indexHandler);
app.get("/booking_detail", bookingDetailHandler);
app.get("/search", searchRouteHandler);
app.get("/userDashboard", userDashboardHandler);

app.get("/user/ticket",bookingDetailHandler);
app.post("/api/ticket",bodyPraseObj,createTicket);
app.get("/search",searchRouteHandler);

app.get("/api/test/generate/locations", locationGenerate);
app.get("/api/test/generate/routes", routeGenerate);
app.get("/api/test/generate/bushouses", busHouseGenerate);
app.get("/api/test/generate/users", usersGenerate);
app.get("/api/test/generate/buses", busGenerate);
app.get("/api/test/generate/details", routeDetailGenerate);
app.get("/api/test/search", searchRouteAPI);

app.get("/api/test/profile", (req, res) => {
  res.json({
    status: req.oidc.isAuthenticated() ? "Logged in" : "Logged out",
    data: req.oidc.user,
    userDB: null,
  });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
