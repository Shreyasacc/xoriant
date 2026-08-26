import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, ChevronLeft, Bot } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';

interface MyProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function MyProfile({ onNavigate, onLogout }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Aakash Mishra',
    email: 'aakash.mishra@xoriant.com',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra, India',
    role: 'System Administrator',
    department: 'Cloud Operations',
    joinDate: 'January 15, 2023',
    bio: 'Experienced system administrator specializing in cloud infrastructure management and automation.'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout onNavigate={onNavigate} onLogout={onLogout}>
      {/* Hero Section */}
      <div className="relative bg-[#AE275F] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Animated Wave Lines */}
            <path
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.3"
              d="M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30;
                  M0,35 C15,30 25,40 35,35 S55,30 65,35 S85,40 100,35;
                  M0,30 C15,25 25,35 35,30 S55,25 65,30 S85,35 100,30
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.3"
              d="M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50"
            >
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50;
                  M0,55 C20,50 30,60 45,55 S65,50 75,55 S90,60 100,55;
                  M0,50 C20,45 30,55 45,50 S65,45 75,50 S90,55 100,50
                "
              />
            </path>
            <path
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.2"
              d="M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70;
                  M0,75 C25,70 35,80 50,75 S70,70 80,75 S95,80 100,75;
                  M0,70 C25,65 35,75 50,70 S70,65 80,70 S95,75 100,70
                "
              />
            </path>
            
            {/* Floating Circles */}
            <circle cx="10" cy="20" r="1" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="8s"
                repeatCount="indefinite"
                values="20;80;20"
              />
              <animate
                attributeName="opacity"
                dur="8s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            <circle cx="30" cy="60" r="1.5" fill="rgba(255,255,255,0.4)">
              <animate
                attributeName="cy"
                dur="10s"
                repeatCount="indefinite"
                values="60;15;60"
              />
              <animate
                attributeName="opacity"
                dur="10s"
                repeatCount="indefinite"
                values="0.4;0.7;0.4"
              />
            </circle>
            <circle cx="70" cy="40" r="1" fill="rgba(255,255,255,0.35)">
              <animate
                attributeName="cy"
                dur="12s"
                repeatCount="indefinite"
                values="40;85;40"
              />
              <animate
                attributeName="opacity"
                dur="12s"
                repeatCount="indefinite"
                values="0.35;0.65;0.35"
              />
            </circle>
            <circle cx="90" cy="70" r="1.2" fill="rgba(255,255,255,0.3)">
              <animate
                attributeName="cy"
                dur="9s"
                repeatCount="indefinite"
                values="70;25;70"
              />
              <animate
                attributeName="opacity"
                dur="9s"
                repeatCount="indefinite"
                values="0.3;0.6;0.3"
              />
            </circle>
            
            {/* Diagonal Lines */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="6s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
            <line x1="0" y1="100" x2="100" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2">
              <animate
                attributeName="opacity"
                dur="7s"
                repeatCount="indefinite"
                values="0.15;0.3;0.15"
              />
            </line>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">My Profile</h1>
              <p className="text-white/90 text-sm">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl lg:col-span-1">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-[#AE275F]">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-[#AE275F] to-[#C73170] text-white text-3xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-sm text-gray-600 mb-3">{profile.email}</p>
                
                <Badge className="bg-purple-100 text-purple-700 border-purple-300 border mb-4">
                  {profile.role}
                </Badge>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-[#AE275F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Department</p>
                      <p className="text-gray-900">{profile.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[#AE275F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs">Joined</p>
                      <p className="text-gray-900">{profile.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Details */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="bg-[#AE275F] hover:bg-[#8F1F4D] text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="mt-1.5"
                    />
                  ) : (
                    <div className="mt-1.5 flex items-center gap-2 text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      {profile.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="mt-1.5"
                    />
                  ) : (
                    <div className="mt-1.5 flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                      className="mt-1.5"
                    />
                  ) : (
                    <div className="mt-1.5 flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile.phone}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      className="mt-1.5"
                    />
                  ) : (
                    <div className="mt-1.5 flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {profile.location}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="mt-1.5 w-full min-h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}