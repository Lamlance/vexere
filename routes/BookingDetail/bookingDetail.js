import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
const bookingDetailHandler = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
    if (!req.query.ticketId) {
        res.redirect("/");
        console.log(" Can't find ticket id ");
        return;
    }
    const userData = sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));
    if (!userData.id) {
        console.log(" Cant find user id");
        res.redirect("/");
        return;
    }
    const ticketId = singleIntQueryHandler(req.query.ticketId);
    const ticket = await prisma.ticket.findFirst({
        where: {
            AND: [{ id: ticketId }, { userId: userData.id }]
        }
    });
    if (!ticket) {
        res.redirect("/");
        return;
    }
    const routeDetail = await prisma.routeDetail.findFirst({
        where: {
            AND: [
                { routeId: { equals: ticket.routeDetailId } },
            ]
        },
        select: {
            routeId: true,
            bus: {
                select: {
                    plate: true,
                    type: true,
                    house: {
                        select: {
                            Name: true
                        }
                    }
                }
            },
        }
    });
    const route = await prisma.routeDetail.findFirst({
        where: {
            AND: [{ routeId: routeDetail?.routeId }]
        },
        select: 
    });
    console.log(ticket);
    res.locals.title = "Thông tin thanh toán";
    res.locals.cssPath = "/css/DetailBooking.css";
    res.render("bookingDetail");
};
export default bookingDetailHandler;
