import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { AppError } from "../lib/errors.js";
import { env } from "../config/env.js";

if(!env.DATABASE_URL) {
    throw new AppError(500, 'Database Url must be a real db url.')
}

export const db = drizzle({
    connection: env.DATABASE_URL!,
    schema: schema,
});
