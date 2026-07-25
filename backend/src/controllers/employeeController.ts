import { Request, Response } from "express";
import {
    getAllEmployees as getAllEmployeesService,
    getEmployeeById,
    createEmployee as createEmployeeService,
    updateEmployee as updateEmployeeService,
    deleteEmployee as deleteEmployeeService,
} from "../services/employeeService.js";

export async function getEmployees(req: Request, res: Response) {
    try {
        const employees = await getAllEmployeesService();
        res.json(employees);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch employees",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function createEmployee(req: Request, res: Response) {
    try {
        const { firstName, lastName, email, phoneNumber, hireDate, roleId, username, password } = req.body;

        if (!firstName || !lastName || !email || !hireDate || !roleId || !username || !password) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const employee = await createEmployeeService({
            firstName,
            lastName,
            email,
            phoneNumber,
            hireDate,
            roleId,
            username,
            password,
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create employee",
        });
    }
}

export async function updateEmployee(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const { firstName, lastName, email, phoneNumber, hireDate } = req.body;

        const employee = await updateEmployeeService(parseInt(id), {
            firstName,
            lastName,
            email,
            phoneNumber,
            hireDate,
        });

        res.json(employee);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to update employee",
        });
    }
}

export async function deleteEmployee(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };

        await deleteEmployeeService(parseInt(id));

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to delete employee",
        });
    }
}
