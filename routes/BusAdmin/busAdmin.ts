import { Bus, prisma, PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import { prisma as myPrisma, sessionManager } from "../../server";
import { singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";

interface AdminBusGET {
  page: string;
}
interface AdminBusPOST {
  plate: string;
  seatAmount: number;
  type: number;
  busHouse: number;
}
interface AdminBusPUT {
  busId: number;
  plate: string;
  seatAmount: number;
  type: number;
  busHouse: number;
}
interface AdminBusDELETE {
  busId: number;
}

type AdminBusBody = AdminBusPOST & AdminBusPUT & AdminBusDELETE;

const busAdminHandler = async (
  req: Request<{}, {}, AdminBusBody, AdminBusGET>,
  res: Response
) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return;
  }

  switch (req.method) {
    case "GET": {
      const buses = await getBusAdminHandler(req);
      res.status(200).json(buses);
      return;
    }
    case "POST": {
      const newBus = await addBusAdminHandler(req);
      if (newBus) {
        res.status(200).json(newBus);
      } else {
        res.status(400);
      }
      return;
    }
    default:
      break;
  }
};

const getBusAdminHandler = async (req: Request<{}, {}, {}, AdminBusGET>) => {
  const page = singleIntQueryHandler(req.query.page, 0);
  await myPrisma.$connect();
  const buses = await myPrisma.bus.findMany({
    take: 5,
    skip: 5 * page,
  });
  return buses;
};

const addBusAdminHandler = async (req: Request<{}, {}, AdminBusPOST, {}>) => {
  const { plate, seatAmount, type, busHouse } = req.body;
  if (!(plate && seatAmount && type && busHouse)) {
    return null;
  }
  await myPrisma.$connect();
  try {
    const newBus = await myPrisma.bus.create({
      data: {
        plate: plate,
        seatAmount: seatAmount,
        type: type,
        busHouse: busHouse,
      },
    });
    return newBus;
  } catch (error) {
    return null;
  }
};

const updateBusAdminHanlder = async (
  req: Request<{}, {}, AdminBusPOST, {}>
) => {
  const { plate, seatAmount, type, busHouse } = req.body;
  if (!(!plate && seatAmount && type && busHouse)) {
    return null;
  }
  await myPrisma.$connect();
  const busData = {
    plate: singleIntQueryHandler(req.body.plate),
    seatAmount: singleIntQueryHandler(req.body.seatAmount),
    type: singleIntQueryHandler(req.body.type),
    busHouse: singleIntQueryHandler(req.body.busHouse),
  };
  const newBus = await myPrisma.bus.update({
    where: {
      id: 12,
    },
    data: {
      {busData}
    },
  });
};

const deleteBusAdminHanlder = async (
  req: Request<{}, {}, AdminBusDELETE, {}>
) => {
  await myPrisma.$connect();
  await myPrisma.bus.delete({
    where: {
      id: 12,
    },
  });
};

const addBus = async (req: Request, res: Response) => {};

const editBus = async (req: Request, res: Response) => {};

const deleteBus = async (req: Request, res: Response) => {};

export default busAdminHandler;
