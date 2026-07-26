import { Request, Response } from "express";
import { getEmployeeDashboard } from "../services/dashboardService.js";

export async function dashboard(
    req: Request,
    res: Response
) {
    try {
        const userId = req.user.userId;

        const data = await getEmployeeDashboard(userId);

        res.status(200).json(data);
    }
    catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}