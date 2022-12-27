import { prisma, sessionManager } from "../../../server";
import { getUserFromDB } from "../../db/checkUser";
import { singleIntQueryHandler } from "../../db/queryHandler";
import dotenv from "dotenv";
import { createHmac } from "crypto";
import fetch from "node-fetch";
dotenv.config();
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
console.log(MOMO_PARTNER_CODE);
console.log(MOMO_ACCESS_KEY);
console.log(MOMO_SECRET_KEY);
const PaymentLogic = async (req, res, next) => {
    if (!req.ticket || !req.routeData) {
        next();
        return;
    }
    const ticket = req.ticket;
    const route = req.routeData;
    let transactionStatus = "Chưa thanh toán";
    let payUrl = "";
    if (MOMO_ACCESS_KEY !== undefined && MOMO_PARTNER_CODE !== undefined && MOMO_SECRET_KEY !== undefined) {
        console.log("start paying");
        const id = `${ticket.id}-${ticket.userId}`;
        const newPayment = {
            amount: 50000,
            payment_info: `Thanh toán vé xe từ ${route?.Location_Route_startLocIdToLocation} đến ${route?.Location_Route_endLocIdToLocation}`
        };
        const data = {
            partnerCode: MOMO_PARTNER_CODE,
            requestId: id,
            amount: newPayment.amount,
            orderId: id,
            orderInfo: newPayment.payment_info,
            redirectUrl: `http://localhost:8000/user/ticket?ticketId=${ticket.id}`,
            ipnUrl: `http://localhost:8000/user/ticket?ticketId=${ticket.id}`,
            requestType: "captureWallet",
            extraData: "",
            lang: "vi",
            signature: "",
        };
        let message = `accessKey=${MOMO_ACCESS_KEY}&orderId=${data.orderId}&partnerCode=${data.partnerCode}&requestId=${data.requestId}`;
        data.signature = createHmac("sha256", MOMO_SECRET_KEY)
            .update(message)
            .digest("hex");
        const fetchData = await fetch("https://test-payment.momo.vn/v2/gateway/api/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        try {
            const fetchJson = await fetchData.json(); //Pray
            console.log(fetchJson);
            if (fetchJson.resultCode === 0) {
                transactionStatus = "Đã thanh toán";
            }
        }
        catch (error) {
            console.log(error);
        }
        // then(async (result) => {
        //   let json = await result.json();
        //   if (json.resultCode == 0) {
        //     transactionStatus = "Đã thanh toán";
        //   }
        // });
        //   if (transactionStatus === "Chưa thanh toán") {
        //     message = `accessKey=${MOMO_ACCESS_KEY}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
        //     data.signature = createHmac("sha256", MOMO_SECRET_KEY)
        //       .update(message)
        //       .digest("hex");
        //     fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(data),
        //     }).then(async (result) => {
        //       const json = await result.json();
        //       console.log(json);
        //       payUrl = json.payUrl;
        //       // if (json.payUrl) {
        //       // }
        //     });
        //   }
        // }
        console.log(transactionStatus);
        console.log(payUrl);
    }
};
const bookingDetailHandler = async (req, res, next) => {
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
    // res.locals.title = "Thông tin thanh toán";
    // res.render("ticket", {
    //   ticket: ticket,
    //   detail: routeDetail,
    //   route: route,
    // });
    if (!route) {
        next();
        return;
    }
    req.ticket = ticket;
    req.routeData = route;
    next();
};
export default bookingDetailHandler;
export { PaymentLogic };
