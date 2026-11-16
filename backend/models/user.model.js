import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    city: { type: String }
});

export const User = mongoose.model("User", userSchema);
