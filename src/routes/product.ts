import express, { Request, Response } from 'express';
import productSchema from '../models/productSchema';
import errorHandler from '../functions/error-handler';
import jwt from 'jsonwebtoken';

export const router = express.Router();

router.get("/products", async (req: Request, res: Response) => {
    try {
        const products = await productSchema.find();

        if (!products || products.length === 0) {
            throw new Error("Nenhum produto encontrado!");
        }

        res.status(200).json(products);

    } catch (error) {
        errorHandler(res, error);
    }
});

router.get("/products/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const product = productSchema.findOne({ _id: id });

    if (!product) {
        res.status(404).json({message: "Product not found!"});
        return;
    }

    res.status(200).json(product);
});

router.post("/products", async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const author = req.userJWT.id;

        const dbResponse = await productSchema.create({ name, description, price, author });

        res.status(200).json({
            status: "OK",
            message: "Product has been created!",
            response: dbResponse
        });

    } catch(error) {
        errorHandler(res, error);
    }


});

router.put("/products/:id", async (req: Request, res: Response) => {
    const productID = req.params.id;
    const { name, description, price } = req.body;

    try {
        const dbResponse = await productSchema.updateOne({ _id: productID, author: req.userJWT.id }, { name, description, price } );

        if (dbResponse.modifiedCount > 0) {
            const product = await productSchema.findOne({ _id: productID, author: req.userJWT.id  }).populate("author");
            return res.status(200).json({
                status: "OK",
                message: "Product has been updated!",
                response: product
            });
        }

    } catch(error) {
        errorHandler(res, error);
    }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
    const productID = req.params.id;

    try {
        const dbResponse = await productSchema.deleteOne({ _id: productID, author: req.userJWT.id });

        res.status(200).json({
            status: "OK",
            message: "Product has been deleted!",
            response: dbResponse
        });

    } catch(error) {
        errorHandler(res, error);
    }
});