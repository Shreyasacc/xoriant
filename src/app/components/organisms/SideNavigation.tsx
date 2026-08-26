import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from 'figma:asset/f11b2ccbc5edb6bf832b728e2ab91c617da855fb.png';
import { 
  ChevronRight,
  ChevronLeft,
  Home, 
  Server, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Target, 
  Zap, 
  Cloud, 
  AlertTriangle, 
  Eye, 
  Shield, 
  GitBranch,
  Package,
  FileWarning,
  Users,
  UserPlus,
  Building2,
  X
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Sheet, SheetContent } from '../ui/sheet';

interface SideNavigationProps {
  onNavigate?: (page: string, view?: 'incidents' | 'whitenoise') => void;
  externalCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  currentPage?: string;
}

/**
 * SideNavigation Component - Responsive side navigation
 * Responsive:
 * - Mobile (< 768px): Sheet/Drawer overlay
 * - Tablet (768px - 1024px): Collapsed by default with expand option
 * - Desktop (>= 1024px): Full side nav with collapse toggle
 */
export function SideNavigation({ onNavigate, externalCollapsed, onCollapsedChange, currentPage }: SideNavigationProps = {}) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('Overview');
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update active item based on current page
  useEffect(() => {
    if (currentPage === 'analyzer') {
      setActiveItem('Incidents'); // Set to 'Incidents' sub-item
      setExpandedMenu('Incident Management'); // Expand the parent menu
    } else if (currentPage === 'dashboard') {
      setActiveItem('Analytics Hub');
    } else if (currentPage === 'inventory') {
      setActiveItem('Inventory');
    } else if (currentPage === 'user-management') {
      setActiveItem('User Management'); // Changed to 'User Management' instead of 'Multiple Account Onboard'
    } else if (currentPage === 'integration-tool') {
      setActiveItem('Integration Tool');
    }
  }, [currentPage]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync external collapsed state with mobile drawer
  useEffect(() => {
    if (isMobile && externalCollapsed === false) {
      // When menu button is clicked (externalCollapsed becomes false), open drawer
      setIsMobileOpen(true);
    }
  }, [externalCollapsed, isMobile]);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleCollapsedChange = (collapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
    // Close mobile drawer when toggling
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleMenu = (label: string) => {
    if (expandedMenu === label) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(label);
    }
  };

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    
    // Handle navigation
    if (onNavigate) {
      if (label === 'Incidents') {
        onNavigate('analyzer', 'incidents');
      } else if (label === 'White Noise') {
        onNavigate('analyzer', 'whitenoise');
      } else if (label === 'Incident Management') {
        onNavigate('analyzer', 'incidents');
      } else if (label === 'Analytics Hub') {
        onNavigate('dashboard');
      } else if (label === 'Inventory') {
        onNavigate('inventory');
      } else if (label === 'User Management') {
        onNavigate('user-management');
      } else if (label === 'Integration Tool') {
        onNavigate('integration-tool');
      }
    }

    // Close mobile drawer after navigation
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        {
          label: 'Analytics Hub',
          icon: BarChart3,
          hasDropdown: false,
        },
        {
          label: 'Inventory',
          icon: Package,
          hasDropdown: false,
        },
        {
          label: 'Incident Management',
          icon: FileWarning,
          hasDropdown: true,
          subItems: [
            { label: 'Incidents', icon: AlertTriangle },
            { label: 'White Noise', icon: Eye },
          ],
        },
        {
          label: 'Integration Tool',
          icon: GitBranch,
          hasDropdown: false,
        },
        {
          label: 'User Management',
          icon: Users,
          hasDropdown: false, // Changed from true to false - no dropdown
        },
      ],
    },
  ];

  // Render navigation content
  const NavContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <div className={`${!isMobileView && (isCollapsed ? 'w-20' : 'w-64')} h-full bg-white flex flex-col shadow-sm transition-all duration-300 relative`}>
      {/* Toggle Button - Desktop Only */}
      {!isMobileView && (
        <button
          onClick={() => handleCollapsedChange(!isCollapsed)}
          className="absolute -right-3 top-8 z-10 w-6 h-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hidden lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Logo Section */}
      <div className={`px-4 sm:px-6 py-4 sm:py-6 ${isCollapsed && !isMobileView ? 'flex justify-center' : ''}`}>
        {isCollapsed && !isMobileView ? (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">X</span>
          </div>
        ) : (
          <img src={logo} alt="Xoriant" className="h-7 sm:h-8" />
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2">
        <TooltipProvider>
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
              {/* Section Title */}
              {!isCollapsed || isMobileView ? (
                <div className="px-3 mb-3">
                  <h3 className="text-gray-900 text-xs sm:text-sm uppercase tracking-wide">{section.title}</h3>
                </div>
              ) : null}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedMenu === item.label;
                  const isActive = activeItem === item.label;

                  if (isCollapsed && !isMobileView) {
                    // Collapsed state - show only icons with tooltips
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              if (!item.hasDropdown) {
                                handleItemClick(item.label);
                              } else {
                                handleCollapsedChange(false);
                                toggleMenu(item.label);
                              }
                            }}
                            className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all relative ${
                              isActive && !item.hasDropdown
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-primary-50'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {/* Active Indicator */}
                            {isActive && !item.hasDropdown && (
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <div key={item.label}>
                      {/* Main Item */}
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            toggleMenu(item.label);
                          } else {
                            handleItemClick(item.label);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all relative group ${
                          isActive && !item.hasDropdown
                            ? 'text-primary-600'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{item.label}</span>
                        </div>
                        {item.hasDropdown && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </motion.div>
                        )}
                        
                        {/* Active Indicator */}
                        {isActive && !item.hasDropdown && (
                          <motion.div
                            layoutId={isMobileView ? "activeIndicatorMobile" : "activeIndicator"}
                            className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Dropdown Items */}
                      <AnimatePresence>
                        {item.hasDropdown && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 sm:ml-8 mt-1 space-y-1">
                              {item.subItems?.map((subItem, index) => {
                                if (subItem.type === 'separator') {
                                  return (
                                    <div
                                      key={`separator-${index}`}
                                      className="my-2 border-t border-gray-200"
                                    />
                                  );
                                }

                                if (subItem.type === 'header') {
                                  return (
                                    <div
                                      key={`header-${index}`}
                                      className="px-3 py-1.5 text-xs text-gray-500 uppercase tracking-wider"
                                    >
                                      {subItem.label}
                                    </div>
                                  );
                                }

                                const SubIcon = subItem.icon;
                                const isSubActive = activeItem === subItem.label;

                                return (
                                  <button
                                    key={subItem.label}
                                    onClick={() => handleItemClick(subItem.label)}
                                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg transition-all relative ${
                                      isSubActive
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                  >
                                    {SubIcon && <SubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                                    <span className="text-xs sm:text-sm truncate">{subItem.label}</span>
                                    
                                    {/* Active Indicator for sub-items */}
                                    {isSubActive && (
                                      <motion.div
                                        layoutId={isMobileView ? "activeIndicatorMobile" : "activeIndicator"}
                                        className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer */}
      {(!isCollapsed || isMobileView) && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">@Xoriant 2025</p>
        </div>
      )}
    </div>
  );

  // On mobile, use Sheet (Drawer)
  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={(open) => {
        setIsMobileOpen(open);
        // When drawer closes, notify parent to update collapsed state
        if (!open && onCollapsedChange) {
          onCollapsedChange(true);
        }
      }}>
        <SheetContent side="left" className="p-0 w-64 sm:w-72">
          <NavContent isMobileView={true} />
        </SheetContent>
      </Sheet>
    );
  }

  // On desktop/tablet, use fixed sidebar
  return <NavContent />;
}