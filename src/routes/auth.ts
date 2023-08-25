import express, { Request, Response, json }  from 'express';
import { fakeUsersDB } from '../server';

export const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
    res.redirect("/auth");
});

router.get("/auth", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.clearCookie("access");
    res.render("login", {invalidLogin: false});

    if(fakeUsersDB.length === 0) {
        fakeUsersDB.push({
            login: 'test',//process.env.ADMIN_LOGIN!,
            password: '123',//process.env.ADMIN_PASSWORD!,
            token: process.env.ADMIN_TOKEN!,
            access: "admin"
        });
    }
});

router.post("/auth", (req: Request, res: Response) => {
    const { login, password } = req.body;

    const user = fakeUsersDB.find(user => user.login === login);
    const validPassword = user?.password === password;
    
    if (!user) {
        res.render("login", {invalidLogin: true, invalidLoginMessage: `"Login inválido!" ${fakeUsersDB.length}`});
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