import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const validate = (schema: z.ZodType): (req: Request, res: Response, next: NextFunction) => void =>{
    return function (req, res, next) {
        const result = schema.safeParse(req.body);

        if(!result.success) {
            res.status(400).json(z.flattenError(result.error))
            return z.flattenError(result.error)
        }
        req.body = result.data;
        return next();
    }
}