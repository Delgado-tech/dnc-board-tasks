import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import errorHandler from '../functions/error-handler';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    //if (req.headers.host?.includes("localhost")) return next();
    if (req.url === "/auth") return next();

    const token = req.cookies["x-auth-token"] as string;

    if (!token) {
        res.redirect("/auth");
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.userJWT = decoded;
        next();

    } catch (error) {
        console.log(error);
        errorHandler(res, "Error: Token inválido!");
    }
}