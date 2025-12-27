// backend/routes/internships.js
const router = require('express').Router();
const Internship = require('../models/internship.model');

// ==========================================
// ROUTE 1: GET ALL INTERNSHIPS
// URL: GET /api/internships/
// ==========================================
router.route('/').get((req, res) => {
    Internship.find()
        .then(internships => res.json(internships))
        .catch(err => res.status(400).json('Error: ' + err));
});

// ==========================================
// ROUTE 2: ADD A NEW INTERNSHIP
// URL: POST /api/internships/add
// ==========================================
router.route('/add').post((req, res) => {
    const company = req.body.company;
    const position = req.body.position;
    const location = req.body.location;
    const status = req.body.status;
    const appliedDate = Date.parse(req.body.appliedDate);

    const newInternship = new Internship({
        company,
        position,
        location,
        status,
        appliedDate,
    });

    newInternship.save()
        .then(() => res.json("Internship added succesfully"))
        .catch(err => res.status(400).json('Error: ' + err));
});


// ==========================================
// ROUTE 3: UPDATE AN EXISTING INTERNSHIP
// URL: PUT /api/internships/:id
// ==========================================
router.route('/:id').put((req, res) => {
    // --- DEBUG LOGS ---
    console.log("--------------------------------------------------");
    console.log("Attempting direct DB update for ID:", req.params.id);
    console.log("Data to update:", req.body);

    // Use findByIdAndUpdate for a direct database operation.
    Internship.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedInternship => {
            if (!updatedInternship) {
                // If no document was found with that ID
                console.log("❌ Error: Internship not found in DB.");
                return res.status(404).json('Internship not found');
            }
            console.log("✅ SUCCESS: Database document updated!");
            res.json('Internship updated successfully!');
        })
        .catch(err => {
            console.error("❌ Database Error during update:", err);
            res.status(400).json('Error: ' + err);
        });
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