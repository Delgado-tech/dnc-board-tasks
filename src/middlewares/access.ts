import { Request, Response, NextFunction } from 'express';



type userAccessType = "admin" | "default";

interface IUser {
    login: string,
    password: string,
    token: string,
    access: userAccessType
}

export const fakeUsersDB: IUser[] = [];



export const auth = (req: Request, res: Response, next: NextFunction) => {
    if(fakeUsersDB.length === 0) {
        fakeUsersDB.push({
            login: process.env.ADMIN_LOGIN!,
            password: process.env.ADMIN_PASSWORD!,
            token: process.env.ADMIN_TOKEN!,
            access: "admin"
        });
    }

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