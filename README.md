# GearGuard - Enterprise Maintenance Management System

🛠️ A comprehensive maintenance management system built with Express.js, TypeScript, React, and MySQL.

## 📋 Overview

GearGuard is an enterprise-grade maintenance management system designed to help organizations manage equipment, maintenance requests, teams, and preventive maintenance schedules. Built with a clean, layered architecture and complete type safety.

## ✨ Features

- 🔐 **User Management** - Role-based access control (Admin, Manager, Technician, Operator)
- 👥 **Team Management** - Organize teams, assign tasks, manage shifts
- 🏭 **Equipment Registry** - Track all equipment with QR codes, specifications, and documentation
- 🔧 **Maintenance Requests** - Complete work order management system
- 📅 **Preventive Maintenance** - Schedule and track preventive maintenance
- 📊 **Analytics & Reporting** - KPI tracking, dashboards, and custom reports
- 🔔 **Notifications** - Real-time alerts and customizable notifications
- 📦 **Inventory Management** - Track spare parts and consumption
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MySQL 8.0 (InnoDB engine)
- **ORM**: mysql2 (raw SQL for performance)
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6

### Database
- **Engine**: MySQL InnoDB
- **Normalization**: Boyce-Codd Normal Form (BCNF)
- **Features**: Foreign keys, transactions, triggers, stored procedures

## 📁 Project Structure

```
gearguard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── db/           # Database migrations & seeds
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── shared/               # Shared TypeScript types
│   └── types/
│
├── DATABASE_SCHEMA.md    # Complete database documentation
├── DATABASE_SETUP.md     # Database setup guide
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **MySQL Workbench** (recommended) - [Download](https://dev.mysql.com/downloads/workbench/)

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Database

1. **Update MySQL password** in `server/.env`:
   ```env
   DB_PASSWORD=your_mysql_password
   ```

2. **Set up database**:
   ```bash
   cd server
   npm run db:setup
   ```

   This will:
   - Create the `gearguard_db` database
   - Run all migrations
   - Seed initial data

3. **Test connection**:
   ```bash
   npm run db:test
   ```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

### 5. Default Login

- **Email**: admin@gearguard.com
- **Password**: admin123
- ⚠️ **Change this immediately after first login!**

## 📚 Database Schema

The database is optimized in **Boyce-Codd Normal Form (BCNF)** with 30+ tables covering:

- User Management (users, roles, profiles)
- Team Organization (teams, departments, shifts)
- Equipment Management (equipment, categories, specifications)
- Maintenance Requests (work orders, tasks, history)
- Inventory (spare parts, consumption tracking)
- Notifications & Alerts
- Analytics & Reporting

📖 **Full documentation**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## 🔧 Available Scripts

### Server Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run pending migrations
npm run db:seed      # Run migrations + seeds
npm run db:reset     # Reset database (WARNING: deletes all data)
npm run db:test      # Test database connection
npm run lint         # Lint TypeScript files
npm run format       # Format code with Prettier
```

### Client Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint TypeScript files
npm run format       # Format code with Prettier
```

## 🗄️ Database Management

### Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to **GearGuard** connection (127.0.0.1:3306)
3. Browse the `gearguard_db` database

### Migration Commands

```bash
# Run pending migrations
npm run db:migrate

# Run migrations and seed data
npm run db:seed

# Reset entire database (⚠️ destructive)
npm run db:reset

# Test database connection
npm run db:test
```

### Manual Queries

```sql
-- View all users with roles
USE gearguard_db;

SELECT 
  u.id, u.name, u.email,
  GROUP_CONCAT(ur.role) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.id;

-- View equipment summary
SELECT 
  e.equipment_code, e.name,
  ec.name as category,
  e.status, l.name as location
FROM equipment e
LEFT JOIN equipment_categories ec ON e.category_id = ec.id
LEFT JOIN locations l ON e.location_id = l.id;
```

## 🏛️ Architecture Details

### Layered Architecture

```
Request → Route → Controller → Service → Repository → Database
                      ↓
                  Middleware (Auth, Validation, Error Handling)
```

### Key Principles

1. **Type Safety** - Full TypeScript coverage
2. **Single Responsibility** - Each layer has one job
3. **Dependency Injection** - Services are injectable
4. **Error Handling** - Centralized error middleware
5. **Validation** - Input validation at controller level
6. **Transactions** - Database transactions for data integrity
7. **Security** - JWT auth, password hashing, SQL injection prevention

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Rate limiting (recommended for production)
- ✅ Helmet.js security headers

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Equipment Endpoints
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Maintenance Request Endpoints
- `GET /api/requests` - List all requests
- `GET /api/requests/:id` - Get request details
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `PATCH /api/requests/:id/status` - Update request status

*(Full API documentation coming soon)*

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Production Build

```bash
# Build backend
cd server
npm run build

# Build frontend
cd client
npm run build
```

### Environment Variables

Update these for production:
- `NODE_ENV=production`
- `JWT_SECRET=<strong-secret-key>`
- `DB_PASSWORD=<secure-password>`
- `CORS_ORIGIN=<your-frontend-url>`

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this for your projects!

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u root -p

# Check MySQL service
# Windows: Services -> MySQL80
# Mac: brew services list
# Linux: systemctl status mysql
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Migration Errors

```bash
# Check migration status
npm run db:test

# Reset if needed (⚠️ deletes all data)
npm run db:reset
```

## 📞 Support

For issues and questions:
1. Check [DATABASE_SETUP.md](./DATABASE_SETUP.md)
2. Review MySQL Workbench connection
3. Verify `.env` configuration
4. Check server logs

## 🎯 Roadmap

- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)
- [ ] Advanced reporting and dashboards
- [ ] Multi-language support
- [ ] File upload functionality

---

**Built with ❤️ for the Odoo Hackathon**
   ```bash
   cd ../client
   npm install
   ```

4. **Install shared types (optional)**
   ```bash
   cd ../shared
   npm install
   ```

### Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE gearguard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure environment**
   ```bash
   cd server
   cp .env.example .env
   ```

3. **Update .env with your database credentials**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=gearguard_db
   ```

4. **Run migrations**
   ```bash
   # Execute SQL files in order:
   mysql -u root -p gearguard_db < src/db/migrations/001_create_users.sql
   mysql -u root -p gearguard_db < src/db/migrations/002_create_teams.sql
   mysql -u root -p gearguard_db < src/db/migrations/003_create_equipment.sql
   mysql -u root -p gearguard_db < src/db/migrations/004_create_requests.sql
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Access the application**
   Open `http://localhost:5173` in your browser

## 📦 Core Features

### Equipment Management
- Track machinery, vehicles, tools, and electronic equipment
- Equipment categorization and status tracking
- Maintenance history and scheduling

### Team Management
- Create and manage maintenance teams
- Assign team leaders and members
- Role-based access control

### Maintenance Requests
- Create and track maintenance requests
- Kanban board view for workflow management
- Calendar view for scheduling
- Priority and status management

### Workflow
- Draft → Submitted → Approved → In Progress → Completed
- Support for blocking and cancellation
- Request history tracking

### Smart Features
- Auto-fill for equipment and team assignments
- Pivot reports and analytics
- Graph visualizations

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL 8.0 (InnoDB)
- **ORM**: mysql2 (direct SQL with connection pooling)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Icons**: React Icons

## 📚 API Endpoints (To Be Implemented)

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id` - Get equipment details
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Maintenance Requests
- `GET /api/requests` - List all requests
- `POST /api/requests` - Create request
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

### Reports
- `GET /api/reports/pivot` - Generate pivot reports
- `GET /api/reports/analytics` - Get analytics data

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Helmet for HTTP headers security
- CORS configuration
- SQL injection prevention with parameterized queries
- Input validation

## 🧪 Development

### Scripts

**Server**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Run production server
npm run lint      # Run ESLint
```

**Client**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📝 Database Schema

### Core Tables
- `users` - User accounts and authentication
- `teams` - Maintenance teams
- `team_members` - Team membership (many-to-many)
- `equipment` - Equipment inventory
- `maintenance_requests` - Maintenance work orders
- `request_history` - Request status change history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for hackathons and rapid prototyping.

## 🙏 Acknowledgments

- Inspired by Odoo's maintenance module
- Built for enterprise-grade maintenance management
- Optimized for hackathon development speed

---

**Happy Coding! 🚀**
>>>>>>> parent of 3e1f05f (Revert "INIT COMMIT")
