import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import bookingRoutes from "./routes/booking.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import journalRoutes from "./routes/journal.routes.js";
import authRoutes from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from travelarc root
app.use(express.static(rootDir));

// API Routes
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/", authRoutes);

// API Health Check
app.get("/api/v1/status", (req, res) => {
    res.json({
        status: "OK",
        project: "TravelArc — Multi-Page Travel Platform",
        evaluation: "Web Programming 3rd Evaluation",
        features: [
            "1. External API (Open-Meteo Weather)",
            "2. Node + Express Server",
            "3. Local JSON File Sync (backend/data/bookings.json)",
            "4. MongoDB Atlas Mongoose CRUD"
        ]
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` TravelArc Server is live at: http://localhost:${PORT}`);
    console.log(` Web App:   http://localhost:${PORT}/index.html`);
    console.log(` Bookings:  http://localhost:${PORT}/booking.html`);
    console.log(` Places:    http://localhost:${PORT}/places.html`);
    console.log(` API Check: http://localhost:${PORT}/api/v1/status`);
    console.log(`======================================================\n`);
});

