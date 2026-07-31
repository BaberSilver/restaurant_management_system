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
    getInventory
);

router.get(
    "/low-stock",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER", "CHEF"),
    getLowStockItems
);

router.get(
    "/category/:categoryId",
    authenticate,
    getInventoryByCategoryId
);

router.get(
    "/count/:categoryId",
    authenticate,
    authorize("ADMINISTRATOR", "MANAGER"),
    getInventoryCountByCategoryId
);

router.get(
    "/:id",
    authenticate,
    getInventoryById
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