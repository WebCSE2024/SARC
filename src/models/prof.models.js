import mongoose from "mongoose";

const profSchema = new mongoose.Schema({

    full_name: { type: String, required: true, trim: true },
    linkedIn: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    role:{type:String,default:"PROFESSOR"}
},{timestamps:true})

export const Prof=new mongoose.model("Prof",profSchema)