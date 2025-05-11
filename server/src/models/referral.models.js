import mongoose from "mongoose";
import {
  ReferralMode,
  ReferralStatus,
} from "../../../../shared/types/referral.type.js";

const referralSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is needed"],
      validate: {
        validator: (value) => !isNaN(new Date(value).getTime()),
        message: "Invalid date format",
      },
    },
    // eligibleYears:[{
    //     type:String,
    //     required:true
    // }],
    // referralId:{
    //     type:String,
    //     required:true,
    //     unique:true
    // },
    jobProfile: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    requirements: {
      type: String,
      maxlength: [700, "Requirements should be less than 700 characters"],
      minlength: [15, "Requirements should be more than 10 characters"],
      required: true,
    },
    stipend: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    mode: {
      type: String,
      enum: Object.values(ReferralMode),
      default: ReferralMode.REMOTE,
    },
    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
    },

    message: {
      type: String, //any message on actions from admin-portal, only visible to alumni who posted
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Referral = new mongoose.model("Referral", referralSchema);
