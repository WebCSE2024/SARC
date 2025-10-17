import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const ensureEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parsePositiveInteger = (key) => {
  const raw = ensureEnv(key);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer`);
  }
  return parsed;
};

export const PUBLICATION_ENV = Object.freeze({
  jobTtlSeconds: parsePositiveInteger("PUBLICATION_JOB_TTL_SECONDS"),
  draftTtlSeconds: parsePositiveInteger("PUBLICATION_DRAFT_TTL_SECONDS"),
  socketRoomPrefix:
    process.env.PUBLICATION_SOCKET_ROOM_PREFIX || "publication:user",
});

export const PUBLICATION_REDIS_KEYS = Object.freeze({
  job: (jobId) => `publication_job_${jobId}`,
  draft: (userId) => `publication_draft_${userId}`,
  userJobs: (userId) => `publication_user_jobs_${userId}`,
});
