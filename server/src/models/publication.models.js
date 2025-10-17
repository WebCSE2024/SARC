import mongoose from "mongoose";

const PublicationEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    publicationType: {
      type: String,
      trim: true,
    },
    publisherName: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1900,
      max: 2100,
    },
    volume: {
      type: String,
      trim: true,
    },
    issue: {
      type: String,
      trim: true,
    },
    pages: {
      type: String,
      trim: true,
    },
    issn: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: true, timestamps: false }
);

const PublicationSchema = new mongoose.Schema(
  {
    ownerAuthId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    ownerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING_REVIEW", "FINALIZED"],
      default: "PENDING_REVIEW",
    },
    entries: {
      type: [PublicationEntrySchema],
      default: [],
    },
    finalizedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Publication = mongoose.model("Publication", PublicationSchema);
