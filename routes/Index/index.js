import { prisma as prismaClient } from "../../server";
const indexHandler = async (req, res) => {
    let data = await prismaClient.location.findMany({
        select: {
            name: true,
            id: true
        }
    });
    let locations = data.map(loc => loc.name);
    console.log(locations);
    res.locals.title = "Trang chủ";
    res.locals.cssPath = "/css/index.css";
    res.locals.locations = data;
    res.render("index");
};
export default indexHandler;
