import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ExpressHandlebars } from "express-handlebars";
import fakeIndexHandler from "./routes/fakeindex/fakeIndex";
import locationGenerate from "./routes/test/Location";
import routeGenerate from "./routes/test/Route";
import createUser from "./routes/db/createUser";
import * as url from 'url';
import { PrismaClient } from "@prisma/client";
import { auth,requiresAuth } from 'express-openid-connect';


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


dotenv.config();
const app: Express = express();
const handlebars = new ExpressHandlebars({
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials`,
  defaultLayout: "layout",
  extname: "hbs",
});
const port = process.env.PORT || 8000;
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRETE,
  baseURL: `http://localhost:${port}`,
  clientID: 'lC9I51KD1kbdhWIetiIT93nqURAXDNe4',
  issuerBaseURL: 'https://dev-j07rhfbc.us.auth0.com'
};
if (!process.env.BASE_URL && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}
if (process.env.RENDER_EXTERNAL_URL) {
  config.baseURL = process.env.RENDER_EXTERNAL_URL;
}
app.use(auth(config));
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
   
  next();
},createUser);

const prisma = new PrismaClient();
prisma.$connect();
export { prisma }

app.use(express.static(__dirname + "/public"));
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

app.get("/", fakeIndexHandler);
app.get("/api/test/generate/locations", locationGenerate);
app.get("/api/test/generate/routes", routeGenerate);
app.get("/api/test/profile", (req, res) => {
  res.json({ 
    status: req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out',
    data:req.oidc.user,
    userDB: null
  });
})
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});