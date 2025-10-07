import express from 'express';
import {  getAllSeminars, getSeminarDetails } from '../controllers/seminar.controllers.js';


const router = express.Router();

router.get('/seminar-list', getAllSeminars);
router.get('/:seminarId', getSeminarDetails);


export default router;