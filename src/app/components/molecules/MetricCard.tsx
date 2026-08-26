import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  target: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

/**
 * MetricCard Component - Displays key performance metrics
 * Responsive: Stacks content on smaller screens, adjusts padding
 */
export function MetricCard({ 
  title, 
  value, 
  target, 
  icon: Icon, 
  iconColor, 
  bgColor 
}: MetricCardProps) {
  // Detect if target contains down arrow (decrease indicator) and apply red color
  const hasDownArrow = target.includes('↓');
  const hasUpArrow = target.includes('↑');
  
  const targetColor = hasDownArrow ? 'text-red-600' : hasUpArrow ? 'text-green-600' : 'text-gray-500';
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-gray-600 mb-2 truncate">{title}</h3>
          <p className="text-2xl sm:text-3xl mb-1 truncate">{value}</p>
          <p className={`text-xs ${targetColor} truncate`}>{target}</p>
        </div>
        <div className={`${bgColor} ${iconColor} p-3 rounded-lg shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}