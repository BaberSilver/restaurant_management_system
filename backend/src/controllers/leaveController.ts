import { Request, Response } from "express";
import { 
    getMyLeaveRequests,
    createLeaveRequest,
    approveLeaveRequest,
    getAllLeaveRequests,
} from "../services/leaveService.js";

export async function getMyLeaves(req: Request, res: Response) {
    try {
        const leaves = await getMyLeaveRequests(req.user.employeeId);
        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to fetch leave requests",
        });
    }
}

export async function createLeave(req: Request, res: Response) {
    try {
        if (req.user.role === "ADMINISTRATOR") {
            return res.status(403).json({ message: "Administrators manage leave requests rather than submitting them." });
        }

        const { startDate, endDate, reason } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const leaveRequest = await createLeaveRequest(
            req.user.employeeId,
            startDate,
            endDate,
            reason
        );

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create leave request",
        });
    }
}

export async function approveLeave(req: Request, res: Response) {
    try {
        const leaveId = parseInt(String(req.params.id), 10);
        const { status } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updatedLeave = await approveLeaveRequest(leaveId, status);
        res.json(updatedLeave);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to update leave request",
        });
    }
}

export async function getLeaveRequests(req: Request, res: Response) {
    try {
        const leaves = await getAllLeaveRequests();
        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to fetch leave requests",
        });
    }
}
