import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Cloud,
  Clock,
  Activity,
  Zap,
  FileText,
  Eye,
  Play,
  SkipForward,
  CheckCircle2,
  Bot,
  BarChart3,
  Lightbulb,
  History,
  Shield,
  RefreshCw,
  Timer,
  ShieldCheck,
  DollarSign,
  Bell,
  Settings,
  Users,
  ArrowUpCircle,
  Gauge,
  Link2,
  X,
  Filter,
  ChevronUp,
  Grid3x3,
  List,
  Download
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { AIAssistantPanel } from '../AIAssistantPanel';
import { IncidentDetailsModal } from '../IncidentDetailsModal';
import { MetricCard } from '../molecules/MetricCard';
import { ProviderLogo } from '../molecules/ProviderLogo';
import { CompactIncidentCard } from '../CompactIncidentCard';
import { AdvancedFiltersSection } from '../AdvancedFiltersSection';
import gcpLogo from 'figma:asset/13add375e3a2db3f7db7cbae5b934507fb50dc5a.png';
import azureLogo from 'figma:asset/84f6fef5f441eef1665a48cc39fa13061e5cdb07.png';
import awsLogo from 'figma:asset/499b6cf39d2cc683a05fdb69b4d2b206920ac09a.png';

interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  provider: 'AWS' | 'AZURE' | 'GCP';
  timestamp: string;
  service: string;
  recommendation: string;
  metrics: {
    cpu: number[];
    memory: number[];
  };
  probableCause: string;
  confidence: number;
  status: 'open' | 'investigating' | 'resolved';
  accountName: string;
  accountNo: string;
  resolutionType?: 'auto' | 'manual' | 'ai'; // Track how the incident was resolved
  resolvedAt?: string; // When it was resolved
}

interface IncidentAnalyzerProps {
  onNavigate?: (page: string, view?: 'incidents' | 'whitenoise') => void;
  onLogout?: () => void;
  view?: 'incidents' | 'whitenoise';
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'High CPU Utilization on GC Pod',
    severity: 'critical',
    provider: 'GCP',
    timestamp: '14 Oct 2025, 16:43:56',
    service: 'kubernetes-engine',
    recommendation: 'Increased read operations likely due to API surge. Consider scaling read replicas.',
    metrics: {
      cpu: [45, 52, 68, 85, 92, 88, 95],
      memory: [60, 62, 65, 70, 75, 78, 80]
    },
    probableCause: 'Memory leak in application container causing CPU throttling',
    confidence: 87,
    status: 'open',
    accountName: 'GKE Clusters',
    accountNo: 'gke-main-789012'
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhausted',
    severity: 'high',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 16:28:00',
    service: 'RDS',
    recommendation: 'Connection pool limit reached. Consider increasing max_connections parameter.',
    metrics: {
      cpu: [30, 35, 40, 55, 60, 58, 62],
      memory: [70, 72, 75, 80, 85, 88, 90]
    },
    probableCause: 'Sudden traffic spike without connection pooling optimization',
    confidence: 92,
    status: 'investigating',
    accountName: 'Production DB',
    accountNo: 'aws-prod-001'
  },
  {
    id: '3',
    title: 'Azure Function Memory Spike',
    severity: 'medium',
    provider: 'AZURE',
    timestamp: '14 Oct 2025, 16:10:23',
    service: 'Functions',
    recommendation: 'Memory usage spike detected. Optimize function code or increase allocation.',
    metrics: {
      cpu: [20, 25, 30, 35, 40, 38, 42],
      memory: [50, 55, 65, 75, 85, 88, 90]
    },
    probableCause: 'Large payload processing without streaming',
    confidence: 78,
    status: 'resolved',
    accountName: 'Functions App',
    accountNo: 'azure-prod-002',
    resolutionType: 'manual',
    resolvedAt: '14 Oct 2025, 16:35:12'
  },
  {
    id: '4',
    title: 'S3 Bucket Access Denied',
    severity: 'low',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 15:55:12',
    service: 'S3',
    recommendation: 'Update IAM policy to grant required permissions.',
    metrics: {
      cpu: [10, 12, 15, 18, 20, 19, 22],
      memory: [30, 32, 35, 38, 40, 42, 45]
    },
    probableCause: 'IAM policy missing s3:GetObject permission',
    confidence: 95,
    status: 'resolved',
    accountName: 'Storage',
    accountNo: 'aws-storage-001',
    resolutionType: 'ai',
    resolvedAt: '14 Oct 2025, 16:02:45'
  },
  {
    id: '5',
    title: 'EKS Node Group Scaling Issue',
    severity: 'high',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 15:30:45',
    service: 'EKS',
    recommendation: 'Check cluster autoscaler configuration and node group limits.',
    metrics: {
      cpu: [65, 70, 75, 80, 85, 88, 90],
      memory: [70, 75, 78, 82, 85, 88, 92]
    },
    probableCause: 'Node group reached maximum capacity during traffic surge',
    confidence: 89,
    status: 'investigating',
    accountName: 'Production EKS',
    accountNo: 'eks-prod-123'
  },
  {
    id: '6',
    title: 'Azure SQL Database High DTU',
    severity: 'critical',
    provider: 'AZURE',
    timestamp: '14 Oct 2025, 15:15:30',
    service: 'SQL Database',
    recommendation: 'Scale up database tier or optimize slow queries.',
    metrics: {
      cpu: [80, 85, 90, 92, 95, 97, 98],
      memory: [75, 80, 85, 88, 90, 92, 95]
    },
    probableCause: 'Multiple long-running queries causing DTU exhaustion',
    confidence: 94,
    status: 'open',
    accountName: 'SQL Production',
    accountNo: 'azure-sql-001'
  },
  {
    id: '7',
    title: 'GCP Cloud Storage Latency',
    severity: 'medium',
    provider: 'GCP',
    timestamp: '14 Oct 2025, 14:58:20',
    service: 'Cloud Storage',
    recommendation: 'Consider using regional storage or CDN for faster access.',
    metrics: {
      cpu: [30, 35, 40, 42, 38, 35, 33],
      memory: [45, 48, 52, 55, 53, 50, 48]
    },
    probableCause: 'Cross-region storage access causing increased latency',
    confidence: 81,
    status: 'investigating',
    accountName: 'Storage Buckets',
    accountNo: 'gcp-storage-456'
  },
  {
    id: '8',
    title: 'Lambda Concurrent Execution Limit',
    severity: 'high',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 14:42:10',
    service: 'Lambda',
    recommendation: 'Request limit increase or implement throttling.',
    metrics: {
      cpu: [50, 55, 62, 70, 75, 72, 68],
      memory: [60, 65, 70, 75, 78, 76, 74]
    },
    probableCause: 'Concurrent execution limit reached during batch processing',
    confidence: 92,
    status: 'open',
    accountName: 'Lambda Functions',
    accountNo: 'aws-lambda-789'
  },
  {
    id: '9',
    title: 'Azure App Service CPU Throttling',
    severity: 'medium',
    provider: 'AZURE',
    timestamp: '14 Oct 2025, 14:25:35',
    service: 'App Service',
    recommendation: 'Upgrade to higher tier or optimize application code.',
    metrics: {
      cpu: [40, 48, 55, 60, 58, 52, 48],
      memory: [55, 58, 62, 65, 63, 60, 58]
    },
    probableCause: 'CPU quota exceeded on current app service plan',
    confidence: 86,
    status: 'resolved',
    accountName: 'Web Apps',
    accountNo: 'azure-app-002',
    resolutionType: 'manual',
    resolvedAt: '14 Oct 2025, 14:55:20'
  },
  {
    id: '10',
    title: 'GCP BigQuery Query Timeout',
    severity: 'low',
    provider: 'GCP',
    timestamp: '14 Oct 2025, 14:08:15',
    service: 'BigQuery',
    recommendation: 'Optimize query or increase timeout settings.',
    metrics: {
      cpu: [25, 30, 35, 38, 35, 32, 30],
      memory: [40, 45, 50, 52, 50, 48, 45]
    },
    probableCause: 'Complex JOIN operations on large datasets',
    confidence: 77,
    status: 'resolved',
    accountName: 'Analytics',
    accountNo: 'gcp-analytics-123',
    resolutionType: 'ai',
    resolvedAt: '14 Oct 2025, 14:22:40'
  },
  {
    id: '11',
    title: 'AWS DynamoDB Throttling',
    severity: 'critical',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 13:55:48',
    service: 'DynamoDB',
    recommendation: 'Increase provisioned throughput or enable auto-scaling.',
    metrics: {
      cpu: [70, 75, 82, 88, 92, 90, 95],
      memory: [65, 70, 75, 80, 85, 88, 90]
    },
    probableCause: 'Read capacity units exceeded during peak traffic',
    confidence: 96,
    status: 'investigating',
    accountName: 'Production DB',
    accountNo: 'aws-dynamodb-456'
  }
];

// White Noise - Auto-resolved incidents (resolved without manual or AI intervention)
const whiteNoiseIncidents: Incident[] = [
  {
    id: 'wn-1',
    title: 'Temporary Network Latency Spike',
    severity: 'low',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 14:22:15',
    service: 'EC2',
    recommendation: 'Network congestion resolved automatically',
    metrics: {
      cpu: [15, 18, 22, 20, 16, 15, 14],
      memory: [40, 42, 45, 43, 41, 40, 40]
    },
    probableCause: 'Temporary network congestion during peak hours',
    confidence: 88,
    status: 'resolved',
    accountName: 'Production Main',
    accountNo: '123456789012',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 14:28:30'
  },
  {
    id: 'wn-2',
    title: 'GCP Auto-Scaling Triggered',
    severity: 'low',
    provider: 'GCP',
    timestamp: '14 Oct 2025, 13:45:20',
    service: 'Compute Engine',
    recommendation: 'Auto-scaling resolved the load',
    metrics: {
      cpu: [60, 65, 70, 68, 55, 45, 40],
      memory: [55, 58, 62, 60, 52, 48, 45]
    },
    probableCause: 'Traffic spike handled by auto-scaling',
    confidence: 92,
    status: 'resolved',
    accountName: 'GKE Clusters',
    accountNo: 'gke-main-789012',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 13:52:10'
  },
  {
    id: 'wn-3',
    title: 'Azure Storage Throttling',
    severity: 'medium',
    provider: 'AZURE',
    timestamp: '14 Oct 2025, 12:30:45',
    service: 'Storage',
    recommendation: 'Throttling self-resolved within SLA',
    metrics: {
      cpu: [25, 28, 32, 30, 26, 24, 22],
      memory: [48, 52, 55, 53, 50, 48, 46]
    },
    probableCause: 'Temporary storage throttling during backup',
    confidence: 85,
    status: 'resolved',
    accountName: 'Production Sub',
    accountNo: 'azure-prod-001',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 12:38:22'
  },
  {
    id: 'wn-4',
    title: 'Lambda Cold Start Timeout',
    severity: 'low',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 11:15:30',
    service: 'Lambda',
    recommendation: 'Function warmed up automatically',
    metrics: {
      cpu: [5, 8, 12, 10, 6, 5, 4],
      memory: [30, 35, 40, 38, 32, 30, 28]
    },
    probableCause: 'First invocation after idle period',
    confidence: 95,
    status: 'resolved',
    accountName: 'Production Main',
    accountNo: '123456789012',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 11:17:05'
  },
  {
    id: 'wn-5',
    title: 'Kubernetes Pod Restart',
    severity: 'low',
    provider: 'GCP',
    timestamp: '14 Oct 2025, 10:42:18',
    service: 'kubernetes-engine',
    recommendation: 'Pod restarted successfully',
    metrics: {
      cpu: [40, 45, 50, 48, 42, 38, 35],
      memory: [65, 68, 72, 70, 66, 62, 60]
    },
    probableCause: 'Liveness probe failure, pod auto-restarted',
    confidence: 90,
    status: 'resolved',
    accountName: 'GKE Clusters',
    accountNo: 'gke-main-789012',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 10:44:55'
  },
  {
    id: 'wn-6',
    title: 'Azure Function Timeout',
    severity: 'low',
    provider: 'AZURE',
    timestamp: '14 Oct 2025, 09:25:10',
    service: 'Functions',
    recommendation: 'Function retry succeeded',
    metrics: {
      cpu: [18, 22, 25, 23, 20, 18, 16],
      memory: [42, 46, 50, 48, 44, 42, 40]
    },
    probableCause: 'Transient dependency timeout, auto-retry successful',
    confidence: 88,
    status: 'resolved',
    accountName: 'Functions App',
    accountNo: 'azure-prod-002',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 09:27:40'
  },
  {
    id: 'wn-7',
    title: 'RDS Connection Spike',
    severity: 'medium',
    provider: 'AWS',
    timestamp: '14 Oct 2025, 08:50:22',
    service: 'RDS',
    recommendation: 'Connection pool normalized automatically',
    metrics: {
      cpu: [35, 40, 45, 42, 38, 35, 32],
      memory: [60, 65, 70, 68, 62, 58, 55]
    },
    probableCause: 'Batch job completed, connections released',
    confidence: 87,
    status: 'resolved',
    accountName: 'Production DB',
    accountNo: 'aws-prod-001',
    resolutionType: 'auto',
    resolvedAt: '14 Oct 2025, 08:56:15'
  }
];

const cloudProviders = [
  // AWS Accounts
  { id: 'AWS', type: 'AWS', name: 'All AWS Accounts', accountNo: '*' },
  { id: 'aws-prod-001', type: 'AWS', name: 'Production Main', accountNo: '123456789012' },
  { id: 'aws-prod-002', type: 'AWS', name: 'Production Secondary', accountNo: '123456789013' },
  { id: 'aws-prod-db', type: 'AWS', name: 'Production DB', accountNo: 'aws-prod-001' },
  { id: 'aws-storage-001', type: 'AWS', name: 'Storage Account', accountNo: 'aws-storage-001' },
  { id: 'aws-dev-001', type: 'AWS', name: 'Development Main', accountNo: '987654321098' },
  { id: 'aws-staging-001', type: 'AWS', name: 'Staging Environment', accountNo: '456789123456' },
  { id: 'aws-analytics-001', type: 'AWS', name: 'Analytics & Data', accountNo: '789123456789' },
  // Azure Subscriptions
  { id: 'AZURE', type: 'AZURE', name: 'All Azure Subscriptions', accountNo: '*' },
  { id: 'azure-prod-001', type: 'AZURE', name: 'Production Sub', accountNo: 'azure-prod-001' },
  { id: 'azure-prod-002', type: 'AZURE', name: 'Functions App', accountNo: 'azure-prod-002' },
  { id: 'azure-dev-001', type: 'AZURE', name: 'Development Sub', accountNo: 'azure-dev-001' },
  { id: 'azure-staging-001', type: 'AZURE', name: 'Staging Sub', accountNo: 'azure-staging-001' },
  { id: 'azure-test-001', type: 'AZURE', name: 'Testing Environment', accountNo: 'azure-test-001' },
  { id: 'azure-storage-001', type: 'AZURE', name: 'Storage & Backup', accountNo: 'azure-storage-001' },
  // GCP Projects
  { id: 'GCP', type: 'GCP', name: 'All GCP Projects', accountNo: '*' },
  { id: 'gke-main-789012', type: 'GCP', name: 'GKE Clusters', accountNo: 'gke-main-789012' },
  { id: 'gcp-prod-001', type: 'GCP', name: 'Production Project', accountNo: 'gcp-prod-001' },
  { id: 'gcp-dev-001', type: 'GCP', name: 'Development Project', accountNo: 'gcp-dev-001' },
  { id: 'gcp-ml-001', type: 'GCP', name: 'ML & AI Services', accountNo: 'gcp-ml-001' },
  { id: 'gcp-data-001', type: 'GCP', name: 'BigQuery & Data', accountNo: 'gcp-data-001' },
];

export function IncidentAnalyzer({ onNavigate, onLogout, view = 'incidents' }: IncidentAnalyzerProps) {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  
  // Advanced Filters State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedIntegrationTools, setSelectedIntegrationTools] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedCloudProviders, setSelectedCloudProviders] = useState<string[]>([]);
  const [selectedCloudAccounts, setSelectedCloudAccounts] = useState<string[]>([]);
  const [selectedCloudServices, setSelectedCloudServices] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [incidentNameSearch, setIncidentNameSearch] = useState('');
  const [assignedToSearch, setAssignedToSearch] = useState('');
  
  // Tab and View State
  const [activeTab, setActiveTab] = useState<'incidents' | 'whitenoise'>('incidents');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // grid = table view, table = card view
  const [toolbarSearchTerm, setToolbarSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Set activeTab based on view prop
  useEffect(() => {
    setActiveTab(view === 'whitenoise' ? 'whitenoise' : 'incidents');
  }, [view]);

  // Reset pagination when switching tabs or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, toolbarSearchTerm, selectedCloudProviders, selectedSeverities]);

  const heroMetrics = [
    {
      title: 'Total Incidents',
      value: '247',
      target: '↓ 12% from last week',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Critical Incidents',
      value: '42',
      target: '↓ 8 from last week',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'High Severity',
      value: '89',
      target: '↓ 15 from last week',
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Resolved',
      value: '203',
      target: '↑ 18 this week',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'White Noise',
      value: '34',
      target: '↓ 5% reduction',
      icon: Activity,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      case 'high':
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
      case 'low':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case 'AWS': return awsLogo;
      case 'AZURE': return azureLogo;
      case 'GCP': return gcpLogo;
      default: return awsLogo;
    }
  };

  const filteredProviders = cloudProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.accountNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIncidents = mockIncidents.filter((incident) => {
    // Toolbar search filter
    if (toolbarSearchTerm && !incident.title.toLowerCase().includes(toolbarSearchTerm.toLowerCase()) &&
        !incident.probableCause.toLowerCase().includes(toolbarSearchTerm.toLowerCase()) &&
        !incident.service.toLowerCase().includes(toolbarSearchTerm.toLowerCase())) {
      return false;
    }
    // Table search filter
    if (tableSearchTerm && !incident.title.toLowerCase().includes(tableSearchTerm.toLowerCase())) {
      return false;
    }
    // Provider filter
    if (selectedCloudProviders.length > 0 && !selectedCloudProviders.includes(incident.provider)) {
      return false;
    }
    // Type filter (severity)
    if (selectedSeverities.length > 0) {
      const severityMatch = selectedSeverities.some(t => t.toLowerCase() === incident.severity.toLowerCase());
      if (!severityMatch) return false;
    }
    // Status filter
    if (selectedStatuses.length > 0) {
      const statusMatch = selectedStatuses.some(s => s.toLowerCase() === incident.status.toLowerCase());
      if (!statusMatch) return false;
    }
    // Cloud Services filter
    if (selectedCloudServices.length > 0 && !selectedCloudServices.includes(incident.service)) {
      return false;
    }
    // Cloud Accounts filter
    if (selectedCloudAccounts.length > 0) {
      const accountMatch = selectedCloudAccounts.some(acc => {
        const provider = cloudProviders.find(p => p.id === acc);
        if (!provider) return false;
        if (provider.accountNo === '*') return provider.type === incident.provider;
        return provider.accountNo === incident.accountNo;
      });
      if (!accountMatch) return false;
    }
    // Incident Name search
    if (incidentNameSearch && !incident.title.toLowerCase().includes(incidentNameSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredWhiteNoiseIncidents = whiteNoiseIncidents.filter((incident) => {
    // Toolbar search filter
    if (toolbarSearchTerm && !incident.title.toLowerCase().includes(toolbarSearchTerm.toLowerCase()) &&
        !incident.probableCause.toLowerCase().includes(toolbarSearchTerm.toLowerCase()) &&
        !incident.service.toLowerCase().includes(toolbarSearchTerm.toLowerCase())) {
      return false;
    }
    // Table search filter
    if (tableSearchTerm && !incident.title.toLowerCase().includes(tableSearchTerm.toLowerCase())) {
      return false;
    }
    // Provider filter
    if (selectedCloudProviders.length > 0 && !selectedCloudProviders.includes(incident.provider)) {
      return false;
    }
    // Type filter (severity)
    if (selectedSeverities.length > 0) {
      const severityMatch = selectedSeverities.some(t => t.toLowerCase() === incident.severity.toLowerCase());
      if (!severityMatch) return false;
    }
    // Status filter
    if (selectedStatuses.length > 0) {
      const statusMatch = selectedStatuses.some(s => s.toLowerCase() === incident.status.toLowerCase());
      if (!statusMatch) return false;
    }
    // Cloud Services filter
    if (selectedCloudServices.length > 0 && !selectedCloudServices.includes(incident.service)) {
      return false;
    }
    // Cloud Accounts filter
    if (selectedCloudAccounts.length > 0) {
      const accountMatch = selectedCloudAccounts.some(acc => {
        const provider = cloudProviders.find(p => p.id === acc);
        if (!provider) return false;
        if (provider.accountNo === '*') return provider.type === incident.provider;
        return provider.accountNo === incident.accountNo;
      });
      if (!accountMatch) return false;
    }
    // Incident Name search
    if (incidentNameSearch && !incident.title.toLowerCase().includes(incidentNameSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleApplyFilters = () => {
    // Filter logic is already applied through state
    console.log('Filters applied');
  };

  const handleClearFilters = () => {
    setSelectedIntegrationTools([]);
    setSelectedApplications([]);
    setSelectedCloudProviders([]);
    setSelectedCloudAccounts([]);
    setSelectedCloudServices([]);
    setSelectedSeverities([]);
    setSelectedGroups([]);
    setSelectedStatuses([]);
    setIncidentNameSearch('');
    setAssignedToSearch('');
  };

  // Pagination calculations
  const currentData = activeTab === 'incidents' ? filteredIncidents : filteredWhiteNoiseIncidents;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);
  const paginatedWhiteNoise = filteredWhiteNoiseIncidents.slice(startIndex, endIndex);

  // Pagination component
  const PaginationControls = () => {
    const maxVisiblePages = 5;
    const getPageNumbers = () => {
      if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      const pages: (number | string)[] = [];
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
      return pages;
    };

    if (currentData.length === 0) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, currentData.length)} of {currentData.length} results
          </span>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page 
                      ? 'bg-[#AE275F] text-white hover:bg-[#8B1F4C]' 
                      : ''
                  }`}
                >
                  {page}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout currentPage="analyzer" onNavigate={onNavigate} onLogout={onLogout}>
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
          <div className="mb-4 sm:mb-6">
            <h1 className="text-white">Incident Management Dashboard</h1>
            <p className="text-white/80 text-sm hidden sm:block">
              Multi-cloud incident tracking and AI-powered root cause analysis
            </p>
          </div>
          
          {/* Responsive Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {heroMetrics.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                target={metric.target}
                icon={metric.icon}
                iconColor={metric.iconColor}
                bgColor={metric.bgColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <PageContainer maxWidth="7xl" padding="md">
        <div className="space-y-4 sm:space-y-6">
          {/* Compact Tabs with Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white rounded-lg shadow-sm p-3 border border-gray-200">
            {/* Custom Compact Tabs */}
            <div className="flex items-center gap-2">
              {view === 'incidents' && (
                <button
                  onClick={() => setActiveTab('incidents')}
                  className="px-4 py-2 rounded-lg text-sm transition-all bg-white shadow-sm border border-gray-200 text-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <span>Incidents</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#AE275F] text-white">
                      {mockIncidents.length}
                    </span>
                  </div>
                </button>
              )}
              
              {view === 'whitenoise' && (
                <button
                  onClick={() => setActiveTab('whitenoise')}
                  className="px-4 py-2 rounded-lg text-sm transition-all bg-white shadow-sm border border-gray-200 text-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <span>White Noise</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#AE275F] text-white">
                      {whiteNoiseIncidents.length}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={toolbarSearchTerm}
                  onChange={(e) => setToolbarSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

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

              {/* Pagination Numbers Only */}
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
                  const totalPages = Math.ceil(currentData.length / itemsPerPage);
                  
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
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(currentData.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(currentData.length / itemsPerPage)}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Content - Incidents */}
          {activeTab === 'incidents' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Advanced Filters */}
              <AdvancedFiltersSection
                isExpanded={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                selectedIntegrationTools={selectedIntegrationTools}
                setSelectedIntegrationTools={setSelectedIntegrationTools}
                selectedApplications={selectedApplications}
                setSelectedApplications={setSelectedApplications}
                selectedCloudProviders={selectedCloudProviders}
                setSelectedCloudProviders={setSelectedCloudProviders}
                selectedCloudAccounts={selectedCloudAccounts}
                setSelectedCloudAccounts={setSelectedCloudAccounts}
                selectedCloudServices={selectedCloudServices}
                setSelectedCloudServices={setSelectedCloudServices}
                selectedSeverities={selectedSeverities}
                setSelectedSeverities={setSelectedSeverities}
                selectedGroups={selectedGroups}
                setSelectedGroups={setSelectedGroups}
                selectedStatuses={selectedStatuses}
                setSelectedStatuses={setSelectedStatuses}
                incidentNameSearch={incidentNameSearch}
                setIncidentNameSearch={setIncidentNameSearch}
                assignedToSearch={assignedToSearch}
                setAssignedToSearch={setAssignedToSearch}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />

              {/* Card View - Incident Cards (List icon selected) */}
              {viewMode === 'table' && (
                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {paginatedIncidents.map((incident) => (
                    <CompactIncidentCard
                      key={incident.id}
                      incident={incident}
                      onViewDetails={(inc) => {
                        setSelectedIncident(inc);
                        setIsDetailsModalOpen(true);
                      }}
                    />
                  ))}
                  {filteredIncidents.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-gray-900 mb-1">No incidents found</h3>
                      <p className="text-sm text-gray-600">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination for Card View */}
              {viewMode === 'table' && filteredIncidents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm">
                  <PaginationControls />
                </div>
              )}

              {/* Table View - Incidents Table (Grid icon selected - default) */}
              {viewMode === 'grid' && (
                <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Incident</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Provider</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Account</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Occurred At</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedIncidents.map((incident) => {
                          const severityColors = getSeverityColor(incident.severity);
                          const getStatusIcon = () => {
                            if (incident.status === 'open') return <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
                            if (incident.status === 'investigating') return <Activity className="w-4 h-4 text-orange-600 shrink-0 mt-0.5 animate-pulse" />;
                            return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />;
                          };
                          const getStatusColor = () => {
                            if (incident.status === 'open') return 'text-red-600';
                            if (incident.status === 'investigating') return 'text-orange-600';
                            return 'text-green-600';
                          };
                          
                          return (
                            <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  {getStatusIcon()}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm text-gray-900">{incident.title}</p>
                                      <Badge className={`${severityColors.bg} ${severityColors.border} ${severityColors.text} border text-xs shrink-0`}>
                                        {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">{incident.probableCause}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <ProviderLogo provider={incident.provider} size="sm" />
                                  <span className="text-sm text-gray-700">{incident.provider}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-700">{incident.service}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm text-gray-900">{incident.accountName}</p>
                                  <p className="text-xs text-gray-500 font-mono mt-0.5">{incident.accountNo}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Clock className="w-3.5 h-3.5" />
                                  {incident.timestamp}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`flex items-center gap-1.5 text-sm ${getStatusColor()}`}>
                                  <span className="capitalize">{incident.status}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedIncident(incident);
                                            setIsDetailsModalOpen(true);
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

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            // AI Diagnose functionality
                                            console.log('AI Diagnose:', incident.id);
                                          }}
                                          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                                        >
                                          <Bot className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>AI Diagnose</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            // Manual Diagnose functionality
                                            console.log('Manual Diagnose:', incident.id);
                                          }}
                                          className="text-gray-600 hover:text-green-600 hover:bg-green-50 h-8 w-8 p-0"
                                        >
                                          <Settings className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Manual Diagnose</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredIncidents.length === 0 && (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-gray-900 mb-1">No incidents found</h3>
                      <p className="text-sm text-gray-600">Try adjusting your filters</p>
                    </div>
                  )}

                  {/* Pagination in Table */}
                  {filteredIncidents.length > 0 && (
                    <PaginationControls />
                  )}
                </Card>
              )}
            </div>
          )}

          {/* Tab Content - White Noise */}
          {activeTab === 'whitenoise' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Advanced Filters */}
              <AdvancedFiltersSection
                isExpanded={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
                selectedIntegrationTools={selectedIntegrationTools}
                setSelectedIntegrationTools={setSelectedIntegrationTools}
                selectedApplications={selectedApplications}
                setSelectedApplications={setSelectedApplications}
                selectedCloudProviders={selectedCloudProviders}
                setSelectedCloudProviders={setSelectedCloudProviders}
                selectedCloudAccounts={selectedCloudAccounts}
                setSelectedCloudAccounts={setSelectedCloudAccounts}
                selectedCloudServices={selectedCloudServices}
                setSelectedCloudServices={setSelectedCloudServices}
                selectedSeverities={selectedSeverities}
                setSelectedSeverities={setSelectedSeverities}
                selectedGroups={selectedGroups}
                setSelectedGroups={setSelectedGroups}
                selectedStatuses={selectedStatuses}
                setSelectedStatuses={setSelectedStatuses}
                incidentNameSearch={incidentNameSearch}
                setIncidentNameSearch={setIncidentNameSearch}
                assignedToSearch={assignedToSearch}
                setAssignedToSearch={setAssignedToSearch}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />

              {/* Card View - White Noise Cards (List icon selected) */}
              {viewMode === 'table' && (
                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {paginatedWhiteNoise.map((incident) => (
                    <CompactIncidentCard
                      key={incident.id}
                      incident={incident}
                      onViewDetails={(inc) => {
                        setSelectedIncident(inc);
                        setIsDetailsModalOpen(true);
                      }}
                    />
                  ))}
                  {filteredWhiteNoiseIncidents.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-gray-900 mb-1">No Auto-Resolved Incidents</h3>
                      <p className="text-sm text-gray-600">All incidents were resolved through AI or manual intervention</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination for Card View */}
              {viewMode === 'table' && filteredWhiteNoiseIncidents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm">
                  <PaginationControls />
                </div>
              )}

              {/* Table View - White Noise Table (Grid icon selected - default) */}
              {viewMode === 'grid' && (
                <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Incident</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Provider</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Severity</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Occurred At</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Resolved At</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Resolution</th>
                          <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedWhiteNoise.map((incident) => {
                          const severityColors = getSeverityColor(incident.severity);
                          return (
                            <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-gray-900">{incident.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{incident.probableCause}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <ProviderLogo provider={incident.provider} size="sm" />
                                  <span className="text-sm text-gray-700">{incident.provider}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-700">{incident.service}</span>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${severityColors.bg} ${severityColors.border} ${severityColors.text} border text-xs`}>
                                  {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Clock className="w-3.5 h-3.5" />
                                  {incident.timestamp}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-green-600">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {incident.resolvedAt}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  <div className="px-2.5 py-1 bg-green-100 border border-green-300 rounded-md">
                                    <span className="text-xs text-green-700">Auto-Resolved</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedIncident(incident);
                                            setIsDetailsModalOpen(true);
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
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredWhiteNoiseIncidents.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-gray-900 mb-1">No Auto-Resolved Incidents</h3>
                      <p className="text-sm text-gray-600">All incidents were resolved through AI or manual intervention</p>
                    </div>
                  )}

                  {/* Pagination in Table */}
                  {filteredWhiteNoiseIncidents.length > 0 && (
                    <PaginationControls />
                  )}
                </Card>
              )}
            </div>
          )}
        </div>
      </PageContainer>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <IncidentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedIncident(null);
          }}
          incident={selectedIncident}
        />
      )}
    </DashboardLayout>
  );
}