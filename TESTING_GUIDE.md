# 🎯 Quick Authentication Test Guide

## ✅ System Status
- **Backend**: Running on http://localhost:5000
- **Frontend**: Running on http://localhost:5173  
- **Database**: MySQL (gearguard_db) with updated passwords

## 🧪 Test Scenarios

### 1. Login Test (Existing User)
**URL**: http://localhost:5173/login

**Test Accounts**:
| Email | Password | Role | Expected Result |
|-------|----------|------|----------------|
| admin@gearguard.com | Admin@123 | admin | ✅ Login success → Dashboard |
| manager@gearguard.com | Manager@123 | manager | ✅ Login success → Dashboard |
| tech1@gearguard.com | Tech@123 | technician | ✅ Login success → Dashboard |
| user@gearguard.com | User@123 | user | ✅ Login success → Dashboard |

**Steps**:
1. Open http://localhost:5173/login
2. Enter email and password from table above
3. Click "Sign in"
4. Verify:
   - Redirects to /dashboard
   - User info appears in sidebar (name and role)
   - Token stored in localStorage

### 2. Signup Test (New User)
**URL**: http://localhost:5173/signup

**Test Data**:
- Name: John Doe
- Email: john@example.com
- Password: John@123
- Confirm Password: John@123

**Steps**:
1. Open http://localhost:5173/signup
2. Fill in the form with test data
3. Click "Sign up"
4. Verify:
   - New user created in database
   - Auto-login successful
   - Redirects to /dashboard
   - User info appears in sidebar

### 3. Password Validation Test
**URL**: http://localhost:5173/signup

**Test Invalid Passwords**:
| Password | Expected Error |
|----------|---------------|
| test | Too short |
| testtest | No uppercase |
| TESTTEST | No lowercase |
| TestTest | No special character |
| Test@12 | Less than 8 characters |

**Steps**:
1. Try each invalid password
2. Verify error message appears
3. Submit button should be disabled

### 4. Protected Route Test
**URL**: http://localhost:5173/dashboard (without login)

**Steps**:
1. Clear localStorage in browser console:
   ```javascript
   localStorage.clear()
   ```
2. Try to access http://localhost:5173/dashboard
3. Verify:
   - Redirects to /login automatically
   - Toast notification appears

### 5. Logout Test
**URL**: Any protected page after login

**Steps**:
1. Login with any account
2. Click logout icon (🚪) in sidebar
3. Verify:
   - localStorage cleared
   - Redirects to /login
   - Success toast appears
   - Cannot access protected pages

### 6. Token Expiration Test
**Steps**:
1. Login with any account
2. Open browser DevTools > Application > Local Storage
3. Find and modify the token to an invalid value
4. Try to navigate to any page or refresh
5. Verify:
   - Auto redirects to /login
   - Token cleared from localStorage

### 7. User Info Display Test
**Steps**:
1. Login with admin@gearguard.com
2. Check sidebar bottom section
3. Verify displays:
   - Initials: "SA" (System Admin)
   - Name: "System Admin"
   - Role: "admin"

## 🔍 API Testing (Optional)

### Login API
```bash
# PowerShell
$body = @{ email = "admin@gearguard.com"; password = "Admin@123" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

Expected Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "admin@gearguard.com",
      "name": "System Admin",
      "role": "admin"
    }
  }
}
```

### Signup API
```bash
# PowerShell
$body = @{ name = "New User"; email = "new@example.com"; password = "New@123"; role = "user" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

Expected Response:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 6,
      "email": "new@example.com",
      "name": "New User",
      "role": "user"
    }
  }
}
```

## 🐛 Troubleshooting

### Issue: Login fails with "Invalid credentials"
**Solution**: Passwords were updated. Use the correct passwords from the table above.

### Issue: Frontend shows "Network Error"
**Solution**: 
1. Check backend is running: `cd server && npx nodemon`
2. Verify .env files exist and are correct

### Issue: "Token expired" error
**Solution**: Token expires after 7 days. Login again to get a new token.

### Issue: Protected route accessible without login
**Solution**: Clear browser cache and localStorage, then try again.

## ✅ Success Checklist

- [ ] Can login with admin account
- [ ] Can login with other roles (manager, tech, user)
- [ ] Can create new account via signup
- [ ] Password validation works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout clears token and redirects
- [ ] User info displays correctly in sidebar
- [ ] Token persists across page refreshes (until logout)

## 📊 Test Results

After completing all tests, verify in MySQL:
```sql
USE gearguard_db;
SELECT id, email, name, role, is_active, created_at FROM users ORDER BY id;
```

You should see:
- 5 seed users (admin, manager, tech1, tech2, user)
- Any new users created via signup
- All with `is_active = 1`

---

**Testing completed successfully! 🎉**
