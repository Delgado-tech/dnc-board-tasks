import { Response } from "express";

export default function errorHandler(res: Response, err: any) {
    //Erro do proprio moongose
    if (String(err).includes("ValidationError:")) {
        return res.status(400).json({
            status: "Error",
            statusMessage: String(err).replace("ValidationError: ", "").replaceAll(":", ""),
            response: String(err)
        });
    }

    //Erro preestabelecido
    if (String(err).includes("Error:")) {
        return res.status(400).json({
            status: "Error",
            statusMessage: String(err).replace("Error: ", "").replaceAll(":", ""),
            response: String(err)
        });
    }

    //Erro inesperado
    console.error(err);
    return res.status(500).json({
        status: "Error",
        statusMessage: "Houve um problema inesperado, tente novamente mais tarde!",
        response: String(err)
    });
} 