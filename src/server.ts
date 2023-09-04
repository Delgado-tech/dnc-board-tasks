import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import { router as productRouter } from './routes/product';
import { router as userRouter } from './routes/user';
import { router as authRouter } from './routes/auth';
import { auth } from './middlewares/access';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';
import dbConnect from './middlewares/db-conect';



const app = express();
const port: number = 5173;

const swaggerConfig = YAML.load(fs.readFileSync("src/swagger.yaml", "utf-8")) as any;

/* =========== libs config ============ */
dotenv.config();

app.set('view engine', 'ejs');
app.set('views', `${process.cwd()}/public/views`);

app.use("/public", express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParse());
app.use(cors());
/* ==================================== */



/* =========== routes ================= */
app.get("/", (req: Request, res: Response) => {
    res.redirect("/docs");
});

app.use("/docs", dbConnect, auth, swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
    customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.css',
}));

app.use("/v1", dbConnect, auth, productRouter);
app.use("/v1", dbConnect, auth, userRouter);

app.use(authRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({message: "This page not exists!"});
});
/* ===================================== */



app.listen(port, () => {
    console.log(`Escutando na porta: ${port}`);
});
