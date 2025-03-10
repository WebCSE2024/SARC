import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Referral } from "../models/referral.models.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import { client } from "../connections/redisConnection.js";
import { v4 as uuidv4 } from "uuid";
import {REDIS_CACHE_EXPIRY_REFERRAL} from '../constants/constants.js'
import { ApplyReferral } from "../models/applyReferral.models.js";
import mongoose from "mongoose";

const generateReferralId = () => {
    return uuidv4().replace(/-/g, "").substring(0, 7);
};

export const createReferral = asyncHandler(async(req,res)=>{
     
    const user = req.user
    console.log("REFROUTE",user)

    if(user.role !== "ALUMNI")
        throw new ApiError(400,"Not authorized to publish a referral")

    const {
        company_name,
        deadline,
        eligibility,
        job_profile,
        added_by=req.user._id,
        
    }=req.body;

    if(!company_name || !deadline || !eligibility || !job_profile || !added_by ){
        throw new ApiError(400,"All fields are required ")
    }
    const referral_id=generateReferralId()

    const referral = await  Referral.create({
        company_name,
        job_profile,
        deadline,
        eligibility,
        added_by,
        referral_id:referral_id
    })
   
    if(!referral)
        throw new ApiError(500,"Referral not generated")

    await client.del('referral-list');
    await client.del(`myreferral:${user._id}`)
    
    const createdReferral = await Referral.findById(referral._id).select('-_id -added_by')
    return res.status(201).json(
        new ApiResponse(201,createdReferral,"Referral created successfully")
    )
})

export const getAllReferrals = asyncHandler(async(req,res)=>{
    
    const cacheReferral=await client.get('referral-list')
    if(cacheReferral)
        return res.status(200).send(
             new ApiResponse(200,JSON.parse(cacheReferral),"referral list ")
        )


    const allReferrals = await Referral.find({}).select('-_id');
    
    if(!allReferrals)
         throw new ApiError(400,"Refrrals list not found")
    
    await client.set('referral-list',JSON.stringify(allReferrals),'EX', REDIS_CACHE_EXPIRY_REFERRAL)

    return res.status(200).json(
        new ApiResponse(200,allReferrals,"List of all referrals")
    )
})

export const applyReferral= asyncHandler(async(req,res)=>{
        
    const referralId=req.params.referralId
    if(!referralId)
        throw new ApiError(400,'Referral-ID not available')
    console.log('ALLGOOD1')

    const referral=await Referral.findOne({
        referral_id:referralId
    })
    console.log('ALLGOOD2')
    if(!referral)
        throw new ApiError(400,'Referral does not exist')
    
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')

    if(req.user.role !=='STUDENT')
        throw new ApiError(400,'Unauthorized')
    
    // console.log(referral._id)
    const existsApplication = await ApplyReferral.findOne({
        applied_by: new mongoose.Types.ObjectId(req.user._id),
        referral_id: new mongoose.Types.ObjectId(referral._id)
    })
    
   if(existsApplication)
      throw new ApiError(400,'Already applied for referral')

    const apply_ref = await ApplyReferral.create({
         
        applied_by:req.user._id,
        referral_id:referral._id,
        applied_on:new Date().toISOString()
    })
    console.log("ALLGOOD3")

    if(!apply_ref)
        throw new ApiError(400,'Can not apply ')
    
    return res.status(200).json(
        new ApiResponse(200,null,'Applied successfully')
    )

})

export const getReferralDetails=asyncHandler(async(req,res)=>{
    
    const referralId=req.params.referralId
    if(!referralId)
        throw new ApiError(400,'Referral-ID not available')
    
    const cacheReferral=await client.get(`referral:${referralId}`)
    if(cacheReferral)
        return res.status(200).send(
             new ApiResponse(200,JSON.parse(cacheReferral),"referral list ")
        )

    const referral=await Referral.findOne({
        referral_id:referralId
    })

    if(!referral)
        throw new ApiError(400,'Referral does not exist')
    
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')

    if(req.user.role !=='ALUMNI' )
        throw new ApiError(400,'Unauthorized')

    const referralData =  await Referral.aggregate([
        {
            $match: {
                referral_id: referralId 
              }
        },
        {
          $lookup: {
            from: "applyreferrals",
            localField: "_id",
            foreignField: "referral_id",
            as: "application_list"
          }
        },
        {
          $unwind: "$application_list"
        },
        {
          $lookup: {
            from: "students",
            localField: "application_list.applied_by",
            foreignField: "_id",
            as: "student_details"
          }
        },
        {
          $unwind: "$student_details"
        },
        {
          $group: {
            _id: "$_id",
            referral_id: { $first: "$referral_id" },
            company_name: { $first: "$company_name" },
            job_profile: { $first: "$job_profile" },
            deadline: { $first: "$deadline" },
            applicants: {
              $push: {
                full_name: "$student_details.full_name",
                linkedIn: "$student_details.linkedIn",
                email: "$student_details.email",
                grad_yr: "$student_details.grad_yr"
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ]);
      

    if(!referralData || !referralData.length === 0)
        throw new ApiError(400,'no referral data exist for the referralID')


    await client.set(`referral:${referralId}`, JSON.stringify(referralData),'EX', REDIS_CACHE_EXPIRY_REFERRAL);
    return res.status(200).json(
        new ApiResponse(200,referralData,'data fetched successfully')
    )
})

export const getMyReferrals = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    if (!userId) throw new ApiError(400, "No user exists");
  
    // const cacheKey = `myreferral:${userId}`;
    const cacheResult = await client.get(`myreferral:${userId}`);
  
    if (cacheResult) {
      return res
        .status(200)
        .json(new ApiResponse(200, JSON.parse(cacheResult), "Referral details fetched successfully from redis"));
    }
  
    if (req.user.role !== "ALUMNI") throw new ApiError(403, "Unauthorized");
  
    const result = await Referral.aggregate([
      {
        $match: {
          added_by: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 0,
          job_profile: 1,
          deadline: 1,
          company_name: 1,
          eligibility: 1,
          referral_id:1
        },
      },
    ]);
  
    await client.set(`myreferral:${userId}`, JSON.stringify(result), 'EX', REDIS_CACHE_EXPIRY_REFERRAL);
  
    return res.status(200).json(new ApiResponse(200, result, "Referral details fetched successfully"));
  });

export const deleteReferral = asyncHandler(async(req,res)=>{
    const refid=req.params.refid

    if(!refid)
      throw new ApiError(400,'Referral-ID not available')

    await client.del(`referral/:${refid}`)

    const response=await Referral.deleteOne({
        referral_id:refid

    })

    if(!response)
       throw new ApiError(400,'can not delete the referral')

    return res.status(200).json(
        new ApiResponse(200,null,'referral deleted successfully')
    )
})
