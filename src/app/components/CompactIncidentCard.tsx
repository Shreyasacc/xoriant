import React from 'react';
import { AlertTriangle, Bot, Eye, RefreshCw, Clock, Cloud, Activity, TrendingUp, TrendingDown, Gauge, Lightbulb, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ProviderLogo } from './molecules/ProviderLogo';
import { useAIAssistant } from '../contexts/AIAssistantContext';

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
}

interface CompactIncidentCardProps {
  incident: Incident;
  onViewDetails: (incident: Incident) => void;
}

export function CompactIncidentCard({ incident, onViewDetails }: CompactIncidentCardProps) {
  const { openAIAssistant } = useAIAssistant();
  
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

  const severityColors = getSeverityColor(incident.severity);

  return (
    <Card 
      className="overflow-hidden border-l-4 hover:shadow-xl transition-all duration-300 rounded-lg group relative bg-white"
      style={{
        borderLeftColor: incident.severity === 'critical' ? '#EF4444' : 
                    incident.severity === 'high' ? '#F97316' : 
                    incident.severity === 'medium' ? '#EAB308' : '#3B82F6'
      }}
    >
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Left: Title, Provider, Account */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                incident.severity === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                incident.severity === 'high' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                incident.severity === 'medium' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 mb-2 break-words">{incident.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge className={`${severityColors.bg} ${severityColors.border} ${severityColors.text} border px-2 py-0.5`}>
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </Badge>
                  <Badge className={`${
                    incident.status === 'open' ? 'bg-red-100 text-red-700 border-red-300' :
                    incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  } border px-2 py-0.5`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    {incident.timestamp}
                  </div>
                </div>
              </div>
            </div>

            {/* Provider & Account - Inline */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 ml-13">
              <div className="flex items-center gap-2">
                <ProviderLogo provider={incident.provider} size="sm" />
                <span>{incident.provider} · {incident.service}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-gray-400" />
                <span>{incident.accountName}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Account:</span>
                <span className="font-mono text-gray-900">{incident.accountNo}</span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={openAIAssistant}
                    className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <Bot className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Diagnose</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => onViewDetails(incident)}
                    className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Details</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2.5 bg-gradient-to-br from-[#AE275F] to-[#8B1F4C] hover:from-[#8B1F4C] hover:to-[#6B1739] text-[rgb(255,255,253)] rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rerun Analysis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* AI Analysis - Compact */}
        <div className="bg-white border border-purple-200 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2 mb-2">
            <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-purple-600 mb-1">AI Root Cause Analysis</p>
              <p className="text-sm text-gray-900">{incident.probableCause}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-purple-200">
              <Zap className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-purple-600">{incident.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Metrics - Compact Inline */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Read IOPS:</span>
            <span className="text-gray-900">2.03</span>
            <TrendingUp className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-600">+40%</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">Write:</span>
            <span className="text-gray-900">1.5</span>
            <TrendingDown className="w-3 h-3 text-red-600" />
            <span className="text-xs text-red-600">-10%</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">Conn:</span>
            <span className="text-gray-900">285/300</span>
          </div>
        </div>

        {/* Recommendation - Compact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-blue-600 mb-0.5">Recommended Action</p>
              <p className="text-sm text-blue-900">{incident.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}