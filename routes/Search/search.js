import { singleIntQueryHandler } from "../db/queryHandler";
import { searchRouteFromDB } from "../db/searchRoute";
const searchRouteHandler = async (req, res) => {
    if (!(req.query && req.query.fromId && req.query.toId)) {
        res.render("search", {});
        return;
    }
    const page = singleIntQueryHandler(req.query.page, 0);
    const fromId = singleIntQueryHandler(req.query.fromId);
    const toId = singleIntQueryHandler(req.query.toId);
    const ans = await searchRouteFromDB(fromId, toId, page);
    ans.routeDetail.forEach((detail) => {
        detail.startTime = detail.startTime.toLocaleString();
        detail.endTime = detail.endTime.toLocaleString();
    });
    res.render("search", ans);
};
export default searchRouteHandler;
