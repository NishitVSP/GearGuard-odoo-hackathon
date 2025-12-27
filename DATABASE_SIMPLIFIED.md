# GearGuard Database Schema - Simplified for Hackathon

## Overview

This database schema is specifically designed for the **GearGuard: The Ultimate Maintenance Tracker** hackathon requirements. It focuses on the **three core entities**: Equipment, Teams, and Maintenance Requests.

## Philosophy

**"Less is More"** - Only 8 tables instead of 30+, focusing on what's actually needed for the hackathon demo.

---

## Database Tables (8 Total)

### 1. **users** - User Authentication
Stores all system users (admins, managers, technicians, regular users).

```sql
Key Fields:
- id, email, password_hash, name
- role: ENUM('admin', 'manager', 'technician', 'user')
- avatar_url (for Kanban view)
```

**Purpose**: Authentication, team assignment, equipment ownership

---

### 2. **departments** - Organizational Structure
Company departments that own equipment.

```sql
Key Fields:
- id, name, description
Example: Production, IT, Logistics
```

**Purpose**: Track equipment by department (Requirement A)

---

### 3. **maintenance_teams** - Specialized Teams
Teams that fix equipment (Mechanics, Electricians, IT Support).

```sql
Key Fields:
- id, name, description
- team_leader_id → users(id)
```

**Purpose**: Support multiple specialized teams (Requirement B)

---

### 4. **team_members** - Team Membership
Many-to-Many relationship between users and teams.

```sql
Key Fields:
- team_id → maintenance_teams(id)
- user_id → users(id)
```

**Purpose**: Link technicians to teams

---

### 5. **equipment_categories** - Equipment Types
Categories like "CNC Machines", "Computers", "Vehicles".

```sql
Key Fields:
- id, name, description
```

**Purpose**: Auto-fill category in maintenance requests

---

### 6. **equipment** - Asset Registry (CORE TABLE)
The central database for all company assets.

```sql
Key Fields:
- equipment_code (UNIQUE identifier)
- name, serial_number
- category_id → equipment_categories
- department_id → departments
- assigned_to_user_id → users (Employee ownership)
- assigned_team_id → maintenance_teams (Default team)
- assigned_technician_id → users (Default technician)
- location (Physical location text)
- status: ENUM('operational', 'under_maintenance', 'broken', 'scrapped')
- purchase_date, warranty_expiry_date
- specifications (JSON for flexibility)
```

**Purpose**: 
- Track equipment by department ✅
- Track equipment by employee ✅
- Assign default maintenance team ✅
- Assign default technician ✅

---

### 7. **maintenance_requests** - Work Orders (CORE TABLE)
The transactional heart of the system.

```sql
Key Fields:
- request_number (UNIQUE identifier)
- subject (What is wrong?)
- description
- request_type: ENUM('corrective', 'preventive')
  * corrective = Breakdown
  * preventive = Routine Checkup
- equipment_id → equipment (Which machine?)
- equipment_category_id (Auto-filled from equipment)
- maintenance_team_id (Auto-filled from equipment)
- assigned_technician_id → users
- stage: ENUM('new', 'in_progress', 'repaired', 'scrap')
- priority: ENUM('low', 'medium', 'high', 'urgent')
- scheduled_date, scheduled_time (For calendar view)
- duration_hours (Hours spent on repair)
- requested_by_id → users
- scrap_reason (Why equipment was scrapped)
```

**Purpose**:
- Handle corrective & preventive maintenance ✅
- Track request lifecycle (stages) ✅
- Auto-fill team/category from equipment ✅
- Calendar view support ✅
- Kanban board support ✅

---

### 8. **request_stage_history** - Audit Trail
Tracks all stage changes for requests.

```sql
Key Fields:
- request_id → maintenance_requests
- from_stage, to_stage
- changed_by_id → users
- notes
- changed_at (timestamp)
```

**Purpose**: Track when requests move from "New" → "In Progress" → "Repaired"

---

## Key Design Decisions

### ✅ What's INCLUDED (Requirements-Driven)

1. **Equipment Tracking**
   - By Department (department_id)
   - By Employee (assigned_to_user_id)
   
2. **Team Management**
   - Multiple teams (maintenance_teams)
   - Team members (team_members)
   - Default team per equipment
   
3. **Request Workflow**
   - Two types: Corrective & Preventive
   - Four stages: New, In Progress, Repaired, Scrap
   - Auto-fill logic support
   
4. **UI Support**
   - Kanban: stage field
   - Calendar: scheduled_date field
   - Smart Buttons: COUNT queries supported
   
5. **Scrap Logic**
   - Scrap stage in requests
   - Scrap reason field
   - Equipment status update to 'scrapped'

### ❌ What's REMOVED (Not in Requirements)

- ~~User profiles~~ - Basic info in users table is enough
- ~~Password reset~~ - Not critical for hackathon demo
- ~~Locations table~~ - Simple text field is fine
- ~~Manufacturers table~~ - Text field is simpler
- ~~Equipment documents~~ - Not in requirements
- ~~Spare parts inventory~~ - Not mentioned
- ~~Request attachments~~ - Not critical
- ~~Work order tasks~~ - Not in requirements
- ~~Complex notifications~~ - Not needed
- ~~Analytics tables~~ - Can be done with queries

---

## Supporting the Required Workflows

### Flow 1: The Breakdown (Corrective Maintenance)

```sql
-- 1. User creates request
INSERT INTO maintenance_requests (
  request_type = 'corrective',
  equipment_id = 1,
  requested_by_id = 5
)

-- 2. Auto-fill happens (trigger or app logic)
UPDATE maintenance_requests SET
  equipment_category_id = (SELECT category_id FROM equipment WHERE id = 1),
  maintenance_team_id = (SELECT assigned_team_id FROM equipment WHERE id = 1)

-- 3. Technician assigns themselves
UPDATE maintenance_requests SET assigned_technician_id = 3, stage = 'in_progress'

-- 4. Work completed
UPDATE maintenance_requests SET 
  stage = 'repaired', 
  duration_hours = 3.5,
  completed_at = NOW()
```

### Flow 2: The Routine Checkup (Preventive Maintenance)

```sql
-- 1. Manager creates preventive request
INSERT INTO maintenance_requests (
  request_type = 'preventive',
  equipment_id = 1,
  scheduled_date = '2025-01-30',
  stage = 'new'
)

-- 2. Appears in calendar view
SELECT * FROM maintenance_requests 
WHERE request_type = 'preventive' 
  AND scheduled_date = '2025-01-30'
```

---

## UI View Support

### Kanban Board Query
```sql
SELECT 
  mr.id, mr.request_number, mr.subject,
  mr.stage, mr.priority,
  u.name as technician_name, u.avatar_url,
  e.name as equipment_name,
  CASE WHEN mr.deadline < CURDATE() THEN TRUE ELSE FALSE END as is_overdue
FROM maintenance_requests mr
LEFT JOIN users u ON mr.assigned_technician_id = u.id
LEFT JOIN equipment e ON mr.equipment_id = e.id
ORDER BY 
  FIELD(mr.stage, 'new', 'in_progress', 'repaired', 'scrap'),
  mr.priority DESC
```

### Calendar View Query
```sql
SELECT 
  mr.id, mr.request_number, mr.subject,
  mr.scheduled_date, mr.scheduled_time,
  e.name as equipment_name,
  t.name as team_name
FROM maintenance_requests mr
JOIN equipment e ON mr.equipment_id = e.id
LEFT JOIN maintenance_teams t ON mr.maintenance_team_id = t.id
WHERE mr.request_type = 'preventive'
  AND mr.scheduled_date IS NOT NULL
```

### Smart Button Query (Equipment → Requests Count)
```sql
SELECT COUNT(*) 
FROM maintenance_requests 
WHERE equipment_id = ?
  AND stage NOT IN ('repaired', 'scrap')
```

---

## Sample Data Included

- **5 Users**: Admin, Manager, 2 Technicians, 1 Regular User
- **5 Departments**: Production, IT, Logistics, Facilities, R&D
- **6 Equipment Categories**: CNC Machines, Computers, Vehicles, HVAC, Tools, Office
- **4 Maintenance Teams**: Mechanics, Electricians, IT Support, HVAC
- **6 Equipment Items**: Including CNC machines, laptops, printer, forklift, HVAC
- **5 Sample Requests**: Mix of corrective and preventive

---

## Database Size

- **Before**: 30+ tables, complex relationships
- **After**: 8 tables, focused and simple
- **Reduction**: ~73% fewer tables
- **Result**: Easier to implement, test, and demo!

---

## BCNF Compliance

All tables are still in **Boyce-Codd Normal Form**:
- ✅ No transitive dependencies
- ✅ Every determinant is a candidate key
- ✅ No redundant data
- ✅ Proper foreign key relationships

---

## Setup Instructions

### Reset Database with Simplified Schema

```bash
cd server

# Drop old complex schema and create simple one
npm run db:reset-simple
```

Or manually:
```sql
mysql -u root -p < src/db/migrations/000_simplified_schema.sql
mysql -u root -p < src/db/seeds/000_simplified_seed.sql
```

---

## Advantages of Simplified Schema

1. **Faster Development** - Less code to write
2. **Easier Testing** - Fewer edge cases
3. **Better Demo** - Focus on core features
4. **Hackathon-Friendly** - Can finish in time!
5. **Still Professional** - Follows best practices
6. **Extensible** - Can add features later if needed

---

## Future Extensions (Post-Hackathon)

If you want to add features later:
- Spare parts inventory
- Request attachments/photos
- Advanced notifications
- Detailed reports
- Mobile app support
- Integration with IoT sensors

But for the hackathon? **This is perfect!** ✅
