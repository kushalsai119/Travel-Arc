import mongoose from "mongoose";

const journalReactionSchema = new mongoose.Schema(
    {
        storyId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        likesCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const JournalReaction = mongoose.model("JournalReaction", journalReactionSchema);
