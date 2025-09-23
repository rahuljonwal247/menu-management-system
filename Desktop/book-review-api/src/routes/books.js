const express = require('express');
const { 
  getBooks, 
  getBook, 
  addBook, 
  searchBooks 
} = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { 
  validateBook, 
  validateReview, 
  validatePagination, 
  validateObjectId 
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/getBooks', validatePagination, getBooks);
router.get('/search', validatePagination, searchBooks);
router.get('/:id', validateObjectId, validatePagination, getBook);

// Protected routes
router.post('/addBook', auth, validateBook, addBook);
router.post('/:id/reviews', auth, validateObjectId, validateReview, addReview);

module.exports = router;