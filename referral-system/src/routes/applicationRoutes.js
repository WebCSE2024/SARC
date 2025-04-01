const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { checkRole } = require('../middleware/roleMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

// Validation middleware
const validateApplication = [
  body('resume_url').isURL(),
  body('cover_letter').isLength({ min: 100 }),
  body('referral_id').notEmpty().isMongoId()
];

// Student routes
router.post('/',
  checkRole(['Student']),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 10 }),
  validateApplication,
  applicationController.submitApplication
);
router.get('/student', checkRole(['Student']), applicationController.getStudentApplications);
router.get('/:id', applicationController.getApplicationById);

// Admin routes
router.put('/admin/:id/status',
  checkRole(['Admin', 'SuperAdmin']),
  applicationController.updateApplicationStatus
);
router.get('/admin/stats',
  checkRole(['Admin', 'SuperAdmin']),
  applicationController.getApplicationStats
);

module.exports = router;