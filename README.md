# JWT Authentication System

A complete authentication system built with Node.js, Express, PostgreSQL, and JWT tokens. Features include user registration, login, logout, token refresh, and a modern responsive frontend.

## Features

- 🔐 **JWT-based Authentication** with access and refresh tokens
- 🗄️ **PostgreSQL Database** for secure data storage
- 🔒 **Password Hashing** using bcrypt
- 🛡️ **Security Features** including rate limiting, CORS, and Helmet
- 📱 **Responsive Frontend** with modern UI design
- 🔄 **Token Refresh** mechanism for seamless user experience
- 🚫 **Secure Logout** with token invalidation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd auth

# Install dependencies
npm install
```

### 2. PostgreSQL Setup

#### Option A: Using Docker (Recommended)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name auth-postgres \
  -e POSTGRES_PASSWORD=your_password_here \
  -e POSTGRES_DB=auth_db \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL Installation

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE auth_db;
   CREATE USER postgres WITH PASSWORD 'your_password_here';
   GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
   ```

### 3. Environment Configuration

1. Copy the `.env` file and update the values:

   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=auth_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # Security
   BCRYPT_ROUNDS=12
   ```

2. **IMPORTANT**: Change the `DB_PASSWORD` and `JWT_SECRET` to secure values!

### 4. Database Schema Setup

Run the SQL schema file in your PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres -d auth_db

# Run the schema (copy and paste the content from config/schema.sql)
# Or use the file directly:
psql -U postgres -d auth_db -f config/schema.sql
```

### 5. Start the Server

```bash
# Start the server
npm start

# Or if you want to use nodemon for development
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

| Method | Endpoint            | Description          | Body                                                         |
| ------ | ------------------- | -------------------- | ------------------------------------------------------------ |
| POST   | `/api/auth/signup`  | User registration    | `{ "email": "user@example.com", "password": "password123" }` |
| POST   | `/api/auth/login`   | User login           | `{ "email": "user@example.com", "password": "password123" }` |
| POST   | `/api/auth/refresh` | Refresh access token | `{ "refreshToken": "token_here" }`                           |
| POST   | `/api/auth/logout`  | User logout          | `{ "refreshToken": "token_here" }`                           |
| GET    | `/api/auth/profile` | Get user profile     | Requires Authorization header                                |

### Other Routes

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | `/`                  | Server status        |
| GET    | `/health`            | Health check         |
| GET    | `/public/index.html` | Frontend application |

## Frontend Usage

1. Open your browser and navigate to `http://localhost:5000/public/index.html`
2. Use the signup form to create a new account
3. Login with your credentials
4. View your profile information
5. Logout when done

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with configurable salt rounds
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Rate Limiting**: Prevents brute force attacks (100 requests per 15 minutes per IP)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection against common vulnerabilities
- **Input Validation**: Server-side validation for all user inputs
- **Token Invalidation**: Secure logout with token removal from database

## Database Schema

### Users Table

- `id`: Primary key (auto-increment)
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Refresh Tokens Table

- `id`: Primary key (auto-increment)
- `user_id`: Foreign key to users table
- `token`: JWT refresh token
- `expires_at`: Token expiration timestamp
- `created_at`: Token creation timestamp

## Environment Variables

| Variable                 | Description                | Default     |
| ------------------------ | -------------------------- | ----------- |
| `PORT`                   | Server port number         | 5000        |
| `NODE_ENV`               | Environment mode           | development |
| `DB_HOST`                | PostgreSQL host            | localhost   |
| `DB_PORT`                | PostgreSQL port            | 5432        |
| `DB_NAME`                | Database name              | auth_db     |
| `DB_USER`                | Database username          | postgres    |
| `DB_PASSWORD`            | Database password          | -           |
| `JWT_SECRET`             | Secret key for JWT signing | -           |
| `JWT_EXPIRES_IN`         | Access token expiration    | 24h         |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration   | 7d          |
| `BCRYPT_ROUNDS`          | Password hashing rounds    | 12          |

## Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (replace TOKEN with actual access token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the collection (if available)
2. Set the base URL to `http://localhost:5000`
3. Use the endpoints as described above

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `auth_db` exists

2. **JWT Token Errors**

   - Verify `JWT_SECRET` is set in `.env`
   - Check token expiration settings
   - Ensure tokens are sent in Authorization header

3. **CORS Errors**

   - Check frontend URL in CORS configuration
   - Verify `credentials: true` is set in frontend requests

4. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill process using the port: `npx kill-port 5000`

### Logs

Check server console for detailed error messages and database connection status.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique `JWT_SECRET`
3. Configure proper CORS origins
4. Set up HTTPS
5. Use environment-specific database credentials
6. Implement proper logging
7. Set up monitoring and health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
