import express from "express";
import {
  addComment,
  addReply,
  getComments,
  deleteComment,
  deleteReply,
} from "./comment.controller.js";
import { setUser } from "../../middlewares/setUser.js";
import { authenticate } from "../../../../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-comment", authenticate, setUser, addComment);
router.post("/add-reply/:commentId", authenticate, setUser, addReply);
router.get("/get-comments/:postId", authenticate, setUser, getComments);
router.delete(
  "/delete-comment/:commentId",
  authenticate,
  setUser,
  deleteComment
);
router.delete("/delete-reply/:replyId", authenticate, setUser, deleteReply);

export default router;
