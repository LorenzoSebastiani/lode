import * as z from 'zod'

export const registerSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(8).max(72).trim()
})

export const loginSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().nonempty()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>