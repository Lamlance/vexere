import { Request, Response, NextFunction } from 'express';
import { prisma, sessionManager } from '../../server';

async function checkUser(req: Request, res: Response, next: NextFunction) {
  // console.log("Userd login callback middleware");
  if (!req.oidc.isAuthenticated()) {
    next();
    return;
  }

  if (req.oidc.user && req.oidc.user.sid && sessionManager.checkAndRefreshed(req.oidc.user.sid)) {
    // console.log("Already logged");
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

      if (userSaved.uuid && userSaved.uuid.includes(req.oidc.user.sub)) {
        sessionManager.addUser(req.oidc.user.sid, {
          id: userSaved.id,
          Name: userSaved.Name,
          email: userSaved.email,
          phone: userSaved.phone
        });
        next();
        return;
      }

      userSaved.uuid = userSaved.uuid.concat(`, ${req.oidc.user.sub}`);
      const update = await prisma.user.update({
        where: {
          id: userSaved.id
        },
        data: userSaved
      });
      sessionManager.addUser(req.oidc.user.sid, {
        id: update.id,
        Name: update.Name,
        email: update.email,
        phone: update.phone
      });

      next();
      return;
    }

    const newUser = {
      Name: (<string>req.oidc.user.name) ? (<string>req.oidc.user.name) : "",
      email: (<string>req.oidc.user.email) ? (<string>req.oidc.user.email) : null,
      uuid: <string>req.oidc.user.sub
    }
    const newlyCreatedUser = await prisma.user.create({
      data: newUser
    });
    // console.log("NewUser",newlyCreatedUser);
    sessionManager.addUser(req.oidc.user.sid, {
      id: newlyCreatedUser.id,
      Name: newlyCreatedUser.Name,
      email: newlyCreatedUser.email,
      phone: newlyCreatedUser.phone
    });
  }
  next();
}

export default checkUser;