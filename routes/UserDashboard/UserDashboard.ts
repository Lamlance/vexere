import express, { Express, Request, Response } from "express";

const userDashboardHandler = (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/");
    return;
  }

  res.locals.title = "Thông tin cá nhân";
  res.locals.cssPath = "/css/UserDashboard.css";

  res.render("userDashboard", {
    user: req.oidc.user,
  });
};

export default userDashboardHandler;
