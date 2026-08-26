interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical' | 'active' | 'inactive' | 'resolved' | 'investigating' | 'open' | 'pending' | 'failed' | 'connected';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * StatusIndicator Component - Displays colored status dots/badges
 * Responsive: Adapts size based on screen size if needed
 */
export function StatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false,
  className = '' 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const colorClasses = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    resolved: 'bg-green-500',
    investigating: 'bg-yellow-500',
    open: 'bg-red-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    connected: 'bg-green-500'
  };

  const labelText = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    active: 'Active',
    inactive: 'Inactive',
    resolved: 'Resolved',
    investigating: 'Investigating',
    open: 'Open',
    pending: 'Pending',
    failed: 'Failed',
    connected: 'Connected'
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full`} />
      {showLabel && (
        <span className="text-xs text-gray-600 capitalize">{labelText[status]}</span>
      )}
    </div>
  );
}
