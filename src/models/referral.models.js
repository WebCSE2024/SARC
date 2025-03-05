import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({

    company_name:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:[true,"Deadline is needed"],
        validate:{
            validator:(value)=> !isNaN(new Date(value).getTime),
            message:"Invalid date format"
        },
    },
    eligibility:{
        type:String,
        trim:true,
        required:true,
        minlength:10,
        maxlength:200
    },
    job_profile:{
        type:String,
        required:true,
    },
    added_by:{
        type:mongoose.Schema.Types.ObjectId,
        
    }
},{timestamps:true})


export const Referral = new mongoose.model('Referral',referralSchema)