import mongoose from "mongoose";
import { NewsType } from "../../../../shared/types/news.type.js";


const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date, // Date on which the achievement occurred
      required: true,
    },
    awardedTo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NewsType),
      default: NewsType.ACHIEVEMENT,
      required: true,
    },
    gallery: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
