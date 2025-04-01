const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  alumni_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  job_title: {
    type: String,
    required: true,
    trim: true
  },
  job_description: {
    type: String,
    required: true,
    minlength: 200
  },
  required_skills: [{
    type: String,
    trim: true
  }],
  experience_level: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior'],
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  referral_bonus: {
    type: Number
  },
  application_deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  admin_notes: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Referral', referralSchema);