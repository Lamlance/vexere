import { singleIntQueryHandler, singleQueryHandler } from "../db/queryHandler";
import { searchRouteFromDB } from "../db/searchRoute";
import { prisma } from "../../server";
const searchRouteHandler = async (req, res) => {
    console.log(req.query.busHouse);
    if (!(req.query && req.query.fromId && req.query.toId)) {
        res.render("search", {});
        return;
    }
    const page = singleIntQueryHandler(req.query.page, 0);
    let fromId = singleIntQueryHandler(req.query.fromId, NaN);
    let toId = singleIntQueryHandler(req.query.toId, NaN);
    if (isNaN(fromId) && isNaN(toId)) {
        await prisma.$connect();
        const fromLoc = await prisma.location.findMany({
            take: 2,
            where: {
                OR: [
                    { name: { contains: singleQueryHandler(req.query.fromId) } },
                    { name: { contains: singleQueryHandler(req.query.toId) } }
                ],
            }
        });
        if (fromLoc.length !== 2) {
            res.render("search", {});
            return;
        }
        fromId = fromLoc[0].id;
        toId = fromLoc[1].id;
    }
    const ans = await searchRouteFromDB(fromId, toId, page);
    ans.routeDetail.forEach((detail) => {
        detail.startTime = detail.startTime.toLocaleString();
        detail.endTime = detail.endTime.toLocaleString();
    });
    res.render("search", ans);
};
export default searchRouteHandler;
