import { Publication } from "../models/publication.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  uploadOnCloudinaryPublication,
} from "../connections/coludinaryConnection.js";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { client } from "../connections/redisConnection.js";
import { REDIS_CACHE_EXPIRY_PUBLICATIONS } from "../constants/constants.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
// import { title } from "process";

export const createPublication = asyncHandler(async (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  // Check if user is a professor (case-insensitive comparison)
  const userType = req.user.userType ? req.user.userType.toUpperCase() : "";
  if (userType !== "PROFESSOR") {
    throw new ApiError(403, "Only professors can create publications");
  }

  const { title, previewPages } = req.body;

  // Validate title
  if (!title || title.trim() === "") {
    throw new ApiError(400, "Publication title is required");
  }

  // Validate preview pages
  if (
    previewPages &&
    (parseInt(previewPages) < 1 || parseInt(previewPages) > 10)
  ) {
    throw new ApiError(400, "Preview pages must be between 1 and 10");
  }

  // Check for PDF file
  const pdf_path = req.file?.path;
  if (!pdf_path) {
    throw new ApiError(400, "PDF file is required");
  }

  // Upload to Cloudinary
  const uploadedPdf = await uploadOnCloudinaryPublication(pdf_path);
  
  if (!uploadedPdf || !uploadedPdf.url) {
    throw new ApiError(500, "Failed to upload PDF to cloud storage");
  }

  const newPublication = await Publication.create({
    title: title.trim(),
    publicationURL: uploadedPdf.url,
    publisher: req.user.id,
    previewPages: previewPages ? parseInt(previewPages) : 3,
  });

  if (!newPublication) {
    await deleteFromCloudinary(uploadedPdf.publicId);
    throw new ApiError(400, "Error on creating publication");
  }

  await User.findByIdAndUpdate(req.user.id, {
    $push: { publicationPosted: newPublication._id },
  });

  const created_publication = await Publication.aggregate([
    {
      $match: {
        _id: newPublication._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "_id",
        as: "publisher",
      },
    },
  ]);

//   await client.del("publication-list");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        created_publication,
        "Publication created successfully"
      )
    );
});

export const getAllPublications = asyncHandler(async (req, res) => {
//   const cacheResult = await client.get("publication-list");
//   if (cacheResult)
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           JSON.parse(cacheResult),
//           "all publications fetched successfully"
//         )
//       );

  const response = await Publication.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "userId",
        as: "publisher",
      },
    },
  ]);

  if (!response) throw new ApiError(400, "no publications found");

//   await client.set(
//     "publication-list",
//     JSON.stringify(response),
//     "EX",
//     REDIS_CACHE_EXPIRY_PUBLICATIONS
//   );
  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "publication-list fetched successfully")
    );
});

export const getPublicationDetails = asyncHandler(async (req, res) => {
  const publicationid = req.params.publicationid;

  if (!publicationid) throw new ApiError(400, "Publication-ID not available");

//   const cacheResult = await client.get(`publication:${publicationid}`);
  if (cacheResult)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cacheResult),
          " publication details fetched successfully"
        )
      );

  const publication_data = await Publication.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(publicationid),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "_id",
        as: "publisher",
      },
    },

    {
      $project: {
        publicationId: 1,
        publicationURL: 1,
        "publisher.full_name": 1,
        "publisher.email": 1,
        "publisher.professorDetails": 1,
        _id: 0,
      },
    },
  ]);

//   await client.set(
//     `publication:${publicationid}`,
//     JSON.stringify(publication_data),
//     "EX",
//     REDIS_CACHE_EXPIRY_PUBLICATIONS
//   );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        publication_data,
        "publication data fetched successfully"
      )
    );
});

export const deletePublication = asyncHandler(async (req, res) => {
  const publicationid = req.params.publicationid;

  // Check authentication
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  // Check authorization with case-insensitive comparison
  const userType = req.user.userType ? req.user.userType.toUpperCase() : "";
  const isAuthorized = userType === "PROFESSOR" || userType === "ADMIN";

  if (!isAuthorized) {
    throw new ApiError(
      403,
      "Only professors and admins can delete publications"
    );
  }

  if (!publicationid) {
    throw new ApiError(400, "Publication ID is required");
  }

  const fetchPublication = await Publication.findOne({
    _id: new mongoose.Types.ObjectId(publicationid),
  });

  if (!fetchPublication) {
    throw new ApiError(404, "Publication not found");
  }

  if (fetchPublication.publisher.toString() !== req.user.id.toString()) {
    throw new ApiError(403, "You can only delete your own publications");
  }

  // Clear from cache
//   await client.del(`publication:${publicationid}`);

  const response = await Publication.deleteOne({
    _id: new mongoose.Types.ObjectId(publicationid),
  });

  if (!response) {
    throw new ApiError(500, "Failed to delete publication");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Publication deleted successfully"));
});

export const getMyPublications = asyncHandler(async (req, res) => {
  // console.log('hii')
  const userId = req.user.id;

  if (!userId) throw new ApiError(400, "No user exists");

//   const cacheResult = await client.get(`mypublication:${userId}`);

  if (cacheResult) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cacheResult),
          "Publication details fetched successfully"
        )
      );
  }

  //    console.log("MYPUB",req.user)
  const result = await Publication.aggregate([
    {
      $match: {
        publisher: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        //   publicationId:1,
        publicationURL: 1,
        title: 1,
      },
    },
  ]);

//   await client.set(
//     `mypublication:${userId}`,
//     JSON.stringify(result),
//     "EX",
//     REDIS_CACHE_EXPIRY_PUBLICATIONS
//   );

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Publication details fetched successfully")
    );
});
