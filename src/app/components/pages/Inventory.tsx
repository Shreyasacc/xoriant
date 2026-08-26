import React from "react";
import {
  Search,
  List,
  Grid3x3,
  RefreshCw,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Activity,
  DollarSign,
  AlertTriangle,
  Shield,
  Clock,
  Calendar,
  ChevronDown,
  X,
  Server,
  TrendingUp,
  TrendingDown,
  Lock,
  Users,
  FileText,
  Cpu,
  HardDrive,
  Network,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  ChevronUp,
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PageContainer } from "../layouts/PageContainer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ResourceDetailModal } from "./ResourceDetailModal";
import { MultiSelectDropdown } from "../MultiSelectDropdown";

interface InventoryProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Inventory({
  onNavigate,
  onLogout,
}: InventoryProps) {
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
  const [toolbarSearchTerm, setToolbarSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dateRange, setDateRange] = React.useState<string>("Last 30 days");
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [selectedResource, setSelectedResource] = React.useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);
  
  const itemsPerPage = 10;

  const dateRangeOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last 1 month",
    "Custom date",
  ];

  // Filter options
  const userOptions = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
  const accountOptions = ['Production Main', 'Production Secondary', 'Development', 'Staging', 'Testing'];
  const regionOptions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1', 'Global'];

  // Mock inventory resources data
  const inventoryResources = [
    {
      id: 1,
      service: "EC2 Instance",
      category: "Compute",
      region: "us-east-1",
      status: "Running",
      resources: 24,
      monitoring: "Enabled",
      backup: "Enabled",
      tags: ["Production", "Web"],
    },
    {
      id: 2,
      service: "S3 Bucket",
      category: "Storage",
      region: "us-west-2",
      status: "Available",
      resources: 18,
      monitoring: "Enabled",
      backup: "Disabled",
      tags: ["Backup", "Archive"],
    },
    {
      id: 3,
      service: "RDS Database",
      category: "Database",
      region: "eu-west-1",
      status: "Running",
      resources: 8,
      monitoring: "Enabled",
      backup: "Enabled",
      tags: ["Production", "MySQL"],
    },
    {
      id: 4,
      service: "Lambda Function",
      category: "Serverless",
      region: "us-east-1",
      status: "Active",
      resources: 45,
      monitoring: "Disabled",
      backup: "N/A",
      tags: ["API", "Backend"],
    },
    {
      id: 5,
      service: "VPC",
      category: "Network",
      region: "us-west-1",
      status: "Available",
      resources: 5,
      monitoring: "Enabled",
      backup: "N/A",
      tags: ["Network", "Security"],
    },
    {
      id: 6,
      service: "CloudFront",
      category: "CDN",
      region: "Global",
      status: "Deployed",
      resources: 12,
      monitoring: "Enabled",
      backup: "N/A",
      tags: ["CDN", "Performance"],
    },
    {
      id: 7,
      service: "DynamoDB",
      category: "Database",
      region: "ap-south-1",
      status: "Active",
      resources: 15,
      monitoring: "Enabled",
      backup: "Enabled",
      tags: ["NoSQL", "Production"],
    },
    {
      id: 8,
      service: "ECS Cluster",
      category: "Compute",
      region: "us-east-2",
      status: "Running",
      resources: 10,
      monitoring: "Enabled",
      backup: "Disabled",
      tags: ["Container", "Docker"],
    },
    {
      id: 9,
      service: "ElastiCache",
      category: "Cache",
      region: "eu-central-1",
      status: "Available",
      resources: 6,
      monitoring: "Disabled",
      backup: "Enabled",
      tags: ["Redis", "Cache"],
    },
    {
      id: 10,
      service: "SNS Topic",
      category: "Messaging",
      region: "us-west-2",
      status: "Active",
      resources: 20,
      monitoring: "Enabled",
      backup: "N/A",
      tags: ["Notifications", "Events"],
    },
    {
      id: 11,
      service: "EKS Cluster",
      category: "Compute",
      region: "us-east-1",
      status: "Running",
      resources: 7,
      monitoring: "Enabled",
      backup: "Enabled",
      tags: ["Kubernetes", "Container"],
    },
    {
      id: 12,
      service: "Route 53",
      category: "Network",
      region: "Global",
      status: "Active",
      resources: 32,
      monitoring: "Enabled",
      backup: "N/A",
      tags: ["DNS", "Domain"],
    },
  ];

  // Filter and search
  const filteredResources = inventoryResources.filter((resource) => {
    const searchLower = toolbarSearchTerm.toLowerCase();
    const matchesSearch = 
      resource.service.toLowerCase().includes(searchLower) ||
      resource.category.toLowerCase().includes(searchLower) ||
      resource.region.toLowerCase().includes(searchLower) ||
      resource.status.toLowerCase().includes(searchLower);
    
    // Apply filter selections
    const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(resource.region);
    // For user and account filters, we would normally check against resource owner data
    // Since mock data doesn't have user/account fields, we skip those filters for now
    
    return matchesSearch && matchesRegion;
  });

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [toolbarSearchTerm]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
      case "active":
      case "available":
      case "deployed":
        return "bg-green-100 text-green-700 border-green-300";
      case "stopped":
      case "inactive":
        return "bg-red-100 text-red-700 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getMonitoringBadge = (monitoring: string) => {
    if (monitoring === "Enabled") {
      return "bg-green-100 text-green-700 border-green-300";
    }
    return "bg-gray-100 text-gray-500 border-gray-300";
  };

  const getBackupBadge = (backup: string) => {
    if (backup === "Enabled") {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (backup === "N/A") {
      return "bg-gray-100 text-gray-500 border-gray-300";
    }
    return "bg-orange-100 text-orange-700 border-orange-300";
  };

  return (
    <DashboardLayout
      currentPage="inventory"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Hero Section with Title and Metrics */}
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-white mb-2">
                Inventory Overview
              </h1>
              <p className="text-white/90 text-sm">
                AWS resources inventory and lifecycle management
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{dateRange}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {showDateDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setDateRange(option);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        dateRange === option
                          ? "bg-[#AE275F]/10 text-[#AE275F]"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hero Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {/* Total Active Resources */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Total Active Resources
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  126
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Active services
              </div>
            </div>

            {/* Monthly Estimated Spend */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Monthly Estimated Spend
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  $4,560
                </div>
              </div>
              <div className="text-xs text-gray-600">
                / month
              </div>
            </div>

            {/* Security Exposure */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Security Exposure
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  3
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Public exposed
              </div>
            </div>

            {/* Backup Coverage */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Backup Coverage
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  84%
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Protected
              </div>
            </div>

            {/* Idle Resources Identified */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Idle Resources Identified
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  9
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Resources idle
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <PageContainer maxWidth="7xl" padding="md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Header */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {showFilters ? 'Filters' : 'Show Filters'}
              </span>
            </div>
            {showFilters ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Filters Content */}
          {showFilters && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-200">
              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* User wise */}
                <MultiSelectDropdown
                  label="User wise"
                  options={userOptions}
                  selectedValues={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Select users..."
                />

                {/* Account wise */}
                <MultiSelectDropdown
                  label="Account wise"
                  options={accountOptions}
                  selectedValues={selectedAccounts}
                  onChange={setSelectedAccounts}
                  placeholder="Select accounts..."
                />

                {/* Multiple account wise (Region) */}
                <MultiSelectDropdown
                  label="Region"
                  options={regionOptions}
                  selectedValues={selectedRegions}
                  onChange={setSelectedRegions}
                  placeholder="Select regions..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    // Apply filters logic
                    console.log('Filters applied:', {
                      users: selectedUsers,
                      accounts: selectedAccounts,
                      regions: selectedRegions
                    });
                  }}
                  className="bg-[#AE275F] hover:bg-[#8E1F4F] text-white px-6"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
                <Button
                  onClick={() => {
                    setSelectedUsers([]);
                    setSelectedAccounts([]);
                    setSelectedRegions([]);
                  }}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>

      {/* AWS Resources Inventory Table */}
      <PageContainer maxWidth="7xl" padding="md">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={toolbarSearchTerm}
                onChange={(e) => setToolbarSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Right Side Toolbar */}
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-[rgb(174,39,95)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-black' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-black' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh Icon Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50"
                      onClick={() => console.log('Refresh')}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Export CSV Icon Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50"
                      onClick={() => console.log('Export CSV')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Pagination */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {(() => {
                  const maxVisiblePages = 3;
                  
                  if (totalPages <= 1) return null;
                  
                  const getPageNumbers = () => {
                    if (totalPages <= maxVisiblePages) {
                      return Array.from({ length: totalPages }, (_, i) => i + 1);
                    }
                    
                    const pages: (number | string)[] = [];
                    if (currentPage <= 2) {
                      for (let i = 1; i <= 3; i++) pages.push(i);
                      if (totalPages > 3) pages.push('...');
                    } else if (currentPage >= totalPages - 1) {
                      pages.push('...');
                      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push('...');
                      pages.push(currentPage);
                      pages.push('...');
                    }
                    return pages;
                  };

                  return getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-sm">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className={`h-9 w-9 p-0 ${
                          currentPage === page 
                            ? 'bg-[#AE275F] text-white hover:bg-[#8B1F4C]' 
                            : ''
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  ));
                })()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Resources</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Monitoring</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Backup</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{resource.service}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{resource.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{resource.region}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(resource.status)} border text-xs`}>
                          {resource.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{resource.resources}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getMonitoringBadge(resource.monitoring)} border text-xs`}>
                          {resource.monitoring}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getBackupBadge(resource.backup)} border text-xs`}>
                          {resource.backup}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag, idx) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-700 border-gray-300 border text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedResource(resource);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-gray-600 hover:text-[#AE275F] hover:bg-[#AE275F]/10 h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedResources.map((resource) => (
                <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-900 mb-1">{resource.service}</h4>
                      <p className="text-xs text-gray-500">{resource.category}</p>
                    </div>
                    <Badge className={`${getStatusColor(resource.status)} border text-xs`}>
                      {resource.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Region:</span>
                      <span className="text-gray-900">{resource.region}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Resources:</span>
                      <span className="text-gray-900">{resource.resources}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Monitoring:</span>
                      <Badge className={`${getMonitoringBadge(resource.monitoring)} border text-xs`}>
                        {resource.monitoring}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Backup:</span>
                      <Badge className={`${getBackupBadge(resource.backup)} border text-xs`}>
                        {resource.backup}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.map((tag, idx) => (
                      <Badge key={idx} className="bg-gray-100 text-gray-700 border-gray-300 border text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-[#AE275F] border-[#AE275F] hover:bg-[#AE275F]/10"
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {filteredResources.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-500">
                No resources found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </PageContainer>

      {/* Resource Detail Modal */}
      {isDetailModalOpen && selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}