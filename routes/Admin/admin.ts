import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";

const adminDashBoard = async (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user) {
    res.redirect("/");
    return;
  }

  await prisma.$connect();
  const userData = (sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email)));

  if(!userData.isAdmin){
    return{
      status:400,
      data:null
    }
  }

  res.render("admin");
}

export default adminDashBoard;