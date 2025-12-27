// backend/models/internship.model.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const internshipSchema = new Schema({
  company: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  position: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  // --- NEW FIELD ADDED HERE ---
  location: {
    type: String,
    required: true, // Let's make it required. Change to false if you want it optional.
    trim: true,
  },
  // ---------------------------
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Interviewing', 'Offer Received', 'Rejected'],
    default: 'Applied'
  },
  appliedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
}, {
  timestamps: true,
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;