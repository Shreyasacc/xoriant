interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  animated?: boolean;
}

/**
 * ProgressBar Component - Animated progress indicator
 * Responsive: Adapts height based on size
 */
export function ProgressBar({ 
  value, 
  max = 100, 
  showLabel = false,
  size = 'md',
  color = 'primary',
  className = '',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ${
            animated ? 'animate-progress-fill' : ''
          }`}
          style={{ 
            width: `${percentage}%`,
            '--progress-width': `${percentage}%`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
