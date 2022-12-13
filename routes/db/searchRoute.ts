import { Request, Response, NextFunction } from 'express';

async function searchRoute(req:Request,res:Response) {
  if(! (req.query && req.query.fromId && req.query.toId) ){
    res.status(210).json([]);
    return;
  }

  const page = (req.query && req.query.page) ? req.query.page : 0;
}