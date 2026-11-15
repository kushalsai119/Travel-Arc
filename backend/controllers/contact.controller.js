import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Contact } from "../models/contact.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, "../data/contacts.json");

const readJSONFile = () => {
    try {
        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(jsonFilePath, "utf8");
        return JSON.parse(data || "[]");
    } catch {
        return [];
    }
};

const writeJSONFile = (data) => {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        console.error("Error writing contacts.json:", err.message);
    }
};

export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required." });
        }

        const contactData = {
            id: Date.now().toString(),
            name,
            email,
            subject: subject || "General Inquiry",
            message,
            createdAt: new Date().toISOString()
        };

        // Write to local JSON file
        const list = readJSONFile();
        list.unshift(contactData);
        writeJSONFile(list);

        // Write to MongoDB
        let doc = null;
        try {
            doc = await Contact.create({ name, email, subject, message });
        } catch (dbErr) {
            console.log("MongoDB write error:", dbErr.message);
        }

        return res.status(201).json({
            message: "Inquiry received successfully",
            contact: doc || contactData
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        let contacts = [];
        try {
            contacts = await Contact.find().sort({ createdAt: -1 });
        } catch {}

        if (!contacts || contacts.length === 0) {
            contacts = readJSONFile();
        }

        return res.status(200).json({ count: contacts.length, contacts });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
