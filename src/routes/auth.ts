import express, { Request, Response }  from 'express';
import { fakeUsersDB } from '../middleware';

export const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
    res.redirect("/auth");
});

router.get("/auth", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.clearCookie("access");
    res.render("login", {invalidLogin: false});
});

router.post("/auth", (req: Request, res: Response) => {
    const { login, password } = req.body;

    const user = fakeUsersDB.find(user => user.login === login);
    const validPassword = user?.password === password;

    if (!user) {
        res.render("login", {invalidLogin: true, invalidLoginMessage: "Login inválido!"});
        return;
    }

    if (!validPassword) {
        res.render("login", {invalidLogin: true, invalidLoginMessage: "Senha inválida!"});
        return;
    }

    const cookie24h = 24 * 60 * 60 * 1000;

    if (!req.cookies["token"]) {
        res.cookie("token", user.token, { maxAge: cookie24h });
    }

    if (user.access === "admin") {
        res.cookie("access", "admin");
    }
    
    res.redirect("/");
    
});