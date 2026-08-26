import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Shield, 
  ChevronLeft,
  Bot,
  Trash2,
  Edit,
  Building2,
  Check,
  X,
  AlertCircle,
  Filter,
  Grid3x3,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';
import gcpLogo from 'figma:asset/13add375e3a2db3f7db7cbae5b934507fb50dc5a.png';
import azureLogo from 'figma:asset/84f6fef5f441eef1665a48cc39fa13061e5cdb07.png';
import awsLogo from 'figma:asset/499b6cf39d2cc683a05fdb69b4d2b206920ac09a.png';

interface UserManagementProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  accounts: string[];
  groups: string[];
  cloudAccounts: string[];
  integrations: string[];
  applications: string[];
}

export function UserManagement({ onNavigate, onLogout }: UserManagementProps) {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  
  // User management states
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Rudra Iyer', 
      email: 'rudra.iyer@customera.com', 
      role: 'Manager', 
      status: 'active', 
      accounts: ['AWS-123456789012', 'AZURE-a1b2c3d4'],
      groups: ['Security'],
      cloudAccounts: ['GCP Prod', 'Azure Prod'],
      integrations: ['PowerBI', 'Confluence'],
      applications: ['Cost Optimizer']
    },
    { 
      id: '2', 
      name: 'Sneha Dutta', 
      email: 'sneha.dutta@customera.com', 
      role: 'Architect', 
      status: 'active', 
      accounts: ['AWS-123456789012'],
      groups: ['Cloud Team', 'IT Operations'],
      cloudAccounts: ['GCP Prod', 'Azure Prod'],
      integrations: ['Kubernetes', 'PowerBI'],
      applications: ['Reports', 'Analytics', 'Monitoring']
    },
    { 
      id: '3', 
      name: 'Sanjay Mehta', 
      email: 'sanjay.mehta@customera.com', 
      role: 'Architect', 
      status: 'active', 
      accounts: ['GCP-gke-main-789012'],
      groups: ['Data Analytics', 'QA Team'],
      cloudAccounts: ['Azure Prod', 'Azure QA'],
      integrations: ['Grafana', 'Jira'],
      applications: ['Reports', 'Testing', 'CI/CD', 'Monitoring']
    },
    { 
      id: '4', 
      name: 'Neil Trivedi', 
      email: 'neil.trivedi@customera.com', 
      role: 'Viewer', 
      status: 'active', 
      accounts: ['AWS-123456789012'],
      groups: ['QA Team'],
      cloudAccounts: ['Azure QA', 'AWS Dev'],
      integrations: ['Terraform'],
      applications: ['Cost Optimizer', 'Reports', 'Dashboard']
    },
  ]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Viewer',
    accounts: [] as string[]
  });
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    cloudAccounts: [] as string[],
    integrations: [] as string[],
    applications: [] as string[]
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        accounts: newUser.accounts,
        groups: [],
        cloudAccounts: [],
        integrations: [],
        applications: []
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'Viewer',
        accounts: []
      });
      setIsAddUserDialogOpen(false);
    }
  };
  
  const handleCreateGroup = () => {
    if (newGroup.name) {
      // Here you would typically save the group to your backend
      console.log('Creating group:', newGroup);
      setNewGroup({
        name: '',
        description: '',
        cloudAccounts: [],
        integrations: [],
        applications: []
      });
      setIsCreateGroupDialogOpen(false);
    }
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditUserDialogOpen(false);
      setEditingUser(null);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentPage="user-management"
    >
      {/* Hero Section */}
      <div className="relative bg-[#AE275F] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Animated Wave Lines */}
            <path
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.3"
              d="M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30;
                  M0,35 C15,30 25,40 35,35 S55,30 65,35 S85,40 100,35;
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.3"
              d="M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50;
                  M0,55 C20,50 30,60 45,55 S65,50 75,55 S90,60 100,55;
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.2"
              d="M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70;
                  M0,75 C25,70 35,80 50,75 S70,70 80,75 S95,80 100,75;
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70
                "
              />
            </path>
            
            {/* Floating Circles */}
            <circle cx="10" cy="20" r="1" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="8s"
                repeatCount="indefinite"
                values="20;80;20"
              />
              <animate
                attributeName="opacity"
                dur="8s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            <circle cx="30" cy="60" r="1.5" fill="rgba(255,255,255,0.4)">
              <animate
                attributeName="cy"
                dur="10s"
                repeatCount="indefinite"
                values="60;15;60"
              />
              <animate
                attributeName="opacity"
                dur="10s"
                repeatCount="indefinite"
                values="0.4;0.7;0.4"
              />
            </circle>
            <circle cx="70" cy="40" r="1" fill="rgba(255,255,255,0.35)">
              <animate
                attributeName="cy"
                dur="12s"
                repeatCount="indefinite"
                values="40;85;40"
              />
              <animate
                attributeName="opacity"
                dur="12s"
                repeatCount="indefinite"
                values="0.35;0.65;0.35"
              />
            </circle>
            <circle cx="90" cy="70" r="1.2" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="9s"
                repeatCount="indefinite"
                values="70;25;70"
              />
              <animate
                attributeName="opacity"
                dur="9s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            
            {/* Diagonal Lines */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="6s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
            <line x1="0" y1="100" x2="100" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="7s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">User Management</h1>
              <p className="text-white/90 text-sm">Manage cloud accounts and user access</p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage users, groups, and access across applications and cloud accounts.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#AE275F]" />
                    Create New Group
                  </DialogTitle>
                  <DialogDescription>
                    Create a group and assign cloud accounts, integrations, and applications
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Group Name */}
                  <div>
                    <Label htmlFor="groupName">Group Name *</Label>
                    <Input
                      id="groupName"
                      placeholder="e.g., DevOps Team"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      className="mt-1.5"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea
                      id="groupDescription"
                      placeholder="Brief description of the group purpose..."
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>
                  
                  {/* Assign Cloud Accounts */}
                  <div>
                    <Label htmlFor="cloudAccounts">Assign Cloud Accounts</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!newGroup.cloudAccounts.includes(value)) {
                          setNewGroup({
                            ...newGroup,
                            cloudAccounts: [...newGroup.cloudAccounts, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select cloud accounts..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AWS Prod">AWS Production</SelectItem>
                        <SelectItem value="Azure Prod">Azure Production</SelectItem>
                        <SelectItem value="GCP Prod">GCP Production</SelectItem>
                        <SelectItem value="AWS Dev">AWS Development</SelectItem>
                        <SelectItem value="Azure QA">Azure QA</SelectItem>
                      </SelectContent>
                    </Select>
                    {newGroup.cloudAccounts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newGroup.cloudAccounts.map((account, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-blue-100 text-blue-700 border-blue-300 border flex items-center gap-1"
                          >
                            {account}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => setNewGroup({
                                ...newGroup, 
                                cloudAccounts: newGroup.cloudAccounts.filter(a => a !== account)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Assign Integrations */}
                  <div>
                    <Label htmlFor="integrations">Assign Integrations</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!newGroup.integrations.includes(value)) {
                          setNewGroup({
                            ...newGroup,
                            integrations: [...newGroup.integrations, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select integrations..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PowerBI">PowerBI</SelectItem>
                        <SelectItem value="Confluence">Confluence</SelectItem>
                        <SelectItem value="Kubernetes">Kubernetes</SelectItem>
                        <SelectItem value="Grafana">Grafana</SelectItem>
                        <SelectItem value="Jira">Jira</SelectItem>
                        <SelectItem value="Terraform">Terraform</SelectItem>
                      </SelectContent>
                    </Select>
                    {newGroup.integrations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newGroup.integrations.map((integration, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-purple-100 text-purple-700 border-purple-300 border flex items-center gap-1"
                          >
                            {integration}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => setNewGroup({
                                ...newGroup, 
                                integrations: newGroup.integrations.filter(i => i !== integration)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Assign Applications */}
                  <div>
                    <Label htmlFor="applications">Assign Applications</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!newGroup.applications.includes(value)) {
                          setNewGroup({
                            ...newGroup,
                            applications: [...newGroup.applications, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select applications..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cost Optimizer">Cost Optimizer</SelectItem>
                        <SelectItem value="Reports">Reports</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="CI/CD">CI/CD</SelectItem>
                      </SelectContent>
                    </Select>
                    {newGroup.applications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newGroup.applications.map((app, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-green-100 text-green-700 border-green-300 border flex items-center gap-1"
                          >
                            {app}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => setNewGroup({
                                ...newGroup, 
                                applications: newGroup.applications.filter(a => a !== app)
                              })}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateGroupDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGroup}
                    className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                    disabled={!newGroup.name}
                  >
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#AE275F]" />
                    Add New User
                  </DialogTitle>
                  <DialogDescription>
                    Create a new user account and assign role-based permissions
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userName">Full Name</Label>
                      <Input
                        id="userName"
                        placeholder="e.g., John Doe"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">Email Address</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="e.g., john.doe@company.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userRole">User Role</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Architect">Architect</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    onClick={handleAddUser}
                    className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* User Table Card */}
        <Card className="p-6 border-2 border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600">{users.length} users</span>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by User Name or Group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="border-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-sm text-gray-700 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">User Name</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Email</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">User Role</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Groups</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Cloud Accounts</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Integrations</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Applications</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Status</th>
                  <th className="text-left py-3 px-3 text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                  
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-3">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#AE275F] to-[#C73170] rounded-full flex items-center justify-center text-white text-xs">
                            {initials}
                          </div>
                          <span className="text-sm text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-sm text-gray-700">{user.email}</span>
                      </td>
                      <td className="py-4 px-3">
                        <Badge className="bg-gray-100 text-gray-700 border-0">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1">
                          {user.groups.map((group, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 border-0 text-xs w-fit">
                              {group}
                            </Badge>
                          ))}
                          {user.groups.length > 2 && (
                            <span className="text-xs text-gray-500">+{user.groups.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1">
                          {user.cloudAccounts.slice(0, 2).map((account, idx) => (
                            <span key={idx} className="text-sm text-gray-700">{account}</span>
                          ))}
                          {user.cloudAccounts.length > 2 && (
                            <span className="text-xs text-gray-500">+{user.cloudAccounts.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1">
                          {user.integrations.slice(0, 2).map((integration, idx) => (
                            <span key={idx} className="text-sm text-gray-700">{integration}</span>
                          ))}
                          {user.integrations.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-700 border-0 text-xs w-fit">
                              +{user.integrations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {user.applications.slice(0, 1).map((app, idx) => (
                            <span key={idx} className="text-sm text-gray-700">{app}</span>
                          ))}
                          {user.applications.length > 1 && (
                            <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                              +{user.applications.length - 1}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        {user.status === 'active' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-blue-50 h-8 w-8 p-0" 
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No users found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          )}
        </Card>
      </PageContainer>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#AE275F]" />
              Edit User - {editingUser?.name}
            </DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editUserName">Full Name</Label>
                  <Input
                    id="editUserName"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="editUserEmail">Email Address</Label>
                  <Input
                    id="editUserEmail"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="editUserRole">User Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Architect">Architect</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editUserStatus">Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(value: 'active' | 'inactive') => setEditingUser({...editingUser, status: value})}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
