const busAdminHandler = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
    switch (req.method) {
        case "GET": {
        }
        case "POST": {
        }
        default:
            break;
    }
};
const addBusAdminHandler = (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
};
const editBusAdminHanlder = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
};
const deleteBusAdminHanlder = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
};
const addBus = async (req, res) => { };
const editBus = async (req, res) => { };
const deleteBus = async (req, res) => { };
export default busAdminHandler;
