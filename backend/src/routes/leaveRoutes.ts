import { Router } from "express";
import {
    getMyLeaves,
    createLeave,
    approveLeave
} from "../controllers/leaveController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get(
    "/me",
    authenticate,
    getMyLeaves
);

router.post(
    "/",
    authenticate,
    createLeave
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    approveLeave
);