import React from 'react';
import { Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface AdvancedFiltersSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedIntegrationTools: string[];
  setSelectedIntegrationTools: (values: string[]) => void;
  selectedApplications: string[];
  setSelectedApplications: (values: string[]) => void;
  selectedCloudProviders: string[];
  setSelectedCloudProviders: (values: string[]) => void;
  selectedCloudAccounts: string[];
  setSelectedCloudAccounts: (values: string[]) => void;
  selectedCloudServices: string[];
  setSelectedCloudServices: (values: string[]) => void;
  selectedSeverities: string[];
  setSelectedSeverities: (values: string[]) => void;
  selectedGroups: string[];
  setSelectedGroups: (values: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (values: string[]) => void;
  incidentNameSearch: string;
  setIncidentNameSearch: (value: string) => void;
  assignedToSearch: string;
  setAssignedToSearch: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function AdvancedFiltersSection({
  isExpanded,
  onToggle,
  selectedIntegrationTools,
  setSelectedIntegrationTools,
  selectedApplications,
  setSelectedApplications,
  selectedCloudProviders,
  setSelectedCloudProviders,
  selectedCloudAccounts,
  setSelectedCloudAccounts,
  selectedCloudServices,
  setSelectedCloudServices,
  selectedSeverities,
  setSelectedSeverities,
  selectedGroups,
  setSelectedGroups,
  selectedStatuses,
  setSelectedStatuses,
  incidentNameSearch,
  setIncidentNameSearch,
  assignedToSearch,
  setAssignedToSearch,
  onApply,
  onClear,
}: AdvancedFiltersSectionProps) {
  // Sample data for dropdowns
  const integrationTools = ['ServiceNow', 'Jira', 'PagerDuty', 'Slack', 'Microsoft Teams'];
  const applications = ['Web App', 'Mobile App', 'API Gateway', 'Database', 'Cache'];
  const cloudProviders = ['AWS', 'Azure', 'GCP'];
  const cloudAccounts = ['Production Main', 'Production Secondary', 'Development', 'Staging'];
  const cloudServices = ['EC2', 'S3', 'RDS', 'Lambda', 'Functions', 'Storage', 'Compute Engine', 'Kubernetes Engine'];
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const groups = ['Infrastructure', 'Application', 'Database', 'Network', 'Security'];
  const statuses = ['Open', 'Investigating', 'Resolved'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            {isExpanded ? 'Advanced Filters' : 'Show Advanced Filters'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Filters Content */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-200">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Integration Tools */}
            <MultiSelectDropdown
              label="Integration Tools"
              options={integrationTools}
              selectedValues={selectedIntegrationTools}
              onChange={setSelectedIntegrationTools}
            />

            {/* Applications */}
            <MultiSelectDropdown
              label="Applications"
              options={applications}
              selectedValues={selectedApplications}
              onChange={setSelectedApplications}
            />

            {/* Cloud Providers */}
            <MultiSelectDropdown
              label="Cloud Providers"
              options={cloudProviders}
              selectedValues={selectedCloudProviders}
              onChange={setSelectedCloudProviders}
            />

            {/* Cloud Provider Accounts */}
            <MultiSelectDropdown
              label="Cloud Provider Accounts"
              options={cloudAccounts}
              selectedValues={selectedCloudAccounts}
              onChange={setSelectedCloudAccounts}
            />

            {/* Cloud Services */}
            <MultiSelectDropdown
              label="Cloud Services"
              options={cloudServices}
              selectedValues={selectedCloudServices}
              onChange={setSelectedCloudServices}
            />

            {/* Severity */}
            <MultiSelectDropdown
              label="Severity"
              options={severities}
              selectedValues={selectedSeverities}
              onChange={setSelectedSeverities}
            />

            {/* Select Group */}
            <MultiSelectDropdown
              label="Select Group"
              options={groups}
              selectedValues={selectedGroups}
              onChange={setSelectedGroups}
            />

            {/* Status */}
            <MultiSelectDropdown
              label="Status"
              options={statuses}
              selectedValues={selectedStatuses}
              onChange={setSelectedStatuses}
            />
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Incident Name Search */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Incident Name Search</label>
              <Input
                placeholder="Search by incident name..."
                value={incidentNameSearch}
                onChange={(e) => setIncidentNameSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Assigned to</label>
              <Input
                placeholder="Search by assigned user..."
                value={assignedToSearch}
                onChange={(e) => setAssignedToSearch(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onApply}
              className="bg-[#AE275F] hover:bg-[#8E1F4F] text-white px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
