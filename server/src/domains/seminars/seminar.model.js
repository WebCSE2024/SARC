import mongoose from "mongoose";
import { NewsType } from "../../../../../shared/types/news.type.js";

const seminarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    speaker: {
      name: { type: String, required: true },
      designation: { type: String },
      organization: { type: String },
    },
    date: {
      type: Date,
      validate: {
        validator: (value) => !isNaN(new Date(value).getTime()),
        message: "Invalid date format",
      },
      required: true,
    },

    venue: {
      type: String,
      required: function () {
        return this.mode !== "Online";
      },
    },
    type: {
      type: String,
      enum: Object.values(NewsType),
      default: NewsType.SEMINAR,
      required: true,
    },
    // Add image field to store seminar poster/image
    image: {
      url: { type: String },
      publicId: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seminar", seminarSchema);
