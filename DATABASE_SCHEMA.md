# GearGuard Database Schema

## Overview
The GearGuard database is designed in **Boyce-Codd Normal Form (BCNF)** for optimal data integrity and performance. It uses MySQL 8.0+ with InnoDB storage engine.

## Database Structure

### 📊 Schema Normalization

The database follows BCNF principles:
- **No transitive dependencies**: Every non-key attribute depends only on the primary key
- **Separate concerns**: Related data is properly separated into distinct tables
- **Referential integrity**: All foreign keys are properly constrained
- **Indexed for performance**: Strategic indexes on frequently queried columns

---

## Core Entities

### 1. **Users & Authentication** (Migration 001)

#### `users`
Core user authentication table.
```sql
- id (PK)
- email (UNIQUE)
- password_hash
- name
- phone
- is_active
- email_verified
- last_login
```

#### `user_roles`
Normalized roles (supports multiple roles per user).
```sql
- id (PK)
- user_id (FK → users)
- role (ENUM: admin, manager, technician, operator)
- assigned_by (FK → users)
```

#### `user_profiles`
Extended user information (1:1 with users).
```sql
- user_id (PK, FK → users)
- avatar_url
- department
- job_title
- employee_id
- bio
- skills (JSON)
- certifications (JSON)
```

#### `password_reset_tokens`
Password reset functionality.
```sql
- id (PK)
- user_id (FK → users)
- token (UNIQUE)
- expires_at
- used
```

---

### 2. **Teams & Departments** (Migration 002)

#### `departments`
Organizational departments.
```sql
- id (PK)
- name (UNIQUE)
- code (UNIQUE)
- description
- is_active
```

#### `teams`
Work teams within departments.
```sql
- id (PK)
- name
- code (UNIQUE)
- department_id (FK → departments)
- leader_id (FK → users)
- specialization
- is_active
```

#### `team_members`
Many-to-many relationship between users and teams.
```sql
- id (PK)
- team_id (FK → teams)
- user_id (FK → users)
- member_role (ENUM)
- responsibilities
- joined_at
- left_at
- is_active
```

#### `team_shifts`
Work schedule management.
```sql
- id (PK)
- team_id (FK → teams)
- shift_name
- start_time
- end_time
- days_of_week (JSON)
```

---

### 3. **Equipment & Assets** (Migration 003)

#### `equipment_categories`
Hierarchical equipment categorization.
```sql
- id (PK)
- name (UNIQUE)
- code (UNIQUE)
- parent_category_id (FK → self)
- is_active
```

#### `equipment_manufacturers`
Equipment manufacturers/vendors.
```sql
- id (PK)
- name (UNIQUE)
- country
- contact_email
- contact_phone
- website
```

#### `locations`
Hierarchical location management.
```sql
- id (PK)
- name
- code (UNIQUE)
- building
- floor
- room
- parent_location_id (FK → self)
```

#### `equipment`
Main equipment registry.
```sql
- id (PK)
- equipment_code (UNIQUE)
- name
- category_id (FK → equipment_categories)
- manufacturer_id (FK → equipment_manufacturers)
- model
- serial_number (UNIQUE)
- qr_code (UNIQUE)
- barcode (UNIQUE)
- location_id (FK → locations)
- assigned_team_id (FK → teams)
- status (ENUM)
- criticality (ENUM)
- purchase_date
- purchase_cost
- warranty_expiry_date
```

#### `equipment_specifications`
Normalized equipment specs (BCNF).
```sql
- id (PK)
- equipment_id (FK → equipment)
- spec_key
- spec_value
- unit
UNIQUE(equipment_id, spec_key)
```

#### `equipment_documents`
Equipment-related documents.
```sql
- id (PK)
- equipment_id (FK → equipment)
- document_type (ENUM)
- title
- file_url
- uploaded_by (FK → users)
```

#### `equipment_maintenance_history`
Historical maintenance records.
```sql
- id (PK)
- equipment_id (FK → equipment)
- maintenance_type (ENUM)
- performed_date
- performed_by (FK → users)
- next_due_date
- cost
```

#### `equipment_downtime`
Equipment downtime tracking.
```sql
- id (PK)
- equipment_id (FK → equipment)
- start_time
- end_time
- downtime_type (ENUM)
- impact_level (ENUM)
- reported_by (FK → users)
```

---

### 4. **Maintenance Requests** (Migration 004)

#### `request_types`
Normalized request types.
```sql
- id (PK)
- name (UNIQUE)
- code (UNIQUE)
- description
- default_priority (ENUM)
- requires_approval
```

#### `maintenance_requests`
Main work order table.
```sql
- id (PK)
- request_number (UNIQUE)
- title
- description
- equipment_id (FK → equipment)
- request_type_id (FK → request_types)
- requested_by (FK → users)
- assigned_to_team (FK → teams)
- assigned_to_user (FK → users)
- priority (ENUM)
- status (ENUM)
- scheduled_start/end
- started_at
- completed_at
- estimated_hours/cost
- actual_hours/cost
- approved_by (FK → users)
```

#### `request_attachments`
Normalized attachments (BCNF).
```sql
- id (PK)
- request_id (FK → maintenance_requests)
- file_name
- file_url
- file_type
- file_size
- uploaded_by (FK → users)
```

#### `request_history`
Audit trail for requests.
```sql
- id (PK)
- request_id (FK → maintenance_requests)
- changed_by (FK → users)
- change_type (ENUM)
- old_value
- new_value
- comment
```

#### `work_order_tasks`
Task checklist for work orders.
```sql
- id (PK)
- request_id (FK → maintenance_requests)
- task_order
- description
- is_completed
- completed_by (FK → users)
```

#### `spare_parts`
Parts inventory.
```sql
- id (PK)
- part_number (UNIQUE)
- name
- manufacturer_id (FK → manufacturers)
- unit_cost
- current_stock
- reorder_level
- location_id (FK → locations)
```

#### `request_parts_used`
Parts used in maintenance.
```sql
- id (PK)
- request_id (FK → maintenance_requests)
- part_id (FK → spare_parts)
- quantity_used
- unit_cost
- total_cost (COMPUTED)
```

#### `maintenance_schedules`
Preventive maintenance scheduling.
```sql
- id (PK)
- equipment_id (FK → equipment)
- request_type_id (FK → request_types)
- frequency_type (ENUM)
- frequency_value
- last_performed_date
- next_due_date
- assigned_team_id (FK → teams)
```

#### `request_comments`
Comments on requests.
```sql
- id (PK)
- request_id (FK → maintenance_requests)
- user_id (FK → users)
- comment
- is_internal
```

---

### 5. **Notifications** (Migration 005)

#### `notification_templates`
Reusable notification templates.
```sql
- id (PK)
- name (UNIQUE)
- template_type (ENUM)
- event_type
- subject
- body_template
```

#### `notifications`
User notifications.
```sql
- id (PK)
- user_id (FK → users)
- title
- message
- notification_type (ENUM)
- related_entity_type
- related_entity_id
- is_read
```

#### `system_alerts`
System-wide alerts.
```sql
- id (PK)
- alert_type (ENUM)
- severity (ENUM)
- title
- description
- is_resolved
- resolved_by (FK → users)
```

#### `notification_preferences`
User notification settings.
```sql
- id (PK)
- user_id (FK → users)
- notification_channel (ENUM)
- event_type
- is_enabled
```

---

### 6. **Analytics & Reporting** (Migration 006)

#### `kpi_metrics`
KPI tracking.
```sql
- id (PK)
- metric_name
- metric_type
- metric_value
- period_start
- period_end
- equipment_id (FK → equipment)
- team_id (FK → teams)
```

#### `saved_reports`
User-saved reports.
```sql
- id (PK)
- report_name
- report_type
- created_by (FK → users)
- parameters (JSON)
- schedule_frequency (ENUM)
```

#### `activity_logs`
Complete audit trail.
```sql
- id (PK)
- user_id (FK → users)
- action
- entity_type
- entity_id
- old_values (JSON)
- new_values (JSON)
- ip_address
```

#### `dashboard_widgets`
User dashboard customization.
```sql
- id (PK)
- user_id (FK → users)
- widget_type
- widget_config (JSON)
- position_x/y
- width/height
```

---

## Key Features

### ✅ BCNF Compliance
- All tables are in Boyce-Codd Normal Form
- No redundant data storage
- Proper dependency management
- Atomic values only

### 🔒 Data Integrity
- Foreign key constraints with appropriate cascade rules
- CHECK constraints for data validation
- UNIQUE constraints on business keys
- NOT NULL enforcement where appropriate

### ⚡ Performance Optimization
- Strategic indexes on frequently queried columns
- Composite indexes for common query patterns
- Generated/computed columns where beneficial
- InnoDB for ACID compliance and row-level locking

### 📊 Scalability Features
- Hierarchical structures (categories, locations)
- Flexible JSON columns for extensible data
- Soft deletes with `is_active` flags
- Temporal tracking with timestamps

### 🔐 Security
- Password hashing (bcrypt)
- Token-based password reset
- Role-based access control (RBAC)
- Complete audit trail

---

## Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions.

## ER Diagram

```
users ──┬─→ user_roles
        ├─→ user_profiles
        └─→ team_members ──→ teams ──→ departments

equipment ──┬─→ equipment_specifications
            ├─→ equipment_documents
            ├─→ equipment_maintenance_history
            └─→ maintenance_requests ──┬─→ request_attachments
                                       ├─→ request_history
                                       ├─→ work_order_tasks
                                       ├─→ request_parts_used
                                       └─→ request_comments

locations ──→ equipment
equipment_categories ──→ equipment
equipment_manufacturers ──→ equipment
```

## Maintenance

- Regular index optimization
- Query performance monitoring
- Backup strategy implementation
- Archive old records as needed
