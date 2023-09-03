import mongoose, { ConnectOptions } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import errorHandler from '../functions/error-handler';

export default async function dbConnect(req: Request, res: Response, next: NextFunction) {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        console.log("Connected to database!");

        try {
            next();
        } catch {};

        return mongoose;

    } catch (error) {
        console.error(error);
        errorHandler(res, "Error: Houve um erro ao tentar se conectar com o banco de dados");
        return error;
    }
}
