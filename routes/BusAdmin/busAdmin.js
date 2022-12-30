"use strict";
// import { Bus, PrismaClient } from "@prisma/client";
// import express, { Express, Request, Response } from "express";
// import { prisma, sessionManager } from "../../server";
// import { singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";
// interface AdminBusAPI_PUT {
//   data: string | Bus;
// }
// interface AdminBusAPI_DELETE {
//   data: string | Bus;
// }
// interface AdminBusAPI_POST {
//   data: string | Bus;
// }
// interface AdminBusAPI_GET {
//   data: string | Bus[];
// }
// export type {
//   AdminBusAPI_PUT,
//   AdminBusAPI_DELETE,
//   AdminBusAPI_POST,
//   AdminBusAPI_GET,
// };
// const busAdminHandler = async (req: Request, res: Response) => {
//   if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
//     res.redirect("/login");
//     return;
//   }
// };
// export const addBusAdminHandler = (req: Request, res: Response) => {
//   if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
//     res.redirect("/login");
//     return;
//   }
// };
// export const editBusAdminHanlder = async (req: Request, res: Response) => {
//   if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
//     res.redirect("/login");
//     return;
//   }
// };
// export const deleteBusAdminHanlder = async (req: Request, res: Response) => {
//   if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
//     res.redirect("/login");
//     return;
//   }
// };
// export const addBus = async (req: Request, res: Response) => {};
// export const editBus = async (req: Request, res: Response) => {};
// export const deleteBus = async (req: Request, res: Response) => {};
// export default busAdminHandler;
