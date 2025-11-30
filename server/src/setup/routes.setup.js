import express from "express";
import commentRouter from "../domains/comments/comments.routes.js";
import likeRouter from "../domains/likes/likes.routes.js";
import publicationRouter from "../domains/publications/publications.routes.js";
import referralRouter from "../domains/referrals/referral.routes.js";
import sigRouter from "../domains/sig/sig.routes.js";

const router = express.Router();

router.use("/comments", commentRouter);
router.use("/likes", likeRouter);
router.use("/publication", publicationRouter);
router.use("/referral", referralRouter);
router.use("/sig", sigRouter);

export default router;
