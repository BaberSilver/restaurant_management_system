import prisma from "../config/prisma.js";
import { ShiftStatus } from "@prisma/client";

export async function getAllSchedules() {
    return prisma.schedule.findMany({
        include: {
            employee: true,
        },
    });
}

export async function getScheduleById(scheduleId: number) {
    return prisma.schedule.findUnique({
        where: { scheduleId },
        include: {
            employee: true,
        },
    });
}

export async function createSchedule(data: {
    employeeId: number;
    workDate: Date;
    shiftStart: Date;
    shiftEnd: Date;
    shiftStatus?: ShiftStatus;
}) {
    return prisma.schedule.create({
        data: {
            employeeId: data.employeeId,
            workDate: data.workDate,
            shiftStart: data.shiftStart,
            shiftEnd: data.shiftEnd,
            shiftStatus: data.shiftStatus ?? ShiftStatus.SCHEDULED,
        },
        include: {
            employee: true,
        },
    });
}

export async function updateSchedule(
    scheduleId: number,
    data: {
        workDate?: Date;
        shiftStart?: Date;
        shiftEnd?: Date;
        shiftStatus?: ShiftStatus;
    }
) {
    return prisma.schedule.update({
        where: { scheduleId },
        data: {
            ...(data.workDate && { workDate: data.workDate }),
            ...(data.shiftStart && { shiftStart: data.shiftStart }),
            ...(data.shiftEnd && { shiftEnd: data.shiftEnd }),
            ...(data.shiftStatus && { shiftStatus: data.shiftStatus }),
        },
        include: {
            employee: true,
        },
    });
}

export async function deleteSchedule(scheduleId: number) {
    return prisma.schedule.delete({
        where: {
            scheduleId,
        },
    });
}