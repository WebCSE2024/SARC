import mongoose from "mongoose";

const seminarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    speaker: {
      name: { type: String, required: true },
      designation: { type: String },
      organization: { type: String },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },

    venue: {
      type: String,
    },
    imageUrl: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seminar", seminarSchema);
