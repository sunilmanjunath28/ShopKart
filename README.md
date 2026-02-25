# E-Commerce Application

A full-stack e-commerce platform built with Spring Boot backend and vanilla JavaScript frontend.

## Project Structure

```
├── backend/          # Spring Boot REST API
├── frontend/         # HTML/CSS/JavaScript frontend
└── .snapshots/       # AI interaction snapshots
```

## Features

### Backend (Spring Boot)
- User authentication and authorization
- Product management (CRUD operations)
- Category management
- Order processing
- Review system
- Real-time chat functionality
- MySQL database integration
- Spring Security with BCrypt encryption
- RESTful API design
- CORS enabled for frontend integration

### Frontend (Vanilla JavaScript)
- User registration and login
- Product browsing and search
- Shopping cart functionality
- Order management
- User profile management
- Seller dashboard for managing products
- Buyer dashboard for purchases
- Product reviews
- Wishlist functionality
- Responsive design

## Technology Stack

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage for session management

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven (included via wrapper)
- Modern web browser

### Database Setup

1. Install MySQL and start the service

2. Create the database:
```sql
CREATE DATABASE ecommerce;
```

3. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Open `frontend/index.html` in a web browser, or

2. Use a local development server:
```bash
cd frontend
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Access the frontend at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (authenticated)
- `PUT /api/products/{id}` - Update product (authenticated)
- `DELETE /api/products/{id}` - Delete product (authenticated)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (authenticated)

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/{id}` - Get order details (authenticated)

### Reviews
- `GET /api/products/{productId}/reviews` - Get product reviews
- `POST /api/products/{productId}/reviews` - Add review (authenticated)

### User Profile
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update profile (authenticated)

### Chat
- `GET /api/chat` - Get chat messages (authenticated)
- `POST /api/chat` - Send message (authenticated)

## Default Users

The application initializes with demo data including:
- Sample products across multiple categories
- Test user accounts (check DataInitializer.java)

## Testing

### Backend Testing
```bash
cd backend
mvnw.cmd test
```

### API Testing
Use the provided test HTML files in the frontend directory:
- `test-api.html` - Test API endpoints
- `test-backend-connection.html` - Test backend connectivity
- `test-products.html` - Test product endpoints
- `test-categories.html` - Test category endpoints

Or use tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

### Example cURL Commands

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Products
curl http://localhost:8080/api/products
```

## Project Features

### User Roles
- **Buyer**: Browse products, place orders, write reviews
- **Seller**: Manage product listings, view sales
- **Admin**: Full system access (future enhancement)

### Security
- Password encryption using BCrypt
- JWT-like session management
- CORS configuration for cross-origin requests
- Protected endpoints requiring authentication

### Data Persistence
- MySQL relational database
- JPA/Hibernate ORM
- Automatic schema generation
- Data initialization on startup

## Development

### Adding New Features

1. Backend:
   - Create model in `model/` package
   - Create repository in `repository/` package
   - Create service in `service/` package
   - Create controller in `controller/` package
   - Add DTOs if needed in `dto/` package

2. Frontend:
   - Create HTML page in `frontend/`
   - Add JavaScript logic in `frontend/js/`
   - Style with CSS in `frontend/css/`

### Code Structure

#### Backend Package Structure
```
com.commerce.ecommerce
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── model/          # Entity classes
├── repository/     # Data access layer
└── service/        # Business logic
```

## Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check database credentials in application.properties
- Verify Java version (17+)
- Check port 8080 is not in use

### Frontend Issues
- Clear browser cache and local storage
- Check browser console for errors
- Verify backend is running on port 8080
- Check CORS configuration if requests fail

### Common Errors
- `Connection refused`: Backend not running
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Check API endpoint URLs
- `500 Internal Server Error`: Check backend logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes.

## Support

For issues and questions, please check:
- Backend logs in console
- Browser developer console
- MySQL error logs
- Application properties configuration

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Product recommendations
- [ ] Admin dashboard
- [ ] Order tracking
- [ ] Inventory management
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Social media integration
