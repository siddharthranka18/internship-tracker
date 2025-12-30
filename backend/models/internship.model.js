// backend/models/internship.model.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const internshipSchema = new Schema({
  // --- LINK TO USER ADDED HERE ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This must match the name you used in mongoose.model("user", ...)
    required: true
  },
  // -------------------------------
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
  location: {
    type: String,
    required: true, 
    trim: true,
  },
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