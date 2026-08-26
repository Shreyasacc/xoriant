import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Bot, 
  ChevronRight, 
  ChevronLeft,
  Play, 
  SkipForward, 
  CheckCircle2, 
  FileText,
  BarChart3
} from 'lucide-react';
import React from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface AIAssistantPanelProps {
  currentPage?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function AIAssistantPanel({ 
  currentPage = 'dashboard',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle
}: AIAssistantPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleToggle = externalOnToggle || (() => setInternalIsOpen(!internalIsOpen));

  // Different content based on page type
  const getPageContent = () => {
    switch (currentPage) {
      case 'analyzer':
        return {
          title: 'AI Assistant',
          subtitle: 'Incident Management Help',
          steps: [
            { id: 1, title: 'Analyze Incident', description: 'Analyzing incident patterns and identifying root causes' },
            { id: 2, title: 'Suggest Resolution', description: 'Generating resolution plan based on historical data' },
            { id: 3, title: 'Apply Fix', description: 'Implementing recommended resolution steps' },
            { id: 4, title: 'Verify & Monitor', description: 'Monitoring system to confirm incident resolution' }
          ],
          metrics: [
            { label: 'Incident Severity', value: 85 },
            { label: 'Resolution Time', value: 72 },
            { label: 'System Impact', value: 45 }
          ]
        };
      case 'dashboard':
        return {
          title: 'AI Assistant',
          subtitle: 'Analytics Hub Help',
          steps: [
            { id: 1, title: 'Analyze Metrics', description: 'Analyzing system-wide performance metrics and trends' },
            { id: 2, title: 'Identify Issues', description: 'Detecting anomalies and potential problems' },
            { id: 3, title: 'Recommend Actions', description: 'Generating optimization recommendations' },
            { id: 4, title: 'Apply Insights', description: 'Implementing suggested improvements' }
          ],
          metrics: [
            { label: 'System Health', value: 92 },
            { label: 'Availability', value: 99 },
            { label: 'Performance', value: 87 }
          ]
        };
      case 'user-management':
        return {
          title: 'AI Assistant',
          subtitle: 'User Management Help',
          steps: [
            { id: 1, title: 'Validate Users', description: 'Validating user data and permissions structure' },
            { id: 2, title: 'Optimize Access', description: 'Analyzing and optimizing role-based access control' },
            { id: 3, title: 'Apply Policies', description: 'Implementing recommended security policies' },
            { id: 4, title: 'Monitor Activity', description: 'Tracking user activity and access patterns' }
          ],
          metrics: [
            { label: 'User Compliance', value: 94 },
            { label: 'Access Security', value: 88 },
            { label: 'Policy Coverage', value: 91 }
          ]
        };
      case 'integration-tool':
        return {
          title: 'AI Assistant',
          subtitle: 'Integration Tool Help',
          steps: [
            { id: 1, title: 'Analyze APIs', description: 'Analyzing API endpoints and connectivity status' },
            { id: 2, title: 'Optimize Integration', description: 'Identifying integration bottlenecks and issues' },
            { id: 3, title: 'Apply Changes', description: 'Implementing optimized integration configurations' },
            { id: 4, title: 'Test & Verify', description: 'Testing integrations and monitoring data flow' }
          ],
          metrics: [
            { label: 'API Health', value: 96 },
            { label: 'Data Sync', value: 89 },
            { label: 'Connection Speed', value: 92 }
          ]
        };
      case 'my-profile':
      case 'account-settings':
      case 'preferences':
        return {
          title: 'AI Assistant',
          subtitle: 'Profile & Settings Help',
          steps: [
            { id: 1, title: 'Review Settings', description: 'Analyzing your current profile and preferences' },
            { id: 2, title: 'Suggest Updates', description: 'Recommending optimal settings for your usage' },
            { id: 3, title: 'Apply Changes', description: 'Implementing suggested configuration updates' },
            { id: 4, title: 'Verify Setup', description: 'Confirming all settings are properly configured' }
          ],
          metrics: [
            { label: 'Profile Complete', value: 85 },
            { label: 'Security Score', value: 90 },
            { label: 'Optimization', value: 78 }
          ]
        };
      default:
        return {
          title: 'AI Assistant',
          subtitle: 'Cloud Operations Help',
          steps: [
            { id: 1, title: 'Analyze Data', description: 'Processing current data and identifying patterns' },
            { id: 2, title: 'Generate Insights', description: 'Creating actionable insights from analysis' },
            { id: 3, title: 'Suggest Actions', description: 'Recommending optimal next steps' },
            { id: 4, title: 'Monitor Results', description: 'Tracking implementation and outcomes' }
          ],
          metrics: [
            { label: 'Analysis Progress', value: 75 },
            { label: 'Data Quality', value: 88 },
            { label: 'Confidence', value: 92 }
          ]
        };
    }
  };

  const content = getPageContent();

  return (
    <>
      {isOpen ? (
        <div className="fixed right-0 top-0 h-screen w-96 z-40 bg-white border-l border-gray-200 shadow-2xl overflow-y-auto">
          <div className="p-6">
            <Card className="bg-white border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden">
              <button
                onClick={handleToggle}
                className="w-full p-5 border-b border-gray-200 bg-gradient-to-r from-[#AE275F] to-[#C73170] hover:from-[#8B1F4D] hover:to-[#AE275F] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-[#AE275F]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white">{content.title}</h3>
                      <p className="text-xs text-pink-100">Step {currentStep} of 4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-full text-xs bg-white/20 text-white">
                      Collapse
                    </div>
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </button>

              <div className="p-5 space-y-4">
                {/* Progress Tracker */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                      <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                        step <= currentStep ? 'bg-[#AE275F]' : 'bg-gray-200'
                      }`}></div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Current Step Content */}
                {!stepCompleted ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 mb-2">
                        {content.steps[currentStep - 1].title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {content.steps[currentStep - 1].description}
                      </p>
                    </div>

                    {/* Mini Visualization */}
                    <div className="rounded-xl p-4 border-0" style={{ background: 'linear-gradient(to bottom right, #AE275F, #8B1E4C)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white">Real-time Analysis</span>
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-3">
                        {content.metrics.map((metric) => (
                          <div key={metric.label} className="bg-[rgba(249,241,241,0)]">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-white/90">{metric.label}</span>
                              <span className="text-white">{metric.value}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            setStepCompleted(true);
                          }
                        }}
                        className="flex-1 h-10 bg-[#AE275F] hover:bg-[#8B1F4D] text-white rounded-xl"
                      >
                        <Play className="w-4 h-4 mr-1.5" />
                        Run Analysis
                      </Button>
                      <Button
                        onClick={() => {
                          if (currentStep < 4) {
                            setCurrentStep(currentStep + 1);
                          }
                        }}
                        variant="outline"
                        className="px-4 h-10 border-gray-300 rounded-xl hover:bg-gray-50"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Step List */}
                    <div className="space-y-2">
                      {content.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                            step.id === currentStep
                              ? 'bg-pink-50 border border-pink-200'
                              : step.id < currentStep
                              ? 'bg-gray-50 border border-gray-200'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            step.id < currentStep
                              ? 'bg-[#10B981] text-white'
                              : step.id === currentStep
                              ? 'bg-pink-100 text-[#AE275F]'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {step.id < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                          </div>
                          <span className={`text-sm ${
                            step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Success State
                  <div className="text-center py-8 space-y-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-[#AE275F]" />
                      </div>
                      {/* Confetti effect */}
                      <div className="absolute inset-0 animate-ping opacity-25">
                        <div className="w-20 h-20 bg-pink-300 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-2">✨ Analysis Complete!</h4>
                      <p className="text-sm text-gray-600">
                        All steps completed successfully. Your system is now optimized.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setStepCompleted(false);
                        setCurrentStep(1);
                      }}
                      variant="outline"
                      className="w-full h-10 border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Detailed Report
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}