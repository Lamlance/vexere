const indexHandler = (req, res) => {
    res.locals.title = "Trang chủ";
    res.locals.cssPath = "/css/index.css";
    res.render("index");
};
export default indexHandler;
