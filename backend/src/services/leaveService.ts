import prisma from "../config/prisma.js";

export async function getMyLeaveRequests(employeeId: number) {
    return prisma.leaveRequest.findMany({
        where: {
            employeeId
        },
        orderBy: {
            startDate: "desc"
        }
    });
}

export async function createLeaveRequest(
    employeeId: number,
    startDate: string,
    endDate: string,
    reason: string
) {
    return prisma.leaveRequest.create({
        data: {
            employeeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING",
        },
        include: {
            employee: true,
        },
    });
}

export async function approveLeaveRequest(
    leaveRequestId: number,
    status: "APPROVED" | "REJECTED"
) {
    return prisma.leaveRequest.update({
        where: {
            leaveRequestId,
        },
        data: {
            status,
        },
        include: {
            employee: true,
        },
    });
}

export async function getAllLeaveRequests() {
    return prisma.leaveRequest.findMany({
        include: {
            employee: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getEmployeesOnLeave() {

    const today = new Date();

    return prisma.leaveRequest.findMany({

        where: {

            status: "APPROVED",

            startDate: {
                lte: today
            },

            endDate: {
                gte: today
            }
        },

        include: {

            employee: true
        }
    });
}

export async function getUpcomingLeave() {

    return prisma.leaveRequest.findMany({

        where: {

            status: "APPROVED",

            startDate: {
                gt: new Date()
            }
        },

        include: {

            employee: true
        },

        orderBy: {

            startDate: "asc"
        }
    });
}