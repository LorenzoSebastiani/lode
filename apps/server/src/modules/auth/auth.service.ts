import { type LoginInput, type RegisterInput } from "@lode/shared";
import { db } from "../../db/index.js";
import { users, type PublicUser } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { AppError } from "../../lib/errors.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { signToken } from "../../lib/jwt.js";

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

export const loginUser = async (input: LoginInput): Promise<{ token: string; user: PublicUser }> => {
    const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

    if(!user) {
        throw new AppError(401, 'Credenziali non valide');
    }

    const passwordValidated = await verifyPassword(input.password, user.passwordHash);

    if(!passwordValidated) {
        throw new AppError(401, 'Credenziali non valide');
    }

    const { passwordHash, ...publicUser } = user;
    const token = signToken(user.id);

    return { token, user: publicUser };
}

export const getUserById = async (id: string): Promise<PublicUser> => {
    const [user] = await db.select({id: users.id, email: users.email, createdAt: users.createdAt}).from(users).where(eq(users.id, id));

    if(!user) {
        throw new AppError(404, 'User not found');
    }

    return user;
}