// backend/routes/internships.js
const router = require('express').Router();
const Internship = require('../models/internship.model');

// ==========================================
// ROUTE 1: GET ALL INTERNSHIPS
// URL: GET /api/internships/
router.route('/').get((req, res) => {
    // Only find internships where the 'user' field matches the logged-in person
    Internship.find({ user: req.user.userid })
      .then(internships => res.json(internships))
      .catch(err => res.status(400).json('Error: ' + err));
  });

/// ADD NEW
router.route('/add').post((req, res) => {
    // 1. Destructure using the NEW names from your form
    const { company, position, status, appliedDate, location } = req.body; 
    const user = req.user.userid; 
  
    const newInternship = new Internship({
      user, 
      company,
      position,
      location,
      status,       // Now matches perfectly
      appliedDate,  // Now matches perfectly
    });
  
    newInternship.save()
      .then(() => res.json('Internship added!'))
      .catch(err => res.status(400).json({ message: err.message }));
});
// UPDATE EXISTING
router.route('/:id').put((req, res) => {
    const { company, position, status, deadline, location } = req.body;
    
    // Create an update object that matches your Model field names
    const updateData = {
        company,
        position,
        location,
        appliedDate: deadline,
        status: status === "In Process" ? "Interviewing" : status
    };

    Internship.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then(updated => res.json('Internship updated successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
});
// ==========================================
// ROUTE 4: DELETE AN INTERNSHIP
// URL: DELETE /api/internships/:id
// ==========================================
router.route('/:id').delete((req, res) => {
    console.log("--------------------------------------------------");
    console.log("🗑️ Backend: Attempting to delete ID:", req.params.id);

    // Use findByIdAndDelete for a direct, atomic operation.
    Internship.findByIdAndDelete(req.params.id)
        .then(deletedInternship => {
            if (!deletedInternship) {
                // If no document was found with that ID
                console.log("❌ Error: Internship ID not found for deletion.");
                return res.status(404).json('Internship not found');
            }
            console.log("✅ SUCCESS: Database document deleted!");
            res.json('Internship deleted successfully!');
        })
        .catch(err => {
            console.error("❌ Database Error during delete:", err);
            res.status(400).json('Error: ' + err);
        });
});

module.exports = router;