-- ============================================
-- GearGuard Database - Equipment & Assets
-- BCNF Optimized Schema
-- ============================================

-- Equipment Categories (Normalized)
CREATE TABLE IF NOT EXISTS equipment_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  parent_category_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (parent_category_id) REFERENCES equipment_categories(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_parent (parent_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Manufacturers (Normalized)
CREATE TABLE IF NOT EXISTS equipment_manufacturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Locations (Normalized for better referential integrity)
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  building VARCHAR(100),
  floor VARCHAR(50),
  room VARCHAR(50),
  description TEXT,
  parent_location_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (parent_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_parent (parent_location_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Table (Main Asset Registry)
CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  manufacturer_id INT,
  model VARCHAR(255),
  serial_number VARCHAR(255) UNIQUE,
  qr_code VARCHAR(255) UNIQUE,
  barcode VARCHAR(255) UNIQUE,
  location_id INT,
  assigned_team_id INT,
  description TEXT,
  purchase_date DATE,
  purchase_cost DECIMAL(15, 2),
  warranty_expiry_date DATE,
  expected_lifetime_years INT,
  criticality ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('operational', 'standby', 'maintenance', 'breakdown', 'retired', 'disposed') DEFAULT 'operational',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (manufacturer_id) REFERENCES equipment_manufacturers(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_code (equipment_code),
  INDEX idx_category (category_id),
  INDEX idx_status (status),
  INDEX idx_location (location_id),
  INDEX idx_team (assigned_team_id),
  INDEX idx_serial (serial_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Specifications (Normalized - BCNF)
CREATE TABLE IF NOT EXISTS equipment_specifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  spec_key VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  unit VARCHAR(50),
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  UNIQUE KEY unique_equipment_spec (equipment_id, spec_key),
  INDEX idx_equipment (equipment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Documents (Manuals, Certificates, etc.)
CREATE TABLE IF NOT EXISTS equipment_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  document_type ENUM('manual', 'certificate', 'warranty', 'invoice', 'inspection', 'other') NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  uploaded_by INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_equipment (equipment_id),
  INDEX idx_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Maintenance History
CREATE TABLE IF NOT EXISTS equipment_maintenance_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  maintenance_type ENUM('preventive', 'corrective', 'inspection', 'calibration', 'upgrade') NOT NULL,
  performed_date TIMESTAMP NOT NULL,
  performed_by INT NOT NULL,
  next_due_date TIMESTAMP,
  notes TEXT,
  cost DECIMAL(10, 2),
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_equipment (equipment_id),
  INDEX idx_date (performed_date),
  INDEX idx_next_due (next_due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Downtime Log
CREATE TABLE IF NOT EXISTS equipment_downtime (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  downtime_type ENUM('breakdown', 'maintenance', 'unavailable', 'other') NOT NULL,
  reason TEXT,
  impact_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'medium',
  reported_by INT NOT NULL,
  
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_equipment (equipment_id),
  INDEX idx_start (start_time),
  INDEX idx_type (downtime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
