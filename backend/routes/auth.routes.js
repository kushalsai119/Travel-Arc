import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { User } from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, "../data/users.json");

const router = express.Router();

function getUsers() {
    try {
        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, "[]");
            return [];
        }
        return JSON.parse(fs.readFileSync(jsonFilePath, "utf8") || "[]");
    } catch {
        return [];
    }
}

function saveUsers(data) {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    } catch {}
}

// 1. SIGNUP (matches sir's lecture)
router.post("/signup", async (req, res) => {
    const { username, password, age, city } = req.body;

    let users = getUsers();
    let existing = users.find((item) => item.username === username);
    if (existing) {
        return res.status(400).json({ msg: "User already exists!" });
    }

    const newUser = { username, password, age, city };
    users.push(newUser);
    saveUsers(users);

    try {
        await User.create(newUser);
    } catch {}

    return res.status(200).json({ msg: "signup successful" });
});

// 2. LOGIN (exact code from sir's screen)
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    let users = getUsers();
    let user = users.find((item) => item.username === username);

    if (user) {
        if (user.password === password) {
            return res.status(200).json({ msg: "user authenticated!" });
        } else {
            return res.status(200).json({ msg: "password incorrect!" });
        }
    } else {
        return res.status(200).json({ msg: "Username not exist" });
    }
});

// 3. GET USERS
router.get("/users", (req, res) => {
    return res.status(200).json(getUsers());
});

export default router;
