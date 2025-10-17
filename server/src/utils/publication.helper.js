import { ApiError } from "./ApiError.js";
import { aiMlAPI } from "../../../../shared/axios/axiosInstance.js";

export const sendPDFToPDFExtractionEngine = async (
  jobId,
  filePath,
  userId,
  metadata = {}
) => {
  try {
    if (!filePath) {
      throw new ApiError(400, "No file path provided");
    }

    await aiMlAPI.post(
      "/extract",
      {
        jobId,
        filePath,
        userId,
        metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Failed to send PDF to extraction engine"
    );
  }
};
