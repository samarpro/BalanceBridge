Kira Dashboard â€” Full design analysis and revamp prompt
Kira â€” design system extraction + revamp prompt
Full design token analysis from the screenshot, plus a copy-ready agent prompt.
COLOR PALETTE
Base cream bg
Card white
Terracotta / work
Lavender / study
Sage green / wellbeing
Amber / near-limit
Green / compliant
Purple / accent
Terracotta dark
Sidebar bg
TYPOGRAPHY + SPACING TOKENS
Body font
Inter / system-sans
Heading size
28px / weight 700
Section label
11px / uppercase / tracked
Metric number
24â€“32px / weight 700
Body copy
13â€“14px / weight 400
Card radius
16px
Sidebar width
220px fixed
Card shadow
subtle, warm-tinted
Progress bar
pill shape, 10px height
Breakpoints
768px / 1024px
DESIGN PRINCIPLES EXTRACTED
1. Semantic color-coding by activity â€” work = warm coral/terracotta, study = lavender, social = lilac, near-limit = amber. This is the most defining visual pattern.

2. Warm, low-contrast softness â€” no pure white or pure black. Every surface is slightly tinted toward cream. Shadows are warm, not grey.

3. Number-first hierarchy â€” the largest type is always the metric (18/24/32 hrs). Labels are small and muted. The number is the headline.

4. Status-aware progress bars â€” green when safe, amber when close to cap. Pills, not rectangles.

5. Card clustering â€” related metrics sit in one rounded card. No bare floating elements. Always contained.

6. Calendar as primary navigation surface â€” week view is the centrepiece, not just a detail.

7. Responsive strategy â€” sidebar collapses to bottom nav on mobile, summary cards stack to single column, calendar shifts to vertical day-list below 768px.
COMPLETE REVAMP AGENT PROMPT Â€” COPY AND USE
You are a senior product designer and front-end developer. Revamp the Kira student dashboard with a complete visual and structural makeover. Maintain all existing features and data â€” only redesign the presentation layer.

---

DESIGN SYSTEM

Color palette (CSS variables to define):
  --color-bg-base: #F5EFE6        /* warm cream page background */
  --color-bg-sidebar: #EEE5D8     /* slightly deeper cream for sidebar */
  --color-bg-card: #FFFFFF        /* card surfaces */
  --color-accent-work: #E8B4A0    /* terracotta â€” work shifts */
  --color-accent-work-dark: #C47A5A
  --color-accent-study: #C9C2E8   /* lavender â€” study blocks */
  --color-accent-study-dark: #8F86C4
  --color-accent-social: #D4C9EF  /* lilac â€” social events */
  --color-accent-wellbeing: #BCD9C4 /* sage green â€” breaks/wellbeing */
  --color-accent-warning: #E8C97E  /* amber â€” near-limit state */
  --color-accent-success: #6BAE8A  /* green â€” compliant/safe state */
  --color-text-primary: #2C2420
  --color-text-secondary: #7A6E68
  --color-text-muted: #A89E98
  --color-border: rgba(120, 100, 80, 0.12)

Typography:
  Font family: 'Inter', system-ui, sans-serif
  Page heading (greeting): 28â€“32px, weight 700, --color-text-primary
  Section label: 11px, weight 600, uppercase, letter-spacing 0.08em, --color-text-muted
  Metric number: 24â€“32px, weight 700, --color-text-primary
  Card label: 12â€“13px, weight 500, --color-text-secondary
  Body copy: 13â€“14px, weight 400, --color-text-secondary, line-height 1.6
  Greeting accent (day/date): same size as heading, --color-accent-work-dark

Border radius:
  Cards: 16px
  Progress bars: 999px (pill)
  Badges/tags: 8px
  Sidebar nav items (active): 12px

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48px

Shadows: box-shadow: 0 2px 8px rgba(100, 70, 40, 0.07) on cards

---

LAYOUT STRUCTURE

Desktop (â‰¥1024px):
  - Fixed sidebar: 220px wide, full height, --color-bg-sidebar
  - Main content area: fluid, left-margin 220px, padding 32px
  - Top bar: inline with main content, full width, search + avatar right-aligned
  - Summary cards row: 3-column grid with gap-16
  - Visa hours banner: full width card above summary cards
  - Weekly calendar: full width, 7 equal columns, min-height 400px

Tablet (768pxâ€“1023px):
  - Sidebar collapses to icon-only rail (56px wide), icons with tooltips
  - Summary cards: 2-column grid
  - Calendar: 7 columns maintained, smaller column widths, horizontally scrollable if needed

Mobile (<768px):
  - Sidebar disappears entirely
  - Bottom navigation bar: fixed, height 56px, 5 tabs (Dashboard, Schedule, Explore, Wellbeing, Profile)
  - Summary cards: single column stack
  - Calendar: hide 7-column grid, replace with scrollable day-list view showing today + next 4 days
  - Visa hours banner: compact single-row layout showing only fortnight total + status badge

---

COMPONENT SPECS

Sidebar navigation:
  - App logo/name top-left, 18px weight 600
  - Nav items: 14px, icon (20px) + label, 12px border-radius on active state
  - Active state: --color-accent-work background at 20% opacity, --color-accent-work-dark text
  - Hover: --color-bg-base background
  - Bottom: language switcher + subtle version tag

Visa hours card:
  - Two progress bars side by side (This week / This fortnight)
  - Progress bars: pill-shaped, 10px height, green fill when <70% used, amber when â‰¥85%
  - Status badge top-right: "Compliant" in green bg/text, "At risk" in amber, "Over limit" in red
  - Warning text below bar uses amber color + warning icon when close to cap

Summary metric cards (3-up row):
  - Each card: white bg, 16px radius, 16px padding, warm shadow
  - Top: small icon (24px) in tinted circle (matching accent color at 20% opacity)
  - Label: 11px uppercase muted
  - Primary value: 28px weight 700 (e.g. "18 / 24")
  - Sub-label: 13px muted (e.g. "6 hrs left this week")
  - Work card: --color-accent-work tint
  - Exam mode card: --color-accent-study tint
  - Break card: --color-accent-wellbeing tint

Weekly calendar grid:
  - Column headers: day abbreviation (13px muted) + date number (16px weight 500)
  - Today column: date circle with --color-accent-work-dark fill, white text
  - Time labels: left gutter, 12px muted, every hour
  - Event blocks: rounded 8px, colored per activity type (see color palette above)
  - Event block content: bold title 12px, subtitle 11px muted, time range 11px
  - Near-limit events: amber left-border accent or amber badge overlay

Fortnight sidebar widget (bottom-left):
  - Compact card showing 32/48 hrs + mini horizontal progress bar
  - "Heads up" label in amber when within 16hrs of cap

---

RESPONSIVE BEHAVIOR RULES

1. Never show horizontal scroll on the page itself â€” only inside calendar on mobile.
2. On mobile, the bottom nav must always be above any floating action button.
3. The floating "+" action button: bottom-right, 56px circle, --color-accent-work-dark fill, white icon, fixed position. On mobile: 16px from bottom-right, above bottom nav (bottom: 72px).
4. Metric cards must never shrink below 140px width â€” reduce to single column before that.
5. Calendar event blocks must always show at minimum the event title, even at narrow widths.
6. On tablet/mobile, the Visa hours card collapses both bars into a single stacked layout.
7. Search bar in top bar collapses to an icon-only button on mobile.

---

INTERACTION + MOTION

- Nav item hover/active: 150ms ease background transition
- Progress bar fill: animate width from 0 on page load, 600ms ease-out
- Card hover: subtle translateY(-2px) + slightly deeper shadow, 150ms ease
- Calendar event hover: slight background darken, cursor pointer
- Floating button: scale(1.08) on hover, 150ms ease

---

ACCESSIBILITY

- All color-coded elements must include a text label or icon â€” never rely on color alone
- Progress bars use role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
- Bottom nav items include aria-label
- Focus rings: 2px offset outline using --color-accent-work-dark at 60% opacity
- Minimum touch target: 44x44px on all interactive elements

---

OUTPUT

Produce a fully responsive HTML/CSS/JS single-file implementation of the revamped dashboard. Use CSS custom properties for all design tokens. Include a realistic data state (Wei's name, SIT216 exam in 6 days, 18/24 hrs this week, 32/48 this fortnight). The calendar should show the current week (Mon 12 â€“ Sun 18 May) with the SIT216 lectures on Tue and Wed pre-populated.

Copy prompt