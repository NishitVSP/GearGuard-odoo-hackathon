-- C:\Users\Lenovo\Desktop\programming\gearguard\server\src\db\seeds\000_simplified_seed.sql

-- ============================================
-- GearGuard - Simplified Seed Data
-- Based on Hackathon Requirements
-- ============================================

USE gearguard_db;

-- ============================================
-- 1. Seed Default Admin User
-- ============================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role, is_active) VALUES
('admin@gearguard.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'System Admin', 'admin', TRUE),
('manager@gearguard.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'John Manager', 'manager', TRUE),
('tech1@gearguard.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Mike Technician', 'technician', TRUE),
('tech2@gearguard.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Sarah Technician', 'technician', TRUE),
('user@gearguard.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Regular User', 'user', TRUE);

-- ============================================
-- 2. Seed Departments
-- ============================================
INSERT INTO departments (name, description) VALUES
('Production', 'Manufacturing and production department'),
('IT', 'Information Technology department'),
('Logistics', 'Warehouse and logistics department'),
('Facilities', 'Building and facilities management'),
('R&D', 'Research and Development');

-- ============================================
-- 3. Seed Equipment Categories
-- ============================================
INSERT INTO equipment_categories (name, description) VALUES
('CNC Machines', 'Computer Numerical Control machines'),
('Computers', 'Desktop computers, laptops, servers'),
('Vehicles', 'Company vehicles and forklifts'),
('HVAC', 'Heating, ventilation, and air conditioning'),
('Production Tools', 'Hand tools and power tools'),
('Office Equipment', 'Printers, scanners, copiers');

-- ============================================
-- 4. Seed Maintenance Teams
-- ============================================
INSERT INTO maintenance_teams (name, description, team_leader_id) VALUES
('Mechanics', 'Mechanical equipment maintenance', 3),
('Electricians', 'Electrical systems and equipment', 3),
('IT Support', 'Computer and network support', 4),
('HVAC Specialists', 'Climate control systems', 4);

-- ============================================
-- 5. Assign Team Members
-- ============================================
INSERT INTO team_members (team_id, user_id) VALUES
(1, 3), -- Mike -> Mechanics
(2, 3), -- Mike -> Electricians
(3, 4), -- Sarah -> IT Support
(4, 4); -- Sarah -> HVAC Specialists

-- ============================================
-- 6. Seed Sample Equipment
-- ============================================
INSERT INTO equipment (
  equipment_code, name, category_id, department_id, 
  assigned_to_user_id, assigned_team_id, assigned_technician_id,
  serial_number, manufacturer, model, location, status,
  purchase_date, warranty_expiry_date, description
) VALUES
-- Production Equipment
('EQ-001', 'CNC Mill Machine A', 1, 1, NULL, 1, 3, 'CNC-2024-001', 'Haas Automation', 'VF-2SS', 'Production Floor A', 'operational', '2023-01-15', '2026-01-15', 'Primary CNC milling machine for precision parts'),
('EQ-002', 'CNC Lathe B', 1, 1, NULL, 1, 3, 'CNC-2024-002', 'Haas Automation', 'ST-20', 'Production Floor A', 'operational', '2023-03-20', '2026-03-20', 'CNC lathe for cylindrical parts'),

-- IT Equipment
('EQ-003', 'Laptop - John Manager', 2, 2, 2, 3, 4, 'LP-2024-001', 'Dell', 'Latitude 7430', 'Office 201', 'operational', '2024-01-10', '2027-01-10', 'Manager laptop'),
('EQ-004', 'Network Printer 01', 6, 2, NULL, 3, 4, 'PR-2024-001', 'HP', 'LaserJet Pro MFP M428fdw', 'Office Floor 2', 'operational', '2023-06-15', '2026-06-15', 'Main office printer'),

-- Logistics Equipment
('EQ-005', 'Forklift Toyota A', 3, 3, NULL, 1, 3, 'FK-2023-001', 'Toyota', '8FBMT25', 'Warehouse A', 'operational', '2022-05-10', '2025-05-10', 'Electric forklift for warehouse'),

-- Facilities Equipment
('EQ-006', 'HVAC Unit - Floor 1', 4, 4, NULL, 4, 4, 'HVAC-2021-001', 'Carrier', '50TCA08', 'Roof - Building 1', 'operational', '2021-08-20', '2024-08-20', 'Main HVAC unit for first floor');

-- ============================================
-- 7. Seed Sample Maintenance Requests
-- ============================================
INSERT INTO maintenance_requests (
  request_number, subject, description, request_type,
  equipment_id, equipment_category_id, maintenance_team_id,
  assigned_technician_id, requested_by_id, stage, priority,
  scheduled_date, duration_hours
) VALUES
-- Corrective (Breakdown) Requests
('REQ-001', 'Leaking Oil', 'CNC Machine A is leaking hydraulic oil from the pump area', 'corrective', 1, 1, 1, 3, 2, 'new', 'high', NULL, NULL),
('REQ-002', 'Printer Paper Jam', 'Network Printer 01 has continuous paper jam issues', 'corrective', 4, 6, 3, 4, 5, 'in_progress', 'medium', NULL, NULL),

-- Preventive (Routine) Requests
('REQ-003', 'Monthly CNC Maintenance', 'Routine monthly maintenance for CNC Mill Machine A', 'preventive', 1, 1, 1, 3, 2, 'new', 'medium', '2025-01-15', NULL),
('REQ-004', 'Quarterly HVAC Checkup', 'Quarterly inspection and filter replacement', 'preventive', 6, 4, 4, 4, 2, 'new', 'medium', '2025-01-20', NULL),

-- Completed Request
('REQ-005', 'Forklift Battery Replacement', 'Replace old battery with new one', 'corrective', 5, 3, 1, 3, 2, 'repaired', 'high', NULL, 4.5);

-- ============================================
-- 8. Seed Request History
-- ============================================
INSERT INTO request_stage_history (request_id, from_stage, to_stage, changed_by_id, notes) VALUES
(2, 'new', 'in_progress', 4, 'Started working on printer jam issue'),
(5, 'new', 'in_progress', 3, 'Started battery replacement'),
(5, 'in_progress', 'repaired', 3, 'Battery replaced successfully, forklift tested and operational');

-- ============================================
-- Record Migration
-- ============================================
INSERT INTO schema_migrations (migration_name) VALUES
('000_simplified_schema.sql'),
('001_seed_data.sql');
