import { prisma as myPrisma } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";
const busAdminHandler = async (req, res) => {
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
            }
            else {
                res.status(400);
            }
            return;
        }
        default:
            break;
    }
};
const getBusAdminHandler = async (req) => {
    const page = singleIntQueryHandler(req.query.page, 0);
    await myPrisma.$connect();
    const buses = await myPrisma.bus.findMany({
        take: 5,
        skip: 5 * page,
    });
    return buses;
};
const addBusAdminHandler = async (req) => {
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
    }
    catch (error) {
        return null;
    }
};
const editBusAdminHanlder = async (req) => { };
const deleteBusAdminHanlder = async (req) => { };
const addBus = async (req, res) => { };
const editBus = async (req, res) => { };
const deleteBus = async (req, res) => { };
export default busAdminHandler;
