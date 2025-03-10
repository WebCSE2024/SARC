import { Router } from "express";
import { setUser } from "../middlewares/setUser.js";
import {upload} from '../middlewares/multer.js'
import { createEvent, deleteEvent, getAllEvents, getEventDetails } from "../controllers/event.controller.js";

const router=Router()

router.post('/create-event',upload.single('event_img'),setUser,createEvent)
router.get('/event-list',getAllEvents)
router.get('/get-event-data/:eventid',getEventDetails)
router.delete('/delete-event/:eventid',deleteEvent)
export default router