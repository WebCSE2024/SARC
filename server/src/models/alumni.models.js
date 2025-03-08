import mongoose from "mongoose";


const alumniSchema = new mongoose.Schema({
    full_name: { type: String, required: true, trim: true },
    linkedIn: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    role: { type: String, default: "ALUMNI", required: true },
    current_workplace: { type: String, required: true },
    position: { type: String, required: true }
});

export const Alumni = mongoose.model("Alumni", alumniSchema);
