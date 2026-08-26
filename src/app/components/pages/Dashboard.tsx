import React from "react";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Bot,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Activity,
  Calendar,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PageContainer } from "../layouts/PageContainer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import teamsLogo from "figma:asset/4be1a8225ecf8a2669411e4f97be7a3b5b957133.png";
import dynatraceLogo from "figma:asset/f392b5fed600a49d6be38c9234ecd7a2726324b4.png";
import grafanaLogo from "figma:asset/946d1752e29f4dbac5427cc1ea61d13fdc4cde9a.png";
import slackLogo from "figma:asset/403126d7a1277ba6f757fd200ce86210572c9225.png";
import awsLogo from "figma:asset/842f305051c82d7ab507109953a37071407a4919.png";
import newRelicLogo from "figma:asset/f5be67c5add83eb44775fbaa35e394d80180aed6.png";
import gcpLogo from "figma:asset/13add375e3a2db3f7db7cbae5b934507fb50dc5a.png";
import azureLogo from "figma:asset/d33531d236b10313b9671afe2f89ffc6853e67ba.png";
import signozLogo from "figma:asset/775d64cdd6d020ce8063d4b94354949955d28626.png";

interface DashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Dashboard({
  onNavigate,
  onLogout,
}: DashboardProps) {
  const [selectedSeverities, setSelectedSeverities] = React.useState<string[]>([
    "Critical",
    "High",
    "Medium",
    "Low",
  ]);
  const [timeView, setTimeView] = React.useState<"Daily" | "Weekly">("Weekly");
  const [dateRange, setDateRange] = React.useState<string>("Last 30 days");
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);

  const dateRangeOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last 1 month",
    "Custom date",
  ];

  // Weekly Incident Trends Data
  const weeklyIncidentTrends = [
    { week: "Week 1", Critical: 40, High: 105, Medium: 75, Low: 35 },
    { week: "Week 2", Critical: 45, High: 110, Medium: 85, Low: 38 },
    { week: "Week 3", Critical: 35, High: 95, Medium: 70, Low: 40 },
    { week: "Week 4", Critical: 50, High: 125, Medium: 95, Low: 45 },
  ];

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity],
    );
  };

  // Mock data for incidents table
  const activeIncidents = [
    {
      id: 1,
      incident: "Payment Gateway Timeout",
      severity: "critical",
      provider: "AWS",
      status: "Investigating",
      eta: "15 mins",
    },
    {
      id: 2,
      incident: "Database Connection Pool Full",
      severity: "warning",
      provider: "Azure",
      status: "In Progress",
      eta: "30 mins",
    },
    {
      id: 3,
      incident: "API Rate Limit Exceeded",
      severity: "warning",
      provider: "AWS",
      status: "Monitoring",
      eta: "10 mins",
    },
  ];

  const upcomingRisks = [
    {
      title: "API Key expiring in 7 days",
      description: "Production AWS key needs renewal",
      color: "border-l-orange-500",
    },
    {
      title: "Database backup overdue",
      description: "Last backup was 36 hours ago",
      color: "border-l-red-500",
    },
    {
      title: "SSL Certificate renewal due",
      description: "Expires in 14 days",
      color: "border-l-yellow-500",
    },
  ];

  const incidentTrendData = [
    { day: "Mon", critical: 2, warning: 5, info: 8 },
    { day: "Tue", critical: 1, warning: 3, info: 6 },
    { day: "Wed", critical: 4, warning: 8, info: 12 },
    { day: "Thu", critical: 2, warning: 4, info: 7 },
    { day: "Fri", critical: 5, warning: 9, info: 15 },
    { day: "Sat", critical: 1, warning: 2, info: 4 },
    { day: "Sun", critical: 1, warning: 3, info: 5 },
  ];

  const costSavingsData = [
    { month: "Jan", savings: 1800 },
    { month: "Feb", savings: 2100 },
    { month: "Mar", savings: 1600 },
    { month: "Apr", savings: 2400 },
    { month: "May", savings: 1900 },
    { month: "Jun", savings: 2600 },
    { month: "Jul", savings: 2200 },
    { month: "Aug", savings: 2900 },
    { month: "Sep", savings: 2400 },
    { month: "Oct", savings: 3100 },
    { month: "Nov", savings: 2700 },
    { month: "Dec", savings: 3300 },
  ];

  // AI Auto-Resolved Incidents by Type
  const aiResolvedIncidents = [
    { name: "Network", value: 5, color: "#3b82f6" },
    { name: "Database", value: 4, color: "#8b5cf6" },
    { name: "API", value: 3, color: "#06b6d4" },
    { name: "CPU", value: 2, color: "#10b981" },
  ];

  const topImpactCategories = [
    { name: "Database", value: 85, color: "bg-red-500" },
    { name: "Network", value: 72, color: "bg-orange-500" },
    { name: "CPU", value: 58, color: "bg-yellow-500" },
    { name: "Firewall", value: 45, color: "bg-blue-500" },
    { name: "API", value: 32, color: "bg-purple-500" },
  ];

  // Integration Tools Activity Data
  const integrationTools = [
    {
      name: "New Relic",
      status: "Connected",
      incidents: 45,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-600",
      icon: "📊",
      logo: newRelicLogo,
    },
    {
      name: "Grafana",
      status: "Connected",
      incidents: 32,
      statusColor: "bg-green-500",
      topStroke: "bg-orange-500",
      icon: "📈",
      logo: grafanaLogo,
    },
    {
      name: "Dynatrace",
      status: "Syncing",
      incidents: 28,
      statusColor: "bg-blue-500",
      topStroke: "bg-purple-600",
      icon: "🔍",
      logo: dynatraceLogo,
    },
    {
      name: "Teams",
      status: "Connected",
      incidents: 18,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-500",
      icon: "👥",
      logo: teamsLogo,
    },
    {
      name: "Slack",
      status: "Connected",
      incidents: 22,
      statusColor: "bg-green-500",
      topStroke: "bg-purple-500",
      icon: "💬",
      logo: slackLogo,
    },
    {
      name: "AWS",
      status: "Connected",
      incidents: 56,
      statusColor: "bg-green-500",
      topStroke: "bg-orange-500",
      icon: "☁️",
      logo: awsLogo,
    },
    {
      name: "GCP",
      status: "Connected",
      incidents: 30,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-500",
      icon: "☁️",
      logo: gcpLogo,
    },
    {
      name: "Azure",
      status: "Connected",
      incidents: 40,
      statusColor: "bg-green-500",
      topStroke: "bg-blue-600",
      icon: "☁️",
      logo: azureLogo,
    },
    {
      name: "SigNoz",
      status: "Connected",
      incidents: 25,
      statusColor: "bg-green-500",
      topStroke: "bg-red-500",
      icon: "📊",
      logo: signozLogo,
    },
  ];

  // Cloud Provider Overview Data
  const cloudProviders = [
    {
      name: "AWS",
      logo: awsLogo,
      activeIncidents: 12,
      topServices: ["EC2", "S3", "Lambda"],
      topService: "EC2",
      color: "bg-orange-500",
    },
    {
      name: "Azure",
      logo: azureLogo,
      activeIncidents: 8,
      topServices: ["App Service", "SQL Database", "Functions"],
      topService: "App Service",
      color: "bg-blue-500",
    },
    {
      name: "GCP",
      logo: gcpLogo,
      activeIncidents: 5,
      topServices: ["Compute Engine", "Cloud Storage", "Cloud Functions"],
      topService: "Compute Engine",
      color: "bg-green-500",
    },
    {
      name: "Other",
      logo: null,
      activeIncidents: 3,
      topServices: ["On-Premise", "CDN", "Third-party APIs"],
      topService: "On-Premise",
      color: "bg-gray-500",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <DashboardLayout
      currentPage="dashboard"
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
                Operational Health Overview
              </h1>
              <p className="text-white/90 text-sm">
                Real-time visibility into system performance, AI driven optimization, and incident impact on your environment.
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
            {/* Total Incidents */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Total Incidents
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  247
                </div>
              </div>
              <div className="text-xs text-gray-600">
                ↑ 12% from last week
              </div>
            </div>

            {/* Avg Resolution Time */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Avg Resolution Time
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  18min
                </div>
              </div>
              <div className="text-xs text-gray-600">
                ↓ 8min improvement
              </div>
            </div>

            {/* AI Accuracy */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  AI Accuracy
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  94.2%
                </div>
              </div>
              <div className="text-xs text-gray-600">
                ↑ 2.1% this month
              </div>
            </div>

            {/* Service Uptime */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Service Uptime
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900">
                  99.97%
                </div>
              </div>
              <div className="text-xs text-gray-600">
                Last 30 days
              </div>
            </div>

            {/* Business Impact Score */}
            <div className="bg-white rounded-lg p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Business Impact Score
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl text-gray-900 text-[24px]">
                  Low Impact
                </div>
              </div>
              <div className="text-xs text-gray-600">
                ↓ 6% last month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Trends Graph */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-gray-900">Incident Trends</h2>
              <p className="text-sm text-gray-500">
                Incident volume over time by severity
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Filter Buttons */}
              <button
                onClick={() => toggleSeverity("Critical")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedSeverities.includes("Critical")
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => toggleSeverity("High")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedSeverities.includes("High")
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                High
              </button>
              <button
                onClick={() => toggleSeverity("Medium")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedSeverities.includes("Medium")
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => toggleSeverity("Low")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedSeverities.includes("Low")
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Low
              </button>
              
              {/* Time View Buttons */}
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => setTimeView("Daily")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    timeView === "Daily"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeView("Weekly")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    timeView === "Weekly"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>
          
          {/* Area Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyIncidentTrends}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  stroke="#e5e7eb"
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  stroke="#e5e7eb"
                  domain={[0, 140]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                  iconType="line"
                />
                {selectedSeverities.includes("Critical") && (
                  <Area
                    type="monotone"
                    dataKey="Critical"
                    stroke="#dc2626"
                    strokeWidth={2}
                    fill="url(#colorCritical)"
                    fillOpacity={1}
                  />
                )}
                {selectedSeverities.includes("High") && (
                  <Area
                    type="monotone"
                    dataKey="High"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#colorHigh)"
                    fillOpacity={1}
                  />
                )}
                {selectedSeverities.includes("Medium") && (
                  <Area
                    type="monotone"
                    dataKey="Medium"
                    stroke="#eab308"
                    strokeWidth={2}
                    fill="url(#colorMedium)"
                    fillOpacity={1}
                  />
                )}
                {selectedSeverities.includes("Low") && (
                  <Area
                    type="monotone"
                    dataKey="Low"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fill="url(#colorLow)"
                    fillOpacity={1}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <PageContainer maxWidth="7xl" padding="md">
        <div className="space-y-6">
          {/* Second Row - AI Value Section (2 large cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Optimization */}
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-4xl text-gray-900 text-[24px] font-normal">
                  $24,500 Saved
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                AI Automatically prevented compute/storage cost
              </div>
              {/* Recharts Mini Bar Chart */}
              <div className="h-20 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costSavingsData}>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [
                        `$${value.toLocaleString()}`,
                        "Savings",
                      ]}
                      cursor={{
                        fill: "rgba(34, 197, 94, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="savings"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Auto Resolution */}
            <div className="bg-white rounded-lg border border-blue-200 p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">
                  AI Powered
                </Badge>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="text-4xl text-gray-900 text-[24px]">
                      14 incidents
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    solved automatically
                    <br />
                    Reduced manual effort & MTTR
                  </div>
                  <button
                    onClick={() => onNavigate?.("whitenoise")}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Pie Chart */}
                <div className="w-28 h-28">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={aiResolvedIncidents}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {aiResolvedIncidents.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                        formatter={(value: any, name: any) => [
                          `${value} incidents`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 gap-2">
                {aiResolvedIncidents.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-700">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third Row - Charts Block (2 panels) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cloud Provider Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-gray-900 mb-1">
                  Cloud Provider Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Multi-cloud incident tracking across providers
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cloudProviders.map((provider) => (
                  <div
                    key={provider.name}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Colored Top Bar */}
                    <div className={`h-2 ${provider.color}`} />
                    
                    {/* Card Content */}
                    <div className="p-4">
                      {/* Logo and Provider Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center h-10 w-10">
                          {provider.logo ? (
                            <img 
                              src={provider.logo} 
                              alt={`${provider.name} logo`}
                              className="h-10 w-10 object-contain"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                              <Activity className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-gray-900">
                            {provider.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Cloud Provider
                          </p>
                        </div>
                      </div>
                      
                      {/* Active Incidents Row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-700">Active Incidents</span>
                        <div className="bg-red-50 text-red-700 px-3 py-1 rounded-lg">
                          {provider.activeIncidents}
                        </div>
                      </div>
                      
                      {/* Top Affected Service Row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-700">Top Affected Service</span>
                        <span className="text-gray-900">
                          {provider.topService}
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-900 border-gray-300 hover:bg-gray-50"
                        onClick={() => onNavigate?.("incidents")}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Tools Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-gray-900">
                  Integration Tools Activity
                </h3>
                <p className="text-sm text-gray-500">
                  Real-time monitoring tool connections and incident detection
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {integrationTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Colored Top Stroke */}
                    <div className={`h-2 ${tool.topStroke}`} />
                    
                    {/* Card Content */}
                    <div className="p-4 relative">
                      {/* Status Indicator */}
                      <div className={`absolute top-3 right-3 w-2.5 h-2.5 ${tool.statusColor} rounded-full`} />
                      
                      {/* Icon or Logo */}
                      <div className="mb-3 flex items-center justify-center h-6 w-6">
                        {tool.logo ? (
                          <img 
                            src={tool.logo} 
                            alt={`${tool.name} logo`}
                            className="h-6 w-6 object-contain"
                          />
                        ) : (
                          <div className="text-3xl">{tool.icon}</div>
                        )}
                      </div>
                      
                      {/* Tool Name & Status */}
                      <h4 className="text-gray-900 mb-1">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {tool.status}
                      </p>
                      
                      {/* Incident Count */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-xs text-gray-500">Today</span>
                        <Badge className="bg-white text-gray-900 border-gray-300 border text-xs px-2 py-0.5">
                          {tool.incidents} incidents
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fourth Row - Active Incidents Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                Active Incidents
              </h3>
            </div>
            {activeIncidents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        Incident
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        ETA Resolution
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeIncidents.map((incident) => (
                      <tr
                        key={incident.id}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {incident.incident}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${getSeverityColor(incident.severity)} border`}
                          >
                            {incident.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {incident.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {incident.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {incident.eta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">
                  No new customer-impacting incidents currently.
                  Everything is running smoothly.
                </p>
              </div>
            )}
          </div>

          {/* Fifth Row - Upcoming Risks (3 cards) */}
          <div>
            <h3 className="text-gray-900 mb-4">
              Upcoming Risks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingRisks.map((risk, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg border border-gray-200 p-4 border-l-4 ${risk.color} h-[120px] flex flex-col justify-between`}
                >
                  <div>
                    <h4 className="text-gray-900 mb-1">
                      {risk.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {risk.description}
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start">
                    Review now
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}