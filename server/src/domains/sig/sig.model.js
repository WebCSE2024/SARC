import mongoose from "mongoose";
import { SIGType } from "../../../../../shared/types/user.type.js";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Project date is required"],
    },
    year: {
      type: String,
      required: [true, "Batch year is required"],
      trim: true,
      // Format: "2024-25", "2025-26", etc.
    },
    sigId: {
      type: String,
      required: [true, "SIG ID is required"],
      enum: Object.values(SIGType),
      index: true,
    },
    media: {
      type: {
        type: String,
        enum: ["image", "video", "gif"],
      },
      url: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

// Index for efficient queries
ProjectSchema.index({ sigId: 1, year: -1 });

const SIGSchema = new mongoose.Schema(
  {
    sigId: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(SIGType),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
export const SIG = mongoose.model("SIG", SIGSchema);
