-- ============================================
-- GearGuard Simplified Database Schema
-- Focused on Core Requirements Only
-- ============================================

-- Drop existing database and start fresh
DROP DATABASE IF EXISTS gearguard_db;
CREATE DATABASE gearguard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gearguard_db;

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'technician', 'user') NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- 2. DEPARTMENTS
-- ============================================

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
) ENGINE=InnoDB;

-- ============================================
-- 3. MAINTENANCE TEAMS
-- ============================================

CREATE TABLE maintenance_teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team_leader_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (team_leader_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_leader (team_leader_id)
) ENGINE=InnoDB;

-- Team Members (Many-to-Many: Users <-> Teams)
CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (team_id) REFERENCES maintenance_teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_member (team_id, user_id),
  INDEX idx_team (team_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- 4. EQUIPMENT CATEGORIES
-- ============================================

CREATE TABLE equipment_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_name (name)
) ENGINE=InnoDB;

-- ============================================
-- 5. EQUIPMENT (ASSETS)
-- ============================================

CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  
  -- Categorization
  category_id INT NOT NULL,
  department_id INT,
  
  -- Assignment
  assigned_to_user_id INT COMMENT 'Employee who owns this equipment',
  assigned_team_id INT NOT NULL COMMENT 'Default maintenance team',
  assigned_technician_id INT COMMENT 'Default technician for this equipment',
  
  -- Technical Details
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  
  -- Purchase & Warranty
  purchase_date DATE,
  warranty_expiry_date DATE,
  
  -- Location & Status
  location VARCHAR(255) COMMENT 'Physical location of equipment',
  status ENUM('operational', 'under_maintenance', 'broken', 'scrapped') DEFAULT 'operational',
  
  -- Additional Info
  description TEXT,
  specifications JSON COMMENT 'Technical specifications as key-value pairs',
  image_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_team_id) REFERENCES maintenance_teams(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_technician_id) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_code (equipment_code),
  INDEX idx_category (category_id),
  INDEX idx_department (department_id),
  INDEX idx_status (status),
  INDEX idx_assigned_team (assigned_team_id)
) ENGINE=InnoDB;

-- ============================================
-- 6. MAINTENANCE REQUESTS (WORK ORDERS)
-- ============================================

CREATE TABLE maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Basic Info
  subject VARCHAR(255) NOT NULL COMMENT 'What is wrong?',
  description TEXT,
  
  -- Request Type
  request_type ENUM('corrective', 'preventive') NOT NULL COMMENT 'Corrective=Breakdown, Preventive=Routine',
  
  -- Equipment Reference
  equipment_id INT NOT NULL,
  equipment_category_id INT COMMENT 'Auto-filled from equipment',
  
  -- Team & Assignment
  maintenance_team_id INT COMMENT 'Auto-filled from equipment',
  assigned_technician_id INT COMMENT 'Who is fixing this',
  
  -- Request Lifecycle
  stage ENUM('new', 'in_progress', 'repaired', 'scrap') DEFAULT 'new',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  
  -- Scheduling
  scheduled_date DATE COMMENT 'When should work happen (for calendar view)',
  scheduled_time TIME,
  deadline DATE,
  
  -- Execution Tracking
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  duration_hours DECIMAL(10, 2) COMMENT 'Hours spent on repair',
  
  -- Requester
  requested_by_id INT NOT NULL,
  
  -- Notes
  technician_notes TEXT,
  scrap_reason TEXT COMMENT 'Why equipment was scrapped',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE RESTRICT,
  FOREIGN KEY (equipment_category_id) REFERENCES equipment_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_technician_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (requested_by_id) REFERENCES users(id) ON DELETE RESTRICT,
  
  INDEX idx_request_number (request_number),
  INDEX idx_equipment (equipment_id),
  INDEX idx_stage (stage),
  INDEX idx_team (maintenance_team_id),
  INDEX idx_technician (assigned_technician_id),
  INDEX idx_scheduled_date (scheduled_date),
  INDEX idx_request_type (request_type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- 7. REQUEST STAGE HISTORY (Audit Trail)
-- ============================================

CREATE TABLE request_stage_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  from_stage VARCHAR(50),
  to_stage VARCHAR(50) NOT NULL,
  changed_by_id INT NOT NULL,
  notes TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by_id) REFERENCES users(id) ON DELETE RESTRICT,
  
  INDEX idx_request (request_id),
  INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB;

-- ============================================
-- 8. SCHEMA MIGRATIONS (System Table)
-- ============================================

CREATE TABLE schema_migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_migration_name (migration_name)
) ENGINE=InnoDB;
