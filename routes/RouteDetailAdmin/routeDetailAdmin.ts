import express, { Express, Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { singleIntQueryHandler } from "../db/queryHandler";

interface GetRouteDetailQuery{
	fromId:string,
	toId:string,
	time1:string,
	time2:string,
}

const adminRouteDetailHandler = async (req: Request, res: Response) => {
	if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
		res.redirect("/login");
		return;
	}

	const routeDetailData = await prisma.routeDetail.findMany({
		include: {
			Bus: {
				include: {
					BusHouse: true,
				}
			},
			Route: {
				include: {
					Location_Route_startLocIdToLocation: true,
					Location_Route_endLocIdToLocation: true
				}
			}
		}
	});

	res.locals.title = "Danh sách các tuyến đường";
	let routeDetailList: Array<Object> = [];

	if (routeDetailData) {
		routeDetailData.forEach((routeDetail) => {
			let tmpRouteDetailData = {};
			tmpRouteDetailData.id = routeDetail.id;
			tmpRouteDetailData.busId = routeDetail.busId;
			tmpRouteDetailData.price = routeDetail.price;
			tmpRouteDetailData.remainSeat = routeDetail.remainSeat;
			let startTime = new Date(routeDetail.startTime);
			tmpRouteDetailData.startTime = startTime.toLocaleString();
			let endTime = new Date(routeDetail.endTime);
			tmpRouteDetailData.endTime = endTime.toLocaleString();
			tmpRouteDetailData.busHouse = routeDetail.Bus.BusHouse.Name;
			tmpRouteDetailData.startPlace = routeDetail.Route.Location_Route_startLocIdToLocation.name;
			tmpRouteDetailData.endPlace = routeDetail.Route.Location_Route_endLocIdToLocation.name;
			routeDetailList.push(tmpRouteDetailData);
		})
	}
	res.locals.routeDetailList = routeDetailList;
	res.render("RouteDetailAdmin/routeDetailList");
};


export const adminRouteDetailAPI = async (req: Request<{},{},{},GetRouteDetailQuery>, res: Response) => {
	if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
		res.redirect("/login");
		return;
	}
	const fromId = singleIntQueryHandler(req.query.fromId,NaN);
	const toId = singleIntQueryHandler(req.query.toId,NaN);
	const date1 = new Date(req.query.time1);
	const date2 = new Date(req.query.time2);

	const details = await prisma.routeDetail.findMany({
		take:30,
		where:{
			AND:[
				{startTime: {gte: date1}},
				{startTime: {lte: date2}},
				{Route:{
					startLocId:{equals: fromId},
					endLocId:{equals:toId}
				}}
			]
		},
		include:{
			Route:{
				select:{
					startLocId: true,
					endLocId: true,
				}
			}
		}
	});
	res.status(200).json(details);
}

export const adminAddRouteDetailHandler = (req: Request, res: Response) => {
	if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
		res.redirect("/login");
		return;
	}
	res.locals.title = "Thêm tuyến xe";
	res.render("RouteDetailAdmin/routeDetailAdd");
};

export const adminEditRouteDetailHandler = async (req: Request, res: Response) => {
	if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
		res.redirect("/login");
		return;
	}

	let id = singleIntQueryHandler(req.params.id);

	if (!id) {
		res.redirect("/admin/route_detail");
		return;
	}

	const routeDetailData = await prisma.routeDetail.findFirst({
		where: { id: id }
	});

	if (!routeDetailData) {
		res.redirect("/admin/route_detail");
		return;
	}

	res.locals.title = "Chỉnh sửa tuyến xe"

	res.render("RouteDetailAdmin/routeDetailUpdate", {
		id: routeDetailData.id,
		busId: routeDetailData.busId,
		price: routeDetailData.price,
		startTime: routeDetailData.startTime.toISOString().slice(0, 16),
		endTime: routeDetailData.endTime.toISOString().slice(0, 16),
		remainSeat: routeDetailData.remainSeat,
		routeId: routeDetailData.routeId
	})
};


export const addRouteDetailHandler = async (req: Request, res: Response) => {

	console.log(req.body.startTime);
	console.log(req.body.endTime);

	const routeDetailData = {
		busId: singleIntQueryHandler(req.body.busId),
		price: singleIntQueryHandler(req.body.price),
		startTime: new Date(req.body.startTime),
		endTime: new Date(req.body.endTime),
		remainSeat: singleIntQueryHandler(req.body.remainSeat),
		routeId: singleIntQueryHandler(req.body.routeId)
	};

	console.log(routeDetailData);

	const newRouteDetail = await prisma.routeDetail.create({
		data: {
			busId: routeDetailData.busId,
			price: routeDetailData.price,
			startTime: routeDetailData.startTime,
			endTime: routeDetailData.endTime,
			remainSeat: routeDetailData.remainSeat,
			routeId: routeDetailData.routeId
		},
	});

	res.redirect("/admin/route_detail");
}

export const editRouteDetailHandler = async (req: Request, res: Response) => {

	const routeDetailData = {
		busId: singleIntQueryHandler(req.body.busId),
		price: singleIntQueryHandler(req.body.price),
		startTime: new Date(req.body.startTime),
		endTime: new Date(req.body.endTime),
		remainSeat: singleIntQueryHandler(req.body.remainSeat),
		routeId: singleIntQueryHandler(req.body.routeId)
	};


	const newRouteDetail = await prisma.routeDetail.update({
		where: {
			id: singleIntQueryHandler(req.params.id),
		},
		data: routeDetailData,
	});

	res.redirect("/admin/route_detail");
}

export const deleteRouteDetailHandler = async (req: Request, res: Response) => {
	res.redirect("/admin/route_detail");
}

export default adminRouteDetailHandler;