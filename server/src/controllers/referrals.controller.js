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
        companyName,
        deadline,
        eligibleYears,
        jobProfile,
        experience,
        stipend,
        duration,
        description,
        worksite,
        location
          
    }=req.body;

    if(!companyName || !deadline || !eligibleYears || !jobProfile ||!location || !experience || !stipend || !duration || !description || !worksite  ){
        throw new ApiError(400,"All fields are required ")
    }
    const referral_id=generateReferralId()
    
    const referral = await  Referral.create({
      companyName,
      deadline,
      eligibleYears,
      jobProfile,
      addedBy:req.user._id,
      experience,
      stipend,
      duration,
      description,
      worksite,
      location,
      status:'pending',
      referralId:referral_id
    })
   
    if(!referral)
        throw new ApiError(500,"Referral not generated")

    await client.del('referral-list');
    await client.del(`myreferral:${user._id}`)
    
    const createdReferral = await Referral.findById(referral._id).select('-_id -addedBy')
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
   


    const allReferrals = await Referral.aggregate([
      {
        $lookup: {
          from: 'alumnis',
          localField: 'addedBy',
          foreignField: '_id',
          as: 'addedBy'
        }
      },
      {
        $project: {
    
    
          _id:0,
          __v:0,
          'addedBy._id':0,
          'addedBy.password':0,
          'addedBy.isVerified':0
          
        }
      }
    ])
    
    if(!allReferrals)
         throw new ApiError(400,"Refrrals list not found")
    
    await client.set('referral-list',JSON.stringify(allReferrals),'EX', REDIS_CACHE_EXPIRY_REFERRAL)
    
     
    return res.status(200).json(
        new ApiResponse(200,allReferrals,"List of all referrals")
    )
})

export const toggleReferralState = asyncHandler(async(req,res)=>{

  if(req.user.role !== 'PROFESSOR') 
    throw new ApiError(400,'Unauthorized')

  const {referralId,status} = req.query
  if(!referralId || !status)
    throw new ApiError(400,'Data incomplete')

  const referral = await Referral.findOne({
    referralId:referralId
  })
  if(!referral)
    throw new ApiError(400,'Referral not found')

  referral.status = status
  await referral.save()
  const updatedReferral = await Referral.findById(referralId,status)

  if(!updatedReferral)
    throw new ApiError(400,'Referral not updated')

  return res.status(200).json(
    new ApiResponse(200,null,'Referral status updated')
  )
})

export  const  getActiveReferrals = asyncHandler(async(req,res)=>{
    const activeReferrals = await Referral.aggregate([
      {
        $match: {
          status: 'active'
        }
      },
      {
        $lookup: {
          from: 'alumnis',
          localField: 'addedBy',
          foreignField: '_id',
          as: 'addedBy'
        }
      },
      {
        $project: {
    
    
          _id:0,
          __v:0,
          'addedBy._id':0,
          'addedBy.password':0,
          'addedBy.isVerified':0
          
        }
      }
    ])
    if(!activeReferrals)
        throw new ApiError(400,'No active referrals found')
    
    return res.status(200).json(
        new ApiResponse(200,activeReferrals,'List of active referrals')
    )
})

export const applyReferral= asyncHandler(async(req,res)=>{
        
    const referralId=req.params.referralId
    if(!referralId)
        throw new ApiError(400,'Referral-ID not available')
    console.log('ALLGOOD1')
    console.log(referralId)
    const referral=await Referral.findOne({
        referralId:referralId
    })
    console.log('ALLGOOD2')
    if(!referral)
        throw new ApiError(400,'Referral does not exist')

    if(referral.status !== 'active'){
      throw new ApiError(400,'Referral is not active yet')
    }

    if(!req.user)
        throw new ApiError(400,'Unauthenticated')

    if(req.user.role !=='STUDENT')
        throw new ApiError(400,'Unauthorized')
    
    // console.log(referral._id)

    if(referral.eligibleYears.indexOf(req.user.grad_yr) === -1)
        throw new ApiError(400,'Not eligible for this referral')

    const existsApplication = await ApplyReferral.findOne({
        applied_by: new mongoose.Types.ObjectId(req.user._id),
        referral_id: new mongoose.Types.ObjectId(referral._id)
    })
    
   if(existsApplication)
      throw new ApiError(400,'Already applied for referral')
    
   if(Date.now() > Date.parse(referral.deadline))
      throw new ApiError(400,'Deadline for application has passed')

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
        referralId:referralId
    })

    if(!referral)
        throw new ApiError(400,'Referral does not exist')
    
    if(!req.user)
        throw new ApiError(400,'Unauthenticated')

    // if(req.user.role !=='ALUMNI' )
    //     throw new ApiError(400,'Unauthorized')

    const referralData =  await Referral.aggregate([
        {
            $match: {
                referralId: referralId 
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
            referralId: { $first: "$referralId" },
            companyName: { $first: "$companyName" },
            jobProfile: { $first: "$jobProfile" },
            deadline: { $first: "$deadline" },
            experience: { $first: "$experience" },
            stipend: { $first: "$stipend" },
            location: { $first: "$location" },
            duration: { $first: "$duration" },
            description: { $first: "$description" },
            worksite: { $first: "$worksite" },
            status: { $first: "$status" },
            message: { $first: "$message" },
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
   

    const cacheReferral=await client.get(`myreferral:${userid}`)
    if(cacheReferral)
        return res.status(200).send(
             new ApiResponse(200,JSON.parse(cacheReferral),"referral list ")
        )
    const user = req.user
    if(!user)
        throw new ApiError(400,'Unauthenticated')

    if(user.role !== 'ALUMNI')  
        throw new ApiError(400,'Unauthorized')

    const myReferrals = await Referral.aggregate([

        {
            $match: {
               addedBy: new mongoose.Types.ObjectId('67c8a5b1364003db93f7e147')
            }
        },
        {
            $lookup: {
              from: 'alumnis',
              localField: 'addedBy',
              foreignField: '_id',
              as: 'addedBy'
            }
          },
          {
             $unwind: "$addedBy"
          },
          {
            $lookup: {
              from: 'applyreferrals',
              localField: '_id',
              foreignField: 'referral_id',
              as: 'applications'
          }
        },
        {
            $project: {
                _id:1,
                companyName:1,
                jobProfile:1,
                deadline:1,
                experience:1,
                stipend:1,
                location:1,
                duration:1,
                description:1,
                worksite:1,
                status:1,
                message:1,
                applicants: { $size: "$applications" },
                _id:0
        }}
    ])
    if(!myReferrals)
        throw new ApiError(400,'No referrals found')

    await client.set(`myreferral:${user._id}`,JSON.stringify(myReferrals),'EX', REDIS_CACHE_EXPIRY_REFERRAL)
    return res.status(200).json(
        new ApiResponse(200,myReferrals,'List of my referrals')
    )

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

export const removeApplication = asyncHandler(async(req,res)=>{
    const refid=req.params.refid
    const applied_by=req.params.applied_by

    if(!refid || !appid)
        throw new ApiError(400,'Referral-ID or Application-ID not available')

    await client.del(`referral/:${refid}`)
    await client.del(`application/:${appid}`)
   
    const existsApplication = await ApplyReferral.findOne({
        referral_id:refid,
        applied_by:applied_by
    })

    if(!existsApplication)
        throw new ApiError(400,'No such application exist')

    const response=await ApplyReferral.deleteOne({
        referral_id:refid,
        applied_by:applied_by
    })

    if(!response)
        throw new ApiError(400,'can not delete the application')

    return res.status(200).json(
        new ApiResponse(200,null,'application deleted successfully')
    )
}   
)
