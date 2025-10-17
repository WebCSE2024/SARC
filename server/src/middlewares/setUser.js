import { User } from "../domains/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

//MCP: This middleware is used to set the user in the database storing metadata of the user where the original user Specific Data is Stored in the auth-system microservice

export const setUser = async (req, res, next) => {
  let resolvedUserType = "STUDENT";
  let resolvedUsername = "";
  let fallbackUsername = "";

  try {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    // Validate that req.user.id is a valid MongoDB ObjectId
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      console.log(`Invalid ObjectId format: ${req.user.id}`);
      return next(new ApiError(400, "Invalid user ID format"));
    }

    const normalizeString = (value) => {
      if (typeof value !== "string") {
        return "";
      }
      return value.trim();
    };

    const candidateUsernames = [
      normalizeString(req.user.username),
      normalizeString(req.user.userName),
      normalizeString(req.user.email),
      normalizeString(req.user.admissionNumber),
      normalizeString(req.user.name),
      normalizeString(req.user.fullName),
    ].filter(Boolean);

    fallbackUsername = `user-${req.user.id.toString()}`;
    resolvedUsername = (
      candidateUsernames[0] || fallbackUsername
    ).toLowerCase();

    const rawUserType = Array.isArray(req.user.userType)
      ? req.user.userType[0]
      : req.user.userType;
    resolvedUserType = normalizeString(rawUserType).toUpperCase() || "STUDENT";

    // Use findOne instead of find for a single document
    const user = await User.findOne({ userId: req.user.id });

    if (user) {
      const updates = {};
      if (resolvedUsername && user.username !== resolvedUsername) {
        updates.username = resolvedUsername;
      }
      if (resolvedUserType && user.userType !== resolvedUserType) {
        updates.userType = resolvedUserType;
      }
      if (Object.keys(updates).length > 0) {
        await User.updateOne({ _id: user._id }, { $set: updates });
      }
      return next();
    }

    const userData = {
      userId: req.user.id,
      userType: resolvedUserType,
      username: resolvedUsername,
    };

    const newUser = await User.create(userData);
    if (!newUser) {
      return next(new ApiError(500, "Failed to create user"));
    }
    console.log("New user created successfully");

    next();
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.username) {
      try {
        const uniqueUsername = `${(
          fallbackUsername || `user-${req?.user?.id ?? "unknown"}`
        ).toLowerCase()}-${Date.now().toString(36).slice(-6)}`;

        await User.findOneAndUpdate(
          { userId: req.user.id },
          {
            $set: {
              userType: resolvedUserType,
              username: uniqueUsername,
            },
            $setOnInsert: {
              userId: req.user.id,
            },
          },
          { upsert: true, new: true }
        );

        console.warn(
          `Duplicate username detected for user ${req.user.id}. Assigned fallback username ${uniqueUsername}.`
        );

        return next();
      } catch (retryError) {
        console.error("Retry failed in setUser middleware:", retryError);
        return next(
          new ApiError(500, retryError.message || "Internal Server Error")
        );
      }
    }

    console.error("Error in setUser middleware:", error);
    return next(new ApiError(500, error.message || "Internal Server Error"));
  }
};
