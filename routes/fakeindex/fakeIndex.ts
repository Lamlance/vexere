import express, { Express, Request, Response } from "express";

const fakeIndexHandler = (req:Request,res:Response)=>{
  res.render("index");
}

export default fakeIndexHandler;