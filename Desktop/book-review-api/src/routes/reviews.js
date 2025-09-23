const express = require('express');
const { updateReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { validateReview, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All review routes require authentication
router.use(auth);

router.put('/:id', validateObjectId, validateReview, updateReview);
router.delete('/:id', validateObjectId, deleteReview);

module.exports = router;