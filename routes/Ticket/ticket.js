import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
async function createTicket(req, res) {
    if (!req.oidc.user || !req.oidc.isAuthenticated()) {
        console.log("User haven't logged in");
        res.redirect("/");
        return;
    }
    if (!req.body) {
        console.log("Req body", req.body);
        res.status(404);
        return;
    }
    const detailId = singleIntQueryHandler(req.body.detailId, -1);
    console.log(req.body.detailId);
    if (detailId < 0) {
        console.log("Failed Id");
        res.status(400);
        return;
    }
    await prisma.$connect();
    const userData = sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));
    const detailInfo = await prisma.routeDetail.findFirst({
        where: {
            id: { equals: detailId }
        }
    });
    if (!detailInfo) {
        console.log("Cant get info");
        res.status(400);
        return;
    }
    const ticketData = await prisma.ticket.create({
        data: {
            userId: userData.id,
            routeDetailId: detailInfo.id
        }
    });
    res.status(303).redirect(`/user/ticket?ticketId=${ticketData.id}`);
}
export default createTicket;
