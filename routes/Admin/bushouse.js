import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
async function adminBusHouseHandler(req, res) {
    if (!req.oidc.isAuthenticated() || !req.oidc.user) {
        res.status(400).json({});
        return;
    }
    await prisma.$connect();
    const userData = (sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email)));
    if (!userData.isAdmin) {
        res.status(400).json({});
        return;
    }
    switch (req.method) {
        case "GET": {
            const houses = await GET(req);
            res.status(200).json(houses);
            return;
        }
        case "POST": {
            const newHouse = await POST(req);
            if (newHouse) {
                res.status(200).json(newHouse);
                return;
            }
            res.status(404);
            return;
        }
        case "PUT": {
            const updateHouse = await PUT(req);
            if (updateHouse) {
                res.status(200).json(updateHouse);
                return;
            }
            res.status(404);
            return;
        }
    }
    res.status(400);
}
async function GET(req) {
    const page = singleIntQueryHandler(req.query.page, 0);
    await prisma.$connect();
    const houses = await prisma.busHouse.findMany({
        take: 5,
        skip: 5 * page
    });
    return houses;
}
async function POST(req) {
    const { name } = req.body;
    await prisma.$connect();
    try {
        const newBusHouse = await prisma.busHouse.create({
            data: {
                Name: name
            }
        });
        return newBusHouse;
    }
    catch (error) {
        console.log(error);
    }
    return null;
}
async function PUT(req) {
    const { busHouseId, name } = req.body;
    await prisma.$connect();
    try {
        const update = await prisma.busHouse.update({
            where: {
                id: busHouseId
            },
            data: {
                Name: name
            }
        });
        return update;
    }
    catch (error) {
        console.log(error);
    }
    return null;
}
export default adminBusHouseHandler;
