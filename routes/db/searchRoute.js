import { prisma } from '../../server';
import { singleIntQueryHandler } from './queryHandler';
async function searchRoute(req, res) {
    if (!(req.query && req.query.fromId && req.query.toId)) {
        res.status(210).json([]);
        return;
    }
    const itemPerPage = 5;
    await prisma.$connect();
    const page = singleIntQueryHandler(req.query.page, 0);
    const formId = singleIntQueryHandler(req.query.fromId);
    const toId = singleIntQueryHandler(req.query.toId);
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
                { startLocId: formId },
                { endLocId: toId },
            ]
        }
    });
    if (!route) {
        res.status(200).json([]);
        return;
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
    res.status(200).json({
        route: route,
        detail: routeDetail
    });
}
export default searchRoute;
