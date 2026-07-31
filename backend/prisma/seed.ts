import { PrismaClient, RoleName, EmploymentStatus, ShiftStatus, LeaveStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Seeding database...");

    const passwordHash = await bcrypt.hash("Password123", 10);

    await prisma.leaveRequest.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.user.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.role.deleteMany();

    const roles = await Promise.all([
        prisma.role.upsert({
            where: { roleName: RoleName.ADMINISTRATOR },
            update: { description: "System Administrator" },
            create: { roleName: RoleName.ADMINISTRATOR, description: "System Administrator" },
        }),
        prisma.role.upsert({
            where: { roleName: RoleName.MANAGER },
            update: { description: "Restaurant Manager" },
            create: { roleName: RoleName.MANAGER, description: "Restaurant Manager" },
        }),
        prisma.role.upsert({
            where: { roleName: RoleName.CHEF },
            update: { description: "Chef" },
            create: { roleName: RoleName.CHEF, description: "Chef" },
        }),
        prisma.role.upsert({
            where: { roleName: RoleName.WAITER },
            update: { description: "Waiter" },
            create: { roleName: RoleName.WAITER, description: "Waiter" },
        }),
    ]);

    const roleMap = Object.fromEntries(roles.map((role) => [role.roleName, role]));

    const employees = await Promise.all([
        prisma.employee.upsert({
            where: { email: "admin@restaurant.com" },
            update: {
                firstName: "Ahmed",
                lastName: "Khan",
                phoneNumber: "03001234567",
                hireDate: new Date("2024-01-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
            create: {
                firstName: "Ahmed",
                lastName: "Khan",
                email: "admin@restaurant.com",
                phoneNumber: "03001234567",
                hireDate: new Date("2024-01-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
        }),
        prisma.employee.upsert({
            where: { email: "manager@restaurant.com" },
            update: {
                firstName: "Sarah",
                lastName: "Ali",
                phoneNumber: "03001234568",
                hireDate: new Date("2024-02-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
            create: {
                firstName: "Sarah",
                lastName: "Ali",
                email: "manager@restaurant.com",
                phoneNumber: "03001234568",
                hireDate: new Date("2024-02-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
        }),
        prisma.employee.upsert({
            where: { email: "chef@restaurant.com" },
            update: {
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "03001234569",
                hireDate: new Date("2024-03-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
            create: {
                firstName: "John",
                lastName: "Doe",
                email: "chef@restaurant.com",
                phoneNumber: "03001234569",
                hireDate: new Date("2024-03-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
        }),
        prisma.employee.upsert({
            where: { email: "waiter@restaurant.com" },
            update: {
                firstName: "Jane",
                lastName: "Smith",
                phoneNumber: "03001234570",
                hireDate: new Date("2024-04-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
            create: {
                firstName: "Jane",
                lastName: "Smith",
                email: "waiter@restaurant.com",
                phoneNumber: "03001234570",
                hireDate: new Date("2024-04-01"),
                employmentStatus: EmploymentStatus.ACTIVE,
            },
        }),
    ]);

    const employeeMap = Object.fromEntries(employees.map((employee) => [employee.email, employee]));

    await Promise.all([
        prisma.user.upsert({
            where: { username: "admin" },
            update: {
                passwordHash,
                roleId: roleMap[RoleName.ADMINISTRATOR].roleId,
                employeeId: employeeMap["admin@restaurant.com"].employeeId,
            },
            create: {
                username: "admin",
                passwordHash,
                roleId: roleMap[RoleName.ADMINISTRATOR].roleId,
                employeeId: employeeMap["admin@restaurant.com"].employeeId,
            },
        }),
        prisma.user.upsert({
            where: { username: "manager" },
            update: {
                passwordHash,
                roleId: roleMap[RoleName.MANAGER].roleId,
                employeeId: employeeMap["manager@restaurant.com"].employeeId,
            },
            create: {
                username: "manager",
                passwordHash,
                roleId: roleMap[RoleName.MANAGER].roleId,
                employeeId: employeeMap["manager@restaurant.com"].employeeId,
            },
        }),
        prisma.user.upsert({
            where: { username: "chef" },
            update: {
                passwordHash,
                roleId: roleMap[RoleName.CHEF].roleId,
                employeeId: employeeMap["chef@restaurant.com"].employeeId,
            },
            create: {
                username: "chef",
                passwordHash,
                roleId: roleMap[RoleName.CHEF].roleId,
                employeeId: employeeMap["chef@restaurant.com"].employeeId,
            },
        }),
        prisma.user.upsert({
            where: { username: "waiter" },
            update: {
                passwordHash,
                roleId: roleMap[RoleName.WAITER].roleId,
                employeeId: employeeMap["waiter@restaurant.com"].employeeId,
            },
            create: {
                username: "waiter",
                passwordHash,
                roleId: roleMap[RoleName.WAITER].roleId,
                employeeId: employeeMap["waiter@restaurant.com"].employeeId,
            },
        }),
    ]);

    const categories = await Promise.all([
        prisma.category.upsert({
            where: { categoryName: "Meat" },
            update: { description: "Fresh meat and poultry" },
            create: { categoryName: "Meat", description: "Fresh meat and poultry" },
        }),
        prisma.category.upsert({
            where: { categoryName: "Vegetables" },
            update: { description: "Fresh vegetables" },
            create: { categoryName: "Vegetables", description: "Fresh vegetables" },
        }),
        prisma.category.upsert({
            where: { categoryName: "Dairy" },
            update: { description: "Milk, cheese, and butter" },
            create: { categoryName: "Dairy", description: "Milk, cheese, and butter" },
        }),
        prisma.category.upsert({
            where: { categoryName: "Beverages" },
            update: { description: "Soft drinks, juices, and water" },
            create: { categoryName: "Beverages", description: "Soft drinks, juices, and water" },
        }),
    ]);

    const categoryMap = Object.fromEntries(categories.map((category) => [category.categoryName, category]));

    await prisma.inventory.createMany({
        data: [
            {
                categoryId: categoryMap["Meat"].categoryId,
                itemName: "Chicken Breast",
                quantity: 15,
                unit: "kg",
                minimumStock: 5,
            },
            {
                categoryId: categoryMap["Vegetables"].categoryId,
                itemName: "Tomatoes",
                quantity: 3,
                unit: "kg",
                minimumStock: 10,
            },
            {
                categoryId: categoryMap["Dairy"].categoryId,
                itemName: "Cheddar Cheese",
                quantity: 2,
                unit: "kg",
                minimumStock: 5,
            },
            {
                categoryId: categoryMap["Beverages"].categoryId,
                itemName: "Sparkling Water",
                quantity: 24,
                unit: "bottles",
                minimumStock: 8,
            },
            {
                categoryId: categoryMap["Vegetables"].categoryId,
                itemName: "Onions",
                quantity: 8,
                unit: "kg",
                minimumStock: 6,
            },
        ],
    });

    await prisma.schedule.createMany({
        data: [
            {
                employeeId: employeeMap["admin@restaurant.com"].employeeId,
                workDate: new Date("2026-07-27"),
                shiftStart: new Date("2026-07-27T09:00:00"),
                shiftEnd: new Date("2026-07-27T17:00:00"),
                shiftStatus: ShiftStatus.SCHEDULED,
            },
            {
                employeeId: employeeMap["manager@restaurant.com"].employeeId,
                workDate: new Date("2026-07-27"),
                shiftStart: new Date("2026-07-27T10:00:00"),
                shiftEnd: new Date("2026-07-27T18:00:00"),
                shiftStatus: ShiftStatus.SCHEDULED,
            },
            {
                employeeId: employeeMap["chef@restaurant.com"].employeeId,
                workDate: new Date("2026-07-27"),
                shiftStart: new Date("2026-07-27T11:00:00"),
                shiftEnd: new Date("2026-07-27T19:00:00"),
                shiftStatus: ShiftStatus.SCHEDULED,
            },
            {
                employeeId: employeeMap["waiter@restaurant.com"].employeeId,
                workDate: new Date("2026-07-27"),
                shiftStart: new Date("2026-07-27T13:00:00"),
                shiftEnd: new Date("2026-07-27T21:00:00"),
                shiftStatus: ShiftStatus.SCHEDULED,
            },
            {
                employeeId: employeeMap["manager@restaurant.com"].employeeId,
                workDate: new Date("2026-07-28"),
                shiftStart: new Date("2026-07-28T10:00:00"),
                shiftEnd: new Date("2026-07-28T18:00:00"),
                shiftStatus: ShiftStatus.SCHEDULED,
            },
        ],
    });

    await prisma.leaveRequest.createMany({
        data: [
            {
                employeeId: employeeMap["manager@restaurant.com"].employeeId,
                startDate: new Date("2026-07-28"),
                endDate: new Date("2026-07-29"),
                reason: "Medical Appointment",
                status: LeaveStatus.APPROVED,
            },
            {
                employeeId: employeeMap["admin@restaurant.com"].employeeId,
                startDate: new Date("2026-08-01"),
                endDate: new Date("2026-08-02"),
                reason: "Family Event",
                status: LeaveStatus.PENDING,
            },
            {
                employeeId: employeeMap["chef@restaurant.com"].employeeId,
                startDate: new Date("2026-08-05"),
                endDate: new Date("2026-08-06"),
                reason: "Personal Leave",
                status: LeaveStatus.PENDING,
            },
        ],
    });

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });