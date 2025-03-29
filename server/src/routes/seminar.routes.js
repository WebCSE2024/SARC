import express from 'express';
import { createSeminar, getAllSeminars, getSeminarDetails, updateSeminar, deleteSeminar } from '../controllers/seminar.controllers.js';

const router = express.Router();

router.post('/create', createSeminar);
router.get('/all-seminars', getAllSeminars);
router.get('/:seminarId', getSeminarDetails);
router.put('/:seminarId', updateSeminar);
router.delete('/:seminarId', deleteSeminar);

export default router;