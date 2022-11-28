"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static(__dirname + "/public"));
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
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
