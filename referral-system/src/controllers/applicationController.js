const Application = require('../models/Application');
const Referral = require('../models/Referral');
const { validationResult } = require('express-validator');

class ApplicationController {
  // Submit new application
  async submitApplication(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if referral exists and is approved
      const referral = await Referral.findById(req.body.referral_id);
      if (!referral) {
        return res.status(404).json({
          success: false,
          error: 'Referral not found'
        });
      }

      if (referral.status !== 'Approved') {
        return res.status(400).json({
          success: false,
          error: 'Cannot apply to unapproved referral'
        });
      }

      if (referral.application_deadline < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Application deadline has passed'
        });
      }

      // Check if student has already applied
      const existingApplication = await Application.findOne({
        student_id: req.user.id,
        referral_id: req.body.referral_id
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: 'You have already applied for this referral'
        });
      }

      const application = new Application({
        ...req.body,
        student_id: req.user.id,
        status: 'Submitted'
      });

      await application.save();

      return res.status(201).json({
        success: true,
        data: application,
        message: 'Application submitted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get student's applications
  async getStudentApplications(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const applications = await Application.find({ student_id: req.user.id })
        .populate('referral_id', 'company_name job_title')
        .skip(skip)
        .limit(limit)
        .sort({ applied_at: -1 });

      const total = await Application.countDocuments({ student_id: req.user.id });

      return res.json({
        success: true,
        data: applications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          records: total
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get application details
  async getApplicationById(req, res) {
    try {
      const application = await Application.findById(req.params.id)
        .populate('referral_id')
        .populate('student_id', 'name email');

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      // Check if user has access to view this application
      if (application.student_id.toString() !== req.user.id && 
          req.user.role !== 'Admin' && 
          req.user.role !== 'SuperAdmin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: application
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update application status (Admin only)
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Under Review', 'Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }

      const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('student_id', 'name email')
        .populate('referral_id', 'company_name job_title');

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      return res.json({
        success: true,
        data: application,
        message: `Application status updated to ${status}`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get application statistics
  async getApplicationStats(req, res) {
    try {
      const stats = await Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedStats = {
        total: 0,
        submitted: 0,
        under_review: 0,
        accepted: 0,
        rejected: 0
      };

      stats.forEach(stat => {
        formattedStats[stat._id.toLowerCase()] = stat.count;
        formattedStats.total += stat.count;
      });

      return res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ApplicationController();