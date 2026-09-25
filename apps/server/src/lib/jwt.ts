import jwt, { type SignOptions } from "jsonwebtoken"
import { env } from "../config/env.js"
import { AppError } from "./errors.js";

export const signToken = (userId: string): string => {
    return jwt.sign({sub: userId}, env.JWT_SECRET, {expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>});
}

export const verifyToken = (token: string): {sub : string} => {
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        return {
            sub: payload.sub?.toString()!
        }
    } catch (error) {
        throw new AppError(401, 'Unauthorized')
    }
}
