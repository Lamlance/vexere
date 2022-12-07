import express from "express";
import dotenv from "dotenv";
import { ExpressHandlebars } from "express-handlebars";
import fakeIndexHandler from "./routes/fakeindex/fakeIndex";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config();
const app = express();
const handlebars = new ExpressHandlebars({
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    defaultLayout: "layout",
    extname: "hbs",
});
const port = process.env.PORT || 8000;
app.use(express.static(__dirname + "/public"));
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.get("/", fakeIndexHandler);
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
