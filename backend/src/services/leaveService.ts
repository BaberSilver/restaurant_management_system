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