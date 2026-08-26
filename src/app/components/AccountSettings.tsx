import { useState } from 'react';
import { Shield, Eye, EyeOff, ChevronLeft, Bot, Key, Smartphone, Clock, Lock, Bell } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface AccountSettingsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AccountSettings({ onNavigate, onLogout }: AccountSettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    incidentAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log('Password change requested');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <DashboardLayout onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#AE275F] to-[#C73170] rounded-xl flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-600">Manage your security and notification preferences</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Change Password */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-gray-900">Change Password</h3>
              </div>

              <div className="space-y-4 max-w-xl">
                {/* Current Password */}
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                >
                  Update Password
                </Button>
              </div>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-gray-900">Two-Factor Authentication</h3>
              </div>

              <div className="flex items-center justify-between max-w-xl">
                <div>
                  <p className="text-sm text-gray-900 mb-1">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-xl">
                  <p className="text-sm text-blue-800">
                    Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when logging in.
                  </p>
                </div>
              )}
            </Card>

            {/* Notification Settings */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-[#AE275F]" />
                <h3 className="text-gray-900">Notification Preferences</h3>
              </div>

              <div className="space-y-4 max-w-xl">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                  />
                </div>

                {/* Incident Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Incident Alerts</p>
                    <p className="text-sm text-gray-600">Get notified about critical incidents</p>
                  </div>
                  <Switch
                    checked={notifications.incidentAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, incidentAlerts: checked})}
                  />
                </div>

                {/* Security Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Security Alerts</p>
                    <p className="text-sm text-gray-600">Get notified about security events</p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                  />
                </div>

                {/* Weekly Reports */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}