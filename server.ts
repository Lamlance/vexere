import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";


dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get('/', (req: Request, res: Response) => {
    res.status(200).sendFile("views/index.html",{root: __dirname });
}); 

app.get('/Lam/ChiTiet', (req: Request, res: Response) => {
    res.status(200).sendFile(`${ __dirname}/views/ChiTiet/ChiTiet.html`);
});

app.get('/An/Main', (req: Request, res: Response) => {
    res.status(200).sendFile(`${ __dirname}/views/Main/main.html`);
});


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

