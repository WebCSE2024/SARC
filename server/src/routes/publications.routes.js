import { Router } from "express";
import { upload } from "../../../../shared/middlewares/multer.middleware.js";
import { compressionMiddleware } from "../../../../shared/middlewares/compressor.middleware.js";
import {
  createPublication,
  deletePublication,
  getAllPublications,
  getMyPublications,
  getPublicationDetails,
} from "../controllers/publication.controller.js";
import { setUser } from "../middlewares/setUser.js";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.js"

const router = Router();

router.post(
  "/create-publication",
  authenticate,
  setUser,
  compressionMiddleware,
  upload.single("publication_pdf"),
  createPublication
);
router.get("/publication-list", getAllPublications);
router.get("/:publicationid", getPublicationDetails);
router.delete("/delete/:publicationid", authenticate, setUser, deletePublication);
router.post("/get-my-publications", authenticate, getMyPublications);

export default router;
