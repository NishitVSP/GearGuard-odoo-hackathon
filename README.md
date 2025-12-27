<<<<<<< HEAD
# GearGuard-odoo-hackathon
=======
# GearGuard - Enterprise Maintenance Management System

🛠️ A comprehensive maintenance management system built with Express.js, TypeScript, React, and MySQL.

## 📋 Overview

GearGuard is an enterprise-grade maintenance management system designed for hackathons and rapid development. It follows a clean, layered architecture with type safety throughout.

## 🏗️ Architecture

- **Backend**: Express.js + TypeScript + MySQL
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Database**: MySQL with InnoDB engine, foreign keys, and transactions
- **Architecture**: Layered (Routes → Controllers → Services → Repositories)

## 📁 Project Structure

```
gearguard/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
└── shared/          # Shared types (optional)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GearGuard-odoo-hackathon
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
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
