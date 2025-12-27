# GearGuard Backend Server

Enterprise-grade Equipment Maintenance Management System Backend

## 🚀 Features

- **RESTful API** - Complete CRUD operations for all resources
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, Manager, Technician, User roles
- **Real-time Dashboard** - System stats and analytics
- **Kanban Board** - Visual maintenance request management
- **Calendar View** - Scheduled maintenance tracking
- **Team Management** - Multi-team support with member assignments
- **Work Centers** - Physical location and capacity management
- **Equipment Tracking** - Complete equipment lifecycle management
- **Request Workflow** - From creation to completion tracking
- **Health Monitoring** - System health check endpoints
- **Error Handling** - Comprehensive error responses
- **Database Migrations** - Version-controlled schema changes

## 📋 Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GearGuard-odoo-hackathon/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the server root:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=gearguard_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_key_change_in_production
   JWT_EXPIRES_IN=7d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173

   # Logging
   LOG_LEVEL=debug
   ```

4. **Setup database**
   ```bash
   npm run db:setup
   ```
   
   This will:
   - Create the database
   - Run all migrations
   - Create all tables
   - Insert sample data

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Database connection pool
│   │   ├── env.ts        # Environment variables
│   │   └── index.ts
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── dashboardController.ts
│   │   ├── equipmentController.ts
│   │   ├── healthController.ts
│   │   ├── requestController.ts
│   │   ├── teamController.ts
│   │   ├── userController.ts
│   │   └── workCenterController.ts
│   ├── db/              # Database files
│   │   ├── migrations/  # SQL migration files
│   │   └── seeds/       # Sample data
│   ├── middleware/      # Express middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── validator.ts
│   ├── models/          # Data models (if ORM is used)
│   ├── repositories/    # Data access layer
│   │   └── workCenterRepository.ts
│   ├── routes/          # API route definitions
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   ├── equipmentRoutes.ts
│   │   ├── healthRoutes.ts
│   │   ├── requestRoutes.ts
│   │   ├── teamRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── workCenterRoutes.ts
│   ├── services/        # Business logic layer
│   │   └── workCenterService.ts
│   ├── scripts/         # Utility scripts
│   │   ├── runMigration.ts
│   │   └── setupDatabase.ts
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── package.json
├── tsconfig.json
├── nodemon.json
└── API_DOCUMENTATION.md # Complete API documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with auto-reload

# Database
npm run db:setup         # Complete database setup (migrations + seeds)
npm run db:migrate       # Run pending migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (drop & recreate)
npm run db:test          # Test database connection

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard
- `GET /api/dashboard/stats` - System statistics
- `GET /api/dashboard/critical-equipment` - Critical equipment list
- `GET /api/dashboard/open-requests` - Open maintenance requests
- `GET /api/dashboard/technician-load` - Technician workload
- `GET /api/dashboard/recent-requests` - Recent requests
- `GET /api/dashboard/upcoming-maintenance` - Upcoming scheduled maintenance

### Equipment
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/meta/categories` - Get categories

### Maintenance Requests
- `GET /api/requests/kanban` - Kanban board view
- `GET /api/requests/calendar` - Calendar view
- `POST /api/requests` - Create request
- `PUT /api/requests/:id` - Update request
- `PATCH /api/requests/:id/stage` - Update request stage
- `DELETE /api/requests/:id` - Delete request

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details with members
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:memberId` - Remove member
- `GET /api/teams/:id/available-users` - Get available users

### Work Centers
- `GET /api/work-centers` - List work centers
- `GET /api/work-centers/:id` - Get work center details
- `POST /api/work-centers` - Create work center
- `PUT /api/work-centers/:id` - Update work center
- `DELETE /api/work-centers/:id` - Delete work center

### Users
- `GET /api/users/technicians` - List all technicians

### System Health
- `GET /api/health` - Comprehensive health check
- `GET /api/ping` - Simple ping
- `GET /api/system` - System information

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## 🗄️ Database Schema

### Core Tables
- **users** - System users with roles
- **departments** - Organizational departments
- **maintenance_teams** - Maintenance teams
- **team_members** - Team membership (many-to-many)
- **equipment_categories** - Equipment categorization
- **equipment** - Equipment/assets tracking
- **maintenance_requests** - Work orders
- **work_centers** - Physical work locations
- **request_stage_history** - Audit trail for request changes

### Relationships
- Equipment belongs to Category, Department, Team
- Requests reference Equipment, Team, Technician
- Teams have many Members (Users)
- Work Centers assigned to Teams and Members

## 🔐 Authentication

All protected endpoints require JWT authentication:

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>'
}
```

Default test credentials (after running db:setup):
```
Email: admin@gearguard.com
Password: admin123
```

## 🧪 Testing

```bash
# Test database connection
npm run db:test

# Test API endpoints
# Use tools like Postman, Insomnia, or curl
curl http://localhost:5000/api/health
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/api/health
```

Returns:
- Database connectivity status
- Memory usage
- Uptime
- Environment info

### Logs
Application logs are output to console in development mode.

## 🔒 Security Best Practices

1. **Environment Variables** - Never commit `.env` file
2. **JWT Secrets** - Use strong, random secrets in production
3. **Password Hashing** - Passwords are hashed with bcrypt
4. **Input Validation** - All inputs validated with express-validator
5. **SQL Injection Prevention** - Parameterized queries used throughout
6. **CORS** - Configured for specific origins only

## 🚦 Error Handling

All errors are handled consistently:

```json
{
  "status": "error",
  "message": "Error description",
  "stack": "... (only in development)"
}
```

## 📈 Performance Optimization

- **Connection Pooling** - MySQL connection pool for efficient database access
- **Indexes** - Strategic database indexes on frequently queried columns
- **Caching** - Ready for Redis integration
- **Query Optimization** - Efficient JOIN queries and pagination

## 🔄 Development Workflow

1. Create feature branch
2. Make changes
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Test locally: `npm run dev`
6. Commit and push
7. Create pull request

## 📝 License

MIT License - See LICENSE file for details

## 👥 Team

GearGuard Development Team

## 🐛 Known Issues

None at the moment.

## 🎯 Future Enhancements

- [ ] Redis caching layer
- [ ] WebSocket for real-time updates
- [ ] File upload for equipment images
- [ ] Report generation (PDF/Excel)
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Comprehensive test coverage
- [ ] Docker containerization
- [ ] GraphQL API option
- [ ] Multi-language support

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using TypeScript, Express, and MySQL**
