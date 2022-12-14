const bookingDetailHandler = (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.redirect("/login");
        return;
    }
    res.locals.title = "Thông tin thanh toán";
    res.locals.cssPath = "/css/DetailBooking.css";
    res.render("bookingDetail");
};
export default bookingDetailHandler;
