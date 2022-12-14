const bookingDetailHandler = (req, res) => {
    res.locals.title = "Thông tin thanh toán";
    res.locals.cssPath = "/css/DetailBooking.css";
    res.render("bookingDetail");
};
export default bookingDetailHandler;
