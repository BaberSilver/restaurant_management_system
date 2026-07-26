import { Router } from "express";
import {
    getEmployees,
    getEmployeeById,
    getEmployeeByNameOrHireDate,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getEmployees,
    getEmployeeById,
    getEmployeeByNameOrHireDate
);

router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createEmployee
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateEmployee
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteEmployee
);


export default router;