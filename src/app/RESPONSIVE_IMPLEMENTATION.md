# Responsive Implementation Guide

This document outlines the responsive design implementation for the Xoriant Portal using atomic design principles.

## Atomic Design Structure

```
components/
├── atoms/                  # Basic building blocks
│   ├── Logo.tsx
│   ├── StatusIndicator.tsx
│   ├── LoadingSpinner.tsx
│   └── Divider.tsx
│
├── molecules/              # Simple component combinations
│   ├── MetricCard.tsx
│   ├── SearchBar.tsx
│   ├── NotificationBell.tsx
│   ├── UserAvatar.tsx
│   ├── ProviderLogo.tsx
│   └── ProgressBar.tsx
│
├── organisms/              # Complex components
│   ├── SideNavigation.tsx
│   ├── TopNavigation.tsx
│   ├── IncidentCard.tsx
│   ├── UserTable.tsx
│   ├── IntegrationsList.tsx
│   └── ProfileDropdown.tsx
│
├── layouts/                # Page layouts
│   ├── DashboardLayout.tsx
│   ├── AuthLayout.tsx (existing)
│   └── PageContainer.tsx
│
└── pages/                  # Page components
    ├── Dashboard.tsx
    ├── IncidentAnalyzer.tsx
    ├── UserManagement.tsx
    ├── IntegrationTool.tsx
    ├── MyProfile.tsx
    ├── AccountSettings.tsx
    └── Preferences.tsx
```

## Responsive Breakpoints

Following Tailwind CSS default breakpoints:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: ≥ 1024px (lg+)

## Key Responsive Behaviors

### Navigation

#### SideNavigation
- **Mobile (< 1024px)**: 
  - Hidden by default
  - Opens as a drawer/sheet overlay
  - Triggered by hamburger menu in TopNav
  - Full width (w-64)
  
- **Desktop (≥ 1024px)**:
  - Fixed sidebar
  - Collapsible (w-20 collapsed, w-64 expanded)
  - Toggle button on sidebar
  - Collapsed by default (can be changed)

#### TopNavigation
- **Mobile**:
  - Compact height (h-14)
  - Hamburger menu button visible
  - Compact search bar
  - Avatar only (no user details)
  - Reduced padding
  
- **Tablet**:
  - Medium height (h-16)
  - Full search bar
  - Avatar with name (hidden on sm)
  
- **Desktop**:
  - Full layout
  - All elements visible
  - Maximum width search bar

### Layout System

#### DashboardLayout
```tsx
<DashboardLayout currentPage="dashboard" onNavigate={...} onLogout={...}>
  <PageContent />
</DashboardLayout>
```

- Handles SideNav + TopNav + Content coordination
- Manages responsive behavior automatically
- AI Assistant panel integration

#### PageContainer
```tsx
<PageContainer padding="md" maxWidth="7xl">
  {/* Page content */}
</PageContainer>
```

- Provides consistent spacing
- Responsive padding: `p-4 sm:p-6 lg:p-8`
- Max-width constraints

### Grid Layouts

#### Metric Cards (Dashboard)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
  {/* Cards */}
</div>
```

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

#### Service/Incident Cards
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
  {/* Cards */}
</div>
```

- Mobile/Tablet: 1 column
- Desktop: 2 columns

### Tables

#### Responsive Table Strategy
1. **Desktop**: Full table layout
2. **Tablet**: Slightly compressed columns
3. **Mobile**: 
   - Option A: Horizontal scroll with `overflow-x-auto`
   - Option B: Card-based layout
   - Option C: Hide less important columns

Example:
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">
    <thead>
      <tr>
        <th className="px-3 sm:px-4 lg:px-6">Column</th>
        <th className="hidden md:table-cell">Desktop Only</th>
      </tr>
    </thead>
  </table>
</div>
```

### Modals/Dialogs

```tsx
<DialogContent className="max-w-[90vw] sm:max-w-md lg:max-w-lg">
  {/* Content */}
</DialogContent>
```

- Mobile: Near full-width (90vw)
- Tablet/Desktop: Fixed max-width
- Vertical scroll for overflow content

### Forms

#### Two-Column to Single-Column
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
  <div>
    <Label>Field 1</Label>
    <Input />
  </div>
  <div>
    <Label>Field 2</Label>
    <Input />
  </div>
</div>
```

### Typography

**No font-size, font-weight, or line-height Tailwind classes** unless specifically requested. Typography is controlled by `/styles/globals.css`.

### Spacing Scale

Consistent spacing using Tailwind spacing scale:
- Gap: `gap-3 sm:gap-4 lg:gap-6`
- Padding: `p-3 sm:p-4 lg:p-6`
- Margin: `mt-3 sm:mt-4 lg:mt-6`

## Component Usage Examples

### Using Atomic Components

```tsx
// Import atoms
import { Logo } from './components/atoms/Logo';
import { StatusIndicator } from './components/atoms/StatusIndicator';

// Import molecules
import { MetricCard } from './components/molecules/MetricCard';
import { SearchBar } from './components/molecules/SearchBar';
import { UserAvatar } from './components/molecules/UserAvatar';

// Using them
<Logo collapsed={isCollapsed} />
<StatusIndicator status="healthy" size="md" showLabel />
<MetricCard 
  title="Service Availability"
  value="99.95%"
  target="Target - 99.9%"
  icon={CheckCircle2}
  iconColor="text-primary-600"
  bgColor="bg-pink-50"
/>
<SearchBar 
  placeholder="Search dashboards..."
  value={searchQuery}
  onChange={setSearchQuery}
/>
<UserAvatar 
  name="John Doe"
  email="john@example.com"
  showDetails
  lastLogin="Today at 09:30 AM"
/>
```

### Using Layout Components

```tsx
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { PageContainer } from './components/layouts/PageContainer';

function MyPage() {
  return (
    <DashboardLayout 
      currentPage="dashboard"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <PageContainer maxWidth="7xl" padding="md">
        <h1>Page Title</h1>
        {/* Page content */}
      </PageContainer>
    </DashboardLayout>
  );
}
```

## Migration Checklist

- [x] Create atomic design folder structure
- [x] Build atom components (Logo, StatusIndicator, LoadingSpinner, Divider)
- [x] Build molecule components (MetricCard, SearchBar, UserAvatar, etc.)
- [x] Build layout components (DashboardLayout, PageContainer)
- [x] Create responsive TopNavigation organism
- [x] Create responsive SideNavigation organism with mobile drawer
- [ ] Update Dashboard page to use atomic components
- [ ] Update IncidentAnalyzer page to be responsive
- [ ] Update UserManagement page to be responsive
- [ ] Update IntegrationTool page to be responsive
- [ ] Update Profile pages to be responsive
- [ ] Update Auth pages to be more responsive
- [ ] Test all breakpoints
- [ ] Ensure all modals/dialogs are responsive
- [ ] Ensure all tables work on mobile

## Responsive Testing Checklist

### Mobile (375px - iPhone SE)
- [ ] Side nav opens as drawer
- [ ] Top nav is compact
- [ ] Cards stack vertically
- [ ] Forms are single column
- [ ] Tables scroll horizontally or show cards
- [ ] Modals are near full-width
- [ ] Buttons are touch-friendly (min 44px)

### Tablet (768px - iPad)
- [ ] Side nav collapsed by default
- [ ] 2-column grids work properly
- [ ] Forms use 2 columns where appropriate
- [ ] Touch targets are adequate

### Desktop (1280px+)
- [ ] Side nav shows expanded
- [ ] All columns visible in tables
- [ ] 4-column metric grids
- [ ] Optimal spacing and layout

## Color Scheme

Primary color: **#AE275F** (dark magenta/pink)

All custom color utilities are defined in `/styles/globals.css`:
- bg-primary-600
- text-primary-600
- border-primary-600
- hover:bg-primary-700
- focus:ring-primary-500

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation supported
- Focus states visible
- Color contrast meets WCAG AA standards
- Screen reader friendly
- Touch targets minimum 44x44px on mobile

## Performance Considerations

- Use `lazy loading` for heavy components
- Optimize images with proper sizes
- Use `virtual scrolling` for long lists
- Minimize re-renders with `useMemo` and `useCallback`
- Code splitting for routes

## Next Steps

1. Migrate existing pages to use DashboardLayout
2. Replace hardcoded components with atomic components
3. Add responsive classes to all elements
4. Test on real devices
5. Optimize performance
6. Document any custom responsive behaviors
