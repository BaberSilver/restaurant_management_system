import { Request, Response } from "express";
import {
    getAllInventory as getAllInventoryItems,
    getInventoryById as getInventoryItemById,
    createInventory as createInventoryItem,
    updateInventory as updateInventoryItem,
    deleteInventory as deleteInventoryItem,
    getInventoryByCategoryId as getInventoryItemsByCategoryId,
    getInventoryCountByCategoryId as getInventoryItemsCountByCategoryId,
    getLowStockItems as getLowStockInventoryItems,

} from "../services/inventoryService.js";

export async function getInventory(req: Request, res: Response) {
    try {
        const inventory = await getAllInventoryItems();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function getInventoryById(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const item = await getInventoryItemById(parseInt(id));

        if (!item) {
            return res.status(404).json({
                message: "Inventory item not found",
            });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory item",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function getInventoryByCategoryId(req: Request, res: Response) {
    try {
        const { categoryId } = req.params as { categoryId: string };
        const items = await getInventoryItemsByCategoryId(parseInt(categoryId));

        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory items by category",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function getInventoryCountByCategoryId(req: Request, res: Response) {
    try {
        const { categoryId } = req.params as { categoryId: string };
        const count = await getInventoryItemsCountByCategoryId(parseInt(categoryId));

        res.json({ count });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory count by category",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export async function createInventory(req: Request, res: Response) {
    try {
        const { itemName, categoryId, quantity, unit, minimumStock } = req.body;

        if (!itemName || !categoryId || quantity === undefined || !unit || minimumStock === undefined) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        const item = await createInventoryItem({
            itemName,
            categoryId,
            quantity,
            unit,
            minimumStock,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create inventory item",
        });
    }
}

export async function updateInventory(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };
        const { itemName, quantity, unit, minimumStock } = req.body;

        const item = await updateInventoryItem(parseInt(id), {
            itemName,
            quantity,
            unit,
            minimumStock,
        });

        res.json(item);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to update inventory item",
        });
    }
}

export async function deleteInventory(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string };

        await deleteInventoryItem(parseInt(id));

        res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to delete inventory item",
        });
    }
}

export async function getLowStockItems(req: Request, res: Response) {
    try {
        const lowStockItems = await getLowStockInventoryItems();
        res.json(lowStockItems);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch low stock inventory items",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}