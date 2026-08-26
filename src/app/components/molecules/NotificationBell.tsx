import { Bell } from 'lucide-react';

interface NotificationBellProps {
  hasNotifications?: boolean;
  count?: number;
  onClick?: () => void;
}

/**
 * NotificationBell Component - Shows notification icon with badge
 * Responsive: Adapts size on mobile
 */
export function NotificationBell({ 
  hasNotifications = false, 
  count,
  onClick 
}: NotificationBellProps) {
  return (
    <button 
      className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={onClick}
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-gray-600" />
      {hasNotifications && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full"></span>
      )}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
