import mongoose from "mongoose";
import {UserType} from "../../../../shared/types/user.type.js"

//MCP: User modal defined only to store the metadata of the user


const UserSchema = new mongoose.Schema({
  userId : {
    // This userId is the _id of the user in the database in the auth-system microservice
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userType: {
    // This userType is the type of the user in the auth-system microservice
    type: String,
    enum: Object.values(UserType),
    required: true,
  },
  referralPosted: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  referralApplied: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  publicationPosted: [{
    type: mongoose.Schema.Types.ObjectId,
  }]

  //MCP: Add more fields for Commenting and Replying
});

export const User = new mongoose.model("User", UserSchema);
