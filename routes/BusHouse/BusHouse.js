import { prisma as prismaClient } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";
async function BusHouseRouteHandler(req, res) {
    const houseId = singleIntQueryHandler(req.query.houseId, NaN);
    if (isNaN(houseId)) {
        res.redirect("/");
        return;
    }
    await prismaClient.$connect();
    const house = await prismaClient.busHouse.findUnique({
        where: {
            id: houseId
        },
        include: {
            Rating: {
                take: 10,
                select: {
                    rating: true,
                    comment: true,
                    Ticket: {
                        select: {
                            User: {
                                select: { Name: true }
                            }
                        }
                    }
                }
            }
        }
    });
    if (houseId) {
        res.render("house", { ...house });
        return;
    }
    res.redirect("/");
}
export default BusHouseRouteHandler;
