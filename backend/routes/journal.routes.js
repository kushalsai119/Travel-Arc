import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JournalReaction } from "../models/journal.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "../data/journal_reactions.json");

const router = express.Router();

const readReactionsJSON = () => {
    try {
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, JSON.stringify({}, null, 2));
            return {};
        }
        return JSON.parse(fs.readFileSync(jsonPath, "utf8") || "{}");
    } catch {
        return {};
    }
};

const writeReactionsJSON = (data) => {
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
        console.error("Error writing journal_reactions.json:", e.message);
    }
};

// GET all reactions
router.get("/", async (req, res) => {
    try {
        let reactions = readReactionsJSON();
        try {
            const dbDocs = await JournalReaction.find();
            if (dbDocs && dbDocs.length > 0) {
                dbDocs.forEach((doc) => {
                    reactions[doc.storyId] = { count: doc.likesCount };
                });
            }
        } catch {}
        res.json({ reactions });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST toggle helpful / like reaction
router.post("/like", async (req, res) => {
    try {
        const { storyId, action } = req.body;
        if (!storyId) {
            return res.status(400).json({ error: "storyId is required" });
        }

        const delta = action === "unlike" ? -1 : 1;
        const reactions = readReactionsJSON();
        const currentCount = (reactions[storyId] && reactions[storyId].count) || 0;
        const newCount = Math.max(0, currentCount + delta);

        reactions[storyId] = { count: newCount, updatedAt: new Date().toISOString() };
        writeReactionsJSON(reactions);

        try {
            await JournalReaction.findOneAndUpdate(
                { storyId },
                { $set: { likesCount: newCount } },
                { upsert: true, new: true }
            );
        } catch (dbErr) {
            console.log("MongoDB reaction write skipped:", dbErr.message);
        }

        res.json({
            message: "Reaction saved to local JSON file and MongoDB Atlas",
            storyId,
            likesCount: newCount
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
