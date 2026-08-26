import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { IncidentAnalyzer } from './components/IncidentAnalyzer';
import { UserManagement } from './components/UserManagement';
import { IntegrationTool } from './components/pages/IntegrationTool';
import { Inventory } from './components/Inventory';
import { MyProfile } from './components/MyProfile';
import { AccountSettings } from './components/AccountSettings';
import { Preferences } from './components/Preferences';
import { ChatbotAssistant } from './components/ChatbotAssistant';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { OTPLogin } from './components/Auth/OTPLogin';
import { Button } from './components/ui/button';
import { MessageCircle } from 'lucide-react';

type AuthPage = 'login' | 'signup' | 'forgot' | 'otp';

export default function App() {
  // Set to false to show login page, true to skip to dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [incidentView, setIncidentView] = useState<'incidents' | 'whitenoise'>('incidents');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage('login');
    setCurrentPage('dashboard');
  };

  // Handle navigation with optional incident view parameter
  const handleNavigate = (page: string, view?: 'incidents' | 'whitenoise') => {
    setCurrentPage(page);
    if (view) {
      setIncidentView(view);
    }
  };

  if (!isAuthenticated) {
    switch (authPage) {
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setAuthPage} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={setAuthPage} />;
      case 'forgot':
        return <ForgotPassword onNavigate={setAuthPage} />;
      case 'otp':
        return <OTPLogin onLogin={handleLogin} onNavigate={setAuthPage} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'analyzer':
        return <IncidentAnalyzer onNavigate={handleNavigate} onLogout={handleLogout} view={incidentView} />;
      case 'user-management':
        return <UserManagement onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'integration-tool':
        return <IntegrationTool onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'inventory':
        return <Inventory onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'my-profile':
        return <MyProfile onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'account-settings':
        return <AccountSettings onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'preferences':
        return <Preferences onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {renderPage()}
      
      {/* Green Chatbot - Hidden for now */}
      {/* {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[rgb(0,166,62)] hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      <ChatbotAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      /> */}
    </div>
  );
}