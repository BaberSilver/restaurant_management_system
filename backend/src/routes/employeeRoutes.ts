import { Router } from "express";
import {
    getEmployees,
    getMyEmployee,
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
    "/me",
    authenticate,
    getMyEmployee
);

router.get(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getEmployees
);

router.get(
    "/search",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getEmployeeByNameOrHireDate
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getEmployeeById
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