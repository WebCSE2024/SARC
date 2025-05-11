import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Referral } from "../models/referral.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { client } from "../connections/redisConnection.js";
import { v4 as uuidv4 } from "uuid";
import { REDIS_CACHE_EXPIRY_REFERRAL } from "../constants/constants.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { UserType } from "../../../../shared/types/user.type.js";

export const createReferral = async (req, res) => {
  const user = req.user;

  if (user.userType !== UserType.PROFESSOR && user.userType !== UserType.ALUMNI)
    throw new ApiError(400, "Not authorized to publish a referral");

  const {
    companyName,
    deadline,
    requirements,
    jobProfile,
    stipend,
    description,
    location,
    email,
    contact,
    website,
    mode,
  } = req.body;

  if (
    !companyName ||
    !deadline ||
    !requirements ||
    !jobProfile ||
    !location ||
    !email ||
    !stipend ||
    !description ||
    !website
  ) {
    throw new ApiError(400, "All fields are required ");
  }
  // const referral_id=generateReferralId()

  const referral = await Referral.create({
    companyName,
    deadline,
    jobProfile,
    addedBy: user.id,
    stipend,
    description,
    requirements,
    location,
    status: "pending",
    // referralId:referral_id,
    email,
    contact,
    website,
    mode,
  });

  if (!referral) throw new ApiError(500, "Referral not generated");

  // await client.del('referral-list');
  // await client.del(`myreferral:${user._id}`)

  const createdReferral = {
    companyName: referral.companyName,
    deadline: referral.deadline,
    jobProfile: referral.jobProfile,
    addedBy: user.id,
    stipend: referral.stipend,
    description: referral.description,
    requirements: referral.requirements,
    location: referral.location,
    status: referral.status,
    email: referral.email,
    contact: referral.contact,
    website: referral.website,
    mode: referral.mode,
  };
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdReferral, "Referral created successfully")
    );
};

export const getAllReferrals = asyncHandler(async (req, res) => {
  // const cacheReferral = await client.get("referral-list");
  // if (cacheReferral)
  //   return res
  //     .status(200)
  //     .send(new ApiResponse(200, JSON.parse(cacheReferral), "referral list "));

  const allReferrals = await Referral.find({});

  if (!allReferrals) throw new ApiError(400, "Refrrals list not found");

  // await client.set(
  //   "referral-list",
  //   JSON.stringify(allReferrals),
  //   "EX",
  //   REDIS_CACHE_EXPIRY_REFERRAL
  // );

  return res
    .status(200)
    .json(new ApiResponse(200, allReferrals, "List of all referrals"));
});

export const toggleReferralState = asyncHandler(async (req, res) => {
  const referralId = req.params.id;
  const { status } = req.body;


  
  
  if (!referralId || !status) throw new ApiError(400, "Data incomplete");

  const referral = await Referral.findOne({
    _id: new mongoose.Types.ObjectId(referralId),
  });

  console.log(referral);

  if (!referral) throw new ApiError(400, "Referral not found");

  referral.status = status;
  const response = await referral.save();
  // const updatedReferral = await Referral.findById(referralId,status)

  if (!response) throw new ApiError(400, "Referral not updated");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Referral status updated"));
});

export const getActiveReferrals = asyncHandler(async (req, res) => {
  const activeReferrals = await Referral.find({
    status: "active",
  });
  if (!activeReferrals) throw new ApiError(400, "No active referrals found");

  return res
    .status(200)
    .json(new ApiResponse(200, activeReferrals, "List of active referrals"));
});

export const getReferralDetails = asyncHandler(async (req, res) => {
  const referralId = req.params.referralId;
  if (!referralId) throw new ApiError(400, "Referral-ID not available");

  const cacheReferral = await client.get(`referral:${referralId}`);
  if (cacheReferral)
    return res
      .status(200)
      .send(new ApiResponse(200, JSON.parse(cacheReferral), "referral list "));

  const referral = await Referral.findOne({
    _id: new mongoose.Types.ObjectId(referralId),
  });

  if (!referral) throw new ApiError(400, "Referral does not exist");

  if (!req.user) throw new ApiError(400, "Unauthenticated");

  // if(req.user.role !=='ALUMNI' )
  //     throw new ApiError(400,'Unauthorized')

  const referralData = await Referral.aggregate([
    {
      $match: {
        referralId: referralId,
      },
    },
  ]);

  if (!referralData || !referralData.length === 0)
    throw new ApiError(400, "no referral data exist for the referralID");

  await client.set(
    `referral:${referralId}`,
    JSON.stringify(referralData),
    "EX",
    REDIS_CACHE_EXPIRY_REFERRAL
  );
  return res
    .status(200)
    .json(new ApiResponse(200, referralData, "data fetched successfully"));
});

export const getMyReferrals = asyncHandler(async (req, res) => {
  const cacheReferral = await client.get(`myreferral:${userid}`);
  if (cacheReferral)
    return res
      .status(200)
      .send(new ApiResponse(200, JSON.parse(cacheReferral), "referral list "));
  const user = req.user;
  if (!user) throw new ApiError(400, "Unauthenticated");

  if (user.role !== "alumni") throw new ApiError(400, "Unauthorized");

  const myReferrals = await Referral.aggregate([
    {
      $match: {
        addedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
  ]);
  if (!myReferrals) throw new ApiError(400, "No referrals found");

  await client.set(
    `myreferral:${user._id}`,
    JSON.stringify(myReferrals),
    "EX",
    REDIS_CACHE_EXPIRY_REFERRAL
  );
  return res
    .status(200)
    .json(new ApiResponse(200, myReferrals, "List of my referrals"));
});

export const deleteReferral = asyncHandler(async (req, res) => {
  const refid = req.params.refid;

  if (!refid) throw new ApiError(400, "Referral-ID not available");

  await client.del(`referral/:${refid}`);

  const response = await Referral.deleteOne({
    _id: new mongoose.Types.ObjectId(refid),
    addedBy: req.user._id,
  });

  if (!response) throw new ApiError(400, "can not delete the referral");

  return res
    .status(200)
    .json(new ApiResponse(200, null, "referral deleted successfully"));
});
