import express, { Request, Response } from 'express';
import bcript from 'bcrypt';
import userSchema from '../models/userSchema';
import errorHandler from '../functions/error-handler';
import validator from 'validator';

export const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
    res.json(await userSchema.find());
});

router.post("/users", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) {
            throw new Error("Invalid Email!");
        }

        const hashRounds = 10;
        const hashPassword = await bcript.hash(password, hashRounds);
        const dbResponse = await userSchema.create({ name, email, password: hashPassword });
    
        res.status(200).json({
            status: "OK",
            message: "User has been created!",
            response: dbResponse
        });
    } catch (error) {
        if (String(error).includes("email_1 dup key")) {
            return errorHandler(res, "Error: This email is already in use!");
        }
        errorHandler(res, error);
    }

});

router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const id = req.params.id;

        const user = await userSchema.findOne({ _id: id }).select("+password");
        const validEmail = user.email === email;
        const validPassword = await bcript.compare(password, user.password);

        if (validEmail && validPassword) {
            const dbResponse = await userSchema.deleteOne({ _id: id });

            res.status(200).json({
                status: "OK",
                message: "User has been deleted!",
                response: dbResponse
            });

        } else {
            throw new Error("Email ou senha inválidos!");
        }
    
    } catch (error) {
        errorHandler(res, error);
    }

});