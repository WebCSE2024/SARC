import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import mongoose from "mongoose";
import { Like } from "../models/like.models.js"; 


export const addLike = asyncHandler(async(req,res)=>{
    
        if(!req.user)
            throw new ApiError(400,'Not authenticated')
    
    
        const {referenceModel,reference}=req.query
        if(!reference && !referenceModel){
            throw new ApiError(400,'Reference or referenceModel is required')
        }
        const newLike=await Like.create({
            likedBy:req.user._id,
            referenceModel,
            reference:new mongoose.Types.ObjectId(reference)
        
        })
    
        if(!newLike)
            throw new ApiError(500,'Error adding like')
    
        res.status(201).json(
            new ApiResponse(201,'Like added successfully',newLike)
        )
    })

export const removeLike = asyncHandler(async(req,res)=>{
        
            if(!req.user)
                throw new ApiError(400,'Not authenticated')
        
        
            const {referenceModel,reference}=req.query
            if(!reference && !referenceModel){
                throw new ApiError(400,'Reference or referenceModel is required')
            }
            const like=await Like.findOneAndDelete({
                likedBy:req.user._id,
                referenceModel,
                reference:new mongoose.Types.ObjectId(reference),
            
            })
        
            if(!like)
                throw new ApiError(500,'Error removing like')
        
            res.status(200).json(
                new ApiResponse(200,'Like removed successfully',like)
            )
        })