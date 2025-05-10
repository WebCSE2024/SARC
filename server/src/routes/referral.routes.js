import { Router } from "express";
import { createReferral, getActiveReferrals, getAllReferrals, getMyReferrals, getReferralDetails, toggleReferralState } from "../controllers/referrals.controller.js";
import { setUser } from "../middlewares/setUser.js";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.js"
const router = Router()

router.post('/create-referral',authenticate, setUser, createReferral)
router.get('/referral-list', getAllReferrals)
router.patch('/toggle-status', authenticate, setUser, toggleReferralState)
router.post('/:referralId', authenticate, setUser, getReferralDetails)
router.get('/get-my-referral', getMyReferrals)
router.get('/active', getActiveReferrals)

export default router