import express, { Express, Request, Response } from "express";

const indexHandler = (req: Request, res: Response) => {
  res.locals.title = "Trang chủ";
  res.locals.cssPath = "/css/index.css";
  res.render("index");
}

export default indexHandler;