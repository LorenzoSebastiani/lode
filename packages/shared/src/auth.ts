import * as z from 'zod'

export const registerSchema = {
    email: z.email().toLowerCase(),
    password: z.string().min(8).max(72)
}

export type RegisterInput = z.infer<typeof registerSchema>