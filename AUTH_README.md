# 🔐 GearGuard Authentication System

A complete authentication system with MySQL backend, JWT tokens, and protected routes.

## ✅ Authentication Features

### Backend (Express.js + MySQL)
- ✅ **User Registration** - Secure signup with password hashing (bcrypt)
- ✅ **User Login** - JWT-based authentication
- ✅ **Password Validation** - Min 8 chars, uppercase, lowercase, special characters
- ✅ **Email Uniqueness** - Prevents duplicate accounts
- ✅ **User Roles** - admin, manager, technician, user
- ✅ **JWT Middleware** - Protected route authentication
- ✅ **Input Validation** - Express-validator for all requests

### Frontend (React + TypeScript)
- ✅ **Login Page** - Full API integration with error handling
- ✅ **Signup Page** - Form validation and password requirements
- ✅ **Protected Routes** - Automatic redirect to login if not authenticated
- ✅ **Auto Logout** - Clears token and redirects on 401 errors
- ✅ **User Profile** - Displays current user info in sidebar
- ✅ **Logout Functionality** - One-click logout with confirmation
- ✅ **Token Management** - Automatic injection in API calls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- npm or yarn

### Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE gearguard_db;
```

2. **Run Migrations:**
```bash
cd server
npm install
npm run db:setup
```

This will create:
- Users table with proper schema
- 5 seed users with valid passwords

### Seed Users

| Email | Password | Role |
|-------|----------|------|
| admin@gearguard.com | Admin@123 | admin |
| manager@gearguard.com | Manager@123 | manager |
| tech1@gearguard.com | Tech@123 | technician |
| tech2@gearguard.com | Tech@123 | technician |
| user@gearguard.com | User@123 | user |

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysqlroot*3
DB_NAME=gearguard_db

JWT_SECRET=gearguard_jwt_secret_key_2025_hackathon
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm install
npx nodemon
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

## 🎯 Testing the Authentication

### 1. Signup Flow
1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: Test@123 (must meet requirements)
   - Confirm Password: Test@123
3. Click "Sign up"
4. Should redirect to dashboard automatically

### 2. Login Flow
1. Navigate to `http://localhost:5173/login`
2. Use one of the seed accounts:
   - Email: admin@gearguard.com
   - Password: Admin@123
3. Click "Sign in"
4. Should redirect to dashboard with user info in sidebar

### 3. Protected Routes
1. Open browser console
2. Clear localStorage: `localStorage.clear()`
3. Try to access `http://localhost:5173/dashboard`
4. Should redirect to `/login` automatically

### 4. Logout
1. Login with any account
2. Click the logout icon in the sidebar (bottom)
3. Should clear token and redirect to login

## 📁 Project Structure

```
GearGuard-odoo-hackathon/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   │   │   └── common/
│   │   │       └── Layout.tsx            # Updated with logout
│   │   ├── pages/
│   │   │   ├── Login.tsx                 # Login with API
│   │   │   └── Signup.tsx                # Signup with validation
│   │   ├── services/
│   │   │   └── api.ts                    # Axios with interceptors
│   │   └── App.tsx                       # Routes with protection
│   └── .env
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.ts         # Auth business logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts         # JWT verification
│   │   │   ├── authValidation.ts         # Input validation
│   │   │   └── validator.ts              # Validation handler
│   │   ├── routes/
│   │   │   └── authRoutes.ts             # Auth endpoints
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   │   └── 000_simplified_schema.sql
│   │   │   └── seeds/
│   │   │       └── 000_simplified_seed.sql
│   │   └── server.ts
│   └── .env
└── README.md
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one special character (@$!%*?&#)

### JWT Token
- 7-day expiration
- Stored in localStorage
- Auto-injected in API requests via axios interceptors
- Verified on every protected route

### Database
- Passwords hashed with bcrypt (10 salt rounds)
- Email uniqueness constraint
- is_active flag for soft deletion

## 🛠️ API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/forgot-password` - Password reset (placeholder)

### Request/Response Format

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "user"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "is_active": true
    }
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid credentials",
  "errors": []
}
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check .env file has correct credentials
cat .env
```

### Frontend can't connect to backend
1. Check backend is running on port 5000
2. Verify CORS origin in server/.env matches `http://localhost:5173`
3. Check client/.env has `VITE_API_URL=http://localhost:5000/api`

### Token not persisting
1. Check browser console for errors
2. Verify localStorage has `token` and `user` items
3. Check axios interceptor is adding Authorization header

### Login fails with valid credentials
1. Check MySQL users table: `SELECT * FROM users;`
2. Verify password hash is correct (not placeholder)
3. Check backend logs for errors
4. Test direct API call: `curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gearguard.com","password":"Admin@123"}'`

## 📝 Next Steps

- [ ] Implement forgot password email flow
- [ ] Add refresh token mechanism
- [ ] Implement role-based access control
- [ ] Add user profile editing
- [ ] Add password change functionality
- [ ] Add two-factor authentication (2FA)
- [ ] Add session timeout warning
- [ ] Implement token blacklist for logout

## 🎉 Success Checklist

- ✅ MySQL database created and migrated
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173
- ✅ Can signup new user
- ✅ Can login with seed account
- ✅ Protected routes redirect to login
- ✅ Logout clears token and redirects
- ✅ User info displays in sidebar

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check backend terminal for logs
3. Verify all environment variables are set
4. Ensure MySQL is running and accessible
5. Test database connection: `npm run db:test` in server directory

---

**Built with ❤️ for the Odoo Hackathon**
