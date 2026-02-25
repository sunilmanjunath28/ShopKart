# E-Commerce Backend

Spring Boot REST API for the e-commerce application.

## Setup Instructions

### 1. Database Configuration

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### 2. Create Database

```sql
CREATE DATABASE ecommerce;
```

### 3. Run the Application

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product

## Features

- ✅ CORS enabled for frontend integration
- ✅ Spring Security with BCrypt password encryption
- ✅ Auto-initialization of demo products
- ✅ MySQL database integration
- ✅ RESTful API design
- ✅ Error handling with proper HTTP status codes

## Testing

You can test the API using:
- Browser (for GET requests)
- Postman
- cURL
- Frontend application

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
