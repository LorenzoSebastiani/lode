import { registerSchema, type RegisterInput } from "@lode/shared";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { AppError } from "../../lib/errors.js";
import { hashPassword } from "../../lib/password.js";

export const registerUser = async (input: RegisterInput): Promise<{ id: string; email: string; createdAt: Date }> => {
    const exsistingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

    if(exsistingUser.length > 0) {
        throw new AppError(409, 'Email già registrata');
    }

    const hashedPassword = await hashPassword(input.password);

    const [user] = await db
        .insert(users)
        .values({ email: input.email, passwordHash: hashedPassword })
        .returning({ id: users.id, email: users.email, createdAt: users.createdAt });

    return user!;
}