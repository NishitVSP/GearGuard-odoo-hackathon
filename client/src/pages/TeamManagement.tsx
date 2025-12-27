import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import AddTeamForm, { TeamFormData } from '../components/teams/AddTeamForm';
import AddMemberForm, { MemberFormData } from '../components/teams/AddMemberForm';
import DeleteConfirmDialog from '../components/equipment/DeleteConfirmDialog';
import AssignTaskDialog from '../components/teams/AssignTaskDialog';
import ViewProfileModal from '../components/teams/ViewProfileModal';
import { FiPlus, FiUsers, FiEdit, FiTrash2 } from 'react-icons/fi';
import * as api from '../services/api';

interface Team {
  id: number;
  name: string;
  specialization: string;
  is_active?: boolean;
  member_count?: number;
  active_requests?: number;
  completed_requests?: number;
  memberCount?: number;
  activeRequests?: number;
  completedThisMonth?: number;
  members?: TeamMember[];
}

interface TeamMember {
  id: number;
  user_id?: number;
  team_id?: number;
  name?: string;
  email?: string;
  role: string;
  avatar?: string;
  status?: 'available' | 'busy' | 'offline';
  active_requests?: number;
  activeRequests?: number;
  joined_at?: string;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [currentTeamDetails, setCurrentTeamDetails] = useState<(Team & { members: TeamMember[] }) | null>(null);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [assignTaskMember, setAssignTaskMember] = useState<TeamMember | null>(null);
  const [viewProfileMember, setViewProfileMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  // Load teams on mount
  useEffect(() => {
    loadTeams();
  }, []);

  // Load team details when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      loadTeamDetails(selectedTeam);
    } else {
      setCurrentTeamDetails(null);
    }
  }, [selectedTeam]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await api.getTeams();
      setTeams(data);
      // Auto-select first team if available
      if (data.length > 0 && !selectedTeam) {
        setSelectedTeam(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
      alert('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const loadTeamDetails = async (teamId: number) => {
    try {
      const data = await api.getTeamById(teamId);
      setCurrentTeamDetails(data);
    } catch (error) {
      console.error('Failed to load team details:', error);
      alert('Failed to load team details');
    }
  };

  // Handlers
  const handleAddTeam = async (data: TeamFormData) => {
    try {
      await api.createTeam({
        name: data.name,
        specialization: data.specialization,
        is_active: true,
      });
      setIsAddTeamModalOpen(false);
      await loadTeams();
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team');
    }
  };

  const handleEditTeam = async (data: TeamFormData) => {
    if (!selectedTeam) return;
    try {
      await api.updateTeam(selectedTeam, {
        name: data.name,
        specialization: data.specialization,
        is_active: true,
      });
      setIsEditTeamModalOpen(false);
      await loadTeams();
      await loadTeamDetails(selectedTeam);
    } catch (error) {
      console.error('Failed to update team:', error);
      alert('Failed to update team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    try {
      await api.deleteTeam(selectedTeam);
      setIsDeleteTeamDialogOpen(false);
      setSelectedTeam(null);
      await loadTeams();
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Failed to delete team');
    }
  };

  const handleAddMember = async (data: MemberFormData) => {
    if (!selectedTeam) return;
    try {
      await api.addTeamMember(selectedTeam, {
        user_id: parseInt(data.userId),
        role: data.role,
      });
      setIsAddMemberModalOpen(false);
      await loadTeamDetails(selectedTeam);
      await loadTeams();
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member');
    }
  };

  const handleAssignTask = (requestId: string) => {
    console.log('Assigning request:', requestId, 'to member:', assignTaskMember?.id);
    // TODO: Implement assign task API
    setAssignTaskMember(null);
  };

  // Helper to normalize team data from API
  const normalizeTeam = (team: Team) => ({
    ...team,
    memberCount: team.member_count || team.memberCount || 0,
    activeRequests: team.active_requests || team.activeRequests || 0,
    completedThisMonth: team.completed_requests || team.completedThisMonth || 0,
  });

  // Helper to normalize member data from API
  const normalizeMember = (member: TeamMember) => {
    const initials = member.name
      ? member.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : member.email?.substring(0, 2).toUpperCase() || 'U';
    
    return {
      ...member,
      name: member.name || member.email || 'Unknown',
      avatar: member.avatar || initials,
      status: member.status || 'available' as const,
      activeRequests: member.active_requests || member.activeRequests || 0,
    };
  };

  const currentTeam = currentTeamDetails ? normalizeTeam(currentTeamDetails) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage maintenance teams and members</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setIsAddTeamModalOpen(true)}>
          Add Team
        </Button>
      </div>

      {loading ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teams List - Sidebar */}
          <div className="lg:col-span-1">
            <Card title="Teams">
              <div className="space-y-2">
                {teams.map((team) => {
                  const normalizedTeam = normalizeTeam(team);
                  return (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedTeam === team.id
                          ? 'bg-blue-50 border-2 border-blue-300 shadow-sm'
                          : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiUsers className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{team.name}</h3>
                          <p className="text-xs text-gray-500">{normalizedTeam.memberCount} members</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Active: {normalizedTeam.activeRequests}</span>
                        <Badge variant="success" size="sm">
                          {normalizedTeam.completedThisMonth}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Team Details - Main Content */}
          <div className="lg:col-span-3">
            {currentTeam ? (
              <>
                {/* Team Header Card */}
                <Card className="mb-6">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-100 rounded-xl">
                        <FiUsers className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentTeam.name}</h2>
                        <p className="text-gray-600">{currentTeam.specialization}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" icon={<FiEdit />} onClick={() => setIsEditTeamModalOpen(true)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" icon={<FiTrash2 />} onClick={() => setIsDeleteTeamDialogOpen(true)}>
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {currentTeam.memberCount}
                      </div>
                      <p className="text-sm text-blue-700">Team Members</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {currentTeam.activeRequests}
                      </div>
                      <p className="text-sm text-yellow-700">Active Requests</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {currentTeam.completedThisMonth}
                      </div>
                      <p className="text-sm text-green-700">Completed This Month</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Team Members */}
              <Card 
                title="Team Members"
                actions={
                  <Button variant="primary" size="sm" icon={<FiPlus />} onClick={() => setIsAddMemberModalOpen(true)}>
                    Add Member
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTeamDetails?.members?.map((member) => {
                    const normalizedMember = normalizeMember(member);
                    return (
                      <div
                        key={member.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        {/* Member Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full ${getAvatarColor(normalizedMember.avatar)} flex items-center justify-center text-white text-lg font-semibold`}>
                              {normalizedMember.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{normalizedMember.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(normalizedMember.status)} size="sm">
                            {normalizedMember.status}
                          </Badge>
                        </div>

                        {/* Member Stats */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Active Requests</span>
                          <span className={`text-lg font-bold ${
                            normalizedMember.activeRequests > 0 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {normalizedMember.activeRequests}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => setViewProfileMember(normalizedMember)}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            View Profile
                          </button>
                          <button 
                            onClick={() => setAssignTaskMember(normalizedMember)}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            Assign Task
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="p-12 text-center">
                <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No team selected</h3>
                <p className="text-gray-600">Select a team from the sidebar to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      )}

      {/* Add Team Modal */}
      <Modal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        title="Add New Team"
        size="md"
      >
        <AddTeamForm
          onSubmit={handleAddTeam}
          onCancel={() => setIsAddTeamModalOpen(false)}
        />
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={isEditTeamModalOpen}
        onClose={() => setIsEditTeamModalOpen(false)}
        title="Edit Team"
        size="md"
      >
        {currentTeam && (
          <AddTeamForm
            team={{
              name: currentTeam.name,
              specialization: currentTeam.specialization,
            }}
            mode="edit"
            onSubmit={handleEditTeam}
            onCancel={() => setIsEditTeamModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Team Confirmation */}
      <DeleteConfirmDialog
        isOpen={isDeleteTeamDialogOpen}
        onClose={() => setIsDeleteTeamDialogOpen(false)}
        onConfirm={handleDeleteTeam}
        equipmentName={currentTeam?.name || ''}
      />

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Team Member"
        size="md"
      >
        {selectedTeam && (
          <AddMemberForm
            teamId={selectedTeam}
            onSubmit={handleAddMember}
            onCancel={() => setIsAddMemberModalOpen(false)}
          />
        )}
      </Modal>

      {/* Assign Task Dialog */}
      <AssignTaskDialog
        isOpen={!!assignTaskMember}
        onClose={() => setAssignTaskMember(null)}
        onAssign={handleAssignTask}
        memberName={assignTaskMember?.name || ''}
        memberId={assignTaskMember?.id || 0}
      />

      {/* View Profile Modal */}
      <ViewProfileModal
        isOpen={!!viewProfileMember}
        onClose={() => setViewProfileMember(null)}
        member={viewProfileMember}
      />
    </Layout>
  );
}
