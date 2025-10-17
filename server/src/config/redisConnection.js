import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is required");
}

const createClient = () => {
  const instance = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });

  instance.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  return instance;
};

const redis = createClient();
const client = createClient();

export { redis, client };
