import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Cloud,
  Copy,
  Sparkles,
  Activity,
  Cpu,
  HardDrive,
  Zap,
  TrendingUp,
  TrendingDown,
  Terminal,
  Bot,
  Play,
  Clock,
  Shield,
  FileCheck,
  ArrowRight,
  Lightbulb,
  Bell,
  User,
  Settings,
  ArrowUp,
  MessageSquare,
  History,
  Eye,
  Wrench,
  BarChart,
  Database,
  Server,
  Box,
  Network,
  Container,
  Layers,
  Link2,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface IncidentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: {
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
    resolutionType?: 'auto' | 'manual' | 'ai';
    resolvedAt?: string;
  } | null;
}

export function IncidentDetailsModal({ isOpen, onClose, incident }: IncidentDetailsModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [incidentStatus, setIncidentStatus] = useState('investigating');
  const [showAIDiagnose, setShowAIDiagnose] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState({
    id: '',
    createdAt: '',
    assignedTo: 'DevOps Team',
    priority: 'High',
    category: 'Infrastructure',
    estimatedResolution: '2-4 hours'
  });
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 0,
    memory: 0,
    responseTime: 0,
    errorRate: 0,
    networkIn: 0,
    networkOut: 0
  });
  const [showRCAModal, setShowRCAModal] = useState(false);
  const [isEditingRCA, setIsEditingRCA] = useState(false);
  const [rcaDetails, setRcaDetails] = useState({
    title: '',
    summary: '',
    rootCause: '',
    impact: '',
    resolution: '',
    preventiveMeasures: '',
    timeline: ''
  });

  // Generate initial metrics data
  useEffect(() => {
    if (!incident) return;
    
    const generateMetricsData = () => {
      const data = [];
      const now = Date.now();
      
      for (let i = 30; i >= 0; i--) {
        const time = new Date(now - i * 60000); // 30 minutes of data
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 40) + 50, // 50-90%
          memory: Math.floor(Math.random() * 30) + 60, // 60-90%
          responseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
          errorRate: Math.floor(Math.random() * 5) + 1, // 1-6%
          networkIn: Math.floor(Math.random() * 50) + 20, // 20-70 MB/s
          networkOut: Math.floor(Math.random() * 30) + 10 // 10-40 MB/s
        });
      }
      
      setMetricsData(data);
      
      // Set current metrics to the latest value
      if (data.length > 0) {
        const latest = data[data.length - 1];
        setCurrentMetrics({
          cpu: latest.cpu,
          memory: latest.memory,
          responseTime: latest.responseTime,
          errorRate: latest.errorRate,
          networkIn: latest.networkIn,
          networkOut: latest.networkOut
        });
      }
    };
    
    generateMetricsData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetricsData(prev => {
        const newData = [...prev];
        const now = new Date();
        
        newData.shift(); // Remove oldest
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 40) + 50,
          memory: Math.floor(Math.random() * 30) + 60,
          responseTime: Math.floor(Math.random() * 300) + 100,
          errorRate: Math.floor(Math.random() * 5) + 1,
          networkIn: Math.floor(Math.random() * 50) + 20,
          networkOut: Math.floor(Math.random() * 30) + 10
        });
        
        // Update current metrics
        const latest = newData[newData.length - 1];
        setCurrentMetrics({
          cpu: latest.cpu,
          memory: latest.memory,
          responseTime: latest.responseTime,
          errorRate: latest.errorRate,
          networkIn: latest.networkIn,
          networkOut: latest.networkOut
        });
        
        return newData;
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, [incident]);

  // Reset ticket state when modal opens
  useEffect(() => {
    if (isOpen && incident) {
      // Generate a ticket ID based on incident
      const generatedTicketId = `TKT-${incident.provider}-${Date.now().toString().slice(-6)}`;
      setTicketId(generatedTicketId);
      setTicketCreated(false);
      
      // Initialize RCA details
      setRcaDetails({
        title: `Root Cause Analysis - ${incident.title}`,
        summary: `This RCA document provides a comprehensive analysis of the ${incident.severity.toUpperCase()} severity incident that occurred on ${new Date(incident.timestamp).toLocaleString()}.`,
        rootCause: `The incident was triggered due to ${incident.probableCause.toLowerCase()}. Initial investigation indicates resource exhaustion in the ${incident.service} service.`,
        impact: `Service: ${incident.service}\nCloud Provider: ${incident.provider}\nAccount: ${incident.accountName} (${incident.accountNo})\nSeverity: ${incident.severity.toUpperCase()}\nConfidence Level: ${incident.confidence}%`,
        resolution: incident.recommendation || 'Resolution steps are being documented based on the incident investigation.',
        preventiveMeasures: '1. Implement automated scaling policies\n2. Set up proactive monitoring alerts\n3. Regular capacity planning reviews\n4. Enhanced resource utilization tracking',
        timeline: `Incident Detected: ${new Date(incident.timestamp).toLocaleString()}\nInvestigation Started: ${new Date(Date.now() - 300000).toLocaleString()}\nResolution Initiated: Pending\nIncident Closed: Pending`
      });
    }
  }, [isOpen, incident]);

  if (!incident) return null;

  const handleCreateTicket = () => {
    const now = new Date();
    const createdAt = now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Determine priority based on severity
    let priority = 'Medium';
    if (incident.severity === 'critical') priority = 'Critical';
    else if (incident.severity === 'high') priority = 'High';
    else if (incident.severity === 'medium') priority = 'Medium';
    else priority = 'Low';

    setTicketDetails({
      id: ticketId,
      createdAt,
      assignedTo: 'DevOps Team',
      priority,
      category: 'Infrastructure',
      estimatedResolution: incident.severity === 'critical' ? '1-2 hours' : 
                          incident.severity === 'high' ? '2-4 hours' : 
                          incident.severity === 'medium' ? '4-8 hours' : '8-24 hours'
    });
    setTicketCreated(true);
  };

  const steps = [
    { id: 1, title: 'Acknowledge Incident', status: 'completed' },
    { id: 2, title: 'Initiate Resolution', status: currentStep >= 2 ? 'completed' : 'pending' },
    { id: 3, title: 'Close Incident', status: currentStep >= 3 ? 'completed' : 'pending' },
    { id: 4, title: 'Generate RCA', status: currentStep >= 4 ? 'completed' : 'pending' }
  ];

  const handleStepAction = (stepId: number) => {
    if (stepId === 2) {
      setCurrentStep(2);
      setIncidentStatus('resolving');
      toast.success('Resolution initiated successfully!', {
        description: 'The incident is now in progress.',
        duration: 3000,
      });
    } else if (stepId === 3) {
      setCurrentStep(3);
      setIncidentStatus('resolved');
      toast.success('Incident closed successfully!', {
        description: 'The incident has been marked as resolved.',
        duration: 3000,
      });
    } else if (stepId === 4) {
      setCurrentStep(4);
      toast.success('RCA generated successfully!', {
        description: 'Root Cause Analysis document is ready.',
        duration: 3000,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      duration: 2000,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'border-red-600 text-red-700 bg-red-50';
      case 'high': return 'border-orange-600 text-orange-700 bg-orange-50';
      case 'medium': return 'border-yellow-500 text-yellow-700 bg-yellow-50';
      case 'low': return 'border-blue-500 text-blue-700 bg-blue-50';
      default: return 'border-gray-500 text-gray-700 bg-gray-50';
    }
  };

  const getCloudProviderIcon = (provider: string) => {
    const normalizedProvider = provider.toLowerCase();
    
    if (normalizedProvider.includes('gcp') || normalizedProvider.includes('google')) {
      // GCP icon - colorful G
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335"/>
        </svg>
      );
    } else if (normalizedProvider.includes('azure') || normalizedProvider.includes('microsoft')) {
      // Azure icon
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M5.483 21.3h6.49L18.248 9.66 13.845 2.7H8.588L5.483 21.3z" fill="#0089D6"/>
          <path d="M13.845 2.7H8.588L.925 19.605a1.63 1.63 0 0 0 1.458 2.392h8.252l3.21-19.297z" fill="#0078D4"/>
        </svg>
      );
    } else if (normalizedProvider.includes('aws') || normalizedProvider.includes('amazon')) {
      // AWS icon
      return (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.847.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.492.492 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.237-.151c.95 0 1.644.215 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.695v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.782c.151 0 .255.025.312.08.064.048.112.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.468.468 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.151-.319l-1.245-5.172-1.237 5.165c-.04.159-.088.263-.151.319-.064.056-.176.08-.32.08h-.686zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.336-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256-.063 0-.167-.032-.295-.096-.447-.2-.95-.296-1.51-.296-.455 0-.815.072-1.062.224-.248.151-.375.383-.375.71 0 .224.08.416.24.567.159.152.447.304.862.447l1.134.36c.575.183.99.438 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.582.703-.239.2-.535.343-.878.447-.34.111-.717.167-1.117.167z" fill="#FF9900"/>
        </svg>
      );
    }
    
    // Default cloud icon if no match
    return <Cloud className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const getStatusBadge = () => {
    switch (incidentStatus) {
      case 'investigating':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">INVESTIGATING</Badge>;
      case 'resolving':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">IN PROGRESS</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          RESOLVED
        </Badge>;
      default:
        return <Badge variant="outline" className="border-gray-500 text-gray-700">OPEN</Badge>;
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[1200px] min-w-[80vw] h-[92vh] sm:h-[88vh] md:h-[85vh] p-0 flex flex-col">
        {/* Check if it's a white noise incident - show different layout */}
        {(incident?.id?.startsWith('wn-') || incident?.id?.startsWith('wn') || incident?.resolutionType === 'auto') ? (
          <>
            {/* White Noise Incident Layout */}
            <DialogHeader className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2">White Noise Incident Details</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600 mb-2">
                  This event has been categorized as White Noise. No customer impact detected. AI automatically suppressed this signal and updated its model to reduce future noise.
                </DialogDescription>
                <p className="text-xs sm:text-sm text-gray-500">2 mins ago</p>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              {/* Stepper - 3 Steps */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
                  <h3 className="text-base sm:text-lg text-gray-900">AI Resolution Process</h3>
                  <span className="text-sm sm:text-base text-gray-600">Step 1 of 3</span>
                </div>
                
                {/* Horizontally Scrollable Container */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-5 sm:px-5">
                  <div className="relative min-w-max">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-16 right-16 h-0.5 bg-gray-300">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: '0%' }}
                      ></div>
                    </div>

                    {/* Steps */}
                    <div className="relative flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                      {/* Step 1 - Completed */}
                      <div className="flex flex-col items-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 bg-green-500 text-white">
                          <CheckCircle2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-center leading-tight px-1 text-gray-900">
                          AI Detection
                        </p>
                      </div>

                      {/* Step 2 - Inactive */}
                      <div className="flex flex-col items-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 bg-white border-2 border-gray-300 text-gray-400">
                          <Circle className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-center leading-tight px-1 text-gray-500">
                          AI Suppression
                        </p>
                      </div>

                      {/* Step 3 - Inactive */}
                      <div className="flex flex-col items-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 bg-white border-2 border-gray-300 text-gray-400">
                          <Circle className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-center leading-tight px-1 text-gray-500">
                          Model Learning Applied
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Information Section */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg text-gray-900 mb-4">Event Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[140px]">Event ID:</span>
                    <span className="text-sm sm:text-base text-gray-900">{incident.id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[140px]">Source Provider:</span>
                    <span className="text-sm sm:text-base text-gray-900">{incident.provider}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[140px]">Category:</span>
                    <span className="text-sm sm:text-base text-gray-900">{incident.service}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[140px]">Severity:</span>
                    <Badge className="bg-gray-100 text-gray-700 border-0 text-xs sm:text-sm w-fit">
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[140px]">Analysis Summary:</span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {incident.probableCause}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Resolution Summary Section */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg text-gray-900 mb-4">AI Resolution Summary</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[160px]">Cause Classification:</span>
                    <span className="text-sm sm:text-base text-gray-900">White Noise - Auto Resolved</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[160px]">Reasoning Summary:</span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {incident.recommendation}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[160px]">Confidence Score:</span>
                    <span className="text-sm sm:text-base text-gray-900">{incident.confidence}%</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 min-w-[160px]">Action Taken:</span>
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs sm:text-sm w-fit">
                      Auto Suppressed
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => {
                  toast.success('Marked as valid noise', {
                    description: 'This event has been confirmed as white noise.',
                    duration: 3000,
                  });
                }}
                className="bg-[#AE275F] hover:bg-[#8d1f4d] text-white flex-1 sm:flex-initial"
              >
                Mark as Valid Noise
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast.info('Reclassifying incident', {
                    description: 'This event will be reclassified as a regular incident.',
                    duration: 3000,
                  });
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial"
              >
                Reclassify as Incident
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Regular Incident Layout */}
        <DialogHeader className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2">Incident Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-500">2 mins ago</DialogDescription>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-auto p-0 mx-4 sm:mx-5 md:mx-6 mb-0 w-auto justify-start flex-shrink-0 overflow-x-auto scrollbar-thin">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-gray-500 px-4 sm:px-5 pb-3 text-sm sm:text-base whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-gray-500 px-4 sm:px-5 pb-3 text-sm sm:text-base whitespace-nowrap"
            >
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="resolution" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-gray-500 px-4 sm:px-5 pb-3 text-sm sm:text-base whitespace-nowrap"
            >
              Resolution
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-gray-500 px-4 sm:px-5 pb-3 text-sm sm:text-base whitespace-nowrap"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="related" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-gray-500 px-4 sm:px-5 pb-3 text-sm sm:text-base whitespace-nowrap"
            >
              Related
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              {/* Stepper */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
                  <h3 className="text-base sm:text-lg text-gray-900">Incident Resolution Progress</h3>
                  <span className="text-sm sm:text-base text-gray-600">Step {currentStep} of 4</span>
                </div>
                
                {/* Horizontally Scrollable Container */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-5 sm:px-5">
                  <div className="relative min-w-max">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-16 right-16 h-0.5 bg-gray-300">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                      ></div>
                    </div>

                    {/* Steps */}
                    <div className="relative flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px]">
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${
                            step.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : step.id === currentStep
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                            ) : (
                              <Circle className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm text-center leading-tight px-1 ${
                            step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout - Incident Information & Resolution Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Incident Information */}
              <div className="space-y-3 min-w-0">
                <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">Incident Information</h3>
                
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Incident ID:</span>
                    <span className="text-sm text-gray-900 font-mono break-words flex-1">{incident.id}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Ticket ID:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-gray-900 font-mono">{ticketId}</span>
                      <Button
                        size="sm"
                        onClick={copyToClipboard.bind(null, ticketId)}
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Title:</span>
                    <span className="text-sm text-gray-900 break-words flex-1">{incident.title}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Status:</span>
                    <div>{getStatusBadge()}</div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Severity:</span>
                    <Badge variant="outline" className={`${getSeverityColor(incident.severity)} text-sm`}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Cloud Provider:</span>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getCloudProviderIcon(incident.provider)}
                      <span className="text-sm text-gray-900 break-words">{incident.provider}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Service:</span>
                    <span className="text-sm text-gray-900 break-words flex-1">{incident.service}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Account Name:</span>
                    <span className="text-sm text-gray-900 break-words flex-1">{incident.accountName}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Account No:</span>
                    <span className="text-sm text-gray-900 font-mono break-words flex-1">{incident.accountNo}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Occurred At:</span>
                    <span className="text-sm text-gray-900">{incident.timestamp}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Confidence:</span>
                    <span className="text-sm text-gray-900">{incident.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Resolution Details */}
              <div className="space-y-3 min-w-0">
                <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">Resolution Details</h3>
                
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Probable Cause:</span>
                    <span className="text-sm text-gray-900 break-words flex-1">{incident.probableCause}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-600 w-28 flex-shrink-0">Recommendation:</span>
                    <span className="text-sm text-gray-900 break-words flex-1">{incident.recommendation}</span>
                  </div>

                  {incident.resolutionType && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 w-28 flex-shrink-0">Resolution Type:</span>
                      <Badge variant="outline" className={`text-sm ${
                        incident.resolutionType === 'auto' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                        incident.resolutionType === 'ai' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                        'bg-green-50 text-green-700 border-green-300'
                      }`}>
                        {incident.resolutionType.toUpperCase()}
                      </Badge>
                    </div>
                  )}

                  {incident.resolvedAt && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 w-28 flex-shrink-0">Resolved At:</span>
                      <span className="text-sm text-gray-900">{incident.resolvedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

              {/* Create Ticket Button and Ticket Details */}
              <div className="space-y-4">
                {!ticketCreated ? (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleCreateTicket}
                      className="bg-[#AE275F] hover:bg-[#8B1F4C] text-white px-6 py-2.5 gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Create Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-green-500 rounded-full p-1.5">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg text-gray-900 mb-1">Ticket Created Successfully!</h3>
                        <p className="text-sm text-gray-600">The incident has been escalated to the support team.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-green-200 p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 pb-2 border-b border-gray-200">Ticket Details</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Ticket ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 font-mono">{ticketDetails.id}</span>
                            <Button
                              size="sm"
                              onClick={copyToClipboard.bind(null, ticketDetails.id)}
                              variant="ghost"
                              className="h-5 w-5 p-0 hover:bg-gray-100"
                            >
                              <Copy className="w-3 h-3 text-gray-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Created At:</span>
                          <span className="text-sm text-gray-900">{ticketDetails.createdAt}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Priority:</span>
                          <Badge variant="outline" className={`text-sm ${
                            ticketDetails.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-300' :
                            ticketDetails.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                            ticketDetails.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                            'bg-blue-50 text-blue-700 border-blue-300'
                          }`}>
                            {ticketDetails.priority}
                          </Badge>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Assigned To:</span>
                          <span className="text-sm text-gray-900">{ticketDetails.assignedTo}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Category:</span>
                          <Badge variant="outline" className="text-sm bg-purple-50 text-purple-700 border-purple-300">
                            {ticketDetails.category}
                          </Badge>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Est. Resolution:</span>
                          <span className="text-sm text-gray-900">{ticketDetails.estimatedResolution}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">Description:</span>
                          <span className="text-sm text-gray-900 break-words flex-1">{incident.title} - {incident.probableCause}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Action Description - Full Width */}
              <div className="space-y-3">
              <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">AI Recommendation</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {incident.recommendation}
                </p>
                </div>
              </div>

              {/* Incident Evidence - Full Width */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">Probable Cause Analysis</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                <p className="text-sm text-gray-900 leading-relaxed break-words">
                  {incident.probableCause}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-600">AI Confidence:</span>
                  <Badge variant="outline" className="bg-white">
                    {incident.confidence}%
                  </Badge>
                </div>
                </div>
              </div>

              {/* Incident Logs */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg text-gray-900">Incident Logs</h3>
                
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between border-b border-gray-200">
                  <span className="text-sm sm:text-base text-gray-700 truncate">Kubernetes Container Restarting</span>
                  <button className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
                
                <div className="bg-[#2d2d2d] p-3 sm:p-4 overflow-x-auto max-h-48 sm:max-h-64">
                  <pre className="text-[10px] sm:text-xs text-gray-300 font-mono leading-relaxed">
{`"root": {
  "event": {
    "id": "c4ac9402-e95a-4c5b-90ea-43e07a85103a",
    "state": "ACTIVATED",
    "title": "fluent-bit query result is > 0.0 for 5 minutes on 'Container is Restarting'",
    "sources": [...],
    "trigger": "INCIDENT_ADDED",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/7145652/issues/c4ac9402-e95a-4c5b-90ea-43e07a85103a?notifier=WEBHOOK",
    "severity": "CRITICAL",
    "priority": "HIGH",
    "impactedEntities": [
      {
        "name": "fluent-bit",
        "type": "POD",
        "namespace": "logging"
      }
    ]
  }
}`}
                  </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button 
                className="bg-[#AE275F] hover:bg-[#8B1F4D] text-white h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-5"
                onClick={() => setShowAIDiagnose(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Diagnose
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-5">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Diagnose
              </Button>
              {currentStep < 4 ? (
                <Button 
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-5"
                  onClick={() => handleStepAction(currentStep + 1)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {currentStep === 1 && 'Initiate Resolution'}
                  {currentStep === 2 && 'Close Incident'}
                  {currentStep === 3 && 'Generate RCA'}
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-5"
                  onClick={() => {
                    setShowRCAModal(true);
                    setIsEditingRCA(false);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate RCA
                </Button>
              )}
            </div>

            {/* AI Diagnose Steps Panel */}
            {showAIDiagnose && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg text-gray-900 truncate">AI Diagnostic Steps</h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">Automated resolution workflow</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAIDiagnose(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  </button>
                </div>

                {/* Steps Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6">
                  <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
                    {/* Introduction Message */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 sm:px-4 py-2.5 sm:py-3 flex-1">
                        <p className="text-sm sm:text-base text-gray-900">
                          I have 3 steps to resolve this issue. Let's start with the first step.
                        </p>
                      </div>
                    </div>

                    {/* Step 1 */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex-1 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <Terminal className="w-4 h-4 text-gray-600" />
                          <h4 className="text-sm sm:text-base text-gray-900">Step 1 of 3</h4>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Check auth-app pod memory utilization</p>
                        
                        {/* Code Block */}
                        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden mb-2 sm:mb-3">
                          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700">
                            <span className="text-xs sm:text-sm text-gray-400">bash</span>
                            <button
                              onClick={() => copyToClipboard('kubectl -n atlas top pod auth-depl-abc123 --containers')}
                              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                          </div>
                          <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto">
                            <pre className="text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
                              <span className="text-gray-400">$</span> kubectl -n atlas top pod auth-depl-abc123 --containers
                            </pre>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600">
                          Verify the current memory utilization of the auth-app container in the auth-depl pod.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex-1 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <Terminal className="w-4 h-4 text-gray-600" />
                          <h4 className="text-sm sm:text-base text-gray-900">Step 2 of 3</h4>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Restart the auth-app pod</p>
                        
                        {/* Code Block */}
                        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden mb-2 sm:mb-3">
                          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700">
                            <span className="text-xs sm:text-sm text-gray-400">bash</span>
                            <button
                              onClick={() => copyToClipboard('kubectl -n atlas delete pod auth-depl-abc123')}
                              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                          </div>
                          <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto">
                            <pre className="text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
                              <span className="text-gray-400">$</span> kubectl -n atlas delete pod auth-depl-abc123
                            </pre>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600">
                          Delete the auth-app pod to trigger a restart and free up memory.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex-1 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <Terminal className="w-4 h-4 text-gray-600" />
                          <h4 className="text-sm sm:text-base text-gray-900">Step 3 of 3</h4>
                        </div>
                        
                        <p className="text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Monitor pod memory usage</p>
                        
                        {/* Code Block */}
                        <div className="bg-[#2d2d2d] rounded-lg overflow-hidden mb-2 sm:mb-3">
                          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700">
                            <span className="text-xs sm:text-sm text-gray-400">bash</span>
                            <button
                              onClick={() => copyToClipboard('kubectl -n atlas describe pod auth-depl-xyz456')}
                              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                          </div>
                          <div className="px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto">
                            <pre className="text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
                              <span className="text-gray-400">$</span> kubectl -n atlas describe pod auth-depl-xyz456
                            </pre>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600">
                          Observe the memory usage of the restarted auth-app pod and ensure it remains within the expected limits.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">Follow these steps to resolve the incident</p>
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAIDiagnose(false)}
                      className="h-10 sm:h-11 text-sm flex-1 sm:flex-none"
                    >
                      Close
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-11 text-sm flex-1 sm:flex-none"
                      onClick={() => {
                        setShowAIDiagnose(false);
                        setCurrentStep(2);
                        setIncidentStatus('resolving');
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Mark as In Progress
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              {/* Real-time Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* CPU Usage */}
                <div className="bg-gradient-to-br from-blue-10 to-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">+12%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">CPU Usage</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.cpu}%</p>
                  </div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${currentMetrics.cpu}%` }}
                    ></div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-gradient-to-br from-purple-10 to-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">+8%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Memory</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.memory}%</p>
                  </div>
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${currentMetrics.memory}%` }}
                    ></div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-br from-green-10 to-green-50 border border-green-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">-5%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Response Time</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.responseTime}<span className="text-sm sm:text-base">ms</span></p>
                  </div>
                  <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 transition-all duration-500"
                      style={{ width: `${(currentMetrics.responseTime / 400) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Error Rate */}
                <div className="bg-gradient-to-br from-red-10 to-red-50 border border-red-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">+2%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Error Rate</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.errorRate}%</p>
                  </div>
                  <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{ width: `${(currentMetrics.errorRate / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Network In */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Network In</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.networkIn}<span className="text-sm sm:text-base"> MB/s</span></p>
                  </div>
                  <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-600 transition-all duration-500"
                      style={{ width: `${(currentMetrics.networkIn / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Network Out */}
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm sm:text-base text-gray-600 mb-1">Network Out</p>
                    <p className="text-2xl sm:text-3xl text-gray-900">{currentMetrics.networkOut}<span className="text-sm sm:text-base"> MB/s</span></p>
                  </div>
                  <div className="h-2 bg-cyan-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-600 transition-all duration-500"
                      style={{ width: `${(currentMetrics.networkOut / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* CPU & Memory Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg text-gray-900">CPU & Memory Utilization</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                    Live
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={metricsData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                      label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorCpu)"
                      strokeWidth={2}
                      name="CPU %"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#a855f7" 
                      fillOpacity={1}
                      fill="url(#colorMemory)"
                      strokeWidth={2}
                      name="Memory %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Response Time & Error Rate Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg text-gray-900 mb-4">Response Time</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                        label={{ value: 'ms', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={false}
                        name="Response Time (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg text-gray-900 mb-4">Error Rate</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                        label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="errorRate" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={false}
                        name="Error Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Network Traffic Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                <h3 className="text-base sm:text-lg text-gray-900 mb-4">Network Traffic</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={metricsData}>
                    <defs>
                      <linearGradient id="colorNetIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNetOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fontSize: 11 }}
                      tickMargin={8}
                      label={{ value: 'MB/s', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="networkIn" 
                      stroke="#f97316" 
                      fillOpacity={1}
                      fill="url(#colorNetIn)"
                      strokeWidth={2}
                      name="Network In (MB/s)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="networkOut" 
                      stroke="#06b6d4" 
                      fillOpacity={1}
                      fill="url(#colorNetOut)"
                      strokeWidth={2}
                      name="Network Out (MB/s)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resolution" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 space-y-3 sm:space-y-4 md:space-y-5">
              {/* AI Resolution Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 text-white">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">AI-Generated Resolution Plan</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Automated analysis and recommended steps</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-white/80">Est. Time</span>
                    </div>
                    <span className="text-sm sm:text-base text-white">12-15 min</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-white/80">Success Rate</span>
                    </div>
                    <span className="text-sm sm:text-base text-white">94.5%</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-white/80">Confidence</span>
                    </div>
                    <span className="text-sm sm:text-base text-white">High</span>
                  </div>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg text-gray-900">Root Cause Analysis</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2">Primary Issue</h4>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      The fluent-bit container is experiencing continuous restarts due to memory exhaustion. Analysis shows memory consumption exceeding the allocated limit of 256Mi, causing the OOMKiller to terminate the container.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2">Contributing Factors</h4>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">High log ingestion rate from multiple sources (avg. 5000 logs/sec)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">Buffer configuration set too aggressively (128MB buffer)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="flex-1">Downstream New Relic API experiencing intermittent latency</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI-Generated Resolution Steps */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg text-gray-900">Resolution Steps</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {/* Check if it's a white noise incident */}
                  {(incident?.id?.startsWith('wn-') || incident?.id?.startsWith('wn') || incident?.resolutionType === 'auto') ? (
                    <>
                      {/* White Noise Step 1 - AI Detection */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                          <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">1</div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base text-gray-900 leading-tight">AI Detection</h4>
                                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Anomaly identified by AI monitoring</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs flex-shrink-0">Completed</Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            Anomaly observed in system signals.
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-green-600">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span>Detection completed automatically</span>
                          </div>
                        </div>
                      </div>

                      {/* White Noise Step 2 - AI Suppression */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                          <div className="flex items-start sm:items-center justify-between gap-2">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">2</div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base text-gray-900 leading-tight">AI Suppression</h4>
                                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Event classified and muted</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs flex-shrink-0">Completed</Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            Event identified as non-impacting and auto muted.
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-green-600">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span>Suppression applied successfully</span>
                          </div>
                        </div>
                      </div>

                      {/* White Noise Step 3 - Model Learning Applied */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                          <div className="flex items-start sm:items-center justify-between gap-2">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">3</div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base text-gray-900 leading-tight">Model Learning Applied</h4>
                                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">AI model updated with feedback</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs flex-shrink-0">Completed</Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            Feedback applied to improve future classification accuracy.
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-green-600">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span>Model learning completed</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Regular Incident Steps */}
                      {/* Step 1 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                          <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">1</div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base text-gray-900 leading-tight">Increase Memory Allocation</h4>
                                <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Immediate action - High priority</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px] sm:text-xs flex-shrink-0">Recommended</Badge>
                          </div>
                        </div>
                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Update the fluent-bit deployment to increase memory limits from 256Mi to 512Mi. This provides sufficient headroom for the current log volume.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 md:p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-[10px] sm:text-xs text-gray-400">kubectl command</span>
                          <button className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
                            <Copy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                        </div>
                        <pre className="text-[10px] sm:text-xs text-green-400 font-mono overflow-x-auto">
{`kubectl set resources deployment fluent-bit \\
  --namespace=logging \\
  --limits=memory=512Mi \\
  --requests=memory=256Mi`}
                        </pre>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Estimated time: 2-3 minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                      <div className="flex items-start sm:items-center justify-between gap-2">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">2</div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm sm:text-base text-gray-900 leading-tight">Optimize Buffer Configuration</h4>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Configuration optimization</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Adjust fluent-bit buffer settings to reduce memory pressure. Update the ConfigMap to implement smaller buffer chunks with more frequent flushes.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 md:p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-[10px] sm:text-xs text-gray-400">fluent-bit.conf</span>
                          <button className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
                            <Copy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                        </div>
                        <pre className="text-[10px] sm:text-xs text-green-400 font-mono overflow-x-auto">
{`[SERVICE]
    Buffer_Size         32MB
    Buffer_Max_Size     64MB
    Flush_Interval      5

[OUTPUT]
    Name                newrelic
    Match               *
    Retry_Limit         3`}
                        </pre>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Estimated time: 5-7 minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                      <div className="flex items-start sm:items-center justify-between gap-2">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">3</div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm sm:text-base text-gray-900 leading-tight">Monitor and Validate</h4>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Verification step</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Monitor the fluent-bit pod for 10-15 minutes to ensure stability. Check memory consumption stays within limits and no restart loops occur.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 md:p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-[10px] sm:text-xs text-gray-400">monitoring command</span>
                          <button className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
                            <Copy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                        </div>
                        <pre className="text-[10px] sm:text-xs text-green-400 font-mono overflow-x-auto">
{`kubectl top pod -n logging -l app=fluent-bit --watch
kubectl get events -n logging --sort-by='.lastTimestamp'`}
                        </pre>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Estimated time: 10-15 minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200">
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-600 rounded-md sm:rounded-lg flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">4</div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm sm:text-base text-gray-900 leading-tight">Implement Horizontal Scaling</h4>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">Long-term solution (Optional)</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] sm:text-xs flex-shrink-0">Optional</Badge>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        For sustained high log volumes, consider deploying multiple fluent-bit instances with load balancing to distribute the workload.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 md:p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <span className="text-[10px] sm:text-xs text-gray-400">kubectl command</span>
                          <button className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
                            <Copy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                        </div>
                        <pre className="text-[10px] sm:text-xs text-green-400 font-mono overflow-x-auto">
{`kubectl scale deployment fluent-bit \\
  --namespace=logging \\
  --replicas=3`}
                        </pre>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Estimated time: 3-5 minutes</span>
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </div>

              {/* Expected Outcome */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg text-gray-900">Expected Outcome</h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base text-gray-900 mb-1">Container Stability</h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Fluent-bit container should stop restarting and maintain stable memory usage below 400Mi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base text-gray-900 mb-1">Log Processing</h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Consistent log delivery to New Relic without backpressure or dropped messages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base text-gray-900 mb-1">Alert Resolution</h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">New Relic alert should clear within 5-10 minutes after implementation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-3 sm:pb-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Execute All Steps
                </Button>
                <Button variant="outline" className="border-gray-300 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Copy Resolution Plan</span>
                  <span className="sm:hidden">Copy Plan</span>
                </Button>
                <Button variant="outline" className="border-gray-300 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                  <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Export as Runbook</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 space-y-3 sm:space-y-4 md:space-y-5">
              {/* Timeline Header */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 text-white">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">Incident Timeline</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">Complete chronological history of this incident</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 sm:left-5 md:left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline Events */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Event 1 - Incident Detected */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="absolute left-4 sm:left-5 md:left-6 w-0.5 h-full bg-gray-200 top-10 sm:top-11 md:top-12"></div>
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Incident Detected</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:47:23 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px] sm:text-xs flex-shrink-0">CRITICAL</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        New Relic alert triggered: "fluent-bit query result is {'>'} 0.0 for 5 minutes on 'Container is Restarting'"
                      </p>
                      <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Alert ID:</span>
                            <span className="text-gray-900 break-all">c4ac9402-e95a</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Source:</span>
                            <span className="text-gray-900">New Relic APM</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Affected Pods:</span>
                            <span className="text-gray-900">3 pods</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Namespace:</span>
                            <span className="text-gray-900">logging</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 2 - AI Analysis Started */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">AI Analysis Initiated</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:47:28 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] sm:text-xs flex-shrink-0">AUTO</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        AI Assistant automatically initiated root cause analysis and began gathering diagnostic data from multiple sources.
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <BarChart className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="break-words">Analyzed 15,000+ log entries across 12 data sources</span>
                      </div>
                    </div>
                  </div>

                  {/* Event 3 - Incident Acknowledged */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Incident Acknowledged</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:48:15 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 text-[10px] sm:text-xs flex-shrink-0">MANUAL</Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-900">Aakash Mishra</p>
                          <p className="text-[10px] sm:text-xs text-gray-600">Senior DevOps Engineer</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Incident acknowledged and assigned to DevOps team for immediate investigation.
                      </p>
                    </div>
                  </div>

                  {/* Event 4 - Root Cause Identified */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Lightbulb className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Root Cause Identified</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:49:42 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] sm:text-xs flex-shrink-0">AI ANALYSIS</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        AI analysis identified memory exhaustion as the primary cause. Container memory consumption exceeded 256Mi limit, triggering OOMKiller.
                      </p>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 sm:p-3">
                        <div className="text-[10px] sm:text-xs space-y-1 sm:space-y-1.5">
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 break-words">Memory usage: 287Mi / 256Mi (112%)</span>
                          </div>
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 break-words">OOMKiller events: 12 in last 30 minutes</span>
                          </div>
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 break-words">Log ingestion rate: 5,247 logs/sec</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 5 - Resolution Plan Generated */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <FileCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Resolution Plan Generated</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:50:18 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700 border-0 text-[10px] sm:text-xs flex-shrink-0">AI GENERATED</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        AI Assistant created a 4-step resolution plan with 94.5% predicted success rate based on historical data.
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <div className="bg-gray-50 rounded p-1.5 sm:p-2 border border-gray-200">
                          <div className="text-gray-600 mb-0.5 sm:mb-1">Steps</div>
                          <div className="text-gray-900">4 steps</div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 sm:p-2 border border-gray-200">
                          <div className="text-gray-600 mb-0.5 sm:mb-1">Est. Time</div>
                          <div className="text-gray-900">12-15 min</div>
                        </div>
                        <div className="bg-gray-50 rounded p-1.5 sm:p-2 border border-gray-200">
                          <div className="text-gray-600 mb-0.5 sm:mb-1">Confidence</div>
                          <div className="text-green-600">High</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 6 - Configuration Updated */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Configuration Updated</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:52:34 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px] sm:text-xs flex-shrink-0">ACTION</Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-900">Aakash Mishra</p>
                          <p className="text-[10px] sm:text-xs text-gray-600">Applied Step 1 of resolution plan</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        Increased fluent-bit container memory limits from 256Mi to 512Mi via kubectl deployment update.
                      </p>
                      <div className="bg-gray-900 rounded-lg p-2.5 sm:p-3 overflow-x-auto">
                        <pre className="text-[10px] sm:text-xs text-green-400 font-mono">
{`$ kubectl set resources deployment fluent-bit \\
  --namespace=logging --limits=memory=512Mi`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Event 7 - Buffer Configuration Optimized */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-cyan-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Wrench className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Buffer Configuration Optimized</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:55:18 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-cyan-100 text-cyan-700 border-0 text-[10px] sm:text-xs flex-shrink-0">ACTION</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        Updated fluent-bit ConfigMap to reduce buffer size and increase flush frequency. Applied Step 2 of resolution plan.
                      </p>
                      <div className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="break-words">ConfigMap updated and pods reloaded successfully</span>
                      </div>
                    </div>
                  </div>

                  {/* Event 8 - Monitoring Phase */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <Activity className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Monitoring Phase Started</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 09:56:02 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px] sm:text-xs flex-shrink-0">MONITORING</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        Initiated 15-minute monitoring window to validate configuration changes and ensure container stability.
                      </p>
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 sm:p-3">
                        <div className="text-[10px] sm:text-xs space-y-1 sm:space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-700">Memory usage:</span>
                            <span className="text-teal-700 flex-shrink-0">342Mi / 512Mi (67%)</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-700">Container restarts:</span>
                            <span className="text-green-600 flex-shrink-0">0 restarts</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-700">Log throughput:</span>
                            <span className="text-teal-700 flex-shrink-0">4,986 logs/sec</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 9 - Comment Added */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Comment Added</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 10:08:45 AM PST</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-900">Aakash Mishra</p>
                          <p className="text-[10px] sm:text-xs text-gray-600">DevOps Engineer</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                          "Memory configuration changes applied successfully. Pod has been stable for 12 minutes with no restarts. Memory usage stabilized at ~67%. Will continue monitoring for another 30 minutes before closing."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event 10 - Incident Resolved */}
                  <div className="relative flex gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center z-10 ring-2 sm:ring-4 ring-white">
                      <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm bg-green-50/30 min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-gray-900 mb-0.5 sm:mb-1">Incident Resolved</h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            <span className="truncate">Oct 28, 2025 • 10:11:23 AM PST</span>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white border-0 text-[10px] sm:text-xs flex-shrink-0">RESOLVED</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                        Incident marked as resolved after successful validation. All metrics returned to normal levels and alert was automatically cleared in New Relic.
                      </p>
                      <div className="bg-white border border-green-300 rounded-lg p-2.5 sm:p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Total Duration:</span>
                            <span className="text-gray-900">24 minutes</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Resolution Time:</span>
                            <span className="text-gray-900">14 minutes</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Actions Taken:</span>
                            <span className="text-gray-900">2 of 4 steps</span>
                          </div>
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-gray-600">Auto-Resolution:</span>
                            <span className="text-green-600">Partial</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
                <h3 className="text-sm sm:text-base md:text-lg text-gray-900 mb-3 sm:mb-4">Timeline Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">24m</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Total Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">10</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Timeline Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl text-gray-900 mb-0.5 sm:mb-1">3</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Manual Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl text-green-600 mb-0.5 sm:mb-1">100%</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              {/* Related Resources Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-5 md:p-6 text-white">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-base sm:text-lg mb-1">Related Resources</h3>
                    <p className="text-xs sm:text-sm text-white/80">Infrastructure components connected to this incident</p>
                  </div>
                </div>
              </div>

              {/* Related Resources List */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">Affected Resources</h3>
                
                {/* Resource 1 - RDS Database */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">atlas-api-manager-rds</h4>
                      <p className="text-sm text-gray-600">RDS Instance • db.m5.large</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Resource 2 - Application Service */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">atlas-api-service</h4>
                      <p className="text-sm text-gray-600">Application Service</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Resource 3 - Container */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Container className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">fluent-bit-7d8c9f4b</h4>
                      <p className="text-sm text-gray-600">Kubernetes Pod • logging namespace</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Resource 4 - Load Balancer */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Network className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">api-gateway-lb</h4>
                      <p className="text-sm text-gray-600">Application Load Balancer • us-east-1</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Resource 5 - ConfigMap */}
                <div className="bg-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">fluent-bit-config</h4>
                      <p className="text-sm text-gray-600">ConfigMap • logging namespace</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Related Incidents */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg text-gray-900 pb-2 border-b border-gray-200">Similar Incidents</h3>
                
                {/* Incident 1 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">High Memory Usage - Logging Service</h4>
                        <p className="text-xs text-gray-600 mb-2">Similar incident from 5 days ago</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-50 text-xs">HIGH</Badge>
                          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-xs">RESOLVED</Badge>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Resolution Time:</span>
                        <span className="text-gray-900 ml-2">18 minutes</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Root Cause:</span>
                        <span className="text-gray-900 ml-2">Memory leak</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incident 2 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">Container Restart Loop - Fluent-bit</h4>
                        <p className="text-xs text-gray-600 mb-2">Similar incident from 12 days ago</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50 text-xs">CRITICAL</Badge>
                          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-xs">RESOLVED</Badge>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Resolution Time:</span>
                        <span className="text-gray-900 ml-2">32 minutes</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Root Cause:</span>
                        <span className="text-gray-900 ml-2">Config error</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incident 3 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">Buffer Overflow - Log Processing</h4>
                        <p className="text-xs text-gray-600 mb-2">Similar incident from 18 days ago</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50 text-xs">MEDIUM</Badge>
                          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-xs">RESOLVED</Badge>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Resolution Time:</span>
                        <span className="text-gray-900 ml-2">12 minutes</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Root Cause:</span>
                        <span className="text-gray-900 ml-2">Buffer size</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Documentation */}
              <div className="space-y-3">
                <h3 className="text-gray-900 pb-2 border-b border-gray-200">Related Documentation</h3>
                
                {/* Doc 1 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">Fluent Bit Memory Optimization Guide</h4>
                      <p className="text-sm text-gray-600">Configuration best practices • Updated 2 weeks ago</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Doc 2 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">Kubernetes Resource Limits Runbook</h4>
                      <p className="text-sm text-gray-600">Troubleshooting guide • Updated 1 month ago</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Doc 3 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1">New Relic Integration Setup</h4>
                      <p className="text-sm text-gray-600">Integration documentation • Updated 3 weeks ago</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-gray-900 mb-4">Relationship Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl text-gray-900 mb-1">5</div>
                    <div className="text-xs text-gray-600">Affected Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-gray-900 mb-1">3</div>
                    <div className="text-xs text-gray-600">Similar Incidents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-gray-900 mb-1">3</div>
                    <div className="text-xs text-gray-600">Related Docs</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* RCA Modal */}
    <Dialog open={showRCAModal} onOpenChange={setShowRCAModal}>
      <DialogContent className="w-[96vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[1200px] min-w-[80vw] h-[92vh] sm:h-[88vh] md:h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#AE275F]" />
            Root Cause Analysis
          </DialogTitle>
          <DialogDescription>
            Review and modify the RCA details before generating the final document
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5">
          <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            {isEditingRCA ? (
              <input
                type="text"
                value={rcaDetails.title}
                onChange={(e) => setRcaDetails({...rcaDetails, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {rcaDetails.title}
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.summary}
                onChange={(e) => setRcaDetails({...rcaDetails, summary: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {rcaDetails.summary}
              </div>
            )}
          </div>

          {/* Root Cause */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Root Cause
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.rootCause}
                onChange={(e) => setRcaDetails({...rcaDetails, rootCause: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {rcaDetails.rootCause}
              </div>
            )}
          </div>

          {/* Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impact Analysis
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.impact}
                onChange={(e) => setRcaDetails({...rcaDetails, impact: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 whitespace-pre-line">
                {rcaDetails.impact}
              </div>
            )}
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution Steps
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.resolution}
                onChange={(e) => setRcaDetails({...rcaDetails, resolution: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {rcaDetails.resolution}
              </div>
            )}
          </div>

          {/* Preventive Measures */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preventive Measures
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.preventiveMeasures}
                onChange={(e) => setRcaDetails({...rcaDetails, preventiveMeasures: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 whitespace-pre-line">
                {rcaDetails.preventiveMeasures}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Timeline
            </label>
            {isEditingRCA ? (
              <textarea
                value={rcaDetails.timeline}
                onChange={(e) => setRcaDetails({...rcaDetails, timeline: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F]"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 whitespace-pre-line">
                {rcaDetails.timeline}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Modal Footer with Buttons */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowRCAModal(false)}
            className="px-5"
          >
            Cancel
          </Button>
          {isEditingRCA ? (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-5"
              onClick={() => {
                setIsEditingRCA(false);
                toast.success('RCA details saved!', {
                  description: 'You can now generate the final RCA document.',
                  duration: 2000,
                });
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 px-5"
                onClick={() => setIsEditingRCA(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Modify
              </Button>
              <Button
                className="bg-[#AE275F] hover:bg-[#8B1F4D] text-white px-5"
                onClick={() => {
                  setShowRCAModal(false);
                  toast.success('RCA document generated successfully!', {
                    description: 'The Root Cause Analysis document is ready for download.',
                    duration: 3000,
                  });
                  // Here you would typically trigger the download
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Final RCA
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
