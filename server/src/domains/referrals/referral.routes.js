import { Router } from "express";
import {
  createReferral,
  getActiveReferrals,
  getAllReferrals,
  getMyReferrals,
  getReferralDetails,
  toggleReferralState,
  deleteReferral,
} from "./referrals.controller.js";
import { setUser } from "../../middlewares/setUser.js";
import {
  authenticate,
  requireRole,
} from "../../../../../shared/middlewares/auth.middleware.js";
import { UserType } from "../../../../../shared/types/user.type.js";
const router = Router();

router.post("/create-referral", authenticate, setUser, createReferral);
router.get("/referral-list", getAllReferrals);
router.patch(
  "/toggle-status/:id",
  authenticate,
  requireRole(UserType.ADMIN),
  toggleReferralState
);
router.delete(
  "/delete/:id",
  authenticate,
  requireRole(UserType.ADMIN),
  deleteReferral
);
router.post("/:referralId", authenticate, setUser, getReferralDetails);
router.get("/get-my-referral", getMyReferrals);
router.get("/active", getActiveReferrals);

export default router;
