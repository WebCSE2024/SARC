import express from "express";
import { getAllSeminars, getSeminarDetails } from "./seminar.controller.js";

const router = express.Router();

router.get("/seminar-list", getAllSeminars);
router.get("/:seminarId", getSeminarDetails);

export default router;
