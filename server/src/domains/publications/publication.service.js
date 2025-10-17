import mongoose from "mongoose";
import { Publication } from "./publication.model.js";
import { User } from "../user/user.model.js";
import { client as redisClient } from "../../config/redisConnection.js";
import {
  PUBLICATION_ENV,
  PUBLICATION_REDIS_KEYS,
} from "../../constants/publication.constants.js";
import { ApiError } from "../../utils/ApiError.js";

const normalizeString = (value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
};

const normalizeNumber = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const normalizeConfidence = (value) => {
  const num = normalizeNumber(value);
  if (num === undefined) {
    return undefined;
  }
  if (num < 0) {
    return 0;
  }
  if (num > 1) {
    return 1;
  }
  return num;
};

const normalizeYear = (value) => {
  if (!value) {
    return undefined;
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string") {
    const match = value.match(/(19|20)\d{2}/);
    if (match) {
      return Number.parseInt(match[0], 10);
    }
  }
  return undefined;
};

const normalizeArrayOfStrings = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeString(entry))
      .filter((entry) => Boolean(entry));
  }
  if (typeof value === "string") {
    return value
      .split(/[,;\n]/)
      .map((entry) => normalizeString(entry))
      .filter((entry) => Boolean(entry));
  }
  return [];
};

export const toPublicationEntry = (record) => {
  const title = normalizeString(record.title);
  if (!title) {
    return null;
  }

  const authors = normalizeArrayOfStrings(record.authors);

  return {
    title,
    authors,
    publicationType: normalizeString(
      record.publication_type ?? record.publicationType
    ),
    publisherName: normalizeString(record.publisher ?? record.publisherName),
    year: normalizeYear(record.year),
    volume: normalizeString(record.volume),
    issue: normalizeString(record.issue),
    pages: normalizeString(record.pages),
    issn: normalizeString(record.issn),
    isbn: normalizeString(record.isbn),
    description: normalizeString(record.description),
  };
};

export const sanitizeEntries = (records = []) =>
  records
    .map((record) => toPublicationEntry(record))
    .filter((entry) => Boolean(entry));

export const storeJobState = async (jobId, payload) => {
  const key = PUBLICATION_REDIS_KEYS.job(jobId);
  await redisClient.set(
    key,
    JSON.stringify(payload),
    "EX",
    PUBLICATION_ENV.jobTtlSeconds
  );
  if (payload.ownerAuthId) {
    const userKey = PUBLICATION_REDIS_KEYS.userJobs(payload.ownerAuthId);
    await redisClient.sadd(userKey, jobId);
    await redisClient.expire(userKey, PUBLICATION_ENV.jobTtlSeconds);
  }
  return payload;
};

export const getJobState = async (jobId) => {
  const key = PUBLICATION_REDIS_KEYS.job(jobId);
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

export const clearJobState = async (jobId) => {
  const key = PUBLICATION_REDIS_KEYS.job(jobId);
  await redisClient.del(key);
};

export const getJobStatesForUser = async (ownerAuthId) => {
  const userKey = PUBLICATION_REDIS_KEYS.userJobs(ownerAuthId);
  const jobIds = await redisClient.smembers(userKey);
  if (!jobIds || jobIds.length === 0) {
    return [];
  }
  const jobs = await Promise.all(jobIds.map((jobId) => getJobState(jobId)));
  return jobs.filter(Boolean);
};

export const resolveUserProfile = async (authUserId) => {
  if (!authUserId) {
    throw new ApiError(400, "Missing user identifier");
  }

  const objectId = (() => {
    if (authUserId instanceof mongoose.Types.ObjectId) {
      return authUserId;
    }
    if (typeof authUserId === "string") {
      if (!mongoose.Types.ObjectId.isValid(authUserId)) {
        throw new ApiError(400, "Invalid user identifier");
      }
      return new mongoose.Types.ObjectId(authUserId);
    }
    throw new ApiError(400, "Unsupported user identifier type");
  })();

  const userProfile = await User.findOne({ userId: objectId });
  if (!userProfile) {
    throw new ApiError(404, "User profile not found in SARC metadata store");
  }

  return userProfile;
};

export const upsertPublicationList = async ({
  ownerAuthId,
  ownerProfileId,
  entries,
  status,
}) => {
  const existing = await Publication.findOne({ ownerAuthId });

  if (!existing) {
    return Publication.create({
      ownerAuthId,
      ownerProfileId,
      entries,
      status,
      finalizedAt: status === "FINALIZED" ? new Date() : undefined,
    });
  }

  existing.entries = entries;
  existing.status = status;
  existing.ownerProfileId = ownerProfileId;
  if (status === "FINALIZED") {
    existing.finalizedAt = new Date();
  }

  return existing.save();
};

export const finalizePublicationList = async ({
  ownerAuthId,
  entryUpdates,
}) => {
  const userProfile = await resolveUserProfile(ownerAuthId);

  const publication = await Publication.findOne({
    ownerAuthId: userProfile.userId,
  });

  if (!publication) {
    throw new ApiError(404, "No publication list found to finalize");
  }

  if (!entryUpdates || entryUpdates.length === 0) {
    throw new ApiError(
      400,
      "At least one entry update is required to finalize"
    );
  }

  // Update entries with all user-provided fields
  const updatedEntries = publication.entries.map((entry) => {
    const update = entryUpdates.find((u) => u.entryId === entry._id.toString());
    if (update) {
      return {
        ...entry.toObject(),
        title: normalizeString(update.title) ?? entry.title,
        authors:
          update.authors && update.authors.length > 0
            ? normalizeArrayOfStrings(update.authors)
            : entry.authors,
        publicationType:
          normalizeString(update.publicationType) ?? entry.publicationType,
        publisherName:
          normalizeString(update.publisherName) ?? entry.publisherName,
        year: normalizeYear(update.year) ?? entry.year,
        volume: normalizeString(update.volume) ?? entry.volume,
        issue: normalizeString(update.issue) ?? entry.issue,
        pages: normalizeString(update.pages) ?? entry.pages,
        issn: normalizeString(update.issn) ?? entry.issn,
        isbn: normalizeString(update.isbn) ?? entry.isbn,
        description: normalizeString(update.description) ?? entry.description,
      };
    }
    return entry.toObject();
  });

  // Filter to only entries that were included in the update
  const entryIds = new Set(entryUpdates.map((u) => u.entryId));
  const finalEntries = updatedEntries.filter((entry) =>
    entryIds.has(entry._id.toString())
  );

  if (finalEntries.length === 0) {
    throw new ApiError(400, "No valid entries to finalize");
  }

  publication.entries = finalEntries;
  publication.status = "FINALIZED";
  publication.finalizedAt = new Date();

  await publication.save();

  return publication;
};

export const getPublicationSnapshot = async (ownerAuthId) => {
  if (!ownerAuthId) {
    throw new ApiError(400, "Missing user identifier");
  }

  const userProfile = await resolveUserProfile(ownerAuthId);
  const publication = await Publication.findOne({
    ownerAuthId: userProfile.userId,
  });

  return publication;
};
