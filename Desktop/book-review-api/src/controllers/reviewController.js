const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: userId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book'
      });
    }
    
    // Create new review
    const review = new Review({
      book: bookId,
      user: userId,
      rating: req.body.rating,
      comment: req.body.comment
    });
    
    await review.save();
    await review.populate('user', 'username');
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own reviews'
      });
    }
    
    // Update review
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment !== undefined ? req.body.comment : review.comment;
    
    await review.save();
    await review.populate('user', 'username');
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own reviews'
      });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview
};
