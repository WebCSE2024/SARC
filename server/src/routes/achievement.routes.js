import express from "express";
import {
  getAllAchievements,
  getAchievementDetails,
} from "../controllers/achievement.controller.js";
const router = express.Router();

router.get("/achievement-list", getAllAchievements);
router.get("/:achievementId", getAchievementDetails);

export default router;
