import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const validate = (schema: z.ZodType, source: 'body'|'params' = 'body'): (req: Request, res: Response, next: NextFunction) => void =>{
    return function (req, res, next) {
        const result = schema.safeParse(req[source]);

        if(!result.success) {
            return res.status(400).json(z.flattenError(result.error))
        }
        req[source] = result.data;
        return next();
    }
}