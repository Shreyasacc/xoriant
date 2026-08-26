import { Search, Bell, ChevronDown, User, Settings, Palette, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { useState } from 'react';

interface TopNavigationProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onMenuToggle?: () => void;
}

/**
 * TopNavigation Component - Main top navigation bar
 * Responsive:
 * - Mobile: Hamburger menu button, compact search, avatar only
 * - Tablet: Full search, avatar with name (hidden on sm)
 * - Desktop: Full layout with all elements
 */
export function TopNavigation({ onNavigate, onLogout, onMenuToggle }: TopNavigationProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Mock user data
  const user = {
    name: 'Aakash Mishra',
    email: 'aakash.mishra@xoriant.com',
    role: 'System Administrator',
    avatar: '', // Will use fallback
    lastLogin: 'Today at 09:30 AM',
  };

  const handleMenuClick = (page: string) => {
    if (page === 'logout') {
      setShowLogoutDialog(true);
    } else if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <div className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 shrink-0">
        {/* Left Section: Menu Button (Mobile/Tablet) + Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-2 sm:ml-4 shrink-0">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full"></span>
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg p-1.5 sm:p-2 transition-colors outline-none">
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary-600 text-white text-xs sm:text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm text-gray-900 truncate max-w-[120px] lg:max-w-[150px]">{user.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px] lg:max-w-[150px]">Last login: {user.lastLogin}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 bg-white">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary-600 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <Badge variant="secondary" className="mt-1 text-xs bg-primary-100 text-primary-700">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div className="px-2 py-2">
                <p className="text-xs text-gray-500 px-2">Last Login</p>
                <p className="text-sm text-gray-900 px-2">{user.lastLogin}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleMenuClick('my-profile')}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleMenuClick('account-settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleMenuClick('preferences')}
              >
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => handleMenuClick('logout')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page and will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white m-0"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
