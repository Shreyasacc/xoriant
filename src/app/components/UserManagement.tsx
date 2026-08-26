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
  XCircle,
  Cloud,
  Link2,
  LayoutGrid,
  MoreVertical,
  Eye
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
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

interface Group {
  id: string;
  name: string;
  memberCount: number;
  cloudAccounts: string[];
  integrations: string[];
  applications: string[];
}

export function UserManagement({ onNavigate, onLogout }: UserManagementProps) {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  // User management states
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Rudra Iyer', 
      email: 'rudra.iyer@customera.com', 
      role: 'Manager', 
      status: 'active', 
      accounts: ['AWS-123456789012', 'AZURE-a1b2c3d4'],
      groups: ['Security Team'],
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
      groups: ['IT Operations'],
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
      groups: ['Data Analytics', 'IT Operations'],
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
      groups: ['DevOps Engineers'],
      cloudAccounts: ['Azure QA', 'AWS Dev'],
      integrations: ['Terraform'],
      applications: ['Cost Optimizer', 'Reports', 'Dashboard']
    },
    { 
      id: '5', 
      name: 'Priya Sharma', 
      email: 'priya.sharma@customera.com', 
      role: 'Admin', 
      status: 'active', 
      accounts: ['AWS-123456789012'],
      groups: ['IT Operations', 'Security Team'],
      cloudAccounts: ['AWS Prod', 'Azure Prod'],
      integrations: ['Grafana', 'Dynatrace'],
      applications: ['App Monitor', 'Incident Manager']
    },
    { 
      id: '6', 
      name: 'Arjun Patel', 
      email: 'arjun.patel@customera.com', 
      role: 'Manager', 
      status: 'active', 
      accounts: ['AWS-123456789012'],
      groups: ['DevOps Engineers', 'IT Operations'],
      cloudAccounts: ['AWS Prod', 'GCP Prod'],
      integrations: ['Kubernetes', 'Jenkins'],
      applications: ['CI/CD Pipeline', 'Infrastructure Monitor']
    },
    { 
      id: '7', 
      name: 'Kavya Reddy', 
      email: 'kavya.reddy@customera.com', 
      role: 'Architect', 
      status: 'active', 
      accounts: ['AZURE-a1b2c3d4'],
      groups: ['Security Team'],
      cloudAccounts: ['Azure Prod'],
      integrations: ['Sentinel', 'CrowdStrike'],
      applications: ['Security Dashboard', 'Compliance Monitor']
    },
    { 
      id: '8', 
      name: 'Rahul Gupta', 
      email: 'rahul.gupta@customera.com', 
      role: 'Manager', 
      status: 'active', 
      accounts: ['GCP-gke-main-789012'],
      groups: ['Data Analytics'],
      cloudAccounts: ['Azure Prod', 'GCP Prod'],
      integrations: ['PowerBI', 'Tableau'],
      applications: ['Analytics Platform', 'Reports']
    },
    { 
      id: '9', 
      name: 'Anita Singh', 
      email: 'anita.singh@customera.com', 
      role: 'Viewer', 
      status: 'active', 
      accounts: ['AWS-123456789012'],
      groups: ['DevOps Engineers'],
      cloudAccounts: ['AWS Dev'],
      integrations: ['GitLab', 'Terraform'],
      applications: ['CI/CD Pipeline']
    },
    { 
      id: '10', 
      name: 'Vikram Kumar', 
      email: 'vikram.kumar@customera.com', 
      role: 'Architect', 
      status: 'inactive', 
      accounts: ['AWS-123456789012'],
      groups: ['IT Operations'],
      cloudAccounts: ['AWS Prod'],
      integrations: ['Splunk', 'Prometheus'],
      applications: ['App Monitor']
    },
    { 
      id: '11', 
      name: 'Meera Joshi', 
      email: 'meera.joshi@customera.com', 
      role: 'Manager', 
      status: 'active', 
      accounts: ['AZURE-a1b2c3d4'],
      groups: ['Security Team', 'Data Analytics'],
      cloudAccounts: ['Azure Prod'],
      integrations: ['Qualys', 'Looker'],
      applications: ['Security Dashboard', 'Data Warehouse']
    },
    { 
      id: '12', 
      name: 'Rohan Desai', 
      email: 'rohan.desai@customera.com', 
      role: 'Viewer', 
      status: 'active', 
      accounts: ['GCP-gke-main-789012'],
      groups: ['DevOps Engineers'],
      cloudAccounts: ['GCP Prod'],
      integrations: ['Kubernetes'],
      applications: ['Infrastructure Monitor']
    },
  ]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Viewer',
    accounts: [] as string[],
    groups: [] as string[],
    cloudAccounts: [] as string[],
    services: [] as string[],
    integrations: [] as string[],
    applications: [] as string[]
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
  const [userView, setUserView] = useState<'individual' | 'groups'>('individual');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCloudAccounts, setSelectedCloudAccounts] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedIntegrationTools, setSelectedIntegrationTools] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  
  // Mock groups data
  const groups: Group[] = [
    {
      id: '1',
      name: 'IT Operations',
      memberCount: 130,
      cloudAccounts: ['AWS Prod', 'Azure Prod', 'GCP Prod'],
      integrations: ['Grafana', 'Dynatrace', 'Splunk', 'Prometheus'],
      applications: ['App Monitor', 'Incident Manager']
    },
    {
      id: '2',
      name: 'Security Team',
      memberCount: 45,
      cloudAccounts: ['AWS Prod', 'Azure Prod'],
      integrations: ['Sentinel', 'CrowdStrike', 'Qualys'],
      applications: ['Security Dashboard', 'Compliance Monitor', 'Threat Intelligence']
    },
    {
      id: '3',
      name: 'DevOps Engineers',
      memberCount: 87,
      cloudAccounts: ['AWS Prod', 'AWS Dev', 'GCP Prod'],
      integrations: ['Kubernetes', 'Terraform', 'Jenkins', 'GitLab'],
      applications: ['CI/CD Pipeline', 'Infrastructure Monitor']
    },
    {
      id: '4',
      name: 'Data Analytics',
      memberCount: 62,
      cloudAccounts: ['Azure Prod', 'GCP Prod'],
      integrations: ['PowerBI', 'Tableau', 'Looker'],
      applications: ['Analytics Platform', 'Reports', 'Data Warehouse']
    }
  ];

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        accounts: newUser.accounts,
        groups: newUser.groups,
        cloudAccounts: newUser.cloudAccounts,
        integrations: newUser.integrations,
        applications: newUser.applications
      };
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'Viewer',
        accounts: [],
        groups: [],
        cloudAccounts: [],
        services: [],
        integrations: [],
        applications: []
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

  const handleViewMembers = (group: Group) => {
    setSelectedGroup(group);
    setIsViewMembersDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsEditGroupDialogOpen(true);
  };

  const handleRemoveMemberFromGroup = (userId: string, groupName: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          groups: user.groups.filter(g => g !== groupName)
        };
      }
      return user;
    }));
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">User Management</h1>
                <p className="text-white/90 text-sm">Manage cloud accounts and user access</p>
              </div>
            </div>
            
            {/* Action Buttons in Hero */}
            <div className="flex items-center gap-3">
              <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
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
                  <Button className="bg-white text-[#AE275F] hover:bg-white/90">
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
                      Create a new user account and assign access permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {/* Full Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">Full Name *</Label>
                        <Input
                          id="userName"
                          placeholder="Enter full name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="userEmail">Email *</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          placeholder="email@customera.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    {/* User Role */}
                    <div>
                      <Label htmlFor="userRole">User Role *</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Architect">Architect</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 my-2" />

                    {/* Assign to Group(s) */}
                    <div>
                      <Label htmlFor="userGroups">Assign to Group(s)</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!newUser.groups.includes(value)) {
                            setNewUser({
                              ...newUser,
                              groups: [...newUser.groups, value]
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select groups..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Cloud Team">Cloud Team</SelectItem>
                          <SelectItem value="IT Operations">IT Operations</SelectItem>
                          <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                          <SelectItem value="QA Team">QA Team</SelectItem>
                        </SelectContent>
                      </Select>
                      {newUser.groups.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newUser.groups.map((group, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-blue-100 text-blue-700 border-blue-300 border flex items-center gap-1"
                            >
                              {group}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setNewUser({
                                  ...newUser, 
                                  groups: newUser.groups.filter(g => g !== group)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assign Cloud Provider Accounts */}
                    <div>
                      <Label htmlFor="cloudAccounts">Assign Cloud Provider Accounts</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!newUser.cloudAccounts.includes(value)) {
                            setNewUser({
                              ...newUser,
                              cloudAccounts: [...newUser.cloudAccounts, value]
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
                      {newUser.cloudAccounts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newUser.cloudAccounts.map((account, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-purple-100 text-purple-700 border-purple-300 border flex items-center gap-1"
                            >
                              {account}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setNewUser({
                                  ...newUser, 
                                  cloudAccounts: newUser.cloudAccounts.filter(a => a !== account)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assign Services */}
                    <div>
                      <Label htmlFor="services">Assign Services</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!newUser.services.includes(value)) {
                            setNewUser({
                              ...newUser,
                              services: [...newUser.services, value]
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select services..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EC2">EC2</SelectItem>
                          <SelectItem value="S3">S3</SelectItem>
                          <SelectItem value="RDS">RDS</SelectItem>
                          <SelectItem value="Lambda">Lambda</SelectItem>
                          <SelectItem value="VPC">VPC</SelectItem>
                          <SelectItem value="CloudWatch">CloudWatch</SelectItem>
                          <SelectItem value="IAM">IAM</SelectItem>
                        </SelectContent>
                      </Select>
                      {newUser.services.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newUser.services.map((service, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-green-100 text-green-700 border-green-300 border flex items-center gap-1"
                            >
                              {service}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setNewUser({
                                  ...newUser, 
                                  services: newUser.services.filter(s => s !== service)
                                })}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assign Integrations & Applications */}
                    <div>
                      <Label htmlFor="integrationsApps">Assign Integrations & Applications</Label>
                      <Select
                        onValueChange={(value) => {
                          const integrationsList = ['PowerBI', 'Confluence', 'Kubernetes', 'Grafana', 'Jira', 'Terraform', 'Jenkins', 'GitLab'];
                          if (integrationsList.includes(value)) {
                            if (!newUser.integrations.includes(value)) {
                              setNewUser({
                                ...newUser,
                                integrations: [...newUser.integrations, value]
                              });
                            }
                          } else {
                            if (!newUser.applications.includes(value)) {
                              setNewUser({
                                ...newUser,
                                applications: [...newUser.applications, value]
                              });
                            }
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
                          <SelectItem value="Jenkins">Jenkins</SelectItem>
                          <SelectItem value="GitLab">GitLab</SelectItem>
                          <SelectItem value="Cost Optimizer">Cost Optimizer</SelectItem>
                          <SelectItem value="Reports">Reports</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                          <SelectItem value="Monitoring">Monitoring</SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                          <SelectItem value="Testing">Testing</SelectItem>
                          <SelectItem value="CI/CD">CI/CD</SelectItem>
                        </SelectContent>
                      </Select>
                      {(newUser.integrations.length > 0 || newUser.applications.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newUser.integrations.map((integration, idx) => (
                            <Badge 
                              key={`int-${idx}`} 
                              className="bg-orange-100 text-orange-700 border-orange-300 border flex items-center gap-1"
                            >
                              {integration}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setNewUser({
                                  ...newUser, 
                                  integrations: newUser.integrations.filter(i => i !== integration)
                                })}
                              />
                            </Badge>
                          ))}
                          {newUser.applications.map((app, idx) => (
                            <Badge 
                              key={`app-${idx}`} 
                              className="bg-pink-100 text-pink-700 border-pink-300 border flex items-center gap-1"
                            >
                              {app}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => setNewUser({
                                  ...newUser, 
                                  applications: newUser.applications.filter(a => a !== app)
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
                      onClick={() => {
                        setIsAddUserDialogOpen(false);
                        setNewUser({
                          name: '',
                          email: '',
                          phone: '',
                          role: 'Viewer',
                          accounts: [],
                          groups: [],
                          cloudAccounts: [],
                          services: [],
                          integrations: [],
                          applications: []
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                      disabled={!newUser.name || !newUser.email}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
           
          </div>
        </div>

        {/* User Table Card */}
        <Card className="p-6 border-2 border-gray-200 rounded-xl">
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant={userView === 'individual' ? 'default' : 'outline'}
              className={userView === 'individual' ? 'bg-[#AE275F] hover:bg-[#8F1F4D] text-white' : ''}
              onClick={() => setUserView('individual')}
            >
              <Users className="w-4 h-4 mr-2" />
              Individual Users View
            </Button>
            <Button
              variant={userView === 'groups' ? 'default' : 'outline'}
              className={userView === 'groups' ? 'bg-[#AE275F] hover:bg-[#8F1F4D] text-white' : ''}
              onClick={() => setUserView('groups')}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Groups View
            </Button>
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
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Groups Filter */}
                <div>
                  <Label className="text-sm mb-1.5 block">Groups</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedGroups.includes(value)) {
                      setSelectedGroups([...selectedGroups, value]);
                    }
                  }}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select groups..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Cloud Team">Cloud Team</SelectItem>
                      <SelectItem value="IT Operations">IT Operations</SelectItem>
                      <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                      <SelectItem value="QA Team">QA Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cloud Provider Accounts Filter */}
                <div>
                  <Label className="text-sm mb-1.5 block">Cloud Provider Accounts</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedCloudAccounts.includes(value)) {
                      setSelectedCloudAccounts([...selectedCloudAccounts, value]);
                    }
                  }}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select accounts..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GCP Prod">GCP Production</SelectItem>
                      <SelectItem value="Azure Prod">Azure Production</SelectItem>
                      <SelectItem value="AWS Prod">AWS Production</SelectItem>
                      <SelectItem value="Azure QA">Azure QA</SelectItem>
                      <SelectItem value="AWS Dev">AWS Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Services Filter */}
                <div>
                  <Label className="text-sm mb-1.5 block">Services</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedServices.includes(value)) {
                      setSelectedServices([...selectedServices, value]);
                    }
                  }}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select services..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EC2">EC2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                      <SelectItem value="RDS">RDS</SelectItem>
                      <SelectItem value="Lambda">Lambda</SelectItem>
                      <SelectItem value="VPC">VPC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Integration Tools Filter */}
                <div>
                  <Label className="text-sm mb-1.5 block">Integration Tools</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedIntegrationTools.includes(value)) {
                      setSelectedIntegrationTools([...selectedIntegrationTools, value]);
                    }
                  }}>
                    <SelectTrigger className="bg-white">
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
                </div>

                {/* Applications Filter */}
                <div>
                  <Label className="text-sm mb-1.5 block">Applications</Label>
                  <Select onValueChange={(value) => {
                    if (!selectedApplications.includes(value)) {
                      setSelectedApplications([...selectedApplications, value]);
                    }
                  }}>
                    <SelectTrigger className="bg-white">
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
                </div>
              </div>

              {/* Show selected filters as badges */}
              {(selectedGroups.length > 0 || selectedCloudAccounts.length > 0 || selectedServices.length > 0 || selectedIntegrationTools.length > 0 || selectedApplications.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Active Filters:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedGroups([]);
                        setSelectedCloudAccounts([]);
                        setSelectedServices([]);
                        setSelectedIntegrationTools([]);
                        setSelectedApplications([]);
                      }}
                      className="h-8 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroups.map((group, idx) => (
                      <Badge key={`group-${idx}`} className="bg-blue-100 text-blue-700 border-blue-300 border flex items-center gap-1">
                        {group}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGroups(selectedGroups.filter(g => g !== group))} />
                      </Badge>
                    ))}
                    {selectedCloudAccounts.map((account, idx) => (
                      <Badge key={`account-${idx}`} className="bg-purple-100 text-purple-700 border-purple-300 border flex items-center gap-1">
                        {account}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCloudAccounts(selectedCloudAccounts.filter(a => a !== account))} />
                      </Badge>
                    ))}
                    {selectedServices.map((service, idx) => (
                      <Badge key={`service-${idx}`} className="bg-green-100 text-green-700 border-green-300 border flex items-center gap-1">
                        {service}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedServices(selectedServices.filter(s => s !== service))} />
                      </Badge>
                    ))}
                    {selectedIntegrationTools.map((tool, idx) => (
                      <Badge key={`tool-${idx}`} className="bg-orange-100 text-orange-700 border-orange-300 border flex items-center gap-1">
                        {tool}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedIntegrationTools(selectedIntegrationTools.filter(t => t !== tool))} />
                      </Badge>
                    ))}
                    {selectedApplications.map((app, idx) => (
                      <Badge key={`app-${idx}`} className="bg-pink-100 text-pink-700 border-pink-300 border flex items-center gap-1">
                        {app}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedApplications(selectedApplications.filter(a => a !== app))} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Table */}
          {userView === 'individual' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-sm text-gray-700 w-12">
                      <Checkbox 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(users.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-3 text-sm text-gray-700">User Name</th>
                    <th className="text-left py-3 px-3 text-sm text-gray-700">Email ID</th>
                    <th className="text-left py-3 px-3 text-sm text-gray-700">User Type</th>
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
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
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
          ) : (
            /* Groups Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="p-5 border border-gray-300 rounded-lg hover:shadow-md transition-all bg-white">
                  {/* Group Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#AE275F] to-[#C73170] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-0.5">{group.name}</h3>
                        <p className="text-gray-500 text-sm">{group.memberCount} members</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewMembers(group)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2 text-blue-600" />
                          View Members
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditGroup(group)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2 text-[#AE275F]" />
                          Edit Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="h-px bg-gray-200 my-3" />

                  {/* Cloud Accounts */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-4 h-4 text-[#AE275F]" />
                      <span className="text-xs text-gray-600">Cloud Accounts</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.cloudAccounts.slice(0, 2).map((account, idx) => (
                        <Badge key={idx} className="bg-blue-50 text-blue-700 border-0 text-xs px-2 py-0.5">
                          {account}
                        </Badge>
                      ))}
                      {group.cloudAccounts.length > 2 && (
                        <Badge className="bg-blue-50 text-blue-700 border-0 text-xs px-2 py-0.5">
                          +{group.cloudAccounts.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Integrations */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-[#AE275F]" />
                      <span className="text-xs text-gray-600">Integrations</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.integrations.slice(0, 3).map((integration, idx) => (
                        <Badge key={idx} className="bg-purple-50 text-purple-700 border-0 text-xs px-2 py-0.5">
                          {integration}
                        </Badge>
                      ))}
                      {group.integrations.length > 3 && (
                        <Badge className="bg-purple-50 text-purple-700 border-0 text-xs px-2 py-0.5">
                          +{group.integrations.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LayoutGrid className="w-4 h-4 text-[#AE275F]" />
                      <span className="text-xs text-gray-600">Applications</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.applications.slice(0, 3).map((app, idx) => (
                        <Badge key={idx} className="bg-green-50 text-green-700 border-0 text-xs px-2 py-0.5">
                          {app}
                        </Badge>
                      ))}
                      {group.applications.length > 3 && (
                        <Badge className="bg-green-50 text-green-700 border-0 text-xs px-2 py-0.5">
                          +{group.applications.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredUsers.length === 0 && userView === 'individual' && (
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

      {/* View Members Dialog */}
      <Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              {selectedGroup?.name} - Members
            </DialogTitle>
            <DialogDescription>
              View all members of this group ({selectedGroup?.memberCount} members)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Members List - Show All Members */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {users.filter(u => u.groups.some(g => selectedGroup?.name.includes(g.split(' ')[0]))).map((user) => {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#AE275F] to-[#C73170] rounded-full flex items-center justify-center text-white text-sm">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gray-100 text-gray-700 border-0">
                        {user.role}
                      </Badge>
                      {user.status === 'active' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => selectedGroup && handleRemoveMemberFromGroup(user.id, selectedGroup.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewMembersDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#AE275F]" />
              Edit Group - {selectedGroup?.name}
            </DialogTitle>
            <DialogDescription>
              Update group information and assigned resources
            </DialogDescription>
          </DialogHeader>
          
          {selectedGroup && (
            <div className="space-y-4 py-4">
              {/* Group Name */}
              <div>
                <Label htmlFor="editGroupName">Group Name *</Label>
                <Input
                  id="editGroupName"
                  placeholder="e.g., DevOps Team"
                  defaultValue={selectedGroup.name}
                  className="mt-1.5"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-2" />

              {/* Cloud Accounts */}
              <div>
                <Label>Assigned Cloud Accounts</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGroup.cloudAccounts.map((account, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-blue-100 text-blue-700 border-blue-300 border flex items-center gap-1"
                    >
                      {account}
                      <X className="w-3 h-3 cursor-pointer" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    + Add Account
                  </Button>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <Label>Assigned Integrations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGroup.integrations.map((integration, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-purple-100 text-purple-700 border-purple-300 border flex items-center gap-1"
                    >
                      {integration}
                      <X className="w-3 h-3 cursor-pointer" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    + Add Integration
                  </Button>
                </div>
              </div>

              {/* Applications */}
              <div>
                <Label>Assigned Applications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGroup.applications.map((app, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-green-100 text-green-700 border-green-300 border flex items-center gap-1"
                    >
                      {app}
                      <X className="w-3 h-3 cursor-pointer" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    + Add Application
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditGroupDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsEditGroupDialogOpen(false)}
              className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}