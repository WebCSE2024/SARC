import { Router } from "express";
import { applyReferral, createReferral, getActiveReferrals, getAllReferrals, getMyReferrals, getReferralDetails, toggleReferralState } from "../controllers/referrals.controller.js";
import { setUser } from "../middlewares/setUser.js";
const router=Router()

router.post('/create-referral',setUser,createReferral)
router.get('/referral-list',getAllReferrals)
router.patch('/toggle-status',setUser,toggleReferralState)
// router.post('/apply/:referralId',setUser,applyReferral)
router.post('/:referralId',setUser,getReferralDetails)
router.get('/get-my-referral',setUser,getMyReferrals)
router.get('/active',getActiveReferrals)

export default router