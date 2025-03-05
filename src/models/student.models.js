import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    full_name: { type: String, required: true, trim: true },
    linkedIn: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    role: { type: String, default:"STUDENT", required: true },
    grad_yr: { type: Number, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
