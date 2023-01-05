import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
const adminDashBoard = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user) {
        res.redirect("/");
        return;
    }
    console.log("Is loggedin");
    await prisma.$connect();
    const userData = sessionManager.users[req.oidc.user.sid] ||
        (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));
    console.log(userData);
    if (!userData.isAdmin) {
        return {
            status: 400,
            data: null,
        };
    }
    res.render("admin");
};
export default adminDashBoard;
