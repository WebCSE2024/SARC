import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({

    companyName:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:[true,"Deadline is needed"],
        validate:{
            validator:(value)=> !isNaN(new Date(value).getTime()),
            message:"Invalid date format"
        },
    },
    eligibleYears:[{
        type:String,
        required:true
    }],
    referralId:{
        type:String,
        required:true,
        unique:true
    },
    jobProfile:{
        type:String,
        required:true,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Alumni',
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    stipend:{
        amount: {
            type: Number,
             required: true
             }, 
        currency:
         { 
          type: String, 
          required: true 
        },

    },
    location:{
        city: {
            type: String,
             required: true
             }, 
        country:
         { 
          type: String, 
          required: true 
        },
        
    },
    duration:{ // little bit dicey i think we can add it  to  description itself 
       type:String,
       required:true 
    },
    description:{
       type:String,
       required:true
    },
    worksite:{
       type:String,
       required:true
    },
    status:{
        type:String,
        enum:['pending','active','removed','expired'],
        default:'pending'
    },
    
    message:{
       type:String    //any message on actions from admin-portal, only visible to alumni who posted
    }
},{timestamps:true})


export const Referral = new mongoose.model('Referral',referralSchema)