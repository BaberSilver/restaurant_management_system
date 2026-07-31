import { Request, Response } from "express";
import { login } from "../services/authService.js";

export async function loginUser(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const result = await login(username, password);

        res.json(result);
    } catch (error) {
        console.error("Login request failed:", error);

        res.status(401).json({
            message: error instanceof Error ? error.message : "Invalid credentials"
        });
    }
}