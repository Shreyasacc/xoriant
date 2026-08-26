/**
 * IntegrationTool Page - Responsive Version
 * 
 * Mobile-first responsive design with:
 * - Mobile: Single column, bottom sheet for filters, mobile detail view
 * - Tablet: Adjusted layout with responsive cards
 * - Desktop: Full split-pane layout with list + details
 * 
 * Key responsive features:
 * - Uses DashboardLayout for consistent navigation
 * - Mobile: List view with modal for details
 * - Desktop: Side-by-side list and details
 * - Touch-friendly targets (min 44px)
 * - Responsive spacing and typography
 */

import { useState } from 'react';
import { 
  Search, 
  Settings,
  Trash2,
  Filter,
  X,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  PlayCircle,
  ChevronLeft,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Mail,
  Link2
} from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { Card } from '../ui/card';

interface Integration {
  id: string;
  name: string;
  serviceName: string;
  provider: 'SigNoz' | 'New Relic' | 'Slack' | 'AWS' | 'Teams';
  appKey: string;
  createdBy: string;
  createdAt: string;
  platformName: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastSync: string;
  // Health & Status
  lastErrorMessage?: string;
  lastSuccessfulEvents?: number;
  failureRate24h?: number;
  syncFrequency?: string;
  // Environment
  environment?: 'Development' | 'UAT' | 'Production';
  apiKeyType?: 'Sandbox' | 'Production';
  // Permissions
  scopes?: string[];
  // Ownership
  ownerTeam?: string;
  ownerDepartment?: string;
  maintainedBy?: string;
  supportContact?: string;
}

interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  bgColor: string;
  textColor: string;
  platform: string;
  authType: string;
  setupTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  isConnected: boolean;
}

interface IntegrationToolProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'signozgokwik',
    serviceName: 'backend API service',
    provider: 'SigNoz',
    appKey: '1276cab0-0794-443f-81a2-6504a4271eb',
    createdBy: 'Manoj Bhamidipati',
    createdAt: '27/10/2025',
    platformName: 'signoz',
    status: 'ACTIVE',
    lastSync: '2 mins ago',
    lastSuccessfulEvents: 1247,
    failureRate24h: 0.8,
    syncFrequency: 'Every 5 minutes',
    environment: 'Production',
    apiKeyType: 'Production',
    scopes: ['read:users', 'read:metrics', 'write:logs'],
    ownerTeam: 'Platform Engineering',
    ownerDepartment: 'Engineering',
    maintainedBy: 'DevOps Team',
    supportContact: 'devops@xoriant.com'
  },
  {
    id: '2',
    name: 'new_relic',
    serviceName: 'Real Time Transaction',
    provider: 'New Relic',
    appKey: '8a9b2def-1234-567c-89de-f012345678ab',
    createdBy: 'Sarah Johnson',
    createdAt: '25/10/2025',
    platformName: 'newrelic',
    status: 'ACTIVE',
    lastSync: '5 mins ago',
    lastSuccessfulEvents: 892,
    failureRate24h: 1.2,
    syncFrequency: 'Every 10 minutes',
    environment: 'Production',
    apiKeyType: 'Production',
    scopes: ['read:transactions', 'read:errors', 'read:infrastructure'],
    ownerTeam: 'Backend Services',
    ownerDepartment: 'Engineering',
    maintainedBy: 'Backend Team',
    supportContact: 'backend@xoriant.com'
  },
  {
    id: '3',
    name: 'slack_real',
    serviceName: 'Real Time Transaction',
    provider: 'Slack',
    appKey: '3c4d5ef6-7890-12ab-cdef-345678901234',
    createdBy: 'Mike Chen',
    createdAt: '23/10/2025',
    platformName: 'slack',
    status: 'ACTIVE',
    lastSync: '10 mins ago',
    lastErrorMessage: 'Rate limit exceeded at 14:23 UTC',
    lastSuccessfulEvents: 456,
    failureRate24h: 3.5,
    syncFrequency: 'Real-time (webhook)',
    environment: 'Production',
    apiKeyType: 'Production',
    scopes: ['channels:read', 'chat:write', 'users:read'],
    ownerTeam: 'Communications',
    ownerDepartment: 'Operations',
    maintainedBy: 'IT Operations',
    supportContact: 'it-ops@xoriant.com'
  },
  {
    id: '4',
    name: 'process',
    serviceName: 'backend API service',
    provider: 'AWS',
    appKey: 'aws-key-9876-54dc-ba98-765432109876',
    createdBy: 'Emily Davis',
    createdAt: '20/10/2025',
    platformName: 'aws',
    status: 'ACTIVE',
    lastSync: '1 hour ago',
    lastSuccessfulEvents: 2134,
    failureRate24h: 0.3,
    syncFrequency: 'Every 15 minutes',
    environment: 'Production',
    apiKeyType: 'Production',
    scopes: ['ec2:read', 's3:read', 'cloudwatch:read', 'rds:read'],
    ownerTeam: 'Cloud Infrastructure',
    ownerDepartment: 'Engineering',
    maintainedBy: 'Cloud Team',
    supportContact: 'cloud@xoriant.com'
  },
  {
    id: '5',
    name: 'testsignoz',
    serviceName: 'Feedback Service',
    provider: 'SigNoz',
    appKey: '5d6e7fa8-9012-34bc-def5-678901234567',
    createdBy: 'John Smith',
    createdAt: '18/10/2025',
    platformName: 'signoz',
    status: 'ACTIVE',
    lastSync: '3 hours ago',
    lastSuccessfulEvents: 234,
    failureRate24h: 0.5,
    syncFrequency: 'Every 30 minutes',
    environment: 'UAT',
    apiKeyType: 'Sandbox',
    scopes: ['read:traces', 'read:logs'],
    ownerTeam: 'QA Team',
    ownerDepartment: 'Quality Assurance',
    maintainedBy: 'QA Engineers',
    supportContact: 'qa@xoriant.com'
  },
  {
    id: '6',
    name: 'teams_int',
    serviceName: 'backend API service',
    provider: 'Teams',
    appKey: 'teams-abc123-def456-ghi789',
    createdBy: 'Lisa Anderson',
    createdAt: '15/10/2025',
    platformName: 'teams',
    status: 'ACTIVE',
    lastSync: '1 day ago',
    lastSuccessfulEvents: 678,
    failureRate24h: 2.1,
    syncFrequency: 'Every hour',
    environment: 'Production',
    apiKeyType: 'Production',
    scopes: ['team:read', 'chat:write', 'presence:read'],
    ownerTeam: 'Collaboration Tools',
    ownerDepartment: 'IT',
    maintainedBy: 'IT Support',
    supportContact: 'itsupport@xoriant.com'
  },
  {
    id: '7',
    name: 'prodtest',
    serviceName: 'Feedback Service',
    provider: 'New Relic',
    appKey: 'nr-prod-7890-abcd-ef12-3456',
    createdBy: 'David Wilson',
    createdAt: '12/10/2025',
    platformName: 'newrelic',
    status: 'ACTIVE',
    lastSync: '2 days ago',
    lastSuccessfulEvents: 123,
    failureRate24h: 0.2,
    syncFrequency: 'Daily at 2 AM UTC',
    environment: 'Development',
    apiKeyType: 'Sandbox',
    scopes: ['read:apm', 'read:browser'],
    ownerTeam: 'Development',
    ownerDepartment: 'Engineering',
    maintainedBy: 'Dev Team',
    supportContact: 'dev@xoriant.com'
  },
];

const availableProviders: Provider[] = [
  {
    id: 'signoz',
    name: 'SigNoz',
    logo: 'SN',
    description: 'Integrate SigNoz for comprehensive observability and monitoring.',
    longDescription: 'SigNoz provides open-source observability with distributed tracing, metrics, and logs in a single platform.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Observability'],
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'API Key',
    setupTime: '5–10 min',
    difficulty: 'Moderate',
    isConnected: true
  },
  {
    id: 'newrelic',
    name: 'New Relic',
    logo: 'NR',
    description: 'Integrate New Relic for full-stack observability and performance monitoring.',
    longDescription: 'New Relic delivers powerful full-stack observability to help you build better software.',
    category: 'Monitoring',
    tags: ['Monitoring', 'APM'],
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'License Key',
    setupTime: '7–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'datadog',
    name: 'Datadog',
    logo: '🐶',
    description: 'Integrate Datadog for infrastructure and application monitoring.',
    longDescription: 'Datadog provides unified monitoring for infrastructure, applications, and logs.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Infrastructure'],
    bgColor: 'bg-purple-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Key',
    setupTime: '5–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    logo: '📟',
    description: 'Integrate PagerDuty for incident management and on-call scheduling.',
    longDescription: 'PagerDuty provides incident response and on-call management for operations teams.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Incident Management'],
    bgColor: 'bg-green-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Key',
    setupTime: '3–5 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'apm-tool',
    name: 'APM Tool',
    logo: '📊',
    description: 'Advanced application performance monitoring with real-time insights.',
    longDescription: 'Monitor application performance with detailed metrics and traces.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Performance'],
    bgColor: 'bg-purple-700',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'API Key',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'grafana',
    name: 'Grafana',
    logo: '📈',
    description: 'Integrate Grafana for powerful data visualization and monitoring dashboards.',
    longDescription: 'Grafana provides beautiful dashboards and visualizations for your metrics.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Visualization'],
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Token',
    setupTime: '5–8 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'dynatrace',
    name: 'Dynatrace',
    logo: 'DT',
    description: 'Integrate Dynatrace for AI-powered full-stack observability and automation.',
    longDescription: 'Dynatrace provides automatic and intelligent observability with AI-powered insights.',
    category: 'Monitoring',
    tags: ['Monitoring', 'AI', 'Observability'],
    bgColor: 'bg-indigo-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Token',
    setupTime: '8–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'appdynamics',
    name: 'AppDynamics',
    logo: 'AD',
    description: 'Integrate AppDynamics for application performance management and business insights.',
    longDescription: 'AppDynamics delivers real-time application performance monitoring and business transaction insights.',
    category: 'Monitoring',
    tags: ['Monitoring', 'APM', 'Analytics'],
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    platform: 'Cisco',
    authType: 'API Key',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'coralogix',
    name: 'Coralogix',
    logo: 'CX',
    description: 'Integrate Coralogix for real-time log analytics and monitoring.',
    longDescription: 'Coralogix provides stateful streaming analytics for logs, metrics, and security data.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Log Analytics', 'Security'],
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'Private Key',
    setupTime: '6–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: '🐙',
    description: 'Integrate your GitHub repositories to enable AI-powered anomaly detection.',
    longDescription: 'Connect GitHub for version control integration and automated deployments.',
    category: 'Version Control',
    tags: ['Version Control', 'CI/CD'],
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    platform: 'GitHub',
    authType: 'OAuth 2.0',
    setupTime: '3–5 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    logo: '🔷',
    description: 'Integrate your Bitbucket repositories to enable AI-powered anomaly detection.',
    longDescription: 'Bitbucket integration for Git repository management and CI/CD pipelines.',
    category: 'Version Control',
    tags: ['Version Control', 'CI/CD'],
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    platform: 'Bitbucket',
    authType: 'OAuth 2.0',
    setupTime: '4–6 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    logo: '🦊',
    description: 'Integrate your GitLab Projects to enable AI-powered anomaly detection.',
    longDescription: 'GitLab integration for complete DevOps lifecycle management.',
    category: 'Version Control',
    tags: ['Version Control', 'DevOps'],
    bgColor: 'bg-orange-700',
    textColor: 'text-white',
    platform: 'GitLab',
    authType: 'Personal Access Token',
    setupTime: '4–7 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '💬',
    description: 'Integrate Slack for real-time notifications.',
    longDescription: 'Connect Slack to receive real-time alerts and collaborate on incident resolution.',
    category: 'Messaging',
    tags: ['Messaging', 'Notifications'],
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
    platform: 'Slack',
    authType: 'OAuth 2.0',
    setupTime: '3–5 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'aws',
    name: 'AWS',
    logo: '☁️',
    description: 'Integrate AWS services for cloud monitoring.',
    longDescription: 'Amazon Web Services integration provides comprehensive monitoring across multiple AWS accounts.',
    category: 'Cloud',
    tags: ['Cloud', 'Infrastructure'],
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'IAM Role',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'azure',
    name: 'Azure',
    logo: 'AZ',
    description: 'Integrate Microsoft Azure for cloud infrastructure monitoring.',
    longDescription: 'Azure integration for monitoring cloud resources and applications.',
    category: 'Cloud',
    tags: ['Cloud', 'Infrastructure'],
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    platform: 'Azure',
    authType: 'Service Principal',
    setupTime: '12–18 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    logo: 'GCP',
    description: 'Integrate Google Cloud Platform for cloud monitoring.',
    longDescription: 'GCP integration for monitoring cloud infrastructure and services.',
    category: 'Cloud',
    tags: ['Cloud', 'Infrastructure'],
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    platform: 'GCP',
    authType: 'Service Account',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: 'MS',
    description: 'Integrate Teams for collaboration.',
    longDescription: 'Microsoft Teams integration enables seamless collaboration and instant alerts.',
    category: 'Messaging',
    tags: ['Messaging', 'Collaboration'],
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    platform: 'Microsoft Teams',
    authType: 'Webhook URL',
    setupTime: '2–4 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'jira',
    name: 'Jira',
    logo: '🎫',
    description: 'Integrate Jira for issue tracking and project management.',
    longDescription: 'Jira integration for agile project management and issue tracking.',
    category: 'Ticketing',
    tags: ['Ticketing', 'Project Management'],
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    platform: 'Atlassian',
    authType: 'API Token',
    setupTime: '5–8 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: 'SN',
    description: 'Integrate ServiceNow for IT service management and ticketing.',
    longDescription: 'ServiceNow integration for enterprise IT service management.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM'],
    bgColor: 'bg-teal-700',
    textColor: 'text-white',
    platform: 'ServiceNow',
    authType: 'OAuth 2.0',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'jira-service-mgmt',
    name: 'Jira Service Management',
    logo: '🎟️',
    description: 'Integrate Jira Service Management for ITSM and service desk operations.',
    longDescription: 'Jira Service Management for IT service desk and incident management.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM', 'Service Desk'],
    bgColor: 'bg-blue-800',
    textColor: 'text-white',
    platform: 'Atlassian',
    authType: 'API Token',
    setupTime: '6–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'acc-itsm',
    name: 'ACC ITSM',
    logo: 'AI',
    description: 'Integrate ACC ITSM for IT service management and ticketing workflows.',
    longDescription: 'ACC ITSM integration for comprehensive IT service management.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM'],
    bgColor: 'bg-indigo-700',
    textColor: 'text-white',
    platform: 'ACC',
    authType: 'API Key',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    logo: 'ES',
    description: 'Integrate Elasticsearch for distributed search and analytics of log data.',
    longDescription: 'Elasticsearch provides powerful search and analytics for large volumes of data.',
    category: 'Logging',
    tags: ['Logging', 'Search', 'Analytics'],
    bgColor: 'bg-yellow-600',
    textColor: 'text-white',
    platform: 'Elastic',
    authType: 'API Key',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'splunk',
    name: 'Splunk',
    logo: 'SP',
    description: 'Integrate Splunk for enterprise log management and security analytics.',
    longDescription: 'Splunk provides comprehensive log management and operational intelligence.',
    category: 'Logging',
    tags: ['Logging', 'Analytics', 'Security'],
    bgColor: 'bg-green-700',
    textColor: 'text-white',
    platform: 'Splunk',
    authType: 'API Token',
    setupTime: '12–18 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'cloudwatch-logs',
    name: 'CloudWatch Logs',
    logo: 'CW',
    description: 'Integrate AWS CloudWatch Logs for monitoring and troubleshooting systems.',
    longDescription: 'CloudWatch Logs helps you monitor, store, and access log files from AWS resources.',
    category: 'Logging',
    tags: ['Logging', 'AWS', 'Monitoring'],
    bgColor: 'bg-orange-700',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'IAM Role',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'log-management',
    name: 'Log Management',
    logo: '📋',
    description: 'Centralized log management platform for collecting and analyzing logs.',
    longDescription: 'Comprehensive log management solution for centralized logging and analysis.',
    category: 'Logging',
    tags: ['Logging', 'Management'],
    bgColor: 'bg-gray-700',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Key',
    setupTime: '5–10 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'cloud-platform',
    name: 'Cloud Platform',
    logo: '☁️',
    description: 'Universal cloud platform integration for multi-cloud management.',
    longDescription: 'Integrate multiple cloud platforms with a unified management interface.',
    category: 'Cloud',
    tags: ['Cloud', 'Multi-Cloud', 'Platform'],
    bgColor: 'bg-cyan-600',
    textColor: 'text-white',
    platform: 'Multi-Cloud',
    authType: 'API Key',
    setupTime: '10–15 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'confluence',
    name: 'Confluence',
    logo: '📚',
    description: 'Integrate Confluence for team collaboration and documentation management.',
    longDescription: 'Confluence integration for creating, organizing, and collaborating on documentation.',
    category: 'Documentation',
    tags: ['Documentation', 'Collaboration', 'Knowledge Base'],
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    platform: 'Atlassian',
    authType: 'API Token',
    setupTime: '5–8 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: '📝',
    description: 'Integrate Notion for all-in-one workspace and documentation.',
    longDescription: 'Notion integration for creating wikis, knowledge bases, and collaborative documents.',
    category: 'Documentation',
    tags: ['Documentation', 'Workspace', 'Notes'],
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    platform: 'Notion',
    authType: 'OAuth 2.0',
    setupTime: '3–6 min',
    difficulty: 'Easy',
    isConnected: false
  },
];

const categories = [
  'All Integrations',
  'Monitoring',
  'Logging',
  'Cloud',
  'Messaging',
  'Version Control',
  'Ticketing',
  'Documentation'
];

export function IntegrationTool({ onNavigate, onLogout }: IntegrationToolProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showNewIntegrationDialog, setShowNewIntegrationDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [providerSearchTerm, setProviderSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Integrations');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredIntegrations = mockIntegrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || integration.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredProviders = availableProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(providerSearchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(providerSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Integrations' || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProviderIcon = (provider: string) => {
    const iconMap: { [key: string]: { bg: string; text: string; logo: string } } = {
      'SigNoz': { bg: 'bg-red-500', text: 'text-white', logo: 'SN' },
      'New Relic': { bg: 'bg-teal-500', text: 'text-white', logo: 'NR' },
      'Slack': { bg: 'bg-purple-500', text: 'text-white', logo: 'SL' },
      'AWS': { bg: 'bg-orange-500', text: 'text-white', logo: 'AWS' },
      'Teams': { bg: 'bg-blue-600', text: 'text-white', logo: 'MS' },
    };
    return iconMap[provider] || { bg: 'bg-gray-400', text: 'text-white', logo: '?' };
  };

  const handleDeleteIntegration = () => {
    if (selectedIntegration) {
      console.log('Deleting integration:', selectedIntegration.name);
      toast.success('Integration deleted successfully');
      setShowDeleteDialog(false);
      setShowMobileDetail(false);
      setSelectedIntegration(null);
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentStep(1);
    setSelectedBusinessUnit('');
  };

  const handleCloseDialog = () => {
    setShowNewIntegrationDialog(false);
    setSelectedProvider(null);
    setProviderSearchTerm('');
    setSelectedCategory('All Integrations');
    setCurrentStep(1);
    setSelectedBusinessUnit('');
  };

  const handleBackToProviders = () => {
    setSelectedProvider(null);
    setCurrentStep(1);
    setSelectedBusinessUnit('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleValidateIntegration = () => {
    toast.success('Integration validated successfully!', {
      description: 'Your integration is now connected and ready to use.',
    });
    // Move to completion or close dialog
    setTimeout(() => {
      handleCloseDialog();
    }, 1500);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedBusinessUnit) {
      toast.error('Please select a business unit or service');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    // On mobile, show the detail sheet
    if (window.innerWidth < 1024) {
      setShowMobileDetail(true);
    }
  };

  const steps = [
    { number: 1, title: 'Create App Key' },
    { number: 2, title: 'Clone Repository' },
    { number: 3, title: 'Initialize Terraform' },
    { number: 4, title: 'Validate Integration' },
  ];

  return (
    <DashboardLayout 
      onNavigate={onNavigate} 
      onLogout={onLogout}
      currentPage="integration-tool"
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
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">Integration Tools</h1>
              <p className="text-white/90 text-sm">Connect and manage your monitoring and notification tools</p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-4 lg:gap-0">
          {/* Left Section - Integration List (Mobile: Full width, Desktop: Fixed width) */}
          <div className="w-full lg:w-80 xl:w-96 bg-white border border-gray-200 lg:border-r lg:border-y-0 lg:border-l-0 rounded-lg lg:rounded-none flex flex-col h-full">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                <h2 className="text-gray-900">Integrations</h2>
                <Button 
                  onClick={() => setShowNewIntegrationDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 sm:h-10 px-3 sm:px-4 w-full sm:w-auto"
                >
                  New Integration
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Filter integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 sm:h-10 bg-gray-50 border-gray-200"
                />
              </div>
              
              {/* Filter Button (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="w-full h-9 sm:h-10 border-gray-200 justify-start lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">Filter by status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
              </Button>

              {/* Filter Select (Desktop) */}
              <div className="hidden lg:block">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 bg-gray-50 border-gray-200">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Integration List */}
            <div className="flex-1 overflow-y-auto">
              {filteredIntegrations.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No integrations found
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 p-2 sm:p-0 lg:gap-0">
                  {filteredIntegrations.map((integration) => {
                    const providerIcon = getProviderIcon(integration.provider);
                    const isSelected = selectedIntegration?.id === integration.id;
                    
                    return (
                      <button
                        key={integration.id}
                        onClick={() => handleIntegrationClick(integration)}
                        className={`w-full p-3 sm:p-4 border border-gray-100 sm:border-b sm:border-x-0 sm:border-t-0 lg:border-b lg:border-x-0 lg:border-t-0 hover:bg-gray-50 transition-colors text-left rounded-lg sm:rounded-none ${
                          isSelected ? 'bg-blue-50 border-blue-200 sm:border-l-4 sm:border-l-blue-600 lg:border-l-4 lg:border-l-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 ${providerIcon.bg} rounded flex items-center justify-center flex-shrink-0`}>
                            <span className={`${providerIcon.text} text-xs sm:text-sm`}>{providerIcon.logo}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm sm:text-base text-gray-900 truncate">{integration.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              Service name: {integration.serviceName}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Integration Details (Desktop only, Mobile uses Sheet) */}
          {selectedIntegration && (
            <div className="hidden lg:block flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 h-full">
              <div className="max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${getProviderIcon(selectedIntegration.provider).bg} rounded flex items-center justify-center flex-shrink-0`}>
                      <span className={`${getProviderIcon(selectedIntegration.provider).text} text-sm sm:text-base`}>
                        {getProviderIcon(selectedIntegration.provider).logo}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-gray-900 mb-1 sm:mb-2">{selectedIntegration.name}</h1>
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        {selectedIntegration.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50 h-9 sm:h-10 flex-1 sm:flex-none"
                    >
                      <Settings className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Configuration</span>
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteDialog(true)}
                      className="bg-red-600 hover:bg-red-700 text-white h-9 sm:h-10 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Integration Details */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-gray-900 mb-4 sm:mb-6">Integration Details</h3>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">App Key</div>
                        <div className="text-xs sm:text-sm text-gray-900 font-mono bg-gray-50 p-2 sm:p-3 rounded border border-gray-200 break-all">
                          {selectedIntegration.appKey}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Service Name</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.serviceName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Created By</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.createdBy}</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <h3 className="text-gray-900 mb-4 sm:mb-6">Additional Information</h3>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Created At</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.createdAt}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Platform Name</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.platformName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Last Sync</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.lastSync}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Sections Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
                  {/* Integration Health / Status Insights */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <Activity className="w-5 h-5 text-[#AE275F]" />
                      <h3 className="text-gray-900">Integration Health / Status Insights</h3>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      {selectedIntegration.lastErrorMessage && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Last Error Message</div>
                          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{selectedIntegration.lastErrorMessage}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Last Successful Events</div>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{selectedIntegration.lastSuccessfulEvents?.toLocaleString() || 'N/A'} events processed</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Failure Rate (Last 24 Hours)</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                (selectedIntegration.failureRate24h || 0) > 5 ? 'bg-red-500' :
                                (selectedIntegration.failureRate24h || 0) > 2 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(selectedIntegration.failureRate24h || 0, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${
                            (selectedIntegration.failureRate24h || 0) > 5 ? 'text-red-600' :
                            (selectedIntegration.failureRate24h || 0) > 2 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {selectedIntegration.failureRate24h?.toFixed(1) || '0.0'}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Sync Frequency</div>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{selectedIntegration.syncFrequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environment Mapping */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <Settings className="w-5 h-5 text-[#AE275F]" />
                      <h3 className="text-gray-900">Environment Mapping</h3>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Environment</div>
                        <div>
                          <Badge className={`${
                            selectedIntegration.environment === 'Production' ? 'bg-green-100 text-green-700 border-green-300' :
                            selectedIntegration.environment === 'UAT' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                            'bg-blue-100 text-blue-700 border-blue-300'
                          } border`}>
                            {selectedIntegration.environment || 'Not Specified'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">API Key Type</div>
                        <div>
                          <Badge className={`${
                            selectedIntegration.apiKeyType === 'Production' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          } border`}>
                            {selectedIntegration.apiKeyType || 'Not Specified'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scope & Permissions */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <Shield className="w-5 h-5 text-[#AE275F]" />
                      <h3 className="text-gray-900">Scope & Permissions</h3>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-3">Granted Permissions</div>
                      {selectedIntegration.scopes && selectedIntegration.scopes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedIntegration.scopes.map((scope, index) => (
                            <Badge 
                              key={index}
                              className="bg-blue-50 text-blue-700 border-blue-200 border text-xs font-mono"
                            >
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No permissions specified</div>
                      )}
                    </div>
                  </div>

                  {/* Ownership / Team Mapping */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <Users className="w-5 h-5 text-[#AE275F]" />
                      <h3 className="text-gray-900">Ownership / Team Mapping</h3>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Owner Team</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.ownerTeam || 'Not Assigned'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Department</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.ownerDepartment || 'Not Assigned'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Maintained By</div>
                        <div className="text-sm text-gray-900">{selectedIntegration.maintainedBy || 'Not Assigned'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Support Contact</div>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${selectedIntegration.supportContact}`} className="text-[#AE275F] hover:underline">
                            {selectedIntegration.supportContact || 'Not Assigned'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder when no integration selected (Desktop) */}
          {!selectedIntegration && (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 p-8 h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Integration Selected</h3>
                <p className="text-sm text-gray-500">
                  Select an integration from the list to view its details and configuration
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Detail Sheet */}
        <Sheet open={showMobileDetail} onOpenChange={setShowMobileDetail}>
          <SheetContent side="right" className="w-full sm:max-w-lg p-0">
            {selectedIntegration && (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileDetail(false)}
                      className="h-8 px-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 h-8"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => setShowDeleteDialog(true)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${getProviderIcon(selectedIntegration.provider).bg} rounded flex items-center justify-center flex-shrink-0`}>
                      <span className={`${getProviderIcon(selectedIntegration.provider).text}`}>
                        {getProviderIcon(selectedIntegration.provider).logo}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-gray-900 mb-1">{selectedIntegration.name}</h2>
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        {selectedIntegration.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {/* Integration Details */}
                    <div>
                      <h3 className="text-gray-900 mb-4">Integration Details</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">App Key</div>
                          <div className="text-xs text-gray-900 font-mono bg-gray-50 p-3 rounded border border-gray-200 break-all">
                            {selectedIntegration.appKey}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Service Name</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.serviceName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Created By</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.createdBy}</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-gray-900 mb-4">Additional Information</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Created At</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.createdAt}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Platform Name</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.platformName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Last Sync</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.lastSync}</div>
                        </div>
                      </div>
                    </div>

                    {/* Integration Health / Status Insights */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#AE275F]" />
                        <h3 className="text-gray-900">Integration Health / Status Insights</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedIntegration.lastErrorMessage && (
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Last Error Message</div>
                            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                              <span>{selectedIntegration.lastErrorMessage}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Last Successful Events</div>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="font-medium">{selectedIntegration.lastSuccessfulEvents?.toLocaleString() || 'N/A'} events processed</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Failure Rate (Last 24 Hours)</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  (selectedIntegration.failureRate24h || 0) > 5 ? 'bg-red-500' :
                                  (selectedIntegration.failureRate24h || 0) > 2 ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(selectedIntegration.failureRate24h || 0, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${
                              (selectedIntegration.failureRate24h || 0) > 5 ? 'text-red-600' :
                              (selectedIntegration.failureRate24h || 0) > 2 ? 'text-orange-600' :
                              'text-green-600'
                            }`}>
                              {selectedIntegration.failureRate24h?.toFixed(1) || '0.0'}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Sync Frequency</div>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{selectedIntegration.syncFrequency || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Environment Mapping */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-[#AE275F]" />
                        <h3 className="text-gray-900">Environment Mapping</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Environment</div>
                          <div>
                            <Badge className={`${
                              selectedIntegration.environment === 'Production' ? 'bg-green-100 text-green-700 border-green-300' :
                              selectedIntegration.environment === 'UAT' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                              'bg-blue-100 text-blue-700 border-blue-300'
                            } border`}>
                              {selectedIntegration.environment || 'Not Specified'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">API Key Type</div>
                          <div>
                            <Badge className={`${
                              selectedIntegration.apiKeyType === 'Production' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                              'bg-gray-100 text-gray-700 border-gray-300'
                            } border`}>
                              {selectedIntegration.apiKeyType || 'Not Specified'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scope & Permissions */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-[#AE275F]" />
                        <h3 className="text-gray-900">Scope & Permissions</h3>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-3">Granted Permissions</div>
                        {selectedIntegration.scopes && selectedIntegration.scopes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedIntegration.scopes.map((scope, index) => (
                              <Badge 
                                key={index}
                                className="bg-blue-50 text-blue-700 border-blue-200 border text-xs font-mono"
                              >
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No permissions specified</div>
                        )}
                      </div>
                    </div>

                    {/* Ownership / Team Mapping */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-[#AE275F]" />
                        <h3 className="text-gray-900">Ownership / Team Mapping</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Owner Team</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.ownerTeam || 'Not Assigned'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Department</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.ownerDepartment || 'Not Assigned'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Maintained By</div>
                          <div className="text-sm text-gray-900">{selectedIntegration.maintainedBy || 'Not Assigned'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Support Contact</div>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a href={`mailto:${selectedIntegration.supportContact}`} className="text-[#AE275F] hover:underline">
                              {selectedIntegration.supportContact || 'Not Assigned'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Filter Bottom Sheet (Mobile) */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>Filter Integrations</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Label className="text-sm text-gray-700 mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setShowFilters(false);
              }}>
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Integration</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedIntegration?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteIntegration}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Integration Dialog - Simplified for responsiveness */}
        <Dialog open={showNewIntegrationDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="min-w-[75vw] sm:max-w-6xl max-h-[90vh] overflow-hidden p-0">
            {!selectedProvider ? (
              /* Provider Selection View */
              <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                  <DialogTitle className="text-lg sm:text-xl text-gray-900">Integrations</DialogTitle>
                  <DialogDescription className="mt-1 text-sm">
                    Connect your favorite tools and platforms
                  </DialogDescription>
                  
                  {/* Search Bar */}
                  <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search for integrations..."
                      value={providerSearchTerm}
                      onChange={(e) => setProviderSearchTerm(e.target.value)}
                      className="pl-9 h-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="border-b border-gray-200 px-4 sm:px-6 overflow-x-auto flex-shrink-0">
                  <div className="flex gap-1 min-w-max">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                          selectedCategory === category
                            ? 'border-[#AE275F] text-[#AE275F]'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {filteredProviders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">No integrations found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {filteredProviders.map((provider) => (
                        <Card 
                          key={provider.id}
                          className="p-4 cursor-pointer hover:border-[#AE275F] hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-12 h-12 ${provider.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 text-lg`}>
                              <span className={provider.textColor}>{provider.logo}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-gray-900 mb-1">{provider.name}</h4>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                                {provider.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{provider.description}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-8 text-xs border-gray-300 group-hover:border-[#AE275F] group-hover:text-[#AE275F]"
                            onClick={() => handleProviderSelect(provider)}
                          >
                            Open details
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Provider Details / Setup View */
              <div className="flex flex-col max-h-[90vh]">
                {/* Header with Back Button */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      onClick={handleBackToProviders}
                      className="text-gray-600 hover:text-gray-900 -ml-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to integrations
                    </Button>
                    
                    <Button
                      className={`${
                        selectedProvider.isConnected 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-[#AE275F] hover:bg-[#8e1f4d]'
                      } text-white`}
                    >
                      {selectedProvider.isConnected ? 'Run Sync' : 'Connect'}
                    </Button>
                  </div>

                  {/* Integration Title & Status */}
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 ${selectedProvider.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 text-2xl`}>
                      <span className={selectedProvider.textColor}>{selectedProvider.logo}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl text-gray-900">{selectedProvider.name}</h2>
                        <Badge className={`${
                          selectedProvider.isConnected 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {selectedProvider.isConnected ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{selectedProvider.longDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Integration Details Section */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    {/* Platform Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">Required Platform</div>
                        <div className="text-sm text-gray-900">{selectedProvider.platform}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">Auth Type</div>
                        <div className="text-sm text-gray-900">{selectedProvider.authType}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">Setup Time</div>
                        <div className="text-sm text-gray-900">{selectedProvider.setupTime}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">Difficulty</div>
                        <Badge className={getDifficultyColor(selectedProvider.difficulty)}>
                          {selectedProvider.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Horizontal Stepper */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                          <div key={step.number} className="flex-1 flex items-center">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center relative">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                  currentStep === step.number
                                    ? 'bg-[#AE275F] border-[#AE275F] text-white'
                                    : currentStep > step.number
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                }`}
                              >
                                {currentStep > step.number ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <span className="text-sm">{step.number}</span>
                                )}
                              </div>
                              <div className="absolute -bottom-6 text-xs text-gray-600 whitespace-nowrap hidden md:block">
                                Step {step.number}
                              </div>
                            </div>
                            
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-2 ${
                                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      {currentStep === 1 && (
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">Step 1: Create App Key</h3>
                          <p className="text-sm text-gray-600 mb-6">First generate an App Key for this integration</p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="business-unit" className="text-sm text-gray-700">
                              Select Business Unit or Service
                            </Label>
                            <Select value={selectedBusinessUnit} onValueChange={setSelectedBusinessUnit}>
                              <SelectTrigger id="business-unit" className="h-10">
                                <SelectValue placeholder="Choose a business unit..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                                <SelectItem value="backend-api">Backend API Service</SelectItem>
                                <SelectItem value="frontend">Frontend Service</SelectItem>
                                <SelectItem value="data-platform">Data Platform</SelectItem>
                                <SelectItem value="security">Security Team</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">Step 2: Clone Repository and Setup Terraform</h3>
                          <p className="text-sm text-gray-600 mb-6">Download and prepare CloudFormation template</p>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                  <span className="text-[#AE275F] mt-1">•</span>
                                  <span>Clone the integration repository from Git</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#AE275F] mt-1">•</span>
                                  <span>Navigate to the terraform directory</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#AE275F] mt-1">•</span>
                                  <span>Review the CloudFormation template configuration</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-10"
                                onClick={() => window.open('https://github.com/example/integration-repo', '_blank')}
                              >
                                <span className="flex items-center gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  View Git Repository
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">Step 3: Initialize Terraform</h3>
                          <p className="text-sm text-gray-600 mb-6">Setup stack + run CLI commands</p>
                          
                          <div className="space-y-4">
                            <div className="bg-gray-900 rounded-lg p-4 relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 text-gray-400 hover:text-white h-8"
                                onClick={() => handleCopyCode('terraform init\nterraform plan\nterraform apply')}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <pre className="text-sm text-gray-100 font-mono overflow-x-auto">
                                <code>{`# Initialize Terraform
terraform init

# Review the execution plan
terraform plan

# Apply the configuration
terraform apply

# Verify the deployment
terraform show`}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">Step 4: Validate Integration</h3>
                          <p className="text-sm text-gray-600 mb-6">Run test event and verify integration status</p>
                          
                          <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="text-sm text-blue-800">
                                Click the button below to send a test event and validate your integration is working correctly.
                              </p>
                            </div>
                            
                            <Button
                              onClick={handleValidateIntegration}
                              className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                            >
                              <PlayCircle className="w-5 h-5 mr-2" />
                              Run Test & Validate
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={handlePreviousStep}
                          disabled={currentStep === 1}
                          className="h-10"
                        >
                          Previous
                        </Button>
                        
                        {currentStep < 4 ? (
                          <Button
                            onClick={handleNextStep}
                            className="bg-[#AE275F] hover:bg-[#8e1f4d] text-white h-10"
                          >
                            Next Step
                          </Button>
                        ) : (
                          <Button
                            onClick={handleCloseDialog}
                            className="bg-[#AE275F] hover:bg-[#8e1f4d] text-white h-10"
                          >
                            Finish
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}