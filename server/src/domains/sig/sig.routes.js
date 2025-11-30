import express from "express";
import {
  getAllSIGs,
  getSIGById,
  getProjectsBySIG,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectYearsBySIG,
} from "./sig.controller.js";
import {
  authenticate,
  requireRole,
} from "../../../../../shared/middlewares/auth.middleware.js";
import { UserType } from "../../../../../shared/types/user.type.js";

const router = express.Router();

// Public routes
router.get("/", getAllSIGs);
router.get("/:sigId", getSIGById);
router.get("/:sigId/projects", getProjectsBySIG);
router.get("/:sigId/projects/years", getProjectYearsBySIG);
router.get("/project/:projectId", getProjectById);

// Admin-only routes for project management
router.post(
  "/project",
  authenticate,
  requireRole(UserType.ADMIN),
  createProject
);
router.put(
  "/project/:projectId",
  authenticate,
  requireRole(UserType.ADMIN),
  updateProject
);
router.delete(
  "/project/:projectId",
  authenticate,
  requireRole(UserType.ADMIN),
  deleteProject
);

export default router;
