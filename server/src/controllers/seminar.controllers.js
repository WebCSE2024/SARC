import Seminar from "../models/seminar.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { client } from "../connections/redisConnection.js";


export const createSeminar = asyncHandler(async (req, res) => {
  // if (!req.user) throw new ApiError(400, 'Unauthenticated');

  if (!req.user) throw new ApiError(400, "Unauthenticated");

  const { title, speaker, date, venue, description } = req.body;
  if ([title, speaker, date, venue, description].some((field) => !field)) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (new Date(date) < new Date()) {
    throw new ApiError(400, "Date cannot be in the past");
  }
  const newSeminar = await Seminar.create({
    title,
    speaker,
    date,
    venue,
    description,
  });
  if (!newSeminar) throw new ApiError(400, "Error creating seminar");

  await client.del("seminars"); // Clear the cache for seminars
  return res
    .status(200)
    .json(new ApiResponse(200, newSeminar, "Seminar created successfully"));
});

export const getAllSeminars = asyncHandler(async (req, res) => {
  try {
    const seminars = await Seminar.find();
    console.log(seminars);
    
    if (!seminars.length) throw new ApiError(400, "No seminars found");
    return res
      .status(200)
      .json(new ApiResponse(200, seminars, "Seminars fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching seminars");
  }
});

export const getSeminarDetails = asyncHandler(async (req, res) => {

  const { seminarId } = req.params;
  if (!seminarId) throw new ApiError(400, "Seminar ID is required");

  
  const seminar = await Seminar.findById(seminarId);
  if (!seminar) throw new ApiError(404, "Seminar not found");

  await client.set(
    `seminar:${seminarId}`,
    JSON.stringify(seminar),
    "EX",
    60 * 60 * 24
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, seminar, "Seminar details fetched successfully")
    );
});

export const updateSeminar = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Unauthenticated");
  if (req.user.userType !== "admin") throw new ApiError(400, "Unauthorized");

  const { seminarId } = req.params;
  if (!seminarId) throw new ApiError(400, "Seminar ID is required");
  if (!req.body) throw new ApiError(400, "No data provided for update");

  const updatedData = req.body;

  const seminar = await Seminar.findById(seminarId);
  if (!seminar) throw new ApiError(404, "Seminar not found");

  const updatedSeminar = await Seminar.findByIdAndUpdate(
    seminarId,
    updatedData,
    { new: true }
  );

  if (!updatedSeminar) throw new ApiError(400, "Error updating seminar");

  await client.del("seminars"); // Clear the cache for seminars
  await client.del(`seminar:${seminarId}`); // Clear the cache for this seminar
  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeminar, "Seminar updated successfully"));
});

export const deleteSeminar = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, "Unauthenticated");
  if (req.user.userType !== "admin") throw new ApiError(400, "Unauthorized");

  const { seminarId } = req.params;

  if (!seminarId) throw new ApiError(400, "Seminar ID is required");

  const seminar = await Seminar.findById(seminarId);
  if (!seminar) throw new ApiError(404, "Seminar not found");

  const response = await Seminar.deleteOne({ _id: seminarId });

  if (!response) throw new ApiError(400, "Error deleting seminar");

  await client.del("seminars"); // Clear the cache for seminars
  await client.del(`seminar:${seminarId}`); // Clear the cache for this seminar
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Seminar deleted successfully"));
});
