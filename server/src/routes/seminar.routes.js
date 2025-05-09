import express from 'express';
import { createSeminar, getAllSeminars, getSeminarDetails, updateSeminar, deleteSeminar } from '../controllers/seminar.controllers.js';
import { upload } from '../middlewares/multer.js';
import { compressionMiddleware } from '../../../../shared/middlewares/compressor.middleware.js';

const router = express.Router();

router.post('/create',createSeminar);
router.get('/seminar-list', getAllSeminars);
router.get('/:seminarId', getSeminarDetails);
router.put('/:seminarId', upload.single('image'), compressionMiddleware, updateSeminar);
router.delete('/:seminarId',  deleteSeminar);

export default router;