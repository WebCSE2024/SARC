const Referral = require('../models/Referral');
const { validationResult } = require('express-validator');
const rabbitMQ = require('../config/rabbitmq');

class ReferralController {
  // Create a new referral
  async createReferral(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const referral = new Referral({
        ...req.body,
        alumni_id: req.user.id,
        status: 'Pending'
      });

      await referral.save();

      // Send to admin portal for approval via RabbitMQ
      await rabbitMQ.sendForApproval({
        referralId: referral._id,
        alumniId: req.user.id,
        alumniName: req.user.name,
        alumniEmail: req.user.email,
        ...req.body
      });

      return res.status(201).json({
        success: true,
        data: referral,
        message: 'Referral created and sent for approval'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all approved referrals with pagination and filters
  async getApprovedReferrals(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filters = {};
      
      // Apply filters if provided
      if (req.query.company) {
        filters.company_name = { $regex: req.query.company, $options: 'i' };
      }
      if (req.query.experience_level) {
        filters.experience_level = req.query.experience_level;
      }
      if (req.query.skills) {
        filters.required_skills = { $in: req.query.skills.split(',') };
      }

      filters.status = 'Approved';
      filters.application_deadline = { $gt: new Date() };

      const referrals = await Referral.find(filters)
        .populate('alumni_id', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const total = await Referral.countDocuments(filters);

      return res.json({
        success: true,
        data: referrals,
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

  // Get referral details by ID
  async getReferralById(req, res) {
    try {
      const referral = await Referral.findById(req.params.id)
        .populate('alumni_id', 'name email');

      if (!referral) {
        return res.status(404).json({
          success: false,
          error: 'Referral not found'
        });
      }

      // Check if user has access to view this referral
      if (referral.status !== 'Approved' && 
          req.user.role !== 'Admin' && 
          req.user.role !== 'SuperAdmin' && 
          referral.alumni_id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: referral
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get referral statistics for alumni
  async getAlumniStats(req, res) {
    try {
      const stats = await Referral.aggregate([
        { $match: { alumni_id: req.user.id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedStats = {
        total: 0,
        pending: 0,
        approved: 0,
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

module.exports = new ReferralController();