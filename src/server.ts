import express, { Request, Response, json } from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import { router as productRouter } from './routes/product';
//import { router as authRouter } from './routes/auth';
import { /*auth,*/ fakeUsersDB } from './middleware';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
//import swaggerConfig from './swagger.json';
import fs from 'fs';

const swaggerConfig = YAML.load(fs.readFileSync("swagger.yaml", "utf-8")) as any;

const app = express();
const port: number = 5173;

/* =========== read YAML ============== */
//const file = fs.readFileSync('swagger.yaml', 'utf-8');
//const swaggerConfig = yaml.parse(file);
/* ==================================== */



/* =========== libs config ============ */
dotenv.config();

//app.set('view engine', 'ejs');
//app.set('views', `${process.cwd()}/public/views`);

app.use("/public", express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParse());
app.use(cors());
/* ==================================== */



/* =========== routes ================= */
//app.all("*", auth);

app.get("/", (req: Request, res: Response) => {
    res.redirect("/docs");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig, {customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.6.0/swagger-ui.min.css'}));

app.use("/v1", productRouter);

//app.use(authRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({message: "This page not exists!"});
});
/* ===================================== */



app.listen(port, () => {
    console.log(`Escutando na porta: ${port}`);
    fakeUsersDB.push({
        login: process.env.ADMIN_LOGIN!,
        password: process.env.ADMIN_PASSWORD!,
        token: process.env.ADMIN_TOKEN!,
        access: "admin"
    });
});
