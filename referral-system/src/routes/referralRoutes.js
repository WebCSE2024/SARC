const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { checkRole } = require('../middleware/roleMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

// Validation middleware
const validateReferral = [
  body('company_name').notEmpty().trim(),
  body('job_title').notEmpty().trim(),
  body('job_description').isLength({ min: 200 }),
  body('required_skills').isArray(),
  body('experience_level').isIn(['Entry', 'Mid', 'Senior']),
  body('application_deadline').custom(value => {
    const deadline = new Date(value);
    const minDeadline = new Date();
    minDeadline.setDate(minDeadline.getDate() + 7);
    
    if (deadline < minDeadline) {
      throw new Error('Deadline must be at least 7 days from now');
    }
    return true;
  })
];

// Public routes
router.get('/', referralController.getApprovedReferrals);
router.get('/:id', referralController.getReferralById);

// Alumni routes
router.post('/',
  checkRole(['Alumni']),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 5 }),
  validateReferral,
  referralController.createReferral
);
router.get('/stats/alumni', checkRole(['Alumni']), referralController.getAlumniStats);

// Admin routes
router.get('/admin/pending',
  checkRole(['Admin', 'SuperAdmin']),
  referralController.getPendingReferrals
);
router.put('/admin/:id/status',
  checkRole(['Admin', 'SuperAdmin']),
  referralController.updateReferralStatus
);

module.exports = router;