import { prisma } from '../../server';
import { singleIntQueryHandler } from './queryHandler';
async function searchRouteFromDB(fromId, toId, page = 0) {
    const itemPerPage = 5;
    await prisma.$connect();
    const route = await prisma.route.findFirst({
        select: {
            id: true,
            startLoc: {
                select: { name: true }
            },
            endtLoc: {
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
    const routeDetail = await prisma.routeDetail.findMany({
        take: itemPerPage,
        skip: itemPerPage * page,
        where: {
            AND: [
                { startTime: { gt: new Date((new Date()).getDate() + 1) } },
                { remainSeat: { gt: 0 } },
                { routeId: route.id }
            ]
        },
        select: {
            startTime: true,
            endTime: true,
            price: true,
            remainSeat: true,
            bus: {
                select: {
                    type: true,
                    house: {
                        select: {
                            Name: true
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
