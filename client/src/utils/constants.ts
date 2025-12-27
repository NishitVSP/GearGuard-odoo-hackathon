export const APP_NAME = 'GearGuard';

export const EQUIPMENT_CATEGORIES = [
  { value: 'machinery', label: 'Machinery' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'tool', label: 'Tool' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'other', label: 'Other' },
] as const;

export const EQUIPMENT_STATUS = [
  { value: 'operational', label: 'Operational', color: 'green' },
  { value: 'maintenance', label: 'Under Maintenance', color: 'yellow' },
  { value: 'breakdown', label: 'Breakdown', color: 'red' },
  { value: 'retired', label: 'Retired', color: 'gray' },
] as const;

export const REQUEST_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
] as const;

export const REQUEST_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'submitted', label: 'Submitted', color: 'blue' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'blocked', label: 'Blocked', color: 'red' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
] as const;

export const REQUEST_TYPES = [
  { value: 'corrective', label: 'Corrective' },
  { value: 'preventive', label: 'Preventive' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'upgrade', label: 'Upgrade' },
] as const;

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'technician', label: 'Technician' },
  { value: 'operator', label: 'Operator' },
] as const;
