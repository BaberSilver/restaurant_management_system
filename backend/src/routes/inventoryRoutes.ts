import { Router } from "express";
import {
    getInventory,
    getInventoryByCategoryId,
    getInventoryById,
    getInventoryCountByCategoryId,
    createInventory,
    updateInventory,
    deleteInventory,
    getLowStockItems,
} from "../controllers/inventoryController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getInventory,
    getInventoryByCategoryId,
    getInventoryById,
    getInventoryCountByCategoryId,
);

router.get(
    "/low-stock",
    authenticate,
    authorize(
        "ADMINISTRATOR",
        "MANAGER",
        "CHEF",
        "COOK"
    ),
    getLowStockItems
);

router.post(
    "/",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    createInventory
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    updateInventory
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMINISTRATOR"),
    deleteInventory
);

export default router;