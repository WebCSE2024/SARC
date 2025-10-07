import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema(
  {
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    publicationURL: {
      type: String,
      required: true,
    },
    previewPages: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

export const Publication = mongoose.model("Publication", PublicationSchema);
