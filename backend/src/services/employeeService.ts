import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export async function getAllEmployees() {
    return await prisma.employee.findMany({
        include: {
            user: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });
}

export async function getEmployeeById(employeeId: number) {
    return await prisma.employee.findUnique({
        where: { employeeId },
        include: {
            user: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });
}

export async function getEmployeeByNameOrHireDate(name?: string, hireDate?: Date) {
    const whereClause: any = {};

    if (name) {
        whereClause.OR = [
            { firstName: { contains: name, mode: "insensitive" } },
            { lastName: { contains: name, mode: "insensitive" } },
        ];
    }

    if (hireDate) {
        whereClause.hireDate = hireDate;
    }

    return await prisma.employee.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });
}

export async function createEmployee(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    hireDate: Date;
    roleId: number;
    username: string;
    password: string;
}) {
    const existingUser = await prisma.user.findUnique({
        where: { username: data.username },
    });

    if (existingUser) {
        throw new Error("Username already exists");
    }

    const existingEmail = await prisma.employee.findFirst({
        where: { email: data.email },
    });

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const employee = await prisma.employee.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            hireDate: new Date(data.hireDate),
            user: {
                create: {
                    username: data.username,
                    passwordHash,
                    roleId: data.roleId,
                },
            },
        },
        include: {
            user: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });

    return employee;
}

export async function updateEmployee(
    employeeId: number,
    data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        hireDate?: Date;
    }
) {
    return await prisma.employee.update({
        where: { employeeId },
        data: {
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.email && { email: data.email }),
            ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
            ...(data.hireDate && { hireDate: new Date(data.hireDate) }),
        },
        include: {
            user: {
                select: {
                    username: true,
                    role: true,
                },
            },
        },
    });
}

export async function deleteEmployee(employeeId: number) {
    const employee = await prisma.employee.findUnique({
        where: { employeeId },
    });

    if (!employee) {
        throw new Error("Employee not found");
    }

    await prisma.user.deleteMany({
        where: { employeeId },
    });

    return await prisma.employee.delete({
        where: { employeeId },
    });
}