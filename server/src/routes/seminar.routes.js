import express from 'express';
import { createSeminar, getAllSeminars, getSeminarDetails, updateSeminar, deleteSeminar } from '../controllers/seminar.controllers.js';
import { setUser } from '../middlewares/setUser.js';

const router = express.Router();

router.post('/create',setUser, createSeminar);
router.get('/seminar-list',setUser, getAllSeminars);
router.get('/:seminarId',setUser, getSeminarDetails);
router.put('/:seminarId',setUser, updateSeminar);
router.delete('/:seminarId',setUser, deleteSeminar);

export default router;