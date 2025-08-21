import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

//MCP: This middleware is used to set the user in the database storing metadata of the user where the original user Specific Data is Stored in the auth-system microservice

export const setUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    // Validate that req.user.id is a valid MongoDB ObjectId
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      console.log(`Invalid ObjectId format: ${req.user.id}`);
      return next(new ApiError(400, "Invalid user ID format"));
    }

    // Use findOne instead of find for a single document
    const user = await User.findOne({ userId: req.user.id });

    if (user) {
      return next();
    }

    const userData = {
      userId: req.user.id,
      userType: req.user.userType || "STUDENT", // Default to STUDENT if not provided
    };

    const newUser = await User.create(userData);
    if (!newUser) {
      return next(new ApiError(500, "Failed to create user"));
    }
    console.log("New user created successfully");

    next();
  } catch (error) {
    console.error("Error in setUser middleware:", error);
    return next(new ApiError(500, error.message || "Internal Server Error"));
  }
};
