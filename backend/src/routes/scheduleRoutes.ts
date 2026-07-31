import { Router } from "express";
import {
    getSchedule,
    getScheduleByID,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getMyCurrentShift,
    getPreviousEmployeeShift,
    getNextEmployeeShift,
    getCoworkers,
    getSchedulesInRange
} from "../controllers/scheduleController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();


router.get(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getSchedule
);

router.get(
    "/me",
    authenticate,
    getMyCurrentShift
);

router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createSchedule
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateSchedule
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteSchedule
);

router.get(
    "/me/current",
    authenticate,
    getMyCurrentShift
);

router.get(
    "/me/previous",
    authenticate,
    getPreviousEmployeeShift
);

router.get(
    "/me/next",
    authenticate,
    getNextEmployeeShift
);

router.get(
    "/me/coworkers",
    authenticate,
    getCoworkers
);

router.get(
    "/me/range",
    authenticate,
    getSchedulesInRange
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getScheduleByID
);

export default router;