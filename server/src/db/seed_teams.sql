-- Insert sample teams
INSERT INTO maintenance_teams (name, specialization, is_active) VALUES
('Mechanics Team', 'CNC Machines & Heavy Equipment', true),
('Electricians Team', 'Electrical Systems & Power', true),
('IT Support Team', 'Computers & Network Equipment', true),
('HVAC Team', 'Climate Control Systems', true)
ON DUPLICATE KEY UPDATE name=name;

-- Add team members (assuming users exist)
-- First, let's check what users we have
SELECT id, email, name FROM users;

-- Get team IDs for reference
SELECT id, name FROM maintenance_teams;
