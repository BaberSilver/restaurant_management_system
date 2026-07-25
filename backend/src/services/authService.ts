import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
        include: {
            role: true,
            employee: true,
        },
    });


    if (!user) {
        throw new Error("Invalid username or password");
    }

    const validPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!validPassword) {
        throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
        {
            userId: user.userId,
            username: user.username,
            role: user.role.roleName,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "24h",
        }
    );

    return {
        token,
        user,
    };
}