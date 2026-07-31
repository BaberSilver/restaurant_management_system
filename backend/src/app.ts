import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Restaurant Management API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaves", leaveRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;