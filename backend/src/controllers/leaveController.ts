import { Request, Response } from "express";
import { 
    getMyLeaveRequests,
    createLeaveRequest,
    approveLeaveRequest
} from "../services/leaveService.js";

export async function getMyLeaves(req: Request, res: Response) {
    const leaves = await getMyLeaveRequests((req as any).user.employeeId);
    res.json(leaves);
}

export async function createLeave(req: Request, res: Response) {
    const { startDate, endDate, reason } = req.body;
    const employeeId = (req as any).user.employeeId;

    const leaveRequest = await createLeaveRequest(employeeId, startDate, endDate, reason);
    res.status(201).json(leaveRequest);
}

export async function approveLeave(req: Request, res: Response) {
    const leaveId = parseInt(req.params.id);
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const updatedLeave = await approveLeaveRequest(leaveId, status);
    res.json(updatedLeave);
}
