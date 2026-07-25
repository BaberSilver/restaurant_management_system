import { Router } from "express";
import {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory
} from "../controllers/inventoryController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

// Anyone logged in
router.get(
    "/",
    authenticate,
    getInventory
);

// Admin + Manager
router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createInventory
);

// Admin + Manager
router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateInventory
);

// Administrator only
router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteInventory
);

export default router;