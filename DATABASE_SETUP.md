# GearGuard Database Setup Guide

## Prerequisites

- MySQL 8.0 or higher installed
- MySQL Workbench (recommended for GUI management)
- Node.js 18+ and npm installed

## Quick Setup

### 1. Configure MySQL Connection

Your MySQL Workbench connection details:
- **Connection Name**: GearGuard
- **Hostname**: 127.0.0.1 (localhost)
- **Port**: 3306
- **Username**: root
- **Password**: (your MySQL root password)

### 2. Update Environment Variables

The `.env` file has been created at `server/.env` with the following configuration:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gearguard_db
```

**⚠️ IMPORTANT**: Update `DB_PASSWORD` with your MySQL root password!

### 3. Install Server Dependencies

```bash
cd server
npm install
```

### 4. Run Database Migrations

Choose one of the following options:

#### Option A: Full Setup (Recommended for first time)
Creates database, runs all migrations, and seeds initial data:
```bash
npm run db:setup
```

#### Option B: Just Migrations
Creates database and runs migrations only:
```bash
npm run db:migrate
```

#### Option C: Reset Database
⚠️ **WARNING**: This drops the entire database and recreates it!
```bash
npm run db:reset
```

### 5. Verify in MySQL Workbench

1. Open MySQL Workbench
2. Connect to your GearGuard connection
3. You should see the `gearguard_db` database with all tables

## Database Structure

After migration, you'll have the following tables:

### User Management
- `users` - User accounts
- `user_roles` - User roles (RBAC)
- `user_profiles` - Extended user info
- `password_reset_tokens` - Password reset tokens

### Organization
- `departments` - Organizational departments
- `teams` - Work teams
- `team_members` - Team membership
- `team_shifts` - Team work schedules

### Equipment Management
- `equipment` - Main equipment registry
- `equipment_categories` - Equipment categories (hierarchical)
- `equipment_manufacturers` - Manufacturers/vendors
- `locations` - Equipment locations (hierarchical)
- `equipment_specifications` - Technical specifications
- `equipment_documents` - Equipment documents
- `equipment_maintenance_history` - Maintenance history
- `equipment_downtime` - Downtime tracking

### Maintenance Requests
- `maintenance_requests` - Work orders
- `request_types` - Request type definitions
- `request_attachments` - File attachments
- `request_history` - Audit trail
- `work_order_tasks` - Task checklists
- `request_comments` - Comments/notes
- `maintenance_schedules` - Preventive maintenance schedules

### Inventory
- `spare_parts` - Parts inventory
- `request_parts_used` - Parts consumption tracking

### Notifications
- `notifications` - User notifications
- `notification_templates` - Notification templates
- `system_alerts` - System alerts
- `notification_preferences` - User notification settings

### Analytics
- `kpi_metrics` - KPI tracking
- `saved_reports` - User-saved reports
- `activity_logs` - Complete audit trail
- `dashboard_widgets` - Dashboard customization

### System
- `schema_migrations` - Migration tracking (auto-created)

## Seeded Data

The initial seed includes:

### Equipment Categories
- Machinery
- Vehicles
- Tools
- Electronics
- HVAC
- Safety Equipment

### Departments
- Maintenance
- Operations
- Engineering
- Safety
- Facilities

### Request Types
- Corrective Maintenance
- Preventive Maintenance
- Inspection
- Calibration
- Upgrade
- Emergency Repair

### Locations
- Main Warehouse
- Production Floor 1
- Production Floor 2
- Storage Area
- Maintenance Workshop

### Default Admin User
- **Email**: admin@gearguard.com
- **Password**: admin123 (⚠️ **CHANGE THIS IMMEDIATELY!**)
- **Role**: admin

## Common Tasks

### Check Migration Status
```bash
npm run db:migrate
```
This is safe to run multiple times - it only runs pending migrations.

### Add Seed Data
```bash
npm run db:seed
```

### Reset Everything
```bash
npm run db:reset
```

### View Database in MySQL Workbench

1. Open MySQL Workbench
2. Connect to GearGuard connection
3. Expand `gearguard_db` in Schemas panel
4. Browse tables, run queries, etc.

## Manual SQL Queries

### View All Users
```sql
USE gearguard_db;

SELECT 
  u.id, 
  u.name, 
  u.email, 
  GROUP_CONCAT(ur.role) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.id;
```

### View All Equipment
```sql
SELECT 
  e.equipment_code,
  e.name,
  ec.name as category,
  em.name as manufacturer,
  l.name as location,
  e.status
FROM equipment e
LEFT JOIN equipment_categories ec ON e.category_id = ec.id
LEFT JOIN equipment_manufacturers em ON e.manufacturer_id = em.id
LEFT JOIN locations l ON e.location_id = l.id;
```

### View Maintenance Requests
```sql
SELECT 
  mr.request_number,
  mr.title,
  e.name as equipment,
  u.name as requested_by,
  mr.priority,
  mr.status,
  mr.created_at
FROM maintenance_requests mr
JOIN equipment e ON mr.equipment_id = e.id
JOIN users u ON mr.requested_by = u.id
ORDER BY mr.created_at DESC;
```

## Troubleshooting

### Connection Failed
```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root'
```
**Solution**: Check your MySQL password in `.env` file

### Database Already Exists
If you see "Database already exists" warning, it's normal. The migrator checks before creating.

### Migration Failed
```
Error: Table already exists
```
**Solution**: The migration was already run. Check `schema_migrations` table:
```sql
SELECT * FROM schema_migrations;
```

### Cannot Connect to MySQL
1. Ensure MySQL is running
2. Check MySQL service status
3. Verify port 3306 is not blocked
4. Test connection in MySQL Workbench first

### Permission Denied
```
Error: ER_DBACCESS_DENIED_ERROR
```
**Solution**: Grant permissions to MySQL user:
```sql
GRANT ALL PRIVILEGES ON gearguard_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Development Workflow

1. **Make Schema Changes**: Edit migration files in `server/src/db/migrations/`
2. **Run Migration**: `npm run db:migrate`
3. **Update TypeScript Types**: Update types in `server/src/types/`
4. **Update Models**: Update models in `server/src/models/`
5. **Test**: Run application and test changes

## Production Deployment

⚠️ **Before deploying to production**:

1. Change default admin password
2. Update JWT secret in `.env`
3. Set `NODE_ENV=production`
4. Configure proper backup strategy
5. Set up monitoring and alerting
6. Review and optimize indexes
7. Enable SSL/TLS for MySQL connection
8. Restrict database user permissions

## Database Backup

### Manual Backup
```bash
mysqldump -u root -p gearguard_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup
```bash
mysql -u root -p gearguard_db < backup_file.sql
```

## Performance Tips

1. **Regular Maintenance**
   ```sql
   OPTIMIZE TABLE maintenance_requests;
   ANALYZE TABLE equipment;
   ```

2. **Monitor Slow Queries**
   ```sql
   SHOW VARIABLES LIKE 'slow_query_log';
   SET GLOBAL slow_query_log = 'ON';
   ```

3. **Check Index Usage**
   ```sql
   SHOW INDEX FROM maintenance_requests;
   ```

## Next Steps

After database setup:
1. ✅ Start the development server: `npm run dev`
2. ✅ Test the API endpoints
3. ✅ Connect the React frontend
4. ✅ Implement authentication
5. ✅ Build your features!

## Support

For issues or questions:
- Check MySQL error logs
- Review migration files in `server/src/db/migrations/`
- Verify `.env` configuration
- Test MySQL connection in Workbench first
