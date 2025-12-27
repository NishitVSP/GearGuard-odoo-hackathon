import { useState } from 'react';
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

interface Team {
  id: number;
  name: string;
  specialization: string;
  memberCount: number;
  activeRequests: number;
  completedThisMonth: number;
  members: TeamMember[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  activeRequests: number;
}

export default function TeamManagement() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(1);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [assignTaskMember, setAssignTaskMember] = useState<TeamMember | null>(null);
  const [viewProfileMember, setViewProfileMember] = useState<TeamMember | null>(null);

  // Mock data
  const teams: Team[] = [
    {
      id: 1,
      name: 'Mechanics Team',
      specialization: 'CNC Machines & Heavy Equipment',
      memberCount: 5,
      activeRequests: 8,
      completedThisMonth: 24,
      members: [
        { id: 1, name: 'Mike Johnson', role: 'Lead Mechanic', avatar: 'MJ', status: 'busy', activeRequests: 3 },
        { id: 2, name: 'John Doe', role: 'Senior Mechanic', avatar: 'JD', status: 'available', activeRequests: 0 },
        { id: 3, name: 'Tom Brown', role: 'Mechanic', avatar: 'TB', status: 'busy', activeRequests: 2 },
        { id: 4, name: 'Steve Clark', role: 'Mechanic', avatar: 'SC', status: 'available', activeRequests: 1 },
        { id: 5, name: 'David Lee', role: 'Apprentice', avatar: 'DL', status: 'busy', activeRequests: 2 },
      ],
    },
    {
      id: 2,
      name: 'Electricians Team',
      specialization: 'Electrical Systems & Power',
      memberCount: 4,
      activeRequests: 5,
      completedThisMonth: 18,
      members: [
        { id: 6, name: 'Sarah Wilson', role: 'Lead Electrician', avatar: 'SW', status: 'busy', activeRequests: 2 },
        { id: 7, name: 'Jane Smith', role: 'Electrician', avatar: 'JS', status: 'available', activeRequests: 1 },
        { id: 8, name: 'Robert Davis', role: 'Electrician', avatar: 'RD', status: 'busy', activeRequests: 2 },
        { id: 9, name: 'Emily White', role: 'Apprentice', avatar: 'EW', status: 'available', activeRequests: 0 },
      ],
    },
    {
      id: 3,
      name: 'IT Support Team',
      specialization: 'Computers & Network Equipment',
      memberCount: 3,
      activeRequests: 3,
      completedThisMonth: 32,
      members: [
        { id: 10, name: 'Alex Turner', role: 'IT Manager', avatar: 'AT', status: 'available', activeRequests: 0 },
        { id: 11, name: 'Chris Martin', role: 'IT Technician', avatar: 'CM', status: 'busy', activeRequests: 2 },
        { id: 12, name: 'Lisa Anderson', role: 'IT Technician', avatar: 'LA', status: 'available', activeRequests: 1 },
      ],
    },
    {
      id: 4,
      name: 'HVAC Team',
      specialization: 'Climate Control Systems',
      memberCount: 3,
      activeRequests: 4,
      completedThisMonth: 15,
      members: [
        { id: 13, name: 'Paul Martinez', role: 'HVAC Specialist', avatar: 'PM', status: 'busy', activeRequests: 2 },
        { id: 14, name: 'Kevin Brown', role: 'HVAC Technician', avatar: 'KB', status: 'busy', activeRequests: 1 },
        { id: 15, name: 'Mark Taylor', role: 'HVAC Technician', avatar: 'MT', status: 'available', activeRequests: 1 },
      ],
    },
  ];

  const currentTeam = teams.find(t => t.id === selectedTeam);

  // Handlers
  const handleAddTeam = (data: TeamFormData) => {
    console.log('New team data:', data);
    // TODO: Send to backend API
    setIsAddTeamModalOpen(false);
  };

  const handleEditTeam = (data: TeamFormData) => {
    console.log('Updated team data:', data);
    // TODO: Send to backend API
    setIsEditTeamModalOpen(false);
  };

  const handleDeleteTeam = () => {
    console.log('Deleting team:', selectedTeam);
    // TODO: Send to backend API
    setIsDeleteTeamDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleAddMember = (data: MemberFormData) => {
    console.log('New member data:', data, 'for team:', selectedTeam);
    // TODO: Send to backend API
    setIsAddMemberModalOpen(false);
  };

  const handleAssignTask = (requestId: string) => {
    console.log('Assigning request:', requestId, 'to member:', assignTaskMember?.id);
    // TODO: Send to backend API
    setAssignTaskMember(null);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Teams List - Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Teams">
            <div className="space-y-2">
              {teams.map((team) => (
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
                      <p className="text-xs text-gray-500">{team.memberCount} members</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Active: {team.activeRequests}</span>
                    <Badge variant="success" size="sm">
                      {team.completedThisMonth}
                    </Badge>
                  </div>
                </button>
              ))}
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
                  {currentTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      {/* Member Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${getAvatarColor(member.avatar)} flex items-center justify-center text-white text-lg font-semibold`}>
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(member.status)} size="sm">
                          {member.status}
                        </Badge>
                      </div>

                      {/* Member Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Active Requests</span>
                        <span className={`text-lg font-bold ${
                          member.activeRequests > 0 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {member.activeRequests}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => setViewProfileMember(member)}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => setAssignTaskMember(member)}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Assign Task
                        </button>
                      </div>
                    </div>
                  ))}
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
