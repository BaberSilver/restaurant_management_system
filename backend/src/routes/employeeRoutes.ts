import { Router } from "express";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

// Anyone logged in
router.get(
    "/",
    authenticate,
    getEmployees
);

// Admin + Manager
router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createEmployee
);

// Admin + Manager
router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateEmployee
);

// Administrator only
router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteEmployee
);

export default router;