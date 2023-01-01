import { Request, Response } from "express";
import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";

const makeStar = (amount:number = 0)=>{
  let starts = "";
  for (let index = 0; index < amount; index++) {
    starts += "⭐"
  }
  return starts;
}

const ticketDetailHandler = async (req: Request<{}, {}, {}, { ticketId: string }>, res: Response) => {
  if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
    res.redirect("/login");
    return
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
      Rating: {
        select: {
          rating: true,
          comment: true
        }
      }
    }
  });

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
  })

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
  const star = makeStar(ticket.Rating?.rating ? ticket.Rating.rating : 0);
  console.log(star);
  res.render("ticket", {
    ticket: ticket,
    detail: routeDetail,
    route: route,
    transactionStatus: ticket.status,
    statusAction: {
      ...(ticket.status === "WAITING" ? { canPaid: true, canCancel: true } : {}),
      ...(ticket.status === "CANCELED" ? { canCancel: false, canPaid: false } : {}),
      ...(ticket.status === "PAID" ? { canPaid: false, canCancel: true } : {}),
      ...(routeDetail && (!ticket.Rating) ? { canRate: true } : { canRate: false })
    },
    rating: { 
      ...ticket.Rating ,
      star: star
    }
  });
}


export default ticketDetailHandler;