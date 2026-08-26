import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserAvatarProps {
  name: string;
  email?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  lastLogin?: string;
  className?: string;
}

/**
 * UserAvatar Component - User profile picture with optional details
 * Responsive: Hides details on small screens by default
 */
export function UserAvatar({ 
  name, 
  email,
  avatar, 
  size = 'md',
  showDetails = false,
  lastLogin,
  className = '' 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-primary-600 text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showDetails && (
        <div className="text-left hidden md:block">
          <p className="text-sm text-gray-900 truncate max-w-[150px]">{name}</p>
          {lastLogin && (
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              Last login: {lastLogin}
            </p>
          )}
          {email && !lastLogin && (
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{email}</p>
          )}
        </div>
      )}
    </div>
  );
}
