-- ============================================
-- Add Assigned Member to Work Centers
-- Allows assigning specific team members to work centers
-- ============================================

-- Add assigned_member_id column to work_centers table
ALTER TABLE work_centers
ADD COLUMN assigned_member_id INT NULL AFTER assigned_team_id,
ADD CONSTRAINT fk_work_center_member 
  FOREIGN KEY (assigned_member_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_assigned_member ON work_centers(assigned_member_id);

-- Add comment to clarify the relationship
ALTER TABLE work_centers 
MODIFY COLUMN assigned_member_id INT NULL 
COMMENT 'Specific team member assigned to this work center';
