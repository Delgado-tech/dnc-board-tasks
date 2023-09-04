import express, { Request, Response } from 'express';
import bcript from 'bcrypt';
import userSchema, { userAcessLevel } from '../models/userSchema';
import errorHandler from '../functions/error-handler';
import validator from 'validator';

export const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
    res.json(await userSchema.find());
});

router.post("/users", async (req: Request, res: Response) => {
    try {
        const loggedUser = await userSchema.findOne({ _id: req.userJWT.id }).select("+acessLevel");
        if (loggedUser.acessLevel !== "admin" as userAcessLevel) {
            throw new Error("You don't have admin level for create a user!");
        }

        const { name, email, password, acessLevel } = req.body;

        if (!validator.isEmail(email)) {
            throw new Error("Invalid Email!");
        }

        const hashRounds = 10;
        const hashPassword = await bcript.hash(password, hashRounds);
        const dbResponse = await userSchema.create({ name, email, password: hashPassword, acessLevel });
    
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
        const loggedUser = await userSchema.findOne({ _id: req.userJWT.id }).select("+acessLevel");

        if (loggedUser.acessLevel !== "admin" as userAcessLevel) {
            throw new Error("You don't have admin level for delete a user!");
        }

        const id = req.params.id;

        if (id === req.userJWT.id) {
            throw new Error("You can't delete your self!");
        }

        const user = await userSchema.findOne({ _id: id });

        if (user) {
            const dbResponse = await userSchema.deleteOne({ _id: id });

            res.status(200).json({
                status: "OK",
                message: "User has been deleted!",
                response: dbResponse
            });

        } else {
            throw new Error("User not found!");
        }
    
    } catch (error) {
        errorHandler(res, error);
    }

});