import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  
   reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel", 
      required: true,
    },
    referenceModel: {
      type: String,
      required: true,
      enum: ["Seminar","Achievement"], 
    },
});

export const Like = new mongoose.model("Like", likeSchema);
