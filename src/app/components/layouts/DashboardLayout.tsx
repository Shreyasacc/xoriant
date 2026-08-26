import { ReactNode, useState, useEffect } from 'react';
import { SideNavigation } from '../organisms/SideNavigation';
import { TopNavigation } from '../organisms/TopNavigation';
import { AIAssistantPanel } from '../AIAssistantPanel';
import { Bot, ChevronLeft } from 'lucide-react';
import { AIAssistantContext } from '../../contexts/AIAssistantContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onOpenAIAssistant?: () => void;
}

/**
 * DashboardLayout Component - Main layout wrapper for dashboard pages
 * Responsive: 
 * - Desktop: Side nav + top nav + content
 * - Tablet: Collapsed side nav + top nav + content
 * - Mobile: Hidden side nav (drawer), compact top nav, full-width content
 */
export function DashboardLayout({ 
  children, 
  currentPage,
  onNavigate, 
  onLogout,
  onOpenAIAssistant
}: DashboardLayoutProps) {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(true); // Start collapsed by default
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Keep side nav collapsed when AI panel opens
  useEffect(() => {
    if (aiPanelOpen) {
      setSideNavCollapsed(true);
    }
  }, [aiPanelOpen]);

  // Set collapsed to true on initial load and on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSideNavCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep side nav collapsed when navigating between pages
  useEffect(() => {
    // Only collapse on page change, don't auto-expand
    // User must manually click expand arrow to open side nav
  }, [currentPage]);

  const openAIAssistant = () => {
    setAiPanelOpen(true);
  };

  return (
    <AIAssistantContext.Provider value={{ openAIAssistant }}>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Side Navigation - Hidden on mobile, drawer on tablet, fixed on desktop */}
        <SideNavigation 
          externalCollapsed={sideNavCollapsed}
          onCollapsedChange={setSideNavCollapsed}
          onNavigate={onNavigate}
          currentPage={currentPage}
        />

        {/* Main Content Area - Adjusts width based on AI panel state */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${aiPanelOpen ? 'mr-96' : ''}`}>
          {/* Top Navigation */}
          <TopNavigation 
            onNavigate={onNavigate} 
            onLogout={onLogout}
            onMenuToggle={() => setSideNavCollapsed(!sideNavCollapsed)}
          />

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>

        {/* AI Assistant Panel - Fixed to right side, pushes content */}
        <AIAssistantPanel 
          isOpen={aiPanelOpen} 
          onClose={() => setAiPanelOpen(false)}
          onToggle={() => setAiPanelOpen(!aiPanelOpen)}
          currentPage={currentPage}
        />

        {/* Floating AI Assistant Toggle Button */}
        {!aiPanelOpen && (
          <button
            onClick={() => setAiPanelOpen(true)}
            className="fixed bottom-6 right-6 z-40 group bg-[#AE275F] hover:bg-[#8e1f4d] text-white px-6 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-[#AE275F]" />
            </div>
            <div className="text-left">
              <h3 className="text-sm">AI Assistant</h3>
              <p className="text-xs text-pink-100">Click to expand</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </AIAssistantContext.Provider>
  );
}