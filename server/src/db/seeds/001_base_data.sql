-- ============================================
-- GearGuard Database - Initial Seed Data
-- Base data required for application to function
-- ============================================

-- Seed Equipment Categories
INSERT INTO equipment_categories (name, code, description, parent_category_id) VALUES
('Machinery', 'MACH', 'Industrial machinery and equipment', NULL),
('Vehicles', 'VEH', 'Transportation vehicles', NULL),
('Tools', 'TOOL', 'Hand and power tools', NULL),
('Electronics', 'ELEC', 'Electronic equipment and devices', NULL),
('HVAC', 'HVAC', 'Heating, ventilation, and air conditioning', NULL),
('Safety Equipment', 'SAFE', 'Safety and protective equipment', NULL);

-- Seed Departments
INSERT INTO departments (name, code, description) VALUES
('Maintenance', 'MAINT', 'Maintenance and repair department'),
('Operations', 'OPS', 'Operations and production department'),
('Engineering', 'ENG', 'Engineering and technical services'),
('Safety', 'SAFE', 'Safety and compliance department'),
('Facilities', 'FAC', 'Facilities management');

-- Seed Request Types
INSERT INTO request_types (name, code, description, default_priority, requires_approval) VALUES
('Corrective Maintenance', 'CM', 'Fix broken or malfunctioning equipment', 'high', FALSE),
('Preventive Maintenance', 'PM', 'Scheduled maintenance to prevent failures', 'medium', FALSE),
('Inspection', 'INSP', 'Regular equipment inspection', 'low', FALSE),
('Calibration', 'CAL', 'Equipment calibration and testing', 'medium', TRUE),
('Upgrade', 'UPG', 'Equipment upgrade or modification', 'low', TRUE),
('Emergency Repair', 'ER', 'Critical emergency repair', 'critical', FALSE);

-- Seed Locations
INSERT INTO locations (name, code, building, description) VALUES
('Main Warehouse', 'WH-MAIN', 'Building A', 'Primary warehouse facility'),
('Production Floor 1', 'PROD-1', 'Building B', 'First production floor'),
('Production Floor 2', 'PROD-2', 'Building B', 'Second production floor'),
('Storage Area', 'STOR-1', 'Building C', 'General storage area'),
('Maintenance Workshop', 'MAINT-WS', 'Building D', 'Maintenance and repair workshop');

-- Seed Admin User (password: admin123 - hashed with bcrypt)
-- NOTE: Change this password immediately in production!
INSERT INTO users (email, password_hash, name, is_active, email_verified) VALUES
('admin@gearguard.com', '$2a$10$YourHashedPasswordHere', 'System Administrator', TRUE, TRUE);

-- Get the admin user ID for role assignment
SET @admin_id = LAST_INSERT_ID();

-- Assign admin role
INSERT INTO user_roles (user_id, role, assigned_by) VALUES
(@admin_id, 'admin', @admin_id);

-- Create admin profile
INSERT INTO user_profiles (user_id, department, job_title) VALUES
(@admin_id, 'IT', 'System Administrator');

-- Seed Notification Templates
INSERT INTO notification_templates (name, template_type, event_type, subject, body_template) VALUES
('Request Submitted', 'email', 'request_submitted', 'Maintenance Request Submitted', 'Your maintenance request #{{request_number}} has been submitted successfully.'),
('Request Assigned', 'email', 'request_assigned', 'New Maintenance Request Assigned', 'You have been assigned to maintenance request #{{request_number}}.'),
('Request Completed', 'email', 'request_completed', 'Maintenance Request Completed', 'Maintenance request #{{request_number}} has been completed.'),
('Equipment Breakdown', 'in_app', 'equipment_breakdown', 'Equipment Breakdown Alert', 'Equipment {{equipment_name}} has reported a breakdown.'),
('Maintenance Overdue', 'in_app', 'maintenance_overdue', 'Maintenance Overdue', 'Scheduled maintenance for {{equipment_name}} is overdue.');
