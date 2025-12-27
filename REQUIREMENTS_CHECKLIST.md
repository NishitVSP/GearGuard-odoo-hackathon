# ✅ GearGuard Hackathon Requirements Checklist

## Database Schema Compliance

### ✅ A. Equipment Tracking

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Track by Department | `equipment.department_id → departments` | ✅ Done |
| Track by Employee | `equipment.assigned_to_user_id → users` | ✅ Done |
| Dedicated Maintenance Team | `equipment.assigned_team_id → maintenance_teams` | ✅ Done |
| Default Technician | `equipment.assigned_technician_id → users` | ✅ Done |
| Equipment Name | `equipment.name` | ✅ Done |
| Serial Number | `equipment.serial_number` | ✅ Done |
| Purchase Date | `equipment.purchase_date` | ✅ Done |
| Warranty Information | `equipment.warranty_expiry_date` | ✅ Done |
| Physical Location | `equipment.location` (TEXT field) | ✅ Done |

### ✅ B. Maintenance Team

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Team Name | `maintenance_teams.name` | ✅ Done |
| Multiple Teams | Separate table with unlimited teams | ✅ Done |
| Team Members | `team_members` (many-to-many) | ✅ Done |
| Link Technicians | `team_members.user_id → users` | ✅ Done |
| Team Assignment Logic | Only team members can pick up requests | ✅ Ready |

### ✅ C. Maintenance Request

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **Request Types** | | |
| Corrective (Breakdown) | `request_type = 'corrective'` | ✅ Done |
| Preventive (Routine) | `request_type = 'preventive'` | ✅ Done |
| **Key Fields** | | |
| Subject | `maintenance_requests.subject` | ✅ Done |
| Equipment Reference | `maintenance_requests.equipment_id` | ✅ Done |
| Scheduled Date | `maintenance_requests.scheduled_date` | ✅ Done |
| Duration | `maintenance_requests.duration_hours` | ✅ Done |
| **Additional** | | |
| Request Number | `maintenance_requests.request_number` (UNIQUE) | ✅ Done |
| Stage Tracking | ENUM('new', 'in_progress', 'repaired', 'scrap') | ✅ Done |

---

## Functional Workflows

### ✅ Flow 1: The Breakdown

| Step | Requirement | Database Support | Status |
|------|-------------|------------------|--------|
| 1 | User creates request | INSERT into `maintenance_requests` | ✅ Ready |
| 2 | Auto-fill Equipment Category | `equipment_category_id` from `equipment.category_id` | ✅ Ready |
| 2 | Auto-fill Maintenance Team | `maintenance_team_id` from `equipment.assigned_team_id` | ✅ Ready |
| 3 | Request starts in "New" | `stage = 'new'` (default) | ✅ Done |
| 4 | Technician assigns self | UPDATE `assigned_technician_id` | ✅ Ready |
| 5 | Stage → "In Progress" | UPDATE `stage = 'in_progress'` | ✅ Ready |
| 6 | Record hours spent | UPDATE `duration_hours` | ✅ Ready |
| 6 | Stage → "Repaired" | UPDATE `stage = 'repaired'` | ✅ Ready |

### ✅ Flow 2: The Routine Checkup

| Step | Requirement | Database Support | Status |
|------|-------------|------------------|--------|
| 1 | Manager creates preventive request | `request_type = 'preventive'` | ✅ Ready |
| 2 | Set Scheduled Date | `scheduled_date = '2025-01-30'` | ✅ Done |
| 3 | Appears in Calendar View | Query by `scheduled_date` | ✅ Ready |
| 4 | Technician sees job on date | Frontend calendar component | 🔨 To Build |

---

## User Interface Views

### ✅ 1. Maintenance Kanban Board

| Feature | Implementation | Status |
|---------|----------------|--------|
| Group By Stages | Query with ORDER BY stage | ✅ Ready |
| Stages: New, In Progress, Repaired, Scrap | `stage` ENUM field | ✅ Done |
| Drag & Drop | Frontend Kanban library | 🔨 To Build |
| Show Technician Avatar | `users.avatar_url` | ✅ Ready |
| Red indicator for Overdue | `deadline < CURDATE()` | ✅ Ready |

**Sample Query:**
```sql
SELECT 
  mr.id, mr.request_number, mr.subject, mr.stage,
  u.name as technician, u.avatar_url,
  CASE WHEN mr.deadline < CURDATE() THEN 1 ELSE 0 END as is_overdue
FROM maintenance_requests mr
LEFT JOIN users u ON mr.assigned_technician_id = u.id
ORDER BY FIELD(mr.stage, 'new', 'in_progress', 'repaired', 'scrap')
```

### ✅ 2. Calendar View

| Feature | Implementation | Status |
|---------|----------------|--------|
| Display Preventive Requests | `request_type = 'preventive'` | ✅ Ready |
| Show on Scheduled Date | Query WHERE `scheduled_date` = date | ✅ Ready |
| Click date to create request | Frontend calendar library | 🔨 To Build |

**Sample Query:**
```sql
SELECT 
  mr.id, mr.request_number, mr.subject,
  mr.scheduled_date, mr.scheduled_time,
  e.name as equipment_name
FROM maintenance_requests mr
JOIN equipment e ON mr.equipment_id = e.id
WHERE mr.request_type = 'preventive'
  AND mr.scheduled_date BETWEEN ? AND ?
```

### ⚡ 3. Pivot/Graph Report (Optional)

| Feature | Implementation | Status |
|---------|----------------|--------|
| Requests per Team | GROUP BY `maintenance_team_id` | ✅ Ready |
| Requests per Category | GROUP BY `equipment_category_id` | ✅ Ready |

**Sample Query:**
```sql
SELECT 
  t.name as team_name,
  COUNT(*) as request_count,
  SUM(CASE WHEN stage = 'repaired' THEN 1 ELSE 0 END) as completed
FROM maintenance_requests mr
JOIN maintenance_teams t ON mr.maintenance_team_id = t.id
GROUP BY t.id, t.name
```

---

## Smart Features & Automation

### ✅ Smart Buttons

| Feature | Implementation | Status |
|---------|----------------|--------|
| Equipment → "Maintenance" button | Count open requests for equipment | ✅ Ready |
| Show count badge | Frontend component | 🔨 To Build |
| Click to see related requests | Filter requests by `equipment_id` | ✅ Ready |

**Sample Query:**
```sql
-- Count open requests for equipment
SELECT COUNT(*) as open_requests
FROM maintenance_requests
WHERE equipment_id = ?
  AND stage NOT IN ('repaired', 'scrap')
```

### ✅ Scrap Logic

| Feature | Implementation | Status |
|---------|----------------|--------|
| Move request to Scrap stage | UPDATE `stage = 'scrap'` | ✅ Ready |
| Record scrap reason | `scrap_reason` TEXT field | ✅ Done |
| Mark equipment as scrapped | UPDATE `equipment.status = 'scrapped'` | ✅ Ready |
| Log scrap action | INSERT into `request_stage_history` | ✅ Ready |

---

## API Endpoints to Build

### Equipment Endpoints

- [ ] `GET /api/equipment` - List all equipment
- [ ] `GET /api/equipment/:id` - Get equipment details
- [ ] `GET /api/equipment/:id/requests` - Get requests for equipment (Smart Button)
- [ ] `POST /api/equipment` - Create new equipment
- [ ] `PUT /api/equipment/:id` - Update equipment
- [ ] `DELETE /api/equipment/:id` - Delete equipment

### Maintenance Request Endpoints

- [ ] `GET /api/requests` - List all requests (with filters)
- [ ] `GET /api/requests/:id` - Get request details
- [ ] `POST /api/requests` - Create new request (with auto-fill)
- [ ] `PUT /api/requests/:id` - Update request
- [ ] `PATCH /api/requests/:id/stage` - Change stage (+ history)
- [ ] `PATCH /api/requests/:id/assign` - Assign technician
- [ ] `DELETE /api/requests/:id` - Delete request

### Team Endpoints

- [ ] `GET /api/teams` - List all teams
- [ ] `GET /api/teams/:id` - Get team details
- [ ] `GET /api/teams/:id/members` - Get team members
- [ ] `POST /api/teams` - Create team
- [ ] `PUT /api/teams/:id` - Update team

### Calendar Endpoints

- [ ] `GET /api/calendar/requests?start_date=X&end_date=Y` - Calendar view data

---

## Frontend Components to Build

### Pages

- [ ] Login Page
- [ ] Dashboard (Overview)
- [ ] Equipment List Page (with search/filter)
- [ ] Equipment Detail Page (with Smart Button)
- [ ] Maintenance Request Kanban Board
- [ ] Calendar View
- [ ] Team Management Page

### Components

- [ ] Kanban Board Component
  - [ ] Draggable cards
  - [ ] Stage columns
  - [ ] Overdue indicator
  - [ ] Technician avatar
  
- [ ] Calendar Component
  - [ ] Month/Week view
  - [ ] Click to create request
  - [ ] Show preventive maintenance
  
- [ ] Equipment Form
  - [ ] Auto-complete for teams
  - [ ] Department dropdown
  - [ ] Employee assignment
  
- [ ] Request Form
  - [ ] Equipment selector (with auto-fill)
  - [ ] Type selector (Corrective/Preventive)
  - [ ] Date picker for preventive
  
- [ ] Smart Button Component
  - [ ] Request count badge
  - [ ] Click to filter

---

## Priority Levels

### 🔴 **MUST HAVE** (Core Requirements)

1. ✅ Equipment CRUD with department/employee assignment
2. ✅ Maintenance Teams & Members
3. ✅ Request CRUD with auto-fill logic
4. 🔨 Kanban Board View
5. 🔨 Calendar View for preventive maintenance
6. 🔨 Smart Button (Equipment → Requests)
7. ✅ Stage workflow (New → In Progress → Repaired → Scrap)

### 🟡 **SHOULD HAVE** (Enhanced Features)

8. 🔨 Request duration tracking
9. 🔨 Overdue indicators
10. 🔨 Stage change history
11. 🔨 Scrap equipment logic
12. 🔨 Technician assignment

### 🟢 **NICE TO HAVE** (If Time Permits)

13. ⏳ Pivot/Graph reports
14. ⏳ Advanced filters
15. ⏳ Bulk actions
16. ⏳ Email notifications
17. ⏳ Export to Excel

---

## Database Setup Status

| Item | Status |
|------|--------|
| Schema designed | ✅ Done |
| Simplified to 8 tables | ✅ Done |
| BCNF compliant | ✅ Done |
| Seed data created | ✅ Done |
| Migration scripts | ✅ Done |
| Documentation | ✅ Done |

---

## Next Steps

### For Database Team

✅ Database is 100% ready! Move to API development.

### For Backend Team

1. Set up Express routes
2. Implement auto-fill logic in create request endpoint
3. Build stage change endpoint with history tracking
4. Create smart button query endpoint

### For Frontend Team

1. Set up React Router
2. Build Kanban board with drag-drop
3. Integrate calendar library
4. Create equipment detail page with smart button

---

## Testing Checklist

- [ ] Create equipment (assigned to department & employee)
- [ ] Create corrective request (auto-fill works)
- [ ] Create preventive request (scheduled date set)
- [ ] Move request through stages (New → In Progress → Repaired)
- [ ] View Kanban board (grouped by stage)
- [ ] View Calendar (shows preventive requests)
- [ ] Click Equipment smart button (shows related requests)
- [ ] Scrap equipment (logs reason, updates status)

---

## Success Criteria

**Minimum Viable Product (MVP):**
- ✅ Database supports all core requirements
- 🔨 Can create and track equipment
- 🔨 Can create and manage maintenance requests
- 🔨 Requests auto-fill team/category from equipment
- 🔨 Kanban board shows requests by stage
- 🔨 Calendar shows preventive maintenance
- 🔨 Smart button shows equipment requests

**Demo Ready When:**
- [ ] All MUST HAVE features working
- [ ] Sample data loaded
- [ ] UI is clean and functional
- [ ] No critical bugs
- [ ] Team can present workflows

---

## 🎯 Current Status Summary

**✅ Database: 100% Complete**
- 8 focused tables
- All requirements supported
- Seed data ready
- Documentation complete

**🔨 Backend: 0% (Ready to Start)**
- Schema ready for API implementation
- Clear endpoints defined

**🔨 Frontend: 0% (Ready to Start)**
- Database supports all UI views
- Component list defined

**🎊 Ready for Hackathon Development!**
