# 📱 Visual Testing Guide - IncidentAnalyzer

## Quick Test Checklist

### 🎯 Test in 3 Simple Steps

#### Step 1: Open DevTools
1. Press `F12` or `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. Click the device toggle button (phone/tablet icon)
3. Or click the 3 dots → More tools → Responsive

#### Step 2: Test Mobile (375px)
Select "iPhone SE" or set width to 375px

**What You Should See:**
```
┌─────────────────────────┐
│ ☰  [Logo]        [👤]  │ ← Hamburger menu
├─────────────────────────┤
│  Incident Management    │ ← Hero section
│  ┌───────────────────┐  │
│  │ Total Incidents   │  │ ← 1 column
│  │      247          │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Avg Resolution    │  │
│  │      18min        │  │
│  └───────────────────┘  │
├─────────────────────────┤
│ Incidents | Analytics   │ ← 2-col tabs
├─────────────────────────┤
│ 🔍 Search incidents...  │ ← Full width
├─────────────────────────┤
│ ☁️ Provider      ˅      │ ← Full width button
│ ⚠️ Type         ˅      │ ← Full width button
│ 🕐 24h          ˅      │ ← Full width button
├─────────────────────────┤
│ Showing 4 of 4          │
├─────────────────────────┤
│ ┌─────────────────────┐│
│ │ ⚠️ Immediate action  ││ ← Alert banner
│ │ ⚠️ High CPU...       ││
│ │ [CRITICAL]          ││
│ │ 🤖 👁️ 🔄            ││ ← Actions
│ │ kubernetes-engine   ││
│ │ 14 Oct 2025         ││
│ │ 💡 Increased read... ││
│ └─────────────────────┘│
│ ┌─────────────────────┐│
│ │ Next incident...    ││
│ └─────────────────────┘│
└─────────────────────────┘
```

**✅ Success Indicators:**
- [ ] Hamburger menu (☰) visible in top-left
- [ ] Metrics stack in 1 column
- [ ] Tabs show 2 columns (Incidents | Analytics)
- [ ] Search bar is full width
- [ ] Filter buttons are full width
- [ ] Incident cards stack vertically
- [ ] No horizontal scrolling

**❌ Failure Signs:**
- Content cut off on sides
- Horizontal scroll bar
- Overlapping elements
- Tiny text (unreadable)

#### Step 3: Click Filter Button

**What Should Happen:**
```
┌─────────────────────────┐
│                         │
│                         │
│                         │ ← Page content (dimmed)
│                         │
├─────────────────────────┤
│ Filter by Provider   ✕  │ ← Bottom sheet header
├─────────────────────────┤
│ 🔍 Search accounts...   │
├─────────────────────────┤
│ ▼ AWS                   │
│   ☐ All AWS Accounts    │
│   ☐ Production Main     │
│ ▼ AZURE                 │
│   ☐ All Azure Subs      │
│ ▼ GCP                   │
│   ☐ All GCP Projects    │
├─────────────────────────┤
│ [ Apply Filter ]        │ ← Action button
└─────────────────────────┘
```

**✅ Success Indicators:**
- [ ] Bottom sheet slides up from bottom
- [ ] Black backdrop behind
- [ ] Header shows "Filter by Provider" with X
- [ ] Checkboxes are large (easy to tap)
- [ ] "Apply Filter" button at bottom
- [ ] Can close by clicking X or backdrop

### 🔄 Test Different Sizes

#### Mobile Portrait (375px)
```bash
Width: 375px
Expected: Single column, bottom sheets
```

#### Mobile Landscape (667px x 375px)
```bash
Width: 667px (rotated)
Expected: Still mobile layout, more horizontal space
```

#### Tablet (768px)
```bash
Width: 768px
Select: iPad
Expected: 2-column metrics, dropdowns still bottom sheets
```

#### Desktop (1280px)
```bash
Width: 1280px
Expected: 4-column metrics, positioned dropdowns
```

## 🎨 Visual Comparison

### Mobile Layout Flow

#### Hero Section (Mobile)
```
┌─────────────────┐
│ System Health   │
├─────────────────┤
│ ┌─────────────┐ │  ← Metric 1 (full width)
│ │ Total: 247  │ │
│ └─────────────┘ │
│ ┌─────────────┐ │  ← Metric 2
│ │ Time: 18min │ │
│ └─────────────┘ │
│ ┌─────────────┐ │  ← Metric 3
│ │ AI: 94.2%   │ │
│ └─────────────┘ │
│ ┌─────────────┐ │  ← Metric 4
│ │ Cost: $24K  │ │
│ └─────────────┘ │
└─────────────────┘
```

#### Hero Section (Tablet)
```
┌───────────────────────────┐
│ System Health             │
├─────────────┬─────────────┤
│ Total: 247  │ Time: 18min │  ← 2 columns
├─────────────┼─────────────┤
│ AI: 94.2%   │ Cost: $24K  │
└─────────────┴─────────────┘
```

#### Hero Section (Desktop)
```
┌──────────────────────────────────────────┐
│ System Health                            │
├─────────┬─────────┬─────────┬───────────┤
│ Total   │ Time    │ AI      │ Cost      │  ← 4 columns
│ 247     │ 18min   │ 94.2%   │ $24.5K    │
└─────────┴─────────┴─────────┴───────────┘
```

### Filter Dropdowns

#### Mobile (Bottom Sheet)
```
Full screen height
Bottom sheet slides up
Backdrop dims page
Touch-friendly checkboxes
Apply button at bottom
```

#### Desktop (Dropdown)
```
Positioned below button
No backdrop
Smaller, compact
Auto-close on selection
```

### Incident Cards

#### Mobile
```
┌───────────────────────┐
│ ⚠️ Alert banner       │
├───────────────────────┤
│ ⚠️ Title              │  ← Stack vertically
│ [Badge]               │
│ 🤖 👁️ 🔄              │  ← Actions
├───────────────────────┤
│ kubernetes-engine     │
│ 14 Oct 2025          │
├───────────────────────┤
│ ☁️ GKE Clusters       │
│ gke-main-789012      │
├───────────────────────┤
│ Metrics: ReadIOPS...  │  ← Wrap
├───────────────────────┤
│ 💡 Recommendation     │
└───────────────────────┘
```

#### Desktop
```
┌─────────────────────────────────────────────┐
│ ⚠️ Alert banner                             │
├────────────────────────────┬────────────────┤
│ ⚠️ Title [Badge]           │ 🤖 👁️ 🔄       │  ← Side by side
├────────────────────────────┴────────────────┤
│ kubernetes-engine | 14 Oct 2025            │  ← Inline
├─────────────────────────────────────────────┤
│ ☁️ GKE Clusters | gke-main-789012          │  ← Inline
├─────────────────────────────────────────────┤
│ Metrics: ReadIOPS 2.03 | WriteIOPS 1.5 | DB│  ← Inline
├─────────────────────────────────────────────┤
│ 💡 Recommendation text here...              │
└─────────────────────────────────────────────┘
```

## 🧪 Interactive Tests

### Test 1: Filter Bottom Sheet (Mobile)
1. Resize to 375px
2. Click "Provider" button
3. **Expected**: Sheet slides up from bottom
4. Click backdrop (dark area)
5. **Expected**: Sheet closes

### Test 2: Search (All Sizes)
1. Click search bar
2. Type "CPU"
3. **Expected**: Filters incidents immediately
4. Clear search
5. **Expected**: Shows all incidents

### Test 3: Incident Modal (Mobile)
1. Resize to 375px
2. Click eye icon (👁️) on any incident
3. **Expected**: 
   - Modal opens
   - Fits screen width
   - Tabs scroll horizontally if needed
   - Can scroll content

### Test 4: Navigation (Mobile)
1. Resize to 375px
2. Click hamburger menu (☰)
3. **Expected**: Side drawer slides in
4. Click a menu item
5. **Expected**: Navigates and drawer closes

### Test 5: Responsive Metrics
1. Start at 375px (1 column)
2. Resize to 640px (should switch to 2 columns)
3. Resize to 1024px (should switch to 4 columns)
4. **Expected**: Smooth transition, no jumping

## 📏 Measurement Guide

### Tap Target Sizes (Mobile)
```
Minimum: 44px × 44px
Current Implementation:
- Buttons: p-2 = 8px padding + 16px icon = 32px (with card padding = 44px+)
- Checkboxes: w-5 h-5 = 20px (with padding = 44px+)
- Filter buttons: py-2 = min 40px height
✅ All meet minimum
```

### Text Sizes
```
Mobile:
- H1 (Hero): Default (from globals.css)
- Body: text-sm (14px)
- Small: text-xs (12px)

Desktop:
- H1: Default (larger from globals.css)
- Body: text-base (16px)
- Small: text-sm (14px)
```

### Spacing
```
Mobile:
- Page padding: px-4 py-6
- Card padding: p-4
- Gaps: gap-3

Desktop:
- Page padding: px-8 py-10
- Card padding: p-5 or p-6
- Gaps: gap-5 or gap-6
```

## ✅ Success Checklist

After testing, you should have:

### Mobile (< 640px)
- [ ] Hamburger menu visible and working
- [ ] Single column metrics
- [ ] Full-width search and filters
- [ ] Bottom sheet filter dropdowns
- [ ] Stacked incident cards
- [ ] Modal fits screen
- [ ] No horizontal scroll
- [ ] All text readable
- [ ] All buttons tappable (≥44px)

### Tablet (640-1024px)
- [ ] Two-column metrics
- [ ] Responsive navigation
- [ ] Filters work properly
- [ ] Cards display well
- [ ] Modal sized appropriately

### Desktop (≥1024px)
- [ ] Four-column metrics
- [ ] Positioned filter dropdowns
- [ ] All details visible
- [ ] Optimal spacing
- [ ] Full functionality

## 🐛 Common Issues & Fixes

### Issue: Horizontal Scrolling
**Fix**: Check for fixed widths, use max-w-full

### Issue: Text Too Small
**Fix**: Should use responsive text sizes (text-xs sm:text-sm)

### Issue: Buttons Too Small
**Fix**: Minimum py-2 px-3, total tap target ≥44px

### Issue: Modal Too Wide
**Fix**: Already fixed with w-[95vw] sm:w-[90vw]

### Issue: Filters Don't Open
**Fix**: Check z-index, should be z-50

### Issue: Cards Overlapping
**Fix**: Should use gap-4 minimum on grid

## 🎬 Video Test Sequence

1. **Start at desktop** (1280px)
   - See full layout
   - Note 4-column metrics

2. **Resize to tablet** (768px)
   - Watch metrics switch to 2 columns
   - Verify everything still works

3. **Resize to mobile** (375px)
   - Watch metrics stack to 1 column
   - See hamburger menu appear
   - Click hamburger
   - Watch drawer slide in

4. **Click Provider filter**
   - Watch bottom sheet slide up
   - See backdrop
   - Click checkbox
   - Click Apply Filter

5. **Click incident eye icon**
   - Watch modal open
   - Scroll through tabs
   - Close modal

6. **Scroll page**
   - Verify smooth scrolling
   - No horizontal movement

## 🎉 You're Done!

If all tests pass, your IncidentAnalyzer is **FULLY RESPONSIVE**! 🚀

---

*Test systematically, one breakpoint at a time. Every check mark is a win!*
