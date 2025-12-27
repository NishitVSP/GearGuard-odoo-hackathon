# 🚀 GearGuard - Quick Start Guide

## ⏱️ 5-Minute Setup

Follow these steps to get GearGuard running in 5 minutes!

### Step 1: Prerequisites Check ✓

Make sure you have:
- ✅ MySQL installed and running
- ✅ Node.js 18+ installed
- ✅ MySQL Workbench (optional, but recommended)

**Verify:**
```powershell
node --version    # Should show v18 or higher
mysql --version   # Should show MySQL 8.0 or higher
```

### Step 2: Configure MySQL Password 🔐

1. Open `server\.env` file
2. Find this line:
   ```
   DB_PASSWORD=
   ```
3. Add your MySQL root password:
   ```
   DB_PASSWORD=your_mysql_password
   ```
4. Save the file

### Step 3: Install Dependencies 📦

**Open 3 PowerShell terminals:**

**Terminal 1 - Server:**
```powershell
cd server
npm install
```

**Terminal 2 - Client:**
```powershell
cd client
npm install
```

**Terminal 3 - Shared (optional):**
```powershell
cd shared
npm install
```

### Step 4: Setup Database 🗄️

In **Terminal 1** (server):
```powershell
npm run db:setup
```

You should see:
```
✅ Connected to MySQL server
✅ Database 'gearguard_db' created or already exists
✅ Using database 'gearguard_db'
✅ Migrations table ready
📦 Found X pending migration(s)
🔄 Running migration: 001_create_users.sql
✅ Migration completed: 001_create_users.sql
...
🌱 Running seed files...
✅ All migrations completed successfully
```

**Test the connection:**
```powershell
npm run db:test
```

### Step 5: Start Development Servers 🚀

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```
Wait for: `Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```
Wait for: `Local: http://localhost:5173`

### Step 6: Open in Browser 🌐

1. Open browser to: http://localhost:5173
2. Login with:
   - **Email**: `admin@gearguard.com`
   - **Password**: `admin123`

### Step 7: Verify in MySQL Workbench 🔍

1. Open MySQL Workbench
2. Connect to your GearGuard connection (127.0.0.1:3306)
3. Expand `gearguard_db` database
4. You should see 30+ tables!

---

## 🎯 What You Should See

### Backend (Terminal 1)
```
✅ Database connection established successfully
Server running on http://localhost:5000
```

### Frontend (Terminal 2)
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Database Tables (MySQL Workbench)
```
gearguard_db/
├── users
├── user_roles
├── user_profiles
├── departments
├── teams
├── team_members
├── equipment
├── equipment_categories
├── maintenance_requests
└── ... (30+ tables total)
```

---

## 🆘 Troubleshooting

### ❌ "Access denied for user 'root'"

**Solution**: Check your MySQL password in `server\.env`

```env
DB_PASSWORD=your_actual_mysql_password
```

### ❌ "Cannot connect to MySQL"

**Solution**: Make sure MySQL is running

**Windows:**
1. Open Services (Win + R, type `services.msc`)
2. Find "MySQL80" service
3. Click "Start" if it's not running

**Check manually:**
```powershell
mysql -u root -p
```

### ❌ "Port 5000 already in use"

**Solution**: Kill the process or change port

```powershell
# Kill process on port 5000
npx kill-port 5000

# Or change port in server/.env
PORT=5001
```

### ❌ "npm install" fails

**Solution**: Clear npm cache

```powershell
npm cache clean --force
npm install
```

### ❌ "Migration failed"

**Solution**: Reset database

```powershell
cd server
npm run db:reset
```
⚠️ **Warning**: This deletes all data!

### ❌ Client shows blank page

**Solution**: Check browser console

1. Press F12 to open DevTools
2. Check Console tab for errors
3. Make sure backend is running on port 5000

---

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] `server/.env` has correct password
- [ ] Server dependencies installed (`server/node_modules` exists)
- [ ] Client dependencies installed (`client/node_modules` exists)
- [ ] Database created (`npm run db:test` passes)
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Can login with admin@gearguard.com / admin123
- [ ] MySQL Workbench shows `gearguard_db` database

---

## 🎉 Next Steps

Once everything is running:

1. **Change admin password** (security!)
2. **Explore the database** in MySQL Workbench
3. **Review the schema**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
4. **Start building features!**

### Useful Commands

```powershell
# Database
npm run db:test      # Test connection
npm run db:migrate   # Run new migrations
npm run db:reset     # Reset database

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check for errors

# View logs
# Backend logs appear in Terminal 1
# Frontend logs appear in browser console (F12)
```

### Sample Queries to Try

Open MySQL Workbench and run:

```sql
-- View all users
SELECT * FROM users;

-- View all equipment categories
SELECT * FROM equipment_categories;

-- View all request types
SELECT * FROM request_types;

-- View database structure
SHOW TABLES;

-- Count records in each table
SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM equipment) as equipment,
  (SELECT COUNT(*) FROM maintenance_requests) as requests;
```

---

## 📚 Additional Resources

- **Full Documentation**: [README.md](./README.md)
- **Database Schema**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Detailed Setup**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 💡 Pro Tips

1. **Keep terminals open** - You need both servers running
2. **Use MySQL Workbench** - Visual database management is easier
3. **Check logs first** - Most errors show in terminal logs
4. **Test database connection** - Run `npm run db:test` if unsure
5. **Backup before reset** - `npm run db:reset` deletes everything!

---

**Need help?** Check the troubleshooting section above or review the full documentation!

🎊 **Happy coding!**
