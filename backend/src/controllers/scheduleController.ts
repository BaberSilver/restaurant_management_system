import { Request, Response } from "express";
import {
    getAllSchedules as getAllScheduleItems,
    getScheduleById,
    createSchedule as createScheduleItem,
    updateSchedule as updateScheduleItem,
    deleteSchedule as deleteScheduleItem,
} from "../services/scheduleService.js";

export async function getSchedule(req: Request, res: Response) {
    try {
        const schedules = await getAllScheduleItems();
        res.json(schedules);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch schedules",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function createSchedule(req: Request, res: Response) {
    try {
        const { employeeId, workDate, shiftStart, shiftEnd, shiftStatus } = req.body;

        if (!employeeId || !workDate || !shiftStart || !shiftEnd) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const schedule = await createScheduleItem({
            employeeId,
            workDate,
            shiftStart,
            shiftEnd,
            shiftStatus,
        });

        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create schedule",
        });
    }
}

export async function updateSchedule(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const { workDate, shiftStart, shiftEnd, shiftStatus } = req.body;

        const schedule = await updateScheduleItem(parseInt(id), {
            workDate,
            shiftStart,
            shiftEnd,
            shiftStatus,
        });

        res.json(schedule);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to update schedule",
        });
    }
}

export async function deleteSchedule(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };

        await deleteScheduleItem(parseInt(id));

        res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to delete schedule",
        });
    }
}
