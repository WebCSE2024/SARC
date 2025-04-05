import { Comment } from "../models/comments.models.js";
import { Reply } from "../models/replies.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const addComment = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Not authenticated");

  const { content } = req.body;
  if (!content) throw new ApiError(400, "Comment is required");

  const { referenceModel, postId } = req.query;
  if (!postId && !referenceModel) {
    throw new ApiError(400, "PostId and referenceModel are required");
  }

  // Check if username is available in user object
  if (!req.user.first_name && !req.user.username) {
    throw new ApiError(400, "User name is required");
  }

  const newComment = await Comment.create({
    content,
    commentedBy: {
      userid: req.user._id,
      username: req.user.username || req.user.first_name || "Anonymous User", // Fallback to ensure username is always provided
    },
    referenceModel,
    reference: new mongoose.Types.ObjectId(postId),
  });

  if (!newComment) throw new ApiError(500, "Error adding comment");

  res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", newComment));
});

export const addReply = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Not authenticated");
  const { content } = req.body;
  if (!content) throw new ApiError(400, "Reply is required");

  if (!req.params.commentId) {
    throw new ApiError(400, "CommentId is required");
  }

  // Check if username is available in user object
  if (!req.user.first_name && !req.user.username) {
    throw new ApiError(400, "User name is required");
  }

  const newReply = await Reply.create({
    content,
    repliedBy: {
      userid: req.user._id,
      username: req.user.username || req.user.first_name || "Anonymous User", // Fallback to ensure username is always provided
    },
    reference: req.params.commentId,
  });

  if (!newReply) throw new ApiError(400, "Error adding reply");

  res
    .status(201)
    .json(new ApiResponse(201, "Reply added successfully", newReply));
});

export const getComments = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Not authenticated");

  if (!req.params.postId) {
    throw new ApiError(400, "PostId is required");
  }

  const referenceModel = req.query.referenceModel || "Achievement";

  // First get all comments for the post
  const comments = await Comment.find({
    reference: req.params.postId,
    referenceModel: referenceModel,
  }).lean();

  if (!comments || comments.length === 0) {
    return res.status(200).json(new ApiResponse(200, "No comments found", []));
  }

  // For each comment, find its replies
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Reply.find({ reference: comment._id }).lean();
      return { ...comment, result: replies || [] };
    })
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Comments retrieved successfully",
        commentsWithReplies
      )
    );
});

export const deleteComment = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Not authenticated");

  if (!req.params.commentId) {
    throw new ApiError(400, "CommentId is required");
  }

  const comment = await Comment.findOneAndDelete({
    _id: req.params.commentId,
    "commentedBy.userid": req.user._id,
  });

  if (!comment) throw new ApiError(404, "Comment not found");

  // Also delete all replies to this comment
  await Reply.deleteMany({ reference: req.params.commentId });

  res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully", comment));
});

export const deleteReply = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "Not authenticated");
  }

  if (!req.params.replyId) {
    throw new ApiError(400, "ReplyId is required");
  }

  const reply = await Reply.findOne({
    _id: req.params.replyId,
    "repliedBy.userid": req.user._id,
  });

  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const resp = await reply.deleteOne();

  if (!resp) {
    throw new ApiError(500, "Error deleting reply");
  }

  res.status(200).json(new ApiResponse(200, "Reply deleted successfully"));
});
