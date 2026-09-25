import * as z from 'zod'

export const envSchema = z.object({
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('7d')
});

export const env = envSchema.parse(process.env);