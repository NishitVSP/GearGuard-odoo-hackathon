-- ============================================
-- Enhanced Seed Data for Dashboard Testing
-- Run this AFTER 000_simplified_seed.sql
-- ============================================

USE gearguard_db;

-- Add more equipment for better stats
INSERT INTO equipment (
  equipment_code, name, category_id, department_id, 
  assigned_team_id, assigned_technician_id,
  serial_number, manufacturer, model, location, status,
  purchase_date, description
) VALUES
('EQ-007', 'Air Compressor Unit 1', 5, 1, 1, 3, 'AC-2023-001', 'Atlas Copco', 'GA-22', 'Production Floor B', 'under_maintenance', '2023-02-10', 'Main air compressor'),
('EQ-008', 'Welding Robot', 1, 1, 1, 3, 'WR-2024-001', 'Fanuc', 'ARC Mate 100iC', 'Production Floor A', 'operational', '2024-06-01', 'Automated welding system'),
('EQ-009', 'Conveyor Belt System', 5, 1, 1, 3, 'CB-2022-001', 'Dorner', '2200 Series', 'Production Line 1', 'operational', '2022-11-20', 'Main conveyor system'),
('EQ-010', 'Generator Backup', 4, 4, 4, 4, 'GEN-2020-001', 'Caterpillar', 'C15', 'Basement', 'broken', '2020-03-15', 'Emergency backup generator');

-- Add TODAY's completed request (for trend calculation)
INSERT INTO maintenance_requests (
  request_number, subject, description, request_type,
  equipment_id, equipment_category_id, maintenance_team_id,
  assigned_technician_id, requested_by_id, stage, priority,
  started_at, completed_at, duration_hours
) VALUES
('REQ-006', 'Printer Toner Replacement', 'Replace empty toner cartridge', 'corrective', 
 4, 6, 3, 4, 5, 'repaired', 'low', 
 CONCAT(CURDATE(), ' 08:00:00'), CONCAT(CURDATE(), ' 08:15:00'), 0.25);

-- Add OVERDUE requests (deadline passed)
INSERT INTO maintenance_requests (
  request_number, subject, description, request_type,
  equipment_id, equipment_category_id, maintenance_team_id,
  assigned_technician_id, requested_by_id, stage, priority,
  deadline, scheduled_date
) VALUES
('REQ-007', 'Generator Emergency Repair', 'Generator failed during test run', 'corrective',
 10, 4, 4, 4, 2, 'new', 'urgent',
 DATE_SUB(CURDATE(), INTERVAL 3 DAY), NULL),
('REQ-008', 'Air Compressor Filter Change', 'Overdue filter replacement', 'preventive',
 7, 5, 1, 3, 2, 'in_progress', 'high',
 DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- Add UPCOMING preventive maintenance (next 7 days)
INSERT INTO maintenance_requests (
  request_number, subject, description, request_type,
  equipment_id, equipment_category_id, maintenance_team_id,
  assigned_technician_id, requested_by_id, stage, priority,
  scheduled_date, scheduled_time
) VALUES
('REQ-009', 'CNC Machine Lubrication', 'Weekly lubrication service', 'preventive',
 1, 1, 1, 3, 2, 'new', 'medium',
 DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00'),
('REQ-010', 'Forklift Safety Inspection', 'Monthly safety check', 'preventive',
 5, 3, 1, 3, 2, 'new', 'medium',
 DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:30:00'),
('REQ-011', 'HVAC Filter Replacement', 'Replace air filters', 'preventive',
 6, 4, 4, 4, 2, 'new', 'low',
 DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00'),
('REQ-012', 'Conveyor Belt Inspection', 'Monthly belt tension check', 'preventive',
 9, 5, 1, 3, 2, 'new', 'medium',
 DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00:00'),
('REQ-013', 'Welding Robot Calibration', 'Quarterly calibration', 'preventive',
 8, 1, 2, 3, 2, 'new', 'high',
 DATE_ADD(CURDATE(), INTERVAL 7 DAY), '11:00:00');

-- Add more active requests for better count
INSERT INTO maintenance_requests (
  request_number, subject, description, request_type,
  equipment_id, equipment_category_id, maintenance_team_id,
  assigned_technician_id, requested_by_id, stage, priority
) VALUES
('REQ-014', 'CNC Lathe Coolant System Issue', 'Coolant not circulating properly', 'corrective',
 2, 1, 1, 3, 2, 'new', 'high'),
('REQ-015', 'Laptop Screen Flickering', 'Manager laptop display issue', 'corrective',
 3, 2, 3, 4, 2, 'in_progress', 'medium');

-- Update request stage history
INSERT INTO request_stage_history (request_id, from_stage, to_stage, changed_by_id, notes) VALUES
(6, 'new', 'in_progress', 4, 'Started toner replacement'),
(6, 'in_progress', 'repaired', 4, 'Toner replaced successfully'),
(8, 'new', 'in_progress', 3, 'Started filter replacement - delayed due to parts'),
(15, 'new', 'in_progress', 4, 'Diagnosing display issue');
