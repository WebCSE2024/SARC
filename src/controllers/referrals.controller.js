import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Referral } from "../models/referral.models.js";
import {ApiResponse} from '../utils/ApiResponse.js'
export const createReferral = asyncHandler(async(req,res)=>{
     
    const user = req.user
    // console.log("REFROUTE",user)

    if(user.role !== "ALUMNI")
        throw new ApiError(400,"Not authorized to publish a referral")

    const {
        company_name,
        deadline,
        eligibility,
        job_profile,
        added_by=req.user._id
    }=req.body;

    if(!company_name || !deadline || !eligibility || !job_profile || !added_by ){
        throw new ApiError(400,"All fields are required ")
    }

    const referral = await  Referral.create({
        company_name,
        job_profile,
        deadline,
        eligibility,
        added_by
    })

    if(!referral)
        throw new ApiError(500,"Referral not generated")

    const createdReferral = await Referral.findById(referral._id).select('-_id -added_by')
    return res.status(201).json(
        new ApiResponse(201,createdReferral,"Referral created successfully")
    )
})

export const getAllReferrals = asyncHandler(async(req,res)=>{

    const allReferrals = await Referral.find({}).select('-_id');
    if(allReferrals.length === 0 || !allReferrals)
         throw new ApiError(400,"Refrrals list not found")
    
    return res.status(200).json(
        new ApiResponse(200,allReferrals,"List of all referrals")
    )
})