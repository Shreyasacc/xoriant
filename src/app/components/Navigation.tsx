import logo from 'figma:asset/f11b2ccbc5edb6bf832b728e2ab91c617da855fb.png';
import { ChevronDown, Home, Server, DollarSign, Activity, BarChart3, Target, Zap, Cloud, AlertTriangle, Eye, Shield, GitBranch } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

export function Navigation() {
  const menuItems = [
    { label: 'Analytics Hub', hasDropdown: true },
    { label: 'Budget Control', hasDropdown: true },
    { label: 'Inventory', hasDropdown: false },
    { label: 'Incidents', hasDropdown: false },
    { label: 'Log Manager', hasDropdown: true },
    { label: 'NLP CC', hasDropdown: true },
    { label: 'Anomaly Detection', hasDropdown: true },
    { label: 'Analyzer', hasDropdown: false },
    { label: 'AML', hasDropdown: false },
  ];

  const analyticsHubItems = [
    { label: 'Overview', icon: Home },
    { type: 'separator' },
    { type: 'header', label: 'INFRASTRUCTURE' },
    { label: 'Performance', icon: Server },
    { label: 'Cost Efficiency', icon: DollarSign },
    { label: 'Security & Compliance', icon: Activity },
    { label: 'Diagnostics', icon: Server },
  ];

  const budgetControlItems = [
    { label: 'Overview', icon: Home },
    { label: 'Services', icon: BarChart3 },
    { label: 'Regions', icon: Target },
    { type: 'separator' },
    { type: 'header', label: 'MODERNISATION' },
    { label: 'KPI Overview', icon: Activity },
    { label: 'Compute', icon: Server },
    { label: 'Efficiency', icon: Zap },
  ];

  const logManagerItems = [
    { label: 'Overview', icon: Home },
    { label: 'AWS Overview', icon: Cloud },
    { label: 'Azure Overview', icon: Cloud },
    { label: 'GCP Overview', icon: Cloud },
    { label: 'Performance', icon: Zap },
  ];

  const nlpCCItems = [
    { label: 'Overview', icon: AlertTriangle },
    { label: 'AWS Command Center', icon: Home },
  ];

  const anomalyDetectionItems = [
    { label: 'Overview', icon: Home },
    { label: 'Anomalies', icon: AlertTriangle },
    { label: 'Patterns', icon: GitBranch },
    { label: 'Auto-Resolution', icon: Zap },
    { label: 'Analyzer', icon: Eye },
    { label: 'Multi-Cloud Log Analysis', icon: Cloud },
    { label: 'Deployment Guardrails', icon: Shield },
    { label: 'Security Shield', icon: Shield },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <img src={logo} alt="Xoriant" className="h-8" />
        </div>
        <div className="flex items-center gap-6 flex-1">
          {menuItems.map((item) => {
            if (item.label === 'Analytics Hub' && item.hasDropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors outline-none">
                    <span className="text-sm">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white">
                    {analyticsHubItems.map((menuItem, index) => {
                      if (menuItem.type === 'separator') {
                        return <DropdownMenuSeparator key={index} />;
                      }
                      if (menuItem.type === 'header') {
                        return (
                          <DropdownMenuLabel
                            key={index}
                            className="text-xs text-gray-500 px-3 py-2"
                          >
                            {menuItem.label}
                          </DropdownMenuLabel>
                        );
                      }
                      const Icon = menuItem.icon;
                      return (
                        <DropdownMenuItem
                          key={menuItem.label}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"
                        >
                          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-gray-700">{menuItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.label === 'Budget Control' && item.hasDropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors outline-none">
                    <span className="text-sm">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white">
                    {budgetControlItems.map((menuItem, index) => {
                      if (menuItem.type === 'separator') {
                        return <DropdownMenuSeparator key={index} />;
                      }
                      if (menuItem.type === 'header') {
                        return (
                          <DropdownMenuLabel
                            key={index}
                            className="text-xs text-gray-500 px-3 py-2"
                          >
                            {menuItem.label}
                          </DropdownMenuLabel>
                        );
                      }
                      const Icon = menuItem.icon;
                      return (
                        <DropdownMenuItem
                          key={menuItem.label}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"
                        >
                          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-gray-700">{menuItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.label === 'Log Manager' && item.hasDropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors outline-none">
                    <span className="text-sm">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white">
                    {logManagerItems.map((menuItem, index) => {
                      const Icon = menuItem.icon;
                      return (
                        <DropdownMenuItem
                          key={menuItem.label}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"
                        >
                          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-gray-700">{menuItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.label === 'NLP CC' && item.hasDropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors outline-none">
                    <span className="text-sm">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white">
                    {nlpCCItems.map((menuItem, index) => {
                      const Icon = menuItem.icon;
                      return (
                        <DropdownMenuItem
                          key={menuItem.label}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"
                        >
                          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-gray-700">{menuItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (item.label === 'Anomaly Detection' && item.hasDropdown) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors outline-none">
                    <span className="text-sm">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white">
                    {anomalyDetectionItems.map((menuItem, index) => {
                      const Icon = menuItem.icon;
                      return (
                        <DropdownMenuItem
                          key={menuItem.label}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"
                        >
                          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                          <span className="text-gray-700">{menuItem.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <button
                key={item.label}
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors"
              >
                <span className="text-sm">{item.label}</span>
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
