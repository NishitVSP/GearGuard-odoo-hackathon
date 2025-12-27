export interface Team {
  id: number;
  name: string;
  description?: string;
  leader_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role?: string;
  joined_at: string;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  leader_id?: number;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {}
