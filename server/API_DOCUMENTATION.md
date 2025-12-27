# GearGuard Backend API Documentation

## Overview
GearGuard is an Equipment Maintenance Management System designed to streamline maintenance workflows, track equipment status, and manage maintenance teams.

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth-endpoints)
  - [Dashboard](#dashboard-endpoints)
  - [Equipment](#equipment-endpoints)
  - [Maintenance Requests](#maintenance-requests-endpoints)
  - [Teams](#teams-endpoints)
  - [Work Centers](#work-centers-endpoints)
  - [Users](#users-endpoints)

---

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "technician"
    }
  }
}
```

---

## Dashboard Endpoints

### Get Dashboard Stats
**GET** `/api/dashboard/stats`

Returns overall system statistics.

Response:
```json
{
  "status": "success",
  "data": {
    "totalEquipment": 150,
    "activeRequests": 23,
    "completedToday": 5,
    "criticalIssues": 3
  }
}
```

### Get Critical Equipment
**GET** `/api/dashboard/critical-equipment`

Returns equipment with critical status or issues.

### Get Open Requests
**GET** `/api/dashboard/open-requests`

Returns all open maintenance requests.

### Get Technician Load
**GET** `/api/dashboard/technician-load`

Returns workload distribution across technicians.

### Get Recent Requests
**GET** `/api/dashboard/recent-requests?limit=5`

Returns recently created maintenance requests.

### Get Upcoming Maintenance
**GET** `/api/dashboard/upcoming-maintenance?limit=3`

Returns scheduled upcoming maintenance tasks.

---

## Equipment Endpoints

### List Equipment
**GET** `/api/equipment?search=&category=&limit=100`

Query parameters:
- `search` (optional): Search by name or code
- `category` (optional): Filter by category
- `limit` (optional): Maximum results (default: 100)

Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "equipment_code": "EQ-001",
      "name": "CNC Machine #1",
      "category": "Manufacturing",
      "status": "operational",
      "assigned_team": "Mechanics"
    }
  ],
  "meta": {
    "total": 150,
    "limit": 100
  }
}
```

### Get Equipment by ID
**GET** `/api/equipment/:id`

### Create Equipment
**POST** `/api/equipment`

Request body:
```json
{
  "equipment_code": "EQ-101",
  "name": "New CNC Machine",
  "category_id": 1,
  "assigned_team_id": 2,
  "status": "operational",
  "location": "Building A, Floor 1",
  "manufacturer": "ACME Corp",
  "model": "CNC-5000"
}
```

### Update Equipment
**PUT** `/api/equipment/:id`

### Delete Equipment
**DELETE** `/api/equipment/:id`

### Get Equipment Categories
**GET** `/api/equipment/meta/categories`

Returns all available equipment categories.

---

## Maintenance Requests Endpoints

### Get Kanban View
**GET** `/api/requests/kanban`

Returns requests organized by stage (new, in_progress, repaired, scrap).

Response:
```json
{
  "status": "success",
  "data": {
    "new": [...],
    "in_progress": [...],
    "repaired": [...],
    "scrap": [...]
  }
}
```

### Get Calendar Events
**GET** `/api/requests/calendar?start=2025-01-01&end=2025-01-31`

Returns requests formatted for calendar view.

### Create Request
**POST** `/api/requests`

Request body:
```json
{
  "subject": "Motor overheating",
  "description": "Equipment motor is overheating frequently",
  "request_type": "corrective",
  "equipment_id": 5,
  "priority": "high",
  "scheduled_date": "2025-01-15"
}
```

### Update Request
**PUT** `/api/requests/:id`

### Update Request Stage
**PATCH** `/api/requests/:id/stage`

Request body:
```json
{
  "stage": "in_progress",
  "notes": "Technician assigned and working on issue"
}
```

### Delete Request
**DELETE** `/api/requests/:id`

---

## Teams Endpoints

### List All Teams
**GET** `/api/teams`

Returns all maintenance teams with member count and active requests.

### Get Team by ID
**GET** `/api/teams/:id`

Returns team details including all members.

Response:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "HVAC Specialists",
    "description": "Heating and cooling systems",
    "member_count": 5,
    "active_requests": 12,
    "members": [
      {
        "id": 1,
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "user_role": "technician",
        "active_requests": 3
      }
    ]
  }
}
```

### Create Team
**POST** `/api/teams`

Request body:
```json
{
  "name": "Electricians",
  "description": "Electrical systems maintenance"
}
```

### Update Team
**PUT** `/api/teams/:id`

### Delete Team
**DELETE** `/api/teams/:id`

### Add Member to Team
**POST** `/api/teams/:id/members`

Request body:
```json
{
  "user_id": 5
}
```

### Remove Member from Team
**DELETE** `/api/teams/:id/members/:memberId`

### Get Available Users
**GET** `/api/teams/:id/available-users`

Returns users not yet in the team.

---

## Work Centers Endpoints

### List Work Centers
**GET** `/api/work-centers?includeUtilization=true`

Query parameters:
- `includeUtilization` (optional): Include utilization percentage

Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Assembly Line 1",
      "code": "WC-ASM-001",
      "category": "Assembly",
      "location": "Building A, Floor 1",
      "departmentName": "Production",
      "assignedTeamName": "Mechanics",
      "assignedMemberName": "John Doe",
      "status": "active",
      "capacity": 150,
      "utilization": 67
    }
  ]
}
```

### Get Work Center by ID
**GET** `/api/work-centers/:id`

### Create Work Center
**POST** `/api/work-centers`

Request body:
```json
{
  "name": "CNC Station 3",
  "code": "WC-CNC-003",
  "category": "Manufacturing",
  "location": "Building B, Floor 2",
  "departmentId": 1,
  "assignedTeamId": 2,
  "assignedMemberId": 5,
  "status": "active",
  "capacity": 100
}
```

### Update Work Center
**PUT** `/api/work-centers/:id`

### Delete Work Center
**DELETE** `/api/work-centers/:id`

---

## Users Endpoints

### Get Technicians
**GET** `/api/users/technicians`

Returns all users with technician role.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Data Models

### Equipment
```typescript
{
  id: number
  equipment_code: string
  name: string
  category_id: number
  department_id?: number
  assigned_team_id: number
  assigned_technician_id?: number
  status: 'operational' | 'under_maintenance' | 'broken' | 'scrapped'
  location?: string
  manufacturer?: string
  model?: string
  purchase_date?: Date
  warranty_expiry_date?: Date
}
```

### Maintenance Request
```typescript
{
  id: number
  request_number: string
  subject: string
  description?: string
  request_type: 'corrective' | 'preventive'
  equipment_id: number
  maintenance_team_id?: number
  assigned_technician_id?: number
  stage: 'new' | 'in_progress' | 'repaired' | 'scrap'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduled_date?: Date
  deadline?: Date
}
```

### Team
```typescript
{
  id: number
  name: string
  description?: string
  team_leader_id?: number
  is_active: boolean
  member_count?: number
  active_requests?: number
  members?: TeamMember[]
}
```

### Work Center
```typescript
{
  id: number
  name: string
  code: string
  category: string
  location?: string
  departmentId?: number
  assignedTeamId?: number
  assignedMemberId?: number
  status: 'active' | 'inactive' | 'maintenance'
  capacity: number
  utilization?: number
}
```

---

## Rate Limiting
Currently not implemented. All endpoints are available without rate limits.

## Pagination
Most list endpoints support pagination through `limit` query parameter.

## Versioning
Current API version: v1.0.0  
API versioning will be implemented in future releases.

---

For more information or support, contact the development team.
