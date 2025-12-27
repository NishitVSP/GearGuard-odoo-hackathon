-- ============================================
-- Create Work Centers Table
-- Physical locations/stations where maintenance work is performed
-- ============================================

CREATE TABLE IF NOT EXISTS work_centers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL COMMENT 'e.g., Manufacturing, Assembly, QC, Testing',
  
  -- Location & Organization
  location VARCHAR(255) NULL COMMENT 'Physical location within facility',
  department_id INT NULL,
  
  -- Team Assignment
  assigned_team_id INT NULL COMMENT 'Default team responsible for this work center',
  assigned_member_id INT NULL COMMENT 'Specific team member assigned to this work center',
  
  -- Operational Details
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  capacity INT DEFAULT 100 COMMENT 'Maximum concurrent work items',
  description TEXT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_team_id) REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_member_id) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_code (code),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_department (department_id),
  INDEX idx_assigned_team (assigned_team_id),
  INDEX idx_assigned_member (assigned_member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample work centers
INSERT INTO work_centers (name, code, category, location, status, capacity, description) VALUES
('Assembly Line 1', 'WC-ASM-001', 'Assembly', 'Building A, Floor 1', 'active', 150, 'Primary assembly line for electronic components'),
('Quality Control Station', 'WC-QC-001', 'QC', 'Building B, Floor 2', 'active', 50, 'Main quality inspection station'),
('CNC Machining Center', 'WC-MFG-001', 'Manufacturing', 'Building A, Floor 1', 'active', 100, 'CNC machines for precision parts'),
('Packaging Station', 'WC-PKG-001', 'Packaging', 'Building C, Floor 1', 'active', 200, 'Final packaging and shipping preparation')
ON DUPLICATE KEY UPDATE name=VALUES(name);
