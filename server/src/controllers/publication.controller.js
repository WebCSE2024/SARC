import fs from "fs/promises";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Publication } from "../models/publication.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendPDFToPDFExtractionEngine } from "../utils/publication.helper.js";
import {
  finalizePublicationList,
  getPublicationSnapshot,
  getJobState,
  resolveUserProfile,
  sanitizeEntries,
  storeJobState,
  upsertPublicationList,
} from "../services/publication.service.js";
import socketManager from "../connections/socket.connection.js";

const extractAuthUserId = (user = {}) => {
  const candidate = user.id || user.userId || user._id;
  if (!candidate) {
    throw new ApiError(401, "Unable to resolve authenticated user");
  }
  if (typeof candidate === "string") {
    if (!mongoose.Types.ObjectId.isValid(candidate)) {
      throw new ApiError(400, "Invalid user identifier");
    }
    return candidate;
  }
  if (candidate instanceof mongoose.Types.ObjectId) {
    return candidate.toString();
  }
  throw new ApiError(400, "Unsupported user identifier type");
};

const emitToUser = (userId, event, payload) => {
  try {
    socketManager.emitToUser(userId, event, payload);
  } catch (error) {
    console.error("Failed to emit socket event", { event, userId, error });
  }
};

export const uploadPublication = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const authUserId = extractAuthUserId(req.user);
  const userProfile = await resolveUserProfile(authUserId);
  const jobId = uuidv4();

  const jobPayload = {
    jobId,
    status: "PENDING",
    ownerAuthId: userProfile.userId.toString(),
    ownerProfileId: userProfile._id.toString(),
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileStorageKey: req.file.storageKey,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    receivedAt: new Date().toISOString(),
  };

  await storeJobState(jobId, jobPayload);

  res
    .status(202)
    .json(
      new ApiResponse(
        202,
        { jobId, status: "PENDING" },
        "Publication ingestion started"
      )
    );

  sendPDFToPDFExtractionEngine(jobId, req.file.path, authUserId, {
    originalFilename: req.file.originalname,
    storageKey: req.file.storageKey,
  }).catch(async (error) => {
    console.error("Error sending PDF to extraction engine:", error);
    await storeJobState(jobId, {
      ...jobPayload,
      status: "FAILED",
      error: error.message,
      failedAt: new Date().toISOString(),
    });
    emitToUser(authUserId, "publication:extraction-failed", {
      jobId,
      error: error.message,
    });
  });
});

export const createPublication = async (content) => {
  const { jobId, status, publications = [], error } = content;

  const jobState = await getJobState(jobId);
  if (!jobState) {
    throw new ApiError(404, "Publication job metadata not found");
  }

  const ownerAuthId = jobState.ownerAuthId || jobState.userId;
  if (!ownerAuthId) {
    throw new ApiError(400, "Publication job missing owner reference");
  }

  const ownerProfile = await resolveUserProfile(ownerAuthId);

  const persistJobFailure = async (reason) => {
    await storeJobState(jobId, {
      ...jobState,
      status: "FAILED",
      error: reason,
      failedAt: new Date().toISOString(),
    });
    emitToUser(ownerAuthId.toString(), "publication:extraction-failed", {
      jobId,
      error: reason,
    });
  };

  if (status !== "COMPLETED") {
    await persistJobFailure(error || "Extraction failed");
    if (jobState.filePath) {
      await fs.rm(jobState.filePath, { force: true });
    }
    return { success: false, error: error || "Extraction failed" };
  }

  const sanitizedEntries = sanitizeEntries(publications);

  if (sanitizedEntries.length === 0) {
    await persistJobFailure("No publications detected in uploaded document");
    if (jobState.filePath) {
      await fs.rm(jobState.filePath, { force: true });
    }
    return { success: false, error: "No publications detected" };
  }

  const publication = await upsertPublicationList({
    ownerAuthId: ownerProfile.userId,
    ownerProfileId: ownerProfile._id,
    entries: sanitizedEntries,
    status: "PENDING_REVIEW",
  });

  await storeJobState(jobId, {
    ...jobState,
    status: "COMPLETED",
    completedAt: new Date().toISOString(),
    extractedCount: sanitizedEntries.length,
  });

  if (jobState.filePath) {
    await fs.rm(jobState.filePath, { force: true });
  }

  emitToUser(ownerAuthId.toString(), "publication:extraction-complete", {
    jobId,
    status: "PENDING_REVIEW",
    count: sanitizedEntries.length,
    publicationId: publication._id.toString(),
  });

  return { success: true, message: "Publication list updated" };
};

export const getPublicationState = asyncHandler(async (req, res) => {
  const authUserId = extractAuthUserId(req.user);
  const publication = await getPublicationSnapshot(authUserId);

  res.status(200).json(new ApiResponse(200, publication));
});

export const finalizePublication = asyncHandler(async (req, res) => {
  const { entryUpdates } = req.body;
  if (!Array.isArray(entryUpdates)) {
    throw new ApiError(400, "Finalization requires entry updates");
  }

  const authUserId = extractAuthUserId(req.user);
  const publication = await finalizePublicationList({
    ownerAuthId: authUserId,
    entryUpdates,
  });

  emitToUser(authUserId, "publication:finalized", {
    publicationId: publication._id.toString(),
    finalizedAt: publication.finalizedAt,
  });

  res
    .status(200)
    .json(new ApiResponse(200, publication, "Publication list finalized"));
});

export const getPublicationJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    throw new ApiError(400, "Job identifier is required");
  }

  const job = await getJobState(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const authUserId = extractAuthUserId(req.user);
  if ((job.ownerAuthId || "").toString() !== authUserId.toString()) {
    throw new ApiError(403, "You are not authorized to access this job");
  }

  res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

export const getAllPublications = asyncHandler(async (req, res) => {
  const publications = await Publication.find();
  res
    .status(200)
    .json(
      new ApiResponse(200, publications, "Publications fetched successfully")
    );
});

export const getPublicationDetails = asyncHandler(async (req, res) => {
  const { publicationid } = req.params;
  if (!publicationid || !mongoose.Types.ObjectId.isValid(publicationid)) {
    throw new ApiError(400, "Invalid publication identifier");
  }

  const publication = await Publication.findById(publicationid).populate(
    "ownerProfileId"
  );
  if (!publication) {
    throw new ApiError(404, "Publication not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, publication, "Publication fetched successfully")
    );
});

export const deletePublication = asyncHandler(async (req, res) => {
  const authUserId = extractAuthUserId(req.user);
  const publication = await Publication.findOne({ ownerAuthId: authUserId });
  if (!publication) {
    throw new ApiError(404, "Publication list not found");
  }

  await Publication.deleteOne({ _id: publication._id });

  res.status(200).json(new ApiResponse(200, null, "Publication list deleted"));
});

export const getMyPublications = asyncHandler(async (req, res) => {
  const authUserId = extractAuthUserId(req.user);
  const publication = await Publication.findOne({ ownerAuthId: authUserId });
  res
    .status(200)
    .json(
      new ApiResponse(200, publication, "Publications fetched successfully")
    );
});
