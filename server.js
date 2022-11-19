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
app.get('/', (req, res) => {
    res.status(200).sendFile("views/index.html", { root: __dirname });
});
app.get('/ChiTiet', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/ChiTiet/ChiTiet.html`);
});
app.get('/ChiTiet2', (req, res) => {
    res.status(200).sendFile(`${__dirname}/views/ChiTiet/ChiTietTemplate.html`);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
