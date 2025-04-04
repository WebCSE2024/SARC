import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({

  achievementId:{
    type:String,
    required:true,
    unique:true
  },
  
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
      type:String,
      required: true,
    },

    initiative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Initiative", // Belongs to which initiative (e.g., WebCSE, CSAI)
    },
    
    tags: [
      {
        type:String
      }
    ], // For category
    gallery: [
     {
      url:{
        type:String,
        required:true
      },
      publicId:{
        type:String,
        required:true
      }
     }
    ], 
    socialMediaLinks: [
      {
        platform: String,
        url: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
