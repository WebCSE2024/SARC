import express from "express";
import achievementRoutes from "../domains/achievements/achievement.routes.js";
import commentRouter from "../domains/comments/comments.routes.js";
import likeRouter from "../domains/likes/likes.routes.js";
import publicationRouter from "../domains/publications/publications.routes.js";
import referralRouter from "../domains/referrals/referral.routes.js";
import seminarRouter from "../domains/seminars/seminar.routes.js";

const router = express.Router();

router.use("/achievement", achievementRoutes);
router.use("/comments", commentRouter);
router.use("/likes", likeRouter);
router.use("/publication", publicationRouter);
router.use("/referral", referralRouter);
router.use("/seminar", seminarRouter);

export default router;
