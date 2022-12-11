import { prisma } from '../../server';
async function createUser(req, res, next) {
    // console.log("Userd login callback middleware");
    if (!req.oidc.isAuthenticated()) {
        next();
        return;
    }
    await prisma.$connect();
    if (req.oidc.user && req.oidc.user.sub) {
        // console.log(req.oidc.user.sub);
        const userSaved = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: req.oidc.user.email },
                    { uuid: { contains: req.oidc.user.sub } }
                ]
            }
        });
        // console.log(userSaved);
        if (userSaved) {
            if (userSaved.uuid && !userSaved.uuid.includes(req.oidc.user.sub)) {
                userSaved.uuid = userSaved.uuid.concat(`, ${req.oidc.user.sub}`);
                const update = await prisma.user.update({
                    where: {
                        id: userSaved.id
                    },
                    data: userSaved
                });
                window.sessionStorage.setItem("UserDB", JSON.stringify(update));
                next();
                return;
            }
            window.sessionStorage.setItem("UserDB", JSON.stringify(userSaved));
            next();
            return;
        }
        const newUser = {
            Name: req.oidc.user.name ? req.oidc.user.name : "",
            email: req.oidc.user.email ? req.oidc.user.email : null,
            uuid: req.oidc.user.sub
        };
        const newlyCreatedUser = await prisma.user.create({
            data: newUser
        });
        // console.log("NewUser",newlyCreatedUser);
        window.sessionStorage.setItem("UserDB", JSON.stringify(newlyCreatedUser));
    }
    next();
}
export default createUser;
