import type { Request, Response } from "express";
import { AppError } from "../lib/errors.js";

export const errorHandler = async (err: any, req: Request, res: Response, next: () => void) => {
    if(err instanceof AppError){
        return res.status(err.status).json({'message': err.message});
    }

    res.status(500).json(err)
    return console.error('Internal server error: ', err);
}