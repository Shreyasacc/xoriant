import React from "react";
import {
  Server,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Network,
  Lock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Shield,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ResourceDetailModalProps {
  resource: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceDetailModal({
  resource,
  isOpen,
  onClose,
}: ResourceDetailModalProps) {
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

  const getBackupBadge = (backup: string) => {
    if (backup === "Enabled") {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (backup === "N/A") {
      return "bg-gray-100 text-gray-500 border-gray-300";
    }
    return "bg-orange-100 text-orange-700 border-orange-300";
  };

  // Mock data for sparkline
  const costTrendData = [
    { v: 120 },
    { v: 140 },
    { v: 135 },
    { v: 150 },
    { v: 145 },
    { v: 160 },
    { v: 155 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[1200px] min-w-[80vw] h-[92vh] sm:h-[88vh] md:h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#AE275F]" />
            Resource Details - {resource.service}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the resource, including cost, performance, security, and activity logs.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 mx-4 sm:mx-5 md:mx-6 mt-3 sm:mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cost">Cost & Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
            {/* TAB 1: Overview */}
            <TabsContent value="overview" className="space-y-4 mt-4 data-[state=inactive]:hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Service Name</span>
                    <span className="text-sm text-gray-900">{resource.service}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Service ID/ARN</span>
                    <span className="text-xs text-gray-900 font-mono">
                      arn:aws:{resource.category.toLowerCase()}:{resource.region}:123456789012
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Service Type</span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">
                      {resource.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Environment</span>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">
                      {resource.tags.includes("Production") ? "Production" : "Staging"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Region</span>
                    <span className="text-sm text-gray-900">{resource.region}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Owner / Team</span>
                    <span className="text-sm text-gray-900">DevOps Team</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Created Date</span>
                    <span className="text-sm text-gray-900">Nov 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Current State</span>
                    <Badge className={`${getStatusColor(resource.status)} border`}>
                      {resource.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Green</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Service Dependencies</span>
                    <span className="text-sm text-gray-900">{resource.resources} linked services</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Business Criticality</span>
                    <Badge className="bg-red-100 text-red-700 border-red-300 border">High</Badge>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-xs text-gray-700">
                      Primary purpose: {resource.tags[0]} environment {resource.category} service
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Cost & Usage */}
            <TabsContent value="cost" className="space-y-4 mt-4 data-[state=inactive]:hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Current Monthly Cost</span>
                  </div>
                  <div className="text-2xl text-gray-900">$342.50</div>
                  <div className="text-xs text-gray-600 mb-2">Last 30 days trend</div>
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costTrendData}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Forecast Next Month</span>
                  </div>
                  <div className="text-2xl text-gray-900">$389.75</div>
                  <div className="text-xs text-gray-600 mt-1">13.7% increase projected</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-900 mb-3">Cost by Category</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Compute Cost</span>
                    </div>
                    <span className="text-sm text-gray-900">$220.00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Storage Cost</span>
                    </div>
                    <span className="text-sm text-gray-900">$85.50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Network Cost</span>
                    </div>
                    <span className="text-sm text-gray-900">$37.00</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-900">Optimization Recommendations</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-700">
                    • <span className="">Idle Utilization Detected:</span> 42% idle time over last 7 days
                  </div>
                  <div className="text-xs text-gray-700">
                    • <span className="">Right-Size Suggestion:</span> Downgrade to t3.medium (Save ~$95/month)
                  </div>
                  <div className="text-xs text-gray-700">
                    • <span className="">RI/SP Savings:</span> $58/month potential savings with Reserved Instances
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-900 mb-3">Historical Spend (Last 3 Months)</h4>
                <div className="flex items-end gap-2 h-24">
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: "65%" }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: "80%" }}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{ height: "100%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>September</span>
                  <span>October</span>
                  <span>November</span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Performance Metrics */}
            <TabsContent value="performance" className="space-y-4 mt-4 data-[state=inactive]:hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">CPU Usage (Last 24h)</span>
                  </div>
                  <div className="text-xl text-gray-900">Avg: 45% | Peak: 78%</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Memory Usage (Last 24h)</span>
                  </div>
                  <div className="text-xl text-gray-900">Avg: 62% | Peak: 85%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Disk IOPS</span>
                  <span className="text-sm text-gray-900">1,450 ops/sec</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Network I/O</span>
                  <span className="text-sm text-gray-900">In: 1.2 MB/s | Out: 2.4 MB/s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Latency (Avg)</span>
                  <span className="text-sm text-gray-900">45ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm text-green-600">0.02%</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-900 mb-3">Last 5 Operational Incidents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">High CPU spike detected</span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Memory threshold warning (resolved)</span>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Network latency spike (resolved)</span>
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900">SLO/Performance Compliance</span>
                </div>
                <div className="text-2xl text-green-600">99.8%</div>
                <div className="text-xs text-gray-600 mt-1">Above target of 99.5%</div>
              </div>
            </TabsContent>

            {/* TAB 4: Security & Access */}
            <TabsContent value="security" className="space-y-4 mt-4 data-[state=inactive]:hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">IAM Roles Attached</span>
                    <span className="text-sm text-gray-900">EC2-Admin-Role</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Policies Mapped</span>
                    <span className="text-sm text-gray-900">3 policies</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Security Groups</span>
                    <span className="text-xs text-gray-900 font-mono">sg-0a1b2c3d4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Public/Private Access</span>
                    <Badge className="bg-green-100 text-green-700 border-green-300 border">
                      Private
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Encryption Enabled</span>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Yes (AES-256)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Backup Enabled</span>
                    <Badge className={`${getBackupBadge(resource.backup)} border`}>
                      {resource.backup}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Compliance Labels</span>
                    <span className="text-sm text-gray-900">ISO 27001, SOC2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Accessed</span>
                    <span className="text-sm text-gray-900">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900">Port Exposure</span>
                </div>
                <div className="text-xs text-gray-700">
                  Ports 22, 80, 443 - Restricted to VPC only (10.0.0.0/16)
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900">Vulnerability Scan Result</span>
                </div>
                <div className="text-xs text-green-700">
                  Last scan: Nov 5, 2024 - No critical issues found
                </div>
                <div className="text-xs text-gray-600 mt-1">Next scan scheduled: Nov 12, 2024</div>
              </div>
            </TabsContent>

            {/* TAB 5: Activity / Change Log */}
            <TabsContent value="activity" className="space-y-4 mt-4 data-[state=inactive]:hidden">
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Last 10 Configuration Changes</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Instance type changed</span>
                      <span className="text-xs text-gray-500">Nov 6, 2024 14:32</span>
                    </div>
                    <div className="text-xs text-gray-600">Changed from t3.large to t3.xlarge</div>
                    <div className="text-xs text-gray-500 mt-1">
                      By: admin@company.com (IAM: arn:aws:iam::123456789012:user/admin)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Backup policy updated</span>
                      <span className="text-xs text-gray-500">Nov 4, 2024 09:15</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Daily backups enabled with 30-day retention policy
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      By: devops@company.com (IAM: arn:aws:iam::123456789012:user/devops)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Security group modified</span>
                      <span className="text-xs text-gray-500">Nov 2, 2024 16:45</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Added inbound rule for port 8080 (restricted to 10.0.1.0/24)
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      By: security@company.com (IAM: arn:aws:iam::123456789012:user/security)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">Tags updated</span>
                      <span className="text-xs text-gray-500">Oct 30, 2024 11:20</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Added tags: Environment=Production, CostCenter=Engineering
                    </div>
                    <div className="text-xs text-gray-500 mt-1">By: admin@company.com</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-900 mb-3">Resource State Transitions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Instance restarted</span>
                    </div>
                    <span className="text-xs text-gray-500">Nov 6, 2024 14:35</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Auto-scaling triggered (scaled up)</span>
                    </div>
                    <span className="text-xs text-gray-500">Nov 3, 2024 09:42</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">Stopped for maintenance</span>
                    </div>
                    <span className="text-xs text-gray-500">Oct 28, 2024 23:00</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-900 mb-3">Backup Lifecycle Activities</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Daily backup completed</span>
                    </div>
                    <span className="text-xs text-gray-500">Today, 02:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Snapshot created successfully</span>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday, 02:00 AM</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-900 mb-3">Alert Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">CPU threshold exceeded (78%)</span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Backup completed successfully</span>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Security scan passed</span>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}