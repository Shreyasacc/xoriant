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
  PlayCircle
} from 'lucide-react';
import { SideNavigation } from './SideNavigation';
import { TopNavigation } from './TopNavigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

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
    lastSync: '2 mins ago'
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
    lastSync: '5 mins ago'
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
    lastSync: '10 mins ago'
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
    lastSync: '1 hour ago'
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
    lastSync: '3 hours ago'
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
    lastSync: '1 day ago'
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
    lastSync: '2 days ago'
  },
];

const availableProviders: Provider[] = [
  // Version Control
  {
    id: 'github',
    name: 'GitHub',
    logo: '🐙',
    description: 'Integrate your GitHub repositories to enable AI-powered anomaly detection.',
    longDescription: 'Connect GitHub to enable comprehensive repository monitoring, code analysis, and AI-powered anomaly detection across your development workflow.',
    category: 'Version Control',
    tags: ['Version Control'],
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
    logo: '🪣',
    description: 'Integrate your Bitbucket repositories to enable AI-powered anomaly detection.',
    longDescription: 'Integrate Bitbucket to monitor your repositories and pipelines with advanced anomaly detection capabilities.',
    category: 'Version Control',
    tags: ['Version Control'],
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    platform: 'Bitbucket',
    authType: 'API Key',
    setupTime: '5–7 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    logo: '🦊',
    description: 'Integrate your GitLab Projects to enable AI-powered anomaly detection.',
    longDescription: 'Connect GitLab for complete visibility into your CI/CD pipelines and repository activities with intelligent monitoring.',
    category: 'Version Control',
    tags: ['Version Control'],
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    platform: 'GitLab',
    authType: 'Personal Access Token',
    setupTime: '5–7 min',
    difficulty: 'Easy',
    isConnected: false
  },
  // Monitoring
  {
    id: 'signoz',
    name: 'SigNoz',
    logo: 'SN',
    description: 'Integrate SigNoz for comprehensive observability and monitoring.',
    longDescription: 'SigNoz provides open-source observability with distributed tracing, metrics, and logs in a single platform. Connect to enable full-stack monitoring and anomaly detection.',
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
    longDescription: 'New Relic delivers powerful full-stack observability to help you build better software. Monitor everything from infrastructure to application performance.',
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
    logo: '🐕',
    description: 'Integrate Datadog for infrastructure and application monitoring.',
    longDescription: 'Datadog provides monitoring and analytics for cloud-scale applications. Get insights across your entire stack with metrics, traces, and logs.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Infrastructure'],
    bgColor: 'bg-purple-600',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'API Key + App Key',
    setupTime: '8–15 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'apm-tool',
    name: 'APM Tool',
    logo: '📊',
    description: 'Advanced application performance monitoring with real-time insights.',
    longDescription: 'APM Tool provides comprehensive application performance monitoring with distributed tracing, error tracking, and real-time performance metrics. Monitor application health, identify bottlenecks, and optimize user experience.',
    category: 'Monitoring',
    tags: ['Monitoring', 'APM', 'Performance'],
    bgColor: 'bg-indigo-600',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'API Key',
    setupTime: '5–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'grafana',
    name: 'Grafana',
    logo: '📈',
    description: 'Integrate Grafana for powerful data visualization and monitoring dashboards.',
    longDescription: 'Grafana is an open-source analytics and monitoring solution. Create beautiful dashboards and visualizations from multiple data sources including Prometheus, InfluxDB, and more.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Visualization', 'Dashboards'],
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    platform: 'Self-hosted / Cloud',
    authType: 'API Key',
    setupTime: '5–8 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    logo: '🚨',
    description: 'Integrate PagerDuty for incident management and on-call scheduling.',
    longDescription: 'PagerDuty is a leading incident management platform that helps teams detect and fix infrastructure problems quickly. Get real-time alerts, on-call scheduling, and automated escalation policies.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Incident Management', 'Alerting'],
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    platform: 'PagerDuty',
    authType: 'API Key',
    setupTime: '5–7 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'dynatrace',
    name: 'Dynatrace',
    logo: 'DT',
    description: 'AI-powered full-stack monitoring and application performance management.',
    longDescription: 'Dynatrace provides automated, AI-powered observability across your entire stack. Features include automatic discovery, real-time topology mapping, Davis AI for root cause analysis, and comprehensive application performance monitoring.',
    category: 'Monitoring',
    tags: ['Monitoring', 'APM', 'AI', 'Observability'],
    bgColor: 'bg-purple-700',
    textColor: 'text-white',
    platform: 'Cloud / On-Premise',
    authType: 'API Token',
    setupTime: '10–15 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'appdynamics',
    name: 'AppDynamics',
    logo: 'AD',
    description: 'Business-centric application performance monitoring and analytics.',
    longDescription: 'AppDynamics delivers application performance management with business transaction monitoring, code-level diagnostics, and real-user monitoring. Understand the impact of application performance on business outcomes.',
    category: 'Monitoring',
    tags: ['Monitoring', 'APM', 'Business Analytics'],
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    platform: 'Cloud / SaaS',
    authType: 'API Key',
    setupTime: '10–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'coralogix',
    name: 'Coralogix',
    logo: 'CX',
    description: 'Real-time log analytics and monitoring platform with machine learning.',
    longDescription: 'Coralogix provides stateful streaming analytics for logs, metrics, and traces. Features include automated pattern detection, anomaly detection, and cost-effective data tiering for long-term retention.',
    category: 'Monitoring',
    tags: ['Monitoring', 'Logs', 'Analytics', 'ML'],
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Key',
    setupTime: '7–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  // Messaging
  {
    id: 'slack',
    name: 'Slack',
    logo: '💬',
    description: 'Integrate Slack for real-time notifications and alerts.',
    longDescription: 'Connect Slack to receive real-time alerts, notifications, and collaborate on incident resolution directly in your workspace.',
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
    id: 'teams',
    name: 'Microsoft Teams',
    logo: 'MS',
    description: 'Integrate Teams for collaboration and instant notifications.',
    longDescription: 'Microsoft Teams integration enables seamless collaboration and instant alerts for your team with webhook-based notifications.',
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
  // Cloud
  {
    id: 'aws',
    name: 'AWS',
    logo: '☁️',
    description: 'Integrate AWS services with multi-account support for cloud monitoring.',
    longDescription: 'Amazon Web Services integration provides comprehensive monitoring across multiple AWS accounts. Monitor EC2, Lambda, RDS, S3, and more with cross-account visibility and centralized management.',
    category: 'Cloud',
    tags: ['Cloud', 'Infrastructure', 'Multi-Account'],
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
    logo: '☁️',
    description: 'Integrate Microsoft Azure with multi-subscription support.',
    longDescription: 'Azure integration enables monitoring across multiple subscriptions and resource groups. Track virtual machines, databases, app services, and Azure Functions with unified visibility.',
    category: 'Cloud',
    tags: ['Cloud', 'Microsoft', 'Multi-Account'],
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    platform: 'Azure',
    authType: 'Service Principal',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'gcp',
    name: 'GCP',
    logo: '☁️',
    description: 'Integrate Google Cloud Platform with multi-project support.',
    longDescription: 'Google Cloud integration provides visibility across multiple GCP projects and organizations. Monitor Compute Engine, Cloud Functions, BigQuery, and other services with centralized observability.',
    category: 'Cloud',
    tags: ['Cloud', 'Google', 'Multi-Account'],
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    platform: 'GCP',
    authType: 'Service Account',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'cloud-platform',
    name: 'Cloud Platform',
    logo: '🌐',
    description: 'Unified cloud platform integration for multi-cloud monitoring.',
    longDescription: 'Cloud Platform provides a unified interface to monitor and manage resources across multiple cloud providers. Get consolidated insights, cost management, and security monitoring in one place.',
    category: 'Cloud',
    tags: ['Cloud', 'Multi-Cloud', 'Platform'],
    bgColor: 'bg-cyan-600',
    textColor: 'text-white',
    platform: 'Multi-Cloud',
    authType: 'API Key',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  // Logging
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    logo: '🔍',
    description: 'Integrate Elasticsearch for log aggregation and search.',
    longDescription: 'Elasticsearch integration enables powerful log search and analytics capabilities across your infrastructure.',
    category: 'Logging',
    tags: ['Logging', 'Search'],
    bgColor: 'bg-yellow-400',
    textColor: 'text-gray-900',
    platform: 'Self-hosted / Cloud',
    authType: 'API Key',
    setupTime: '7–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'splunk',
    name: 'Splunk',
    logo: '🔎',
    description: 'Integrate Splunk for log management and analysis.',
    longDescription: 'Splunk integration provides enterprise-grade log management with advanced analytics and machine learning capabilities.',
    category: 'Logging',
    tags: ['Logging', 'Analytics'],
    bgColor: 'bg-green-600',
    textColor: 'text-white',
    platform: 'Splunk',
    authType: 'HEC Token',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'log-management',
    name: 'Log Management',
    logo: '📝',
    description: 'Centralized log management and analytics platform.',
    longDescription: 'Log Management provides a comprehensive solution for collecting, analyzing, and visualizing logs from all your systems. Features include real-time log streaming, advanced search, alerting, and long-term retention.',
    category: 'Logging',
    tags: ['Logging', 'Analytics', 'Monitoring'],
    bgColor: 'bg-slate-700',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'API Key',
    setupTime: '6–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'cloudwatch-logs',
    name: 'CloudWatch Logs',
    logo: 'CW',
    description: 'AWS CloudWatch Logs for centralized log monitoring and analysis.',
    longDescription: 'AWS CloudWatch Logs enables you to monitor, store, and access log files from Amazon EC2 instances, Lambda functions, CloudTrail, and other sources. Features include real-time log streaming, metric filters, log insights queries, and integration with AWS services.',
    category: 'Logging',
    tags: ['Logging', 'AWS', 'Cloud'],
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    platform: 'AWS',
    authType: 'IAM Role',
    setupTime: '5–8 min',
    difficulty: 'Easy',
    isConnected: false
  },
  // Ticketing
  {
    id: 'jira',
    name: 'Jira',
    logo: '📋',
    description: 'Integrate Jira for issue tracking and project management.',
    longDescription: 'Jira integration enables automatic ticket creation and incident tracking directly in your project management workflow.',
    category: 'Ticketing',
    tags: ['Ticketing', 'Project Management'],
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    platform: 'Jira',
    authType: 'API Token',
    setupTime: '5–8 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'jira-service-management',
    name: 'Jira Service Management',
    logo: 'JSM',
    description: 'ITSM solution built on Jira for high-velocity incident response.',
    longDescription: 'Jira Service Management (formerly Jira Service Desk) provides IT service management capabilities with incident management, problem management, change management, and SLA tracking. Integrates seamlessly with development teams using Jira Software.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM', 'Service Management'],
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    platform: 'Atlassian Cloud',
    authType: 'API Token',
    setupTime: '6–10 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: '🎫',
    description: 'Integrate ServiceNow for IT service management and ticketing.',
    longDescription: 'ServiceNow integration streamlines ITSM workflows with automatic incident creation and resolution tracking.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM'],
    bgColor: 'bg-green-700',
    textColor: 'text-white',
    platform: 'ServiceNow',
    authType: 'OAuth 2.0',
    setupTime: '10–15 min',
    difficulty: 'Advanced',
    isConnected: false
  },
  {
    id: 'itsm',
    name: 'ITSM',
    logo: '🛠️',
    description: 'Enterprise IT Service Management platform for incident and problem management.',
    longDescription: 'ITSM platform provides comprehensive IT service management capabilities including incident management, problem management, change management, and asset tracking. Streamline your IT operations with automated workflows and SLA management.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM', 'Service Management'],
    bgColor: 'bg-teal-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'API Key',
    setupTime: '8–12 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  {
    id: 'acc-itsm',
    name: 'ACC ITSM',
    logo: '🎯',
    description: 'Advanced Cloud-based ITSM solution for modern IT operations.',
    longDescription: 'ACC ITSM is a cloud-native IT Service Management platform designed for agile teams. Features include AI-powered ticket routing, automated incident response, comprehensive reporting, and seamless integration with DevOps tools.',
    category: 'Ticketing',
    tags: ['Ticketing', 'ITSM', 'Cloud', 'AI'],
    bgColor: 'bg-rose-600',
    textColor: 'text-white',
    platform: 'Cloud',
    authType: 'OAuth 2.0',
    setupTime: '7–10 min',
    difficulty: 'Moderate',
    isConnected: false
  },
  // Documentation
  {
    id: 'confluence',
    name: 'Confluence',
    logo: '📚',
    description: 'Integrate Confluence for documentation and knowledge management.',
    longDescription: 'Confluence integration allows automatic documentation of incidents and best practices in your knowledge base.',
    category: 'Documentation',
    tags: ['Documentation', 'Wiki'],
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    platform: 'Confluence',
    authType: 'API Token',
    setupTime: '5–8 min',
    difficulty: 'Easy',
    isConnected: false
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: '📝',
    description: 'Integrate Notion for collaborative documentation and notes.',
    longDescription: 'Notion integration enables seamless documentation and knowledge sharing with your team through automated page creation.',
    category: 'Documentation',
    tags: ['Documentation', 'Collaboration'],
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    platform: 'Notion',
    authType: 'Integration Token',
    setupTime: '5–7 min',
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
  const [sideNavCollapsed, setSideNavCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration>(mockIntegrations[0]);
  const [showNewIntegrationDialog, setShowNewIntegrationDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [providerSearchTerm, setProviderSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Integrations');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('');

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
    console.log('Deleting integration:', selectedIntegration.name);
    setShowDeleteDialog(false);
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

  const steps = [
    { number: 1, title: 'Create App Key' },
    { number: 2, title: 'Clone Repository' },
    { number: 3, title: 'Initialize Terraform' },
    { number: 4, title: 'Validate Integration' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideNavigation 
        onNavigate={onNavigate}
        externalCollapsed={sideNavCollapsed}
        onCollapsedChange={setSideNavCollapsed}
        currentPage="integration-tool"
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavigation onNavigate={onNavigate} onLogout={onLogout} />
        
        <main className="flex flex-1 overflow-hidden bg-gray-50">
          {/* Left Sidebar - Integration List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">Integrations</h2>
                <Button 
                  onClick={() => setShowNewIntegrationDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4"
                >
                  New Integration
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Filter integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 bg-gray-50 border-gray-200"
                  />
                </div>
                
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
              {filteredIntegrations.map((integration) => {
                const providerIcon = getProviderIcon(integration.provider);
                const isSelected = selectedIntegration.id === integration.id;
                
                return (
                  <button
                    key={integration.id}
                    onClick={() => setSelectedIntegration(integration)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${providerIcon.bg} rounded flex items-center justify-center flex-shrink-0`}>
                        <span className={`${providerIcon.text} text-xs`}>{providerIcon.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 truncate">{integration.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          Service name: {integration.serviceName}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content - Integration Details */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${getProviderIcon(selectedIntegration.provider).bg} rounded flex items-center justify-center`}>
                    <span className="text-white">{getProviderIcon(selectedIntegration.provider).logo}</span>
                  </div>
                  <div>
                    <h1 className="text-gray-900 mb-1">{selectedIntegration.name}</h1>
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                      {selectedIntegration.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 h-9"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configuration
                  </Button>
                  <Button 
                    onClick={() => setShowDeleteDialog(true)}
                    className="bg-red-600 hover:bg-red-700 text-white h-9"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Integration Details */}
                <div>
                  <h3 className="text-gray-900 mb-6">Integration Details</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-2">App Key</div>
                      <div className="text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded border border-gray-200 break-all">
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
                  <h3 className="text-gray-900 mb-6">Additional Information</h3>
                  <div className="space-y-6">
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
            </div>
          </div>
        </main>
      </div>

      {/* New Integration Dialog */}
      <Dialog open={showNewIntegrationDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="min-w-6xl max-h-[90vh] p-0">
          {!selectedProvider ? (
            // Provider Selection View
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl text-gray-900">Integrations</DialogTitle>
                    <DialogDescription className="mt-1">
                      Connect your favorite tools and platforms
                    </DialogDescription>
                  </div>
                  <button
                    onClick={handleCloseDialog}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for integrations..."
                    value={providerSearchTerm}
                    onChange={(e) => setProviderSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex flex-col flex-1 overflow-hidden">
                <div className="border-b border-gray-200 px-6 flex-shrink-0">
                  <TabsList className="bg-transparent h-auto p-0 gap-6">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0 pb-3 data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <TabsContent value={selectedCategory} className="mt-0">
                    <div className="grid grid-cols-3 gap-4">
                      {filteredProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-12 h-12 ${provider.bgColor} ${provider.textColor} rounded flex items-center justify-center flex-shrink-0 text-lg`}>
                              {provider.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm text-gray-900 mb-1">{provider.name}</h3>
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                                {provider.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                            {provider.description}
                          </p>
                          <Button
                            onClick={() => handleProviderSelect(provider)}
                            variant="outline"
                            className="w-full h-8 text-xs border-gray-300 hover:bg-gray-50"
                          >
                            Open details
                          </Button>
                        </div>
                      ))}
                    </div>
                    {filteredProviders.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <p>No integrations found matching your search.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            // Provider Setup View
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleBackToProviders}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to integrations</span>
                  </button>
                  <button
                    onClick={handleCloseDialog}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${selectedProvider.bgColor} ${selectedProvider.textColor} rounded-lg flex items-center justify-center text-2xl`}>
                      {selectedProvider.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl text-gray-900 mb-1">{selectedProvider.name}</h2>
                      <Badge className={selectedProvider.isConnected ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100'}>
                        {selectedProvider.isConnected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    {selectedProvider.isConnected ? 'Run Sync' : 'Connect'}
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  {selectedProvider.longDescription}
                </p>
              </div>

              {/* Setup Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Required Platform</div>
                    <div className="text-sm text-gray-900">{selectedProvider.platform}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Auth Type</div>
                    <div className="text-sm text-gray-900">{selectedProvider.authType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Setup Time</div>
                    <div className="text-sm text-gray-900">{selectedProvider.setupTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Difficulty</div>
                    <Badge className={getDifficultyColor(selectedProvider.difficulty)}>
                      {selectedProvider.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="px-6 py-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step.number 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {currentStep > step.number ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span>{step.number}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 ${
                          currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">Create App Key</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      First generate an App Key for this integration
                    </p>
                    <div className="max-w-md">
                      <Label htmlFor="businessUnit" className="text-sm text-gray-700">
                        Select Business Unit or Service
                      </Label>
                      <Select value={selectedBusinessUnit} onValueChange={setSelectedBusinessUnit}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose a business unit..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="backend">Backend Services</SelectItem>
                          <SelectItem value="frontend">Frontend Services</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setCurrentStep(2)}
                        disabled={!selectedBusinessUnit}
                      >
                        Continue to Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">Clone Repository and Setup Terraform</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Download and prepare CloudFormation template
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                      <ol className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-medium">1.</span>
                          <span>Clone the integration repository from GitHub</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-medium">2.</span>
                          <span>Navigate to the terraform directory</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-medium">3.</span>
                          <span>Review the CloudFormation template configuration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-medium">4.</span>
                          <span>Update variables.tf with your specific settings</span>
                        </li>
                      </ol>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a 
                          href="https://github.com/example/integration-repo" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Repository
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setCurrentStep(3)}
                      >
                        Continue to Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">Initialize Terraform</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Setup stack + run CLI commands
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400">Terminal</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-gray-400 hover:text-white"
                          onClick={() => handleCopyCode('terraform init\nterraform plan\nterraform apply -auto-approve')}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-sm text-green-400 font-mono">
                        <code>{`# Initialize Terraform
terraform init

# Review the execution plan
terraform plan

# Apply the configuration
terraform apply -auto-approve`}</code>
                      </pre>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Make sure you have AWS credentials configured before running these commands.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setCurrentStep(4)}
                      >
                        Continue to Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">Validate Integration</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Run test event and verify integration status
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlayCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-gray-900 mb-2">Ready to Test</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Click the button below to send a test event and validate your integration
                      </p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleValidateIntegration}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Run Test Event
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                      >
                        Back
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleCloseDialog}
                      >
                        Complete Setup
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedIntegration.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteIntegration}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
