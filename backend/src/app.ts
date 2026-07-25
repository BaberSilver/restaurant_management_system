import express from "express";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Restaurant Management API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/schedules", scheduleRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;