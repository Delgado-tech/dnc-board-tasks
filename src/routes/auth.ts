import express, { Request, Response }  from 'express';
import userSchema from '../models/userSchema';
import bcript from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../middlewares/db-conect';

export const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
    res.redirect("/auth");
});

router.get("/auth", (req: Request, res: Response) => {
    res.render("login", {invalidLogin: false});
});

router.post("/auth", dbConnect, async (req: Request, res: Response) => {
    const invalidLogin = () => {
        res.render("login", {invalidLogin: true, invalidLoginMessage: "Email ou senha inválidos!"});
    }

    const { login, password } = req.body;

    const user = await userSchema.findOne({ email: login }).select("+password");
    if (!user) return invalidLogin();

    const validPassword = await bcript.compare(password, user.password);
    if (!validPassword) return invalidLogin();
    

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.cookie("x-auth-token", token);
    
    res.redirect("/");
    
});