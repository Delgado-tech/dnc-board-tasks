import express, {Request, Response, NextFunction} from 'express';

interface IProduct {
    id: number,
    name: string,
    description: string,
    price: number
}

export const router = express.Router();

const fakeProductDB: IProduct[] = [];
let currentId: number = 0;

router.get("/products", (req: Request, res: Response) => {
    res.status(200).json(fakeProductDB);
});

router.get("/products/:id", (req: Request, res: Response) => {
    const product = fakeProductDB.find(prod => prod.id === Number(req.params.id));

    if (!product) {
        res.status(404).json({message: "Product not found!"});
        return;
    }

    res.status(200).json(product);
});

router.post("/products", (req: Request, res: Response) => {
    const { name, description, price } = req.body;
    console.log(req.body)
    if (!name) {
        res.status(400).json({message: "Name can't be empty!"});
        return;
    }

    const errProductExists = fakeProductDB.find(prod => prod.name === name);
    if (errProductExists) {
        res.status(400).json({message: "Product Already Exists!"});
        return;
    }

    const product: IProduct = {
        id: currentId,
        name: name,
        description: description ? description: "",
        price: price ? price : 0
    }

    currentId++;

    fakeProductDB.push(product);
    res.status(201).json(product);
});