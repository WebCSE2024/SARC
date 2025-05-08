import express from "express";
import {
  getAllAchievements,
  getAchievementDetails,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievement.controller.js";
const router = express.Router();
import { setUser } from "../middlewares/setUser.js";
import { upload } from "../middlewares/multer.js";
import { compressionMiddleware } from "../../../../shared/middlewares/compressor.middleware.js";

router.post(
  "/create",
  setUser,
  upload.array("gallery"),
  compressionMiddleware,
  createAchievement
);
router.get("/achievement-list", getAllAchievements);
router.get("/:achievementId", getAchievementDetails);
router.patch("/:achievementId", setUser, updateAchievement);
router.delete("/:achievementId", setUser, deleteAchievement);

export default router;
