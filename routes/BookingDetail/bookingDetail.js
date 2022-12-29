import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
import dotenv from "dotenv";
import { createHmac, randomUUID } from "crypto";
import fetch from "node-fetch";
dotenv.config();
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
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
    console.log(ticket);
    if (!ticket) {
        res.redirect("/");
        return;
    }
    const routeDetail = await prisma.routeDetail.findFirst({
        where: {
            AND: [
                { id: { equals: ticket.routeDetailId } },
            ]
        },
        include: {
            Bus: {
                select: {
                    plate: true,
                    type: true,
                    BusHouse: {
                        select: {
                            Name: true
                        }
                    }
                }
            }
        }
    });
    const route = await prisma.route.findFirst({
        where: {
            AND: [{ id: { equals: routeDetail?.routeId } }]
        },
        select: {
            Location_Route_startLocIdToLocation: {
                select: { name: true }
            },
            Location_Route_endLocIdToLocation: {
                select: { name: true }
            }
        }
    });
    // Get status
    const ticketStatus = ticket.status;
    let transactionStatus = ticketStatus === "WAITING" ? "Chưa thanh toán" : "Đã thanh toán";
    if (MOMO_ACCESS_KEY !== undefined && MOMO_PARTNER_CODE !== undefined && MOMO_SECRET_KEY !== undefined) {
        const id = `${ticket.id}-${ticket.userId}` + randomUUID();
        if (transactionStatus == "Đã thanh toán") {
            res.locals.title = "Thông tin thanh toán";
            res.render("ticket", {
                ticket: ticket,
                detail: routeDetail,
                route: route,
                transactionStatus: transactionStatus,
            });
        }
        else {
            let payUrl = "";
            const newPayment = {
                amount: 50000,
                payment_info: `Thanh toán vé xe`
            };
            const data = {
                partnerCode: MOMO_PARTNER_CODE,
                requestId: id,
                amount: newPayment.amount,
                orderId: id,
                orderInfo: newPayment.payment_info,
                redirectUrl: `http://localhost:8000/user/ticket/callback`,
                ipnUrl: `http://localhost:8000/user/ticket?ticketId=${ticket.id}`,
                requestType: "captureWallet",
                extraData: ticket.id,
                lang: "vi",
                signature: "",
            };
            let message = `accessKey=${MOMO_ACCESS_KEY}&orderId=${data.orderId}&partnerCode=${data.partnerCode}&requestId=${data.requestId}`;
            data.signature = createHmac("sha256", MOMO_SECRET_KEY)
                .update(message)
                .digest("hex");
            if (transactionStatus === "Chưa thanh toán") {
                let message = `accessKey=${MOMO_ACCESS_KEY}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
                data.signature = createHmac("sha256", MOMO_SECRET_KEY)
                    .update(message)
                    .digest("hex");
                fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then(async (result) => {
                    const json = await result.json();
                    payUrl = json.payUrl;
                    res.locals.title = "Thông tin thanh toán";
                    res.render("ticket", {
                        ticket: ticket,
                        detail: routeDetail,
                        route: route,
                        transactionStatus: transactionStatus,
                        payUrl: payUrl,
                    });
                });
            }
        }
    }
};
export const bookingDetailCallbackHandler = async (req, res) => {
    let ticketId = parseInt(req.query.extraData);
    if (req.query.resultCode == 0) {
        // cập nhật trong database
        let transactionStatus = "Thanh toán thành công!";
        const updateTicket = await prisma.ticket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: "PAID",
            },
        });
        res.locals.title = "Thông tin thanh toán";
        // Render lại trong trang thanh toán thành công
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
    }
    else {
        let transactionStatus = "Thanh toán thất bại! Hãy thử lại.";
        res.locals.title = "Thông tin thanh toán";
        // Render lại trong trang thanh toán thất bại
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
    }
};
export default bookingDetailHandler;
