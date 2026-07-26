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


export async function getMyShift(employeeId: number) {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.schedule.findFirst({
        where: {
            employeeId,
            workDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            employee: true,
        },
    });
}

export async function getPreviousShift(employeeId: number) {
    return prisma.schedule.findFirst({
        where: {
            employeeId,
            workDate: {
                lt: new Date(),
            },
        },
        orderBy: {
            workDate: "desc",
        },
        include: {
            employee: true,
        },
    });
}


export async function getNextShift(employeeId: number) {
    return prisma.schedule.findFirst({
        where: {
            employeeId,
            workDate: {
                gt: new Date(),
            },
        },
        orderBy: {
            workDate: "asc",
        },
        include: {
            employee: true,
        },
    });
}


export async function getCoworkersOnDuty(employeeId: number) {
    const myShift = await getMyShift(employeeId);

    if (!myShift) {
        return [];
    }

    const startOfDay = new Date(myShift.workDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(myShift.workDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.schedule.findMany({
        where: {
            employeeId: {
                not: employeeId,
            },
            workDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            employee: true,
        },
        orderBy: {
            shiftStart: "asc",
        },
    });
}


export async function getSchedulesBetweenDates(
    employeeId: number,
    startDate: Date,
    endDate: Date
) {
    return prisma.schedule.findMany({
        where: {
            employeeId,
            workDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            employee: true,
        },
        orderBy: {
            workDate: "asc",
        },
    });
}