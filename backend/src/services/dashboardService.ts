import prisma from "../config/prisma.js";

import {
    getMyShift,
    getPreviousShift,
    getNextShift,
    getCoworkersOnDuty,
} from "./scheduleService.js";

import {
    getMyLeaveRequests,
} from "./leaveService.js";

export async function getEmployeeDashboard(userId: number) {

    const user = await prisma.user.findUnique({
        where: { userId },
        include: {
            role: true,
            employee: true,
        },
    });

    if (!user || !user.employee) {
        throw new Error("User not found");
    }

    const employeeId = user.employee.employeeId;

    const myShift = await getMyShift(employeeId);
    const previousShift = await getPreviousShift(employeeId);
    const nextShift = await getNextShift(employeeId);
    const coworkersOnDuty = await getCoworkersOnDuty(employeeId);

    const leaveRequests = await getMyLeaveRequests(employeeId);

    const alerts: string[] = [];

    if (myShift) {
        alerts.push("You have a shift scheduled today.");
    }

    const pendingLeave = leaveRequests.find(
        leave => leave.status === "PENDING"
    );

    if (pendingLeave) {
        alerts.push("You have a pending leave request.");
    }

    return {
        profile: {
            employeeId: user.employee.employeeId,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            email: user.employee.email,
            phoneNumber: user.employee.phoneNumber,
            hireDate: user.employee.hireDate,
            employmentStatus: user.employee.employmentStatus,
        },

        role: user.role.roleName,

        schedule: {
            today: myShift,
            previous: previousShift,
            next: nextShift,
            coworkersOnDuty,
        },

        leaveRequests,

        alerts,
    };
}