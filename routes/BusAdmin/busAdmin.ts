import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";

const busAdminHandler = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }

  // const data = await prisma.bus.findMany

  // res.locals.title = "Thông tin xe";
  // let busList: Array<Object> = [];
};

export const addBusAdminHandler = (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

export const editBusAdminHanlder = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

export const deleteBusAdminHanlder = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

export const addBus = async (req: Request, res: Response) => {};

export const editBus = async (req: Request, res: Response) => {};

export const deleteBus = async (req: Request, res: Response) => {};

export default busAdminHandler;
