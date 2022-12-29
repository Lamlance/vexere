import { TicketStatus } from "@prisma/client";
import { prisma, sessionManager } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";
import { getUserFromDB } from "../db/checkUser";
async function PUT(req) {
    if (!req.oidc.user || !req.oidc.isAuthenticated()) {
        console.log("User haven't logged in");
        return {
            status: 401,
            data: null
        };
    }
    if (!req.body) {
        console.log("Req body", req.body);
        return {
            status: 404,
            data: null
        };
    }
    const ticketId = singleIntQueryHandler(req.body.ticketId, -1);
    console.log(req.body.ticketId);
    if (ticketId < 0 || !req.body.status) {
        console.log("Failed body content");
        return {
            status: 400,
            data: null
        };
    }
    await prisma.$connect();
    const userData = (sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email)));
    if (!userData.isAdmin) {
        return {
            status: 400,
            data: null
        };
    }
    try {
        const updateProduct = await prisma.ticket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: (req.body.status in TicketStatus) ? req.body.status : TicketStatus.WAITING
            }
        });
        return {
            status: 200,
            data: updateProduct
        };
    }
    catch (error) {
        console.log(error);
        return {
            status: 400,
            data: null
        };
    }
}
async function adminTicketAPI(req, res) {
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
            const getData = await GET(singleIntQueryHandler(req.query.page, 0));
            res.status(200).json(getData);
            return;
        }
        default:
            break;
    }
}
async function GET(page = 0) {
    await prisma.$connect();
    const tickets = await prisma.ticket.findMany({
        skip: page * 5,
        take: 5
    });
    return tickets;
}
export default adminTicketAPI;
