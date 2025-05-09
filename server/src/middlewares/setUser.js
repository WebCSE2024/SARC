import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

//MCP: This middleware is used to set the user in the database storing metadata of the user where the original user Specific Data is Stored in the auth-system microservice

export const setUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const user = await User.findById(req.user.id);
    if (user) {
      console.log("User Already exists");
      return next(new ApiError(401, "User Already exists"));
    }
    const userData = {
      userId: req.user.id,
      userType: req.user.userType,
    };

    const newUser = await User.create(userData);
    if (!newUser) {
      return next(new ApiError(500, "Internal Server Error"));
    }
    console.log("New user created successfully");

    next();
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error"));
  }
};
