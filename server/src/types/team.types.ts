// src/types/team.types.ts

export interface Team {
    id: number;
    name: string;
    description: string;
    team_leader_id: number | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    member_count?: number;
    active_requests?: number;
    completed_this_month?: number;
}

export interface TeamMember {
    id: number;
    team_id: number;
    user_id: number;
    joined_at: Date;
    user_name?: string;
    user_email?: string;
    user_role?: string;
    user_avatar?: string;
    active_requests?: number;
}

export interface CreateTeamRequest {
    name: string;
    description: string;
    team_leader_id?: number;
}

export interface UpdateTeamRequest {
    name?: string;
    description?: string;
    team_leader_id?: number;
    is_active?: boolean;
}

export interface AddMemberRequest {
    user_id: number;
}
