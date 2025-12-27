-- ============================================
-- GearGuard Database - Maintenance Requests & Work Orders
-- BCNF Optimized Schema
-- ============================================

-- Maintenance Request Types (Normalized)
CREATE TABLE IF NOT EXISTS request_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  default_priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  requires_approval BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_number VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  equipment_id INT NOT NULL,
  request_type_id INT NOT NULL,
  requested_by INT NOT NULL,
  assigned_to_team INT,
  assigned_to_user INT,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('draft', 'submitted', 'approved', 'rejected', 'in_progress', 'on_hold', 'blocked', 'completed', 'cancelled') DEFAULT 'draft',
  
  -- Scheduling
  scheduled_start TIMESTAMP,
  scheduled_end TIMESTAMP,
  deadline TIMESTAMP,
  
  -- Time tracking
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  estimated_hours DECIMAL(10, 2),
  actual_hours DECIMAL(10, 2),
  
  -- Financial
  estimated_cost DECIMAL(15, 2),
  actual_cost DECIMAL(15, 2),
  
  -- Safety & Compliance
  safety_requirements TEXT,
  requires_shutdown BOOLEAN DEFAULT FALSE,
  requires_permit BOOLEAN DEFAULT FALSE,
  
  -- Approval
  approved_by INT,
  approved_at TIMESTAMP NULL,
  rejection_reason TEXT,
  
  -- Additional
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE RESTRICT,
  FOREIGN KEY (request_type_id) REFERENCES request_types(id) ON DELETE RESTRICT,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_to_team) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to_user) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_request_number (request_number),
  INDEX idx_equipment (equipment_id),
  INDEX idx_requester (requested_by),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_team (assigned_to_team),
  INDEX idx_user (assigned_to_user),
  INDEX idx_scheduled_start (scheduled_start),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Request Attachments (Normalized - BCNF)
CREATE TABLE IF NOT EXISTS request_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  file_size INT,
  uploaded_by INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Request History (Audit Trail)
CREATE TABLE IF NOT EXISTS request_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  changed_by INT NOT NULL,
  change_type ENUM('status_change', 'assignment', 'priority_change', 'comment', 'other') NOT NULL,
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_request (request_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Work Order Tasks (Checklist items)
CREATE TABLE IF NOT EXISTS work_order_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  task_order INT NOT NULL,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by INT,
  completed_at TIMESTAMP NULL,
  estimated_duration_minutes INT,
  notes TEXT,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_request (request_id),
  INDEX idx_order (task_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Spare Parts Inventory
CREATE TABLE IF NOT EXISTS spare_parts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  part_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  manufacturer_id INT,
  unit_of_measure VARCHAR(50),
  unit_cost DECIMAL(10, 2),
  reorder_level INT DEFAULT 0,
  current_stock INT DEFAULT 0,
  location_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (manufacturer_id) REFERENCES equipment_manufacturers(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  INDEX idx_part_number (part_number),
  INDEX idx_category (category),
  INDEX idx_stock_level (current_stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Parts Used in Maintenance
CREATE TABLE IF NOT EXISTS request_parts_used (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  part_id INT NOT NULL,
  quantity_used INT NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (quantity_used * unit_cost) STORED,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES spare_parts(id) ON DELETE RESTRICT,
  INDEX idx_request (request_id),
  INDEX idx_part (part_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Maintenance Schedules (Preventive Maintenance)
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  schedule_name VARCHAR(255) NOT NULL,
  request_type_id INT NOT NULL,
  frequency_type ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'hours_based', 'custom') NOT NULL,
  frequency_value INT NOT NULL COMMENT 'Interval value based on frequency_type',
  last_performed_date TIMESTAMP,
  next_due_date TIMESTAMP,
  assigned_team_id INT,
  estimated_hours DECIMAL(10, 2),
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (request_type_id) REFERENCES request_types(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_equipment (equipment_id),
  INDEX idx_next_due (next_due_date),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments/Notes on Requests
CREATE TABLE IF NOT EXISTS request_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE COMMENT 'Internal notes not visible to requester',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_request (request_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
