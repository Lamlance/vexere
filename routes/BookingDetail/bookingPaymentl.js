import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
import { createHmac, randomUUID } from "crypto";
import fetch from "node-fetch";
const bookingPaymentHandler = async (req, res) => {
    console.log("Ready to pay");
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
        },
        include: {
            RouteDetail: {
                select: {
                    price: true
                }
            }
        }
    });
    console.log(ticket);
    if (!ticket) {
        res.redirect("/");
        return;
    }
    // Get status
    const ticketStatus = ticket.status;
    const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
    const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
    const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
    const REAL_URL = process.env.RENDER_EXTERNAL_URL;
    console.log("MOMO DATA", MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY);
    let transactionStatus = ticketStatus === "WAITING" ? "Chưa thanh toán" : "Đã thanh toán";
    if (MOMO_ACCESS_KEY && MOMO_PARTNER_CODE && MOMO_SECRET_KEY) {
        const id = `${ticket.id}-${ticket.userId}` + randomUUID();
        if (transactionStatus == "Đã thanh toán") {
            res.locals.title = "Thông tin thanh toán";
            // res.render("ticket", {
            //   ticket: ticket,
            //   detail: routeDetail,
            //   route: route,
            //   transactionStatus: transactionStatus,
            // });
            console.log("Đã thanh toán");
            res.status(303).redirect(`/user/ticket?ticketId=${ticket.id}`);
            return;
        }
        console.log("Chưa thanh toán", ticket.RouteDetail.price);
        let payUrl = "";
        const newPayment = {
            amount: (ticket.RouteDetail.price != 0) ? ticket.RouteDetail.price : 300000,
            payment_info: `Thanh toán vé xe`
        };
        const data = {
            partnerCode: MOMO_PARTNER_CODE,
            requestId: id,
            amount: newPayment.amount,
            orderId: id,
            orderInfo: newPayment.payment_info,
            redirectUrl: `${REAL_URL ? REAL_URL : "http://localhost:8000"}/user/ticket/callback`,
            ipnUrl: `${REAL_URL ? REAL_URL : "http://localhost:8000"}/user/ticket/pay?ticketId=${ticket.id}`,
            requestType: "captureWallet",
            extraData: ticket.id,
            lang: "vi",
            signature: "",
        };
        let message = `accessKey=${MOMO_ACCESS_KEY}&orderId=${data.orderId}&partnerCode=${data.partnerCode}&requestId=${data.requestId}`;
        data.signature = createHmac("sha256", MOMO_SECRET_KEY).update(message).digest("hex");
        if (transactionStatus === "Chưa thanh toán") {
            let message = `accessKey=${MOMO_ACCESS_KEY}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
            data.signature = createHmac("sha256", MOMO_SECRET_KEY).update(message).digest("hex");
            const fetchResult = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = await fetchResult.json();
            payUrl = json.payUrl;
            res.locals.title = "Thông tin thanh toán";
            // res.render("ticket", {
            //   ticket: ticket,
            //   detail: routeDetail,
            //   route: route,
            //   transactionStatus: transactionStatus,
            //   payUrl: payUrl,
            // });
            console.log("Redirecting", payUrl);
            if (payUrl) {
                res.redirect(payUrl);
            }
            else {
                res.redirect("/user/ticket/callback");
                console.log(json);
            }
            return;
        }
    }
    console.log("Skip payment");
    res.redirect(`/user/ticket?ticketId=${ticket.id}`);
    return;
};
export const bookingDetailCallbackHandler = async (req, res) => {
    const ticketId = singleIntQueryHandler(req.query.extraData, -1);
    const result = singleIntQueryHandler(req.query.resultCode, -1);
    if (ticketId < 0 || result != 0) {
        const transactionStatus = "Thanh toán thất bại! Hãy thử lại.";
        res.locals.title = "Thông tin thanh toán";
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
        return;
    }
    if (result == 0) {
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
        const detail = await prisma.routeDetail.findFirst({
            where: { id: updateTicket.routeDetailId }
        });
        if (!detail) {
            const transactionStatus = "Thanh toán thất bại! Hãy thử lại.";
            res.locals.title = "Thông tin thanh toán";
            res.render("paymentStatus", {
                transactionStatus: transactionStatus,
                ticketId: ticketId,
            });
            return;
        }
        await prisma.routeDetail.update({
            where: { id: detail.id },
            data: {
                remainSeat: detail.remainSeat - 1
            }
        });
        res.locals.title = "Thông tin thanh toán";
        // Render lại trong trang thanh toán thành công
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
        return;
    }
    // Render lại trong trang thanh toán thất bại
};
export default bookingPaymentHandler;
