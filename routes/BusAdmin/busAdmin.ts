import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";

const busAdminHandler = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }
};
