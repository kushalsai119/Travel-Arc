import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"]
        },
        destination: {
            type: String,
            required: [true, "Destination is required"]
        },
        guide: {
            type: String,
            default: "Any Verified Guide"
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        totalCost: {
            type: String,
            required: true
        },
        travelDate: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Confirmed", "Pending", "Cancelled"],
            default: "Confirmed"
        }
    },
    {
        timestamps: true
    }
);

export const Booking = mongoose.model("Booking", bookingSchema);
