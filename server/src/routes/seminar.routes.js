import express from 'express';
import { createSeminar, getAllSeminars, getSeminarDetails, updateSeminar, deleteSeminar } from '../controllers/seminar.controllers.js';
import { setUser } from '../middlewares/setUser.js';

const router = express.Router();

router.post('/create',createSeminar);
router.get('/seminar-list', getAllSeminars);
router.get('/:seminarId', getSeminarDetails);
router.put('/:seminarId',updateSeminar);
router.delete('/:seminarId', deleteSeminar);

export default router;