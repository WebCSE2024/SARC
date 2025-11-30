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

router.post(
  "/create-referral",
  authenticate,
  requireRole([UserType.ADMIN, UserType.PROFESSOR, UserType.ALUMNI]),
  setUser,
  createReferral
);
router.get(
  "/referral-list",
  authenticate,
  requireRole(UserType.ADMIN),
  getAllReferrals
);
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
router.post("/:referralId", authenticate, getReferralDetails);
router.get(
  "/get-my-referral",
  authenticate,
  requireRole([UserType.ALUMNI, UserType.ADMIN, UserType.PROFESSOR]),
  getMyReferrals
);
router.get("/active", authenticate, getActiveReferrals);

export default router;
