import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  repliedBy: {
      userid:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      },
      username:{
        type:String,
        required:true
      }
    },
}, { timestamps: true });

export const Reply = new mongoose.model("Reply", replySchema);
