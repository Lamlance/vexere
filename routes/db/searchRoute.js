import { prisma } from '../../server';
import { singleIntQueryHandler } from './queryHandler';
async function searchRouteFromDB(fromId, toId, page = 0) {
    const itemPerPage = 5;
    await prisma.$connect();
    const route = await prisma.route.findFirst({
        select: {
            id: true,
            Location_Route_startLocIdToLocation: {
                select: { name: true }
            },
            Location_Route_endLocIdToLocation: {
                select: { name: true }
            }
        },
        where: {
            AND: [
                { startLocId: fromId },
                { endLocId: toId },
            ]
        }
    });
    if (!route) {
        return {
            route: {},
            routeDetail: [],
        };
    }
    const today = new Date();
    const tommorrow = new Date(today.getTime() + 1 * 8.64e+7);
    const routeDetail = await prisma.routeDetail.findMany({
        take: itemPerPage,
        skip: itemPerPage * page,
        where: {
            AND: [
                { startTime: { gt: new Date("05 October 2011 14:48 UTC") } },
                { remainSeat: { gt: 0 } },
                { routeId: route.id }
            ]
        },
        select: {
            id: true,
            startTime: true,
            endTime: true,
            price: true,
            remainSeat: true,
            Bus: {
                select: {
                    type: true,
                    BusHouse: {
                        select: {
                            Name: true,
                            id: true
                        }
                    }
                }
            }
        }
    });
    return {
        route: route,
        routeDetail: routeDetail
    };
}
async function searchRouteAPI(req, res) {
    if (!(req.query && req.query.fromId && req.query.toId)) {
        res.status(210).json([]);
        return;
    }
    const page = singleIntQueryHandler(req.query.page, 0);
    const fromId = singleIntQueryHandler(req.query.fromId);
    const toId = singleIntQueryHandler(req.query.toId);
    const ans = await searchRouteFromDB(fromId, toId, page);
    res.json(ans);
}
export default searchRouteAPI;
export { searchRouteFromDB };
