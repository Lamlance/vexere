import { Bus, PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";

interface AdminBusGet {
  busId: string;
  plate: string;
  seatAmount: number;
  type: number;
}

const busAdminHandler = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }

  switch (req.method) {
    case "GET": {
    }
    case "POST": {
    }
    default:
      break;
  }
};

const addBusAdminHandler = (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

const editBusAdminHanlder = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

const deleteBusAdminHanlder = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};

const addBus = async (req: Request, res: Response) => {};

const editBus = async (req: Request, res: Response) => {};

const deleteBus = async (req: Request, res: Response) => {};

export default busAdminHandler;
