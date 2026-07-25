import { Router } from "express";
import {
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from "../controllers/scheduleController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

// Anyone logged in
router.get(
    "/",
    authenticate,
    getSchedule
);

// Admin + Manager
router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createSchedule
);

// Admin + Manager
router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateSchedule
);

// Administrator only
router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteSchedule
);

export default router;