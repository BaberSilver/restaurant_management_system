import prisma from "../config/prisma.js";

export async function getEmployeeDashboard(userId: number) {
    const user = await prisma.user.findUnique({
        where: { userId },
        include: {
            role: true,
            employee: {
                include: {
                    schedules: {
                        where: {
                            workDate: {
                                gte: new Date()
                            }
                        },
                        orderBy: {
                            workDate: "asc"
                        },
                        take: 5
                    }
                }
            }
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const today = new Date();

    const todayShift = user.employee?.schedules.find(schedule => {
        const workDate = new Date(schedule.workDate);

        return (
            workDate.getFullYear() === today.getFullYear() &&
            workDate.getMonth() === today.getMonth() &&
            workDate.getDate() === today.getDate()
        );
    });

    const alerts: string[] = [];

    if (todayShift) {
        alerts.push("You have a shift scheduled today.");
    }

    return {
        profile: {
            employeeId: user.employee?.employeeId,
            firstName: user.employee?.firstName,
            lastName: user.employee?.lastName,
            email: user.employee?.email,
            phoneNumber: user.employee?.phoneNumber,
            hireDate: user.employee?.hireDate,
            employmentStatus: user.employee?.employmentStatus
        },

        role: user.role.roleName,

        upcomingShifts: user.employee?.schedules,

        alerts
    };
}