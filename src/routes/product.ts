import express, { Request, Response } from 'express';
import productSchema from '../models/productSchema';
import errorHandler from '../functions/error-handler';

interface IProduct {
    id: number,
    name: string,
    description: string,
    price: number
}

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
        const dbResponse = await productSchema.create({ name, description, price });

        res.status(200).json(dbResponse);
    } catch(error) {
        errorHandler(res, error);
    }


});

// router.put("/products/:id", (req: Request, res: Response) => {
//     const product = fakeProductDB.find(prod => prod.id === Number(req.params.id));

//     if (!product) {
//         res.status(404).json({message: "Product not found!"});
//         return;
//     }

//     res.status(200).json(product);
// });