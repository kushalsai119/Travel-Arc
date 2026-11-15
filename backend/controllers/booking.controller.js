import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Booking } from "../models/booking.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, "../data/bookings.json");

// Helper: read local JSON file
const readJSONFile = () => {
    try {
        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(jsonFilePath, "utf8");
        return JSON.parse(data || "[]");
    } catch (err) {
        console.error("Error reading bookings.json:", err.message);
        return [];
    }
};

// Helper: write to local JSON file
const writeJSONFile = (data) => {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        console.error("Error writing to bookings.json:", err.message);
    }
};

// 1. CREATE a new booking (POST /api/v1/bookings)
export const createBooking = async (req, res) => {
    try {
        const { customerName, email, phone, destination, guide, guests, totalCost, travelDate } = req.body;

        if (!customerName || !email || !phone || !destination || !travelDate) {
            return res.status(400).json({ error: "Missing required booking details." });
        }

        const bookingId = "TRV-" + Math.floor(1000 + Math.random() * 9000);

        const bookingData = {
            bookingId,
            customerName,
            email,
            phone,
            destination,
            guide: guide || "Any Verified Guide",
            guests: Number(guests) || 1,
            totalCost: totalCost || "₹5,000",
            travelDate,
            status: "Confirmed",
            createdAt: new Date().toISOString()
        };

        // Save to Local JSON file (Parameter 3)
        const localList = readJSONFile();
        localList.unshift(bookingData);
        writeJSONFile(localList);

        // Save to MongoDB (Parameter 4)
        let mongoDoc = null;
        try {
            mongoDoc = await Booking.create(bookingData);
        } catch (dbErr) {
            console.log("MongoDB write skipped/failed, saved to JSON file:", dbErr.message);
        }

        return res.status(201).json({
            message: "Booking created successfully",
            booking: mongoDoc || bookingData,
            storage: {
                jsonFile: "Saved in backend/data/bookings.json",
                database: mongoDoc ? "Saved in MongoDB Atlas" : "Local JSON only"
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 2. READ all bookings (GET /api/v1/bookings)
export const getAllBookings = async (req, res) => {
    try {
        let bookings = [];

        // Try MongoDB first
        try {
            bookings = await Booking.find().sort({ createdAt: -1 });
        } catch (dbErr) {
            console.log("MongoDB read failed, falling back to JSON:", dbErr.message);
        }

        // If MongoDB is empty or failed, fetch from local JSON file
        if (!bookings || bookings.length === 0) {
            bookings = readJSONFile();
        }

        return res.status(200).json({
            count: bookings.length,
            bookings
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 3. READ single booking by ID (GET /api/v1/bookings/:id)
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        let booking = null;

        try {
            booking = await Booking.findOne({ bookingId: id });
        } catch (dbErr) {
            // Ignore DB error and fallback
        }

        if (!booking) {
            const list = readJSONFile();
            booking = list.find((b) => b.bookingId === id || b._id === id);
        }

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        return res.status(200).json({ booking });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 4. UPDATE booking status or details (PUT /api/v1/bookings/:id)
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Update in MongoDB
        let updatedMongo = null;
        try {
            updatedMongo = await Booking.findOneAndUpdate(
                { bookingId: id },
                { $set: updates },
                { new: true }
            );
        } catch (dbErr) {
            console.log("MongoDB update error:", dbErr.message);
        }

        // Update in local JSON file
        const list = readJSONFile();
        const index = list.findIndex((b) => b.bookingId === id);
        if (index !== -1) {
            list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
            writeJSONFile(list);
        }

        if (!updatedMongo && index === -1) {
            return res.status(404).json({ error: "Booking not found to update" });
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            booking: updatedMongo || list[index]
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 5. DELETE a booking (DELETE /api/v1/bookings/:id)
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from MongoDB
        try {
            await Booking.findOneAndDelete({ bookingId: id });
        } catch (dbErr) {
            console.log("MongoDB delete error:", dbErr.message);
        }

        // Delete from local JSON file
        const list = readJSONFile();
        const updatedList = list.filter((b) => b.bookingId !== id && b._id !== id);
        writeJSONFile(updatedList);

        return res.status(200).json({
            message: `Booking #${id} deleted successfully from database and local JSON`
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
