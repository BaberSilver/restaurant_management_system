import prisma from "../config/prisma.js";

export async function getAllInventory() {
    return await prisma.inventory.findMany({
        include: {
            category: true,
        },
    });
}

export async function getInventoryById(itemId: number) {
    return await prisma.inventory.findUnique({
        where: { itemId },
        include: {
            category: true,
        },
    });
}

export async function createInventory(data: {
    itemName: string;
    categoryId: number;
    quantity: number;
    unit: string;
    minimumStock: number;
}) {
    return await prisma.inventory.create({
        data: {
            itemName: data.itemName,
            categoryId: data.categoryId,
            quantity: data.quantity,
            unit: data.unit,
            minimumStock: data.minimumStock,
        },
        include: {
            category: true,
        },
    });
}

export async function updateInventory(
    itemId: number,
    data: {
        itemName?: string;
        quantity?: number;
        unit?: string;
        minimumStock?: number;
    }
) {
    return await prisma.inventory.update({
        where: { itemId },
        data: {
            ...(data.itemName && { itemName: data.itemName }),
            ...(data.quantity !== undefined && { quantity: data.quantity }),
            ...(data.unit && { unit: data.unit }),
            ...(data.minimumStock !== undefined && { minimumStock: data.minimumStock }),
        },
        include: {
            category: true,
        },
    });
}

export async function deleteInventory(itemId: number) {
    const item = await prisma.inventory.findUnique({
        where: { itemId },
    });

    if (!item) {
        throw new Error("Inventory item not found");
    }

    return await prisma.inventory.delete({
        where: { itemId },
    });
}
