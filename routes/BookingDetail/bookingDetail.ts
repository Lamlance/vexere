import express, { Express, Request, Response } from "express";

const bookingDetailHandler = (req: Request, res: Response) => {
  res.locals.title = "Thông tin thanh toán";
  res.locals.cssPath = "/css/DetailBooking.css";
  res.render("bookingDetail");
}

export default bookingDetailHandler;