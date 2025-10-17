import express from "express";
import { setUser } from "../../middlewares/setUser.js";
import { addLike, removeLike } from "./like.controller.js";

const router = express.Router();

router.post("/add-like", setUser, addLike);
router.delete("/remove-like", setUser, removeLike);

export default router;
