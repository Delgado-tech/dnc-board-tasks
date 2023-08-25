import { Request, Response, NextFunction } from 'express';
import { fakeUsersDB } from './server';





export const auth = (req: Request, res: Response, next: NextFunction) => {
    return next();
    if (req.headers.host?.includes("localhost")) return next();
    if (req.url === "/auth") return next();

    if (!req.cookies["token"]) {
        res.redirect("/auth");
        return;
    }

    const tokenExists = fakeUsersDB.find(user => user.token === req.cookies["token"]);
    if (!tokenExists) {
        res.clearCookie("token");
        res.redirect("/auth");
        return;
    }

    next();
}