import mongoose from "mongoose";

const applyReferralSchema=new mongoose.Schema({

    applied_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    referral_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Referral',
        required:true
    },
    applied_on:{
        type:Date,
        required:true,
        validate:{
            validator:(value)=> !isNaN(new Date(value).getTime()),
            message:"Invalid date format"
        },
    }
})

export const ApplyReferral = new mongoose.model('ApplyReferral',applyReferralSchema)