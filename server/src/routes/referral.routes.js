import { Router } from "express";
import { applyReferral, createReferral, getAllReferrals, getMyReferrals, getReferralDetails } from "../controllers/referrals.controller.js";
import { setUser } from "../middlewares/setUser.js";
const router=Router()

router.post('/create-referral',setUser,createReferral)
router.get('/referral-list',getAllReferrals)
router.post('/apply/:referralId',setUser,applyReferral)
router.post('/get-referral-data/:referralId',setUser,getReferralDetails)
router.post('/get-my-referral',setUser,getMyReferrals,)

export default router