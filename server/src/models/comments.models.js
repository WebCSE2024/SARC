import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentedBy: {
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
 
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "referenceModel",
    required: true,
  },
  referenceModel: {
    type: String,
    required: true,
    enum: ["Achievement","Seminar"], 
  },
  content: {
    type: String,
    required: true,
  },
  
});

export const Comment = new mongoose.model("Comment", commentSchema);

