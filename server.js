import express from "express";
import dotenv from "dotenv";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.get('/', (req, res) => {
    res.status(200).sendFile("views/index.html", { root: __dirname });
});
app.get('/ChiTiet', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/ChiTiet/ChiTiet.html`);
});
app.get('/ChiTiet2', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/ChiTiet/ChiTietTemplate.html`);
});
app.get('/main', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/Main/main.html`);
});
app.get('/An/Main', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/Main/main.html`);
});
app.get('/An/BookingHistoryDetail', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/BookingHistory/DetailBooking.html`);
});
app.get("/", (req, res) => {
    res.status(200).sendFile("views/index.html", { root: __dirname });
});
app.get("/Lam/ChiTiet", (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/ChiTiet/ChiTiet.html`);
});
app.get("/Filter", (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/Filter/Filter.html`);
});
app.get("/UserDashboard", (req, res) => {
    res
        .status(200)
        .sendFile(`${__dirname}/views/UserDashboard/UserDashboard.html`);
});
app.use("/Search", (req, res) => {
    res.status(200).sendFile("Search.html", {
        root: `${__dirname}/views/`
    });
});
app.use("/BusHouse", (req, res) => {
    res.status(200).sendFile("BusHouse.html", {
        root: `${__dirname}/views/`
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
