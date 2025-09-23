const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, 'i');
    }
    if (req.query.genre) {
      filter.genre = new RegExp(req.query.genre, 'i');
    }
    
    // Get books with pagination
    const books = await Book.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Book.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single book with reviews
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get reviews with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalReviews = await Review.countDocuments({ book: req.params.id });
    const reviewPages = Math.ceil(totalReviews / limit);
    
    res.json({
      success: true,
      data: {
        book,
        reviews,
        reviewPagination: {
          page,
          limit,
          total: totalReviews,
          pages: reviewPages
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const book = new Book(bookData);
    await book.save();
    await book.populate('createdBy', 'username');
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A book with this ISBN already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Create search filter
    const searchFilter = {
      $or: [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ]
    };
    
    const books = await Book.find(searchFilter)
      .populate('createdBy', 'username')
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Book.countDocuments(searchFilter);
    const pages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      searchQuery: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  searchBooks
};