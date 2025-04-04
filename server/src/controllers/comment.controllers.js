import { Comment } from "../models/comments.models.js";
import { Reply } from "../models/replies.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import mongoose from "mongoose";

export const addComment = asyncHandler(async(req,res)=>{

    if(!req.user)
        throw new ApiError(400,'Not authenticated')
 

    const {content}=req.body
    if(!content)
        throw new ApiError(400,'Comment is required')
   
    const {referenceModel,postId}=req.query
    if(!postId && !referenceModel){
        throw new ApiError(400,'PostId or reference is required')
        // throw new ApiError(400,'PostId is required')
    }
    const newComment=await Comment.create({
        content,
        commentedBy:{
            userid:req.user._id,
            username:req.user.first_name
        },
        referenceModel,
        reference:new mongoose.Types.ObjectId(req.params.postId),
       
    })

    if(!newComment)
        throw new ApiError(500,'Error adding comment')

    res.status(201).json(
        new ApiResponse(201,'Comment added successfully',newComment)
    )
})

export const addReply = asyncHandler(async(req,res)=>{
            
        if(!req.user)
            throw new ApiError(400,'Not authenticated')
        const {content}=req.body
        if(!content)
            throw new ApiError(400,'Reply is required')
    
        if(!req.params.commentId){
            throw new ApiError(400,'CommentId is required')
        }
        const newReply=await Reply.create({
            content,
            repliedBy:{
                userid:req.user._id,
                username:req.user.first_name
            },
            reference:req.params.commentId,
        
        })
    
    
        if(!newReply)
            throw new ApiError(400,'Error adding reply')
    
        res.status(201).json(
            new ApiResponse(201,'Reply added successfully',newReply)
        )
    })


export const getComments=asyncHandler(async(req,res)=>{

    if(!req.user)
        throw new ApiError(400,'Not authenticated')

    if(!req.params.postId){
        throw new ApiError(400,'PostId is required')
    }

    const comments= await Comment.aggregate([
        {
            $match: {
              _id:new mongoose.Types.ObjectId(req.params.postId)
            }
          },
          {
            $lookup: {
              from: 'replies',
              localField: '_id',
              foreignField: 'reference',
              as: 'result'
            }
          },
          {
            $project: {
              'result.reference':0, 
            }
          }
    ])

    if(!comments)
        throw new ApiError(404,'No comments found')

    console.log(comments)
    res.status(200).json(
        new ApiResponse(200,'Comments retrieved successfully',comments)
    )
})

export const deleteComment=asyncHandler(async(req,res)=>{
    
        if(!req.user)
            throw new ApiError(400,'Not authenticated')
    
        if(!req.params.commentId){
            throw new ApiError(400,'CommentId is required')
        }
    
        const comment=await Comment.findOneAndDelete({_id:req.params.commentId,'commentedBy.userid':req.user._id})
    
        if(!comment)
            throw new ApiError(404,'Comment not found')
    
        res.status(200).json(
            new ApiResponse(200,'Comment deleted successfully',comment)
        )
    })

export const deleteReply=asyncHandler(async(req,res)=>{
    
    if (!req.user) {
        throw new ApiError(400, "Not authenticated");
    }
    
    if (!req.params.replyId) {
        throw new ApiError(400, "ReplyId is required");
    }
    
    const reply = await Reply.findOne({
        _id: req.params.replyId,
        "repliedBy.userid": new mongoose.Types.ObjectId('67dd617893e5092bb6d60810'),
    });
    
    if (!reply) {
        throw new ApiError(404, "Reply not found");
    }
    
    const resp = await reply.deleteOne();
    
    if (!resp) {
        throw new ApiError(500, "Error deleting reply");
    }
    
    res.status(200).json(new ApiResponse(200, "Reply deleted successfully"));
    
    })


