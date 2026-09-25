import type { Request, RequestHandler, Response } from "express";
import { AppError } from "../lib/errors.js";
import { verifyToken } from "../lib/jwt.js";

export const requireAuth: RequestHandler = (req: Request, res: Response, next: () => any) => {
    const header = req.headers.authorization

    if(!header || !header.startsWith('Bearer ') ){
        throw new AppError(401, 'Unauthorized')
    }

    const token = header.slice(7);

    const {sub} = verifyToken(token);

    req.userId = sub;

    next()
}