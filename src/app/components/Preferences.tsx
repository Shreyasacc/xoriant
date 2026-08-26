import { useState, useEffect } from 'react';
import { Settings, Palette, ChevronLeft, Bot, Sun, Moon, Monitor, Check, Save, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PageContainer } from './layouts/PageContainer';
import { toast } from 'sonner';

interface PreferencesProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function Preferences({ onNavigate, onLogout }: PreferencesProps) {
  // Applied colors (currently active in the portal)
  const [appliedColors, setAppliedColors] = useState({
    primary: '#AE275F',
    secondary: '#C73170'
  });

  // Pending colors (selected but not yet applied)
  const [pendingColors, setPendingColors] = useState({
    primary: '#AE275F',
    secondary: '#C73170'
  });

  // Track if there are unsaved changes
  const hasUnsavedChanges = pendingColors.primary !== appliedColors.primary || 
                           pendingColors.secondary !== appliedColors.secondary;

  const presetColors = [
    { name: 'Magenta Pink (Default)', primary: '#AE275F', secondary: '#C73170' },
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#38BDF8' },
    { name: 'Emerald Green', primary: '#059669', secondary: '#10B981' },
    { name: 'Royal Purple', primary: '#7C3AED', secondary: '#A78BFA' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#FB923C' },
    { name: 'Rose Red', primary: '#E11D48', secondary: '#FB7185' },
    { name: 'Teal', primary: '#0D9488', secondary: '#14B8A6' },
    { name: 'Indigo', primary: '#4F46E5', secondary: '#6366F1' },
  ];

  // Apply colors to the DOM and save
  const applyColorsToDom = (primary: string, secondary: string) => {
    const root = document.documentElement;
    
    // Update main color variables
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    
    // Update Tailwind custom property palette
    root.style.setProperty('--primary-600', primary);
    root.style.setProperty('--primary-700', adjustColor(primary, -20));
    root.style.setProperty('--primary-500', adjustColor(primary, 10));
    root.style.setProperty('--primary-400', adjustColor(primary, 30));
    root.style.setProperty('--primary-300', adjustColor(primary, 50));
    root.style.setProperty('--primary-200', adjustColor(primary, 70));
    root.style.setProperty('--primary-100', adjustColor(primary, 80));
    root.style.setProperty('--primary-50', adjustColor(primary, 90));
    root.style.setProperty('--primary-800', adjustColor(primary, -40));
    root.style.setProperty('--primary-900', adjustColor(primary, -60));
    
    // Update gradient variables
    root.style.setProperty('--gradient-from', primary);
    root.style.setProperty('--gradient-to', secondary);
    
    // Update all hardcoded #AE275F references dynamically
    const style = document.createElement('style');
    style.id = 'dynamic-theme-colors';
    
    // Remove any existing dynamic style
    const existingStyle = document.getElementById('dynamic-theme-colors');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      /* Dynamic theme color overrides */
      
      /* Background colors */
      [class*="bg-[#AE275F]"],
      .bg-primary-600 {
        background-color: ${primary} !important;
      }
      
      [class*="bg-[#8B1F4D]"],
      [class*="bg-[#8E1F4F]"],
      [class*="bg-[#8F1F4D]"],
      [class*="bg-[#800F2F]"],
      [class*="bg-[#8B1E4C]"],
      .bg-primary-700,
      .bg-primary-800 {
        background-color: ${adjustColor(primary, -20)} !important;
      }
      
      [class*="bg-[#C73170]"],
      [class*="bg-[#C9184A]"],
      .bg-primary-500 {
        background-color: ${secondary} !important;
      }
      
      .bg-primary-100 {
        background-color: ${adjustColor(primary, 80)} !important;
      }
      
      .bg-primary-50 {
        background-color: ${adjustColor(primary, 90)} !important;
      }
      
      /* Text colors */
      [class*="text-[#AE275F]"],
      .text-primary-600 {
        color: ${primary} !important;
      }
      
      [class*="text-[#800F2F]"],
      [class*="text-[#8E1F4D]"],
      .text-primary-700 {
        color: ${adjustColor(primary, -20)} !important;
      }
      
      [class*="text-[#C73170]"],
      [class*="text-[#C9184A]"] {
        color: ${secondary} !important;
      }
      
      /* Border colors */
      [class*="border-[#AE275F]"],
      .border-primary-600 {
        border-color: ${primary} !important;
      }
      
      [class*="border-l-[#AE275F]"] {
        border-left-color: ${primary} !important;
      }
      
      .border-primary-500 {
        border-color: ${adjustColor(primary, 10)} !important;
      }
      
      /* Gradient: from colors */
      [class*="from-[#AE275F]"],
      .from-primary-600 {
        --tw-gradient-from: ${primary} var(--tw-gradient-from-position) !important;
        --tw-gradient-to: ${secondary} var(--tw-gradient-to-position) !important;
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
      }
      
      [class*="from-[#C9184A]"],
      [class*="from-[#C73170]"] {
        --tw-gradient-from: ${secondary} var(--tw-gradient-from-position) !important;
      }
      
      /* Gradient: to colors */
      [class*="to-[#AE275F]"] {
        --tw-gradient-to: ${primary} var(--tw-gradient-to-position) !important;
      }
      
      [class*="to-[#C73170]"],
      [class*="to-[#C9184A]"],
      .to-primary-700 {
        --tw-gradient-to: ${secondary} var(--tw-gradient-to-position) !important;
      }
      
      [class*="to-[#800F2F]"],
      [class*="to-[#8B1E4C]"],
      [class*="to-[#8B1F4D]"] {
        --tw-gradient-to: ${adjustColor(primary, -20)} var(--tw-gradient-to-position) !important;
      }
      
      /* Hover states */
      [class*="hover\\:bg-[#AE275F]"]:hover,
      [class*="hover\\:bg-primary-600"]:hover {
        background-color: ${primary} !important;
      }
      
      [class*="hover\\:bg-[#800F2F]"]:hover,
      [class*="hover\\:bg-[#8B1F4D]"]:hover,
      [class*="hover\\:bg-[#8E1F4F]"]:hover,
      [class*="hover\\:bg-primary-700"]:hover {
        background-color: ${adjustColor(primary, -20)} !important;
      }
      
      [class*="hover\\:text-[#AE275F]"]:hover {
        color: ${primary} !important;
      }
      
      [class*="hover\\:text-[#800F2F]"]:hover,
      [class*="hover\\:text-[#8E1F4D]"]:hover {
        color: ${adjustColor(primary, -20)} !important;
      }
      
      [class*="hover\\:from-[#8B1F4D]"]:hover {
        --tw-gradient-from: ${adjustColor(primary, -20)} var(--tw-gradient-from-position) !important;
      }
      
      [class*="hover\\:to-[#AE275F]"]:hover {
        --tw-gradient-to: ${primary} var(--tw-gradient-to-position) !important;
      }
      
      /* Focus states */
      .focus\\:ring-primary-500:focus,
      .focus-visible\\:ring-primary-500\\/20:focus-visible {
        --tw-ring-color: ${hexToRgba(adjustColor(primary, 10), 0.2)} !important;
      }
      
      .focus\\:border-primary-500:focus,
      .focus-visible\\:border-primary-500:focus-visible {
        border-color: ${adjustColor(primary, 10)} !important;
      }
      
      /* Data states for tabs */
      [class*="data-[state=active]\\:bg-[#AE275F]"][data-state="active"] {
        background-color: ${primary} !important;
      }
      
      /* Checked states for checkboxes */
      [class*="peer-checked\\:border-[#AE275F]"]:has(+ input:checked),
      input:checked + [class*="peer-checked\\:border-[#AE275F]"] {
        border-color: ${primary} !important;
      }
      
      /* Ring colors */
      .ring-primary-500\\/20 {
        --tw-ring-color: ${hexToRgba(adjustColor(primary, 10), 0.2)} !important;
      }
      
      /* Inline styles - use attribute selectors */
      [style*="background: linear-gradient(135deg, #C9184A"],
      [style*="background: linear-gradient(90deg, #C9184A"] {
        background: linear-gradient(135deg, ${secondary} 0%, ${primary} 50%, ${adjustColor(primary, -30)} 100%) !important;
      }
      
      [style*="background: linear-gradient(90deg, #AE275F"] {
        background: linear-gradient(90deg, ${primary} 0%, ${adjustColor(primary, -20)} 100%) !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Save to localStorage
    localStorage.setItem('themeColors', JSON.stringify({ primary, secondary }));
  };

  // Handle Apply Changes button click
  const handleApplyChanges = () => {
    applyColorsToDom(pendingColors.primary, pendingColors.secondary);
    setAppliedColors({ ...pendingColors });
    toast.success('Theme colors applied successfully!', {
      description: 'Your color theme has been updated across the entire portal.'
    });
  };

  const adjustColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
      (G<255?G<1?0:G:255)*0x100 +
      (B<255?B<1?0:B:255))
      .toString(16).slice(1);
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const num = parseInt(hex.replace("#",""), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const resetToDefault = () => {
    setPendingColors({ primary: '#AE275F', secondary: '#C73170' });
  };

  const discardChanges = () => {
    setPendingColors({ ...appliedColors });
  };

  useEffect(() => {
    // Load saved colors from localStorage on mount
    const savedColors = localStorage.getItem('themeColors');
    if (savedColors) {
      const { primary, secondary } = JSON.parse(savedColors);
      applyColorsToDom(primary, secondary);
      setAppliedColors({ primary, secondary });
      setPendingColors({ primary, secondary });
    } else {
      // Apply default colors on first load
      applyColorsToDom('#AE275F', '#C73170');
    }
  }, []);

  return (
    <DashboardLayout onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#AE275F] to-[#C73170] rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Preferences</h1>
                <p className="text-sm text-gray-600">Customize your portal appearance and theme</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Color Theme */}
            <Card className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#AE275F]" />
                  <h3 className="text-gray-900">Color Theme</h3>
                </div>
                <div className="flex gap-2">
                  {hasUnsavedChanges && (
                    <Button 
                      onClick={discardChanges}
                      variant="outline"
                      size="sm"
                    >
                      Discard Changes
                    </Button>
                  )}
                  <Button 
                    onClick={resetToDefault}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Primary Color */}
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="primaryColor"
                      type="color"
                      value={pendingColors.primary}
                      onChange={(e) => setPendingColors({ ...pendingColors, primary: e.target.value })}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <div>
                      <p className="text-sm text-gray-900 font-mono">{pendingColors.primary}</p>
                      <p className="text-xs text-gray-600">Used for buttons, links, and accents</p>
                    </div>
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={pendingColors.secondary}
                      onChange={(e) => setPendingColors({ ...pendingColors, secondary: e.target.value })}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <div>
                      <p className="text-sm text-gray-900 font-mono">{pendingColors.secondary}</p>
                      <p className="text-xs text-gray-600">Used for gradients and highlights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Color Themes */}
              <div>
                <Label className="mb-4 block">Preset Themes</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {presetColors.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setPendingColors({ primary: preset.primary, secondary: preset.secondary })}
                      className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg group ${
                        pendingColors.primary === preset.primary && pendingColors.secondary === preset.secondary
                          ? 'border-[#AE275F] shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {pendingColors.primary === preset.primary && pendingColors.secondary === preset.secondary && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#AE275F] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex gap-2 mb-3">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-8 h-8 rounded-lg shadow-sm"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-xs text-gray-900 text-left group-hover:text-[#AE275F] transition-colors">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <Label className="mb-4 block">Preview</Label>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button 
                      className="text-white"
                      style={{ 
                        backgroundColor: pendingColors.primary,
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button 
                      variant="outline"
                      style={{ 
                        borderColor: pendingColors.primary,
                        color: pendingColors.primary
                      }}
                    >
                      Outline Button
                    </Button>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg text-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${pendingColors.primary} 0%, ${pendingColors.secondary} 100%)`
                    }}
                  >
                    <h4 className="mb-1">Gradient Card</h4>
                    <p className="text-sm opacity-90">This is how gradients will look with your selected colors</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pendingColors.primary }}
                    />
                    <span className="text-sm" style={{ color: pendingColors.primary }}>
                      This is how links and accents will appear
                    </span>
                  </div>
                </div>
              </div>

              {/* Apply Changes Button */}
              {hasUnsavedChanges && (
                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Palette className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-amber-900 mb-0.5">Unsaved Changes</h4>
                        <p className="text-sm text-amber-700">
                          Click "Apply Changes" to save and apply your new color theme
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleApplyChanges}
                      className="bg-[#AE275F] hover:bg-[#8E1F4F] text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Apply Changes
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Info Card */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 mb-1">Theme Applied Globally</h4>
                  <p className="text-sm text-blue-800">
                    Your selected colors will be applied across the entire portal, including all dashboards, 
                    navigation elements, buttons, and UI components. The theme will be saved and persist 
                    across sessions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}