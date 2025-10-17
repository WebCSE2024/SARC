import { Router } from "express";
import { upload } from "../../../../../shared/middlewares/multer.middleware.js";
import {
  deletePublication,
  finalizePublication,
  getAllPublications,
  getMyPublications,
  getPublicationDetails,
  getPublicationJob,
  getPublicationState,
  uploadPublication,
} from "./publication.controller.js";
import { setUser } from "../../middlewares/setUser.js";
import {
  authenticate,
  requireRole,
} from "../../../../../shared/middlewares/auth.middleware.js";
import { UserType } from "../../../../../shared/types/user.type.js";

const router = Router();

router.post(
  "/upload",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  upload.single("publication_pdf"),
  uploadPublication
);

router.get(
  "/me",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  getPublicationState
);

router.post(
  "/finalize",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  finalizePublication
);

router.get(
  "/jobs/:jobId",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  getPublicationJob
);

router.get("/publication-list", getAllPublications);
router.get("/:publicationid", getPublicationDetails);
router.delete(
  "/delete",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  deletePublication
);
router.get(
  "/my/list",
  authenticate,
  requireRole([UserType.PROFESSOR, UserType.ADMIN]),
  setUser,
  getMyPublications
);

export default router;
