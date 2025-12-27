-- ============================================
-- GearGuard Database - Notifications & Alerts
-- BCNF Optimized Schema
-- ============================================

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  template_type ENUM('email', 'sms', 'in_app', 'push') NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  body_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_event_type (event_type),
  INDEX idx_template_type (template_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
  related_entity_type VARCHAR(50) COMMENT 'equipment, request, user, etc.',
  related_entity_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System Alerts
CREATE TABLE IF NOT EXISTS system_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alert_type ENUM('equipment_down', 'maintenance_overdue', 'part_low_stock', 'warranty_expiring', 'certification_expiring', 'system') NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by INT,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type_severity (alert_type, severity),
  INDEX idx_resolved (is_resolved),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_channel ENUM('email', 'sms', 'in_app', 'push') NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_channel_event (user_id, notification_channel, event_type),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
