-- Create Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  equipment_id INT NOT NULL,
  requested_by INT NOT NULL,
  assigned_to_team INT,
  assigned_to_user INT,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('draft', 'submitted', 'approved', 'in_progress', 'blocked', 'completed', 'cancelled') DEFAULT 'draft',
  request_type ENUM('corrective', 'preventive', 'inspection', 'upgrade') NOT NULL,
  scheduled_date TIMESTAMP,
  deadline TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours DECIMAL(10, 2),
  actual_hours DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  notes TEXT,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_to_team) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to_user) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_equipment (equipment_id),
  INDEX idx_requester (requested_by),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_team (assigned_to_team),
  INDEX idx_user (assigned_to_user),
  INDEX idx_scheduled (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Request History Table (for tracking status changes)
CREATE TABLE IF NOT EXISTS request_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  changed_by INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
