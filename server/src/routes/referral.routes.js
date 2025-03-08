import { Router } from "express";
import { createReferral, getAllReferrals } from "../controllers/referrals.controller.js";
import { setUser } from "../middlewares/setUser.js";
const router=Router()

router.post('/create-referral',setUser,createReferral)
router.get('/referral-list',getAllReferrals)
export default router