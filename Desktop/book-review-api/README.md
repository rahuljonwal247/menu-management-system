# 📚 Book Review API

A comprehensive RESTful API for managing books and reviews, built with Node.js, Express.js, and MongoDB. This API provides secure user authentication, book management, review functionality, and advanced search capabilities.

## 🚀 Features

- **🔐 User Authentication**: Secure JWT-based authentication system
- **📖 Book Management**: Complete CRUD operations for books
- **⭐ Review System**: Users can add, update, and delete their reviews
- **🔍 Advanced Search**: Search books by title or author with fuzzy matching
- **📄 Pagination**: Efficient data retrieval with customizable pagination
- **🔧 Filtering**: Filter books by author and genre
- **📊 Rating System**: Automatic calculation of average ratings
- **🛡️ Security**: Rate limiting, input validation, and security headers

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Development**: Nodemon for auto-restart

## 📋 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |

### Book Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books/getBooks` | Get all books (paginated, filterable) | ❌ |
| GET | `/api/books/:id` | Get book details with reviews | ❌ |
| POST | `/api/books/addBook` | Add a new book | ✅ |
| GET | `/api/search` | Search books by title or author | ❌ |

### Review Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/books/:id/reviews` | Submit a review | ✅ |
| PUT | `/api/reviews/:id` | Update your own review | ✅ |
| DELETE | `/api/reviews/:id` | Delete your own review | ✅ |

## 🏗️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/rahuljonwal247/book-review-api.git
cd book-review-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/book-review-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### 4. Database Setup
Make sure MongoDB is running:

**For local MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**For MongoDB Atlas:**
1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Get your connection string
3. Replace `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📊 Database Schema

### User Collection

### Book Collection

### Review Collection

### Database Relationships
- **User → Books**: One-to-Many (user can create multiple books)
- **User → Reviews**: One-to-Many (user can write multiple reviews)
- **Book → Reviews**: One-to-Many (book can have multiple reviews)
- **Unique Constraint**: One review per user per book

## 📝 Example API Requests

### 1. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bookworm2024",
    "email": "reader@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6507d1234567890abcdef123",
      "username": "bookworm2024",
      "email": "reader@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reader@example.com",
    "password": "securepass123"
  }'
```

### 3. Add a New Book (Authenticated)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Fiction",
    "description": "A timeless American classic about the Jazz Age",
    "publishedYear": 1925,
    "isbn": "978-0-7432-7356-5"
  }'
```

### 4. Get All Books with Pagination and Filters
```bash
# Basic request
curl http://localhost:3000/api/books

# With pagination
curl "http://localhost:3000/api/books?page=1&limit=5"

# With filters
curl "http://localhost:3000/api/books?author=Fitzgerald&genre=Fiction&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6507d1234567890abcdef456",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Classic Fiction",
      "averageRating": 4.5,
      "totalReviews": 12,
      "createdBy": {
        "_id": "6507d1234567890abcdef123",
        "username": "bookworm2024"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 5. Get Book Details with Reviews
```bash
curl http://localhost:3000/api/books/6507d1234567890abcdef456
```

### 6. Submit a Review (Authenticated)
```bash
curl -X POST http://localhost:3000/api/books/6507d1234567890abcdef456/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Absolutely brilliant! A masterpiece of American literature."
  }'
```

### 7. Search Books
```bash
# Search by title
curl "http://localhost:3000/api/search?q=gatsby"

# Search by author
curl "http://localhost:3000/api/search?q=fitzgerald"

# Search with pagination
curl "http://localhost:3000/api/search?q=fiction&page=1&limit=5"
```

### 8. Update Your Review (Authenticated)
```bash
curl -X PUT http://localhost:3000/api/reviews/6507d1234567890abcdef789 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Great book, but the ending could have been better."
  }'
```

### 9. Delete Your Review (Authenticated)
```bash
curl -X DELETE http://localhost:3000/api/reviews/6507d1234567890abcdef789 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Advanced Usage

### Pagination Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Book Filtering
- `author`: Filter by author name (case-insensitive)
- `genre`: Filter by genre (case-insensitive)

### Search Features
- Case-insensitive partial matching
- Searches both title and author fields
- Results sorted by rating and creation date

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation with express-validator
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing

## 🧪 Testing

### Manual Testing with Postman
1. Import the API endpoints into Postman
2. Set up environment variables for base URL and auth token
3. Test each endpoint with various scenarios

### Example Test Scenarios
- ✅ User registration with valid data
- ❌ User registration with invalid email
- ✅ Login with correct credentials
- ❌ Login with wrong password
- ✅ Add book with authentication
- ❌ Add book without authentication
- ✅ Submit review for a book
- ❌ Submit duplicate review for same book

## 📈 Performance Considerations

### Database Indexes
```javascript
// Implemented indexes for optimal performance
- User: { email: 1, username: 1 }
- Book: { title: 'text', author: 'text' }
- Book: { author: 1, genre: 1 }
- Review: { book: 1, user: 1 } (unique compound index)
```

### Query Optimization
- Pagination with skip/limit
- Selective field population
- Efficient aggregation for rating calculations

## 🔄 Design Decisions & Assumptions

### Authentication
- **JWT Choice**: Stateless authentication for scalability
- **Token Expiry**: 7 days default (configurable)
- **Password Security**: bcrypt with 12 salt rounds

### Database Design
- **MongoDB**: Chosen for flexibility with JSON-like documents
- **Mongoose**: ODM for schema validation and middleware
- **Referential Integrity**: Manual handling for better performance

### API Design
- **RESTful Principles**: Clear resource-based URLs
- **HTTP Status Codes**: Proper status codes for different scenarios
- **Response Format**: Consistent JSON response structure

### Business Logic
- **One Review Per User Per Book**: Prevents spam and duplicate reviews
- **Auto-Rating Calculation**: Real-time average rating updates
- **Soft Constraints**: Flexible ISBN validation (optional field)

### Error Handling
- **Validation Errors**: Detailed field-level error messages
- **Authentication Errors**: Secure error messages (no user enumeration)
- **Database Errors**: Graceful handling of connection issues

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews
JWT_SECRET=super-secure-random-string-for-production
JWT_EXPIRE=7d
```

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Vercel**: Serverless deployment option
- **AWS/GCP**: Full control with EC2/Compute Engine
- **DigitalOcean**: Simple VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@rahuljonwal247](https://github.com/rahuljonwal247)
- Email: rahuljonwal247@gmail.com

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- MongoDB team for the robust database solution
- JWT.io for authentication insights
- Node.js ecosystem for amazing packages

---

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/rahuljonwal247/book-review-api/issues) page
2. Create a new issue with detailed description
3. Contact the maintainer via email

**Happy coding! 📚✨**