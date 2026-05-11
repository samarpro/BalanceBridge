# Plan: limits gate, welcome copy, and wellbeing “glass” dashboard

This document captures the intended implementation for the request below. It is a **plan only** (not a spec of completed work); use it to resume or hand off the feature.

## Original ask (summary)

1. **Work limit & study limit** — There was no durable way to set caps. If the user is new **or** limits were never confirmed, **prompt after onboarding** (before treating the app as fully configured) to set these values first.
2. **Welcome line** — Use the **preferred name from onboarding** (already stored via Zustand / `userProfile.displayName`) for a **“Welcome, {Name}”** (with a sensible fallback when empty).
3. **Wellbeing UI** — Replace long scroll-heavy layouts with **circular (radial) progress** in **tile cards**, **glassmorphism** styling, and a layout that keeps **core stats visible without scrolling** the main page (viewport-sized panel; optional micro-scroll only inside a dense tile such as tasks if needed).

---

## 1. Data model & persistence

### Fields (already partly aligned with codebase direction)

- **`weeklyStudyGoalMinutes`** — Weekly study target (ISO week), drives dashboard “study goal” and wellbeing study ring.
- **`fortnightWorkLimitHours`** — Cap for rolling **14-day** shift total, replaces any hard-coded `48` where “fortnight cap” was implied.
- **`limitsConfigured: boolean`** on persisted profile — When `false` or missing (legacy), user must complete the limits dialog once after onboarding. When `true`, limits are authoritative.

### Storage

- Extend **`UserProfile`** in `src/lib/profile-storage.ts` (or equivalent) so `saveUserProfile` / `loadUserProfile` round-trip `limitsConfigured`, `weeklyStudyGoalMinutes`, and `fortnightWorkLimitHours`.
- Keep **`LEGACY_KEY`** strings that still mention `balance-bridge-*` **unchanged** so old `localStorage` rows keep migrating.

### Zustand (`src/stores/kira-store.ts`)

- Hydrate store from `loadUserProfile()` on init.
- **`completeLimitsSetup(studyMinutes, workHoursFortnight)`** — Writes profile (`limitsConfigured: true`), updates store slices, closes any “editor” overlay flag.
- **`limitsEditorOpen`** + **`openLimitsEditor` / `closeLimitsEditor`** — Optional entry point from Dashboard / Wellbeing (“Adjust limits”) without forcing onboarding again.

---

## 2. Limits gate (post-onboarding)

### UX

- **`LimitsSetupModal`** (under `src/components/kira/`) — Modal with:
  - Study target in **hours/week** (clearer than raw minutes in UI); convert to minutes on save.
  - Work cap in **hours/fortnight**.
  - Validation bands (e.g. study 1–100 h/week, work 1–120 h/fortnight) with inline invalid state.
  - **Required mode** when `!limitsConfigured`: overlay **not dismissable** (no backdrop close, no Escape dismiss) until Save succeeds.
  - **Optional mode** when user opens “Edit limits”: dismissable, Cancel restores overlay state only.

### Placement

- Render from **`src/pages/app/app-shell.tsx`** so the gate applies across tabs:
  - `isOpen = !limitsConfigured || limitsEditorOpen`
  - `isRequired = !limitsConfigured`

### Copy

- All strings under **`limits.*`** in `src/i18n/strings.ts` (title, required vs optional body, labels, hints, save/cancel).

### Downstream consumers

- **`dashboard-panel.tsx`** — Progress for work uses **`fortnightWorkLimitHours`** from store; study uses **`weeklyStudyGoalMinutes`**. Add a small **“Adjust study & work limits”** control calling `openLimitsEditor`.
- Any other place that assumed a fixed fortnight cap should read the store.

---

## 3. Welcome `{Name}`

- Read **`useKiraStore((s) => s.userProfile.displayName)`** (set during onboarding login).
- Wellbeing (or a shared app header if product prefers): heading **`t("wellbeing.welcome")`** with `{{name}}` replaced, or a tiny `tw()` helper; fallback **`t("wellbeing.welcomeGuest")`** when `displayName` is blank/whitespace.

---

## 4. Wellbeing panel — glass tiles + radial stats + less scroll

### Visual system

- **Glass tile** recipe (example): `rounded-2xl border border-white/25 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl shadow-lg` + dark variants aligned with existing app shell glass nav.
- **Radial chart** — SVG `<circle>` with `stroke-dasharray` / `stroke-dashoffset` on a track ring; **clamp** displayed arc to 100% but allow label to show “over cap” (e.g. `112%` or `12.5 / 10 h`).

### Metrics to show as rings (map to existing aggregates)

| Ring | Numerator | Denominator (cap / reference) |
|------|-----------|-------------------------------|
| Study | `calendarWeekKindMinutes(..., "study")` | `weeklyStudyGoalMinutes` |
| Work | `fortnightShiftMinutes(...)` | `fortnightWorkLimitHours * 60` |
| Screen | `estimatedWeekScreenMinutes(studyWeek)` | fixed soft cap (e.g. 960 min, matching util max) |
| Week load | Sum over Mon–Sun of shift + study + exam minutes | soft cap (e.g. 40h/week) or `max(40h, 1.2 * peak day)` |
| Month shifts | `monthlyShiftMinutesByWeek` total for month | reference pace (e.g. 80h/month) or peak-week normalisation |

### Layout

- Outer container: **`max-h-[calc(100dvh - headerEstimate)]`**, **`min-h-0`**, **`overflow-hidden`** on the panel root so the **document** does not scroll for this tab.
- Grid: **2×3** or **3×2** responsive (`grid-cols-2` → `lg:grid-cols-3`), **`min-h-0 flex-1`** on grid so tiles share height.
- **Tasks** — Compact tile; if list grows, **`overflow-y-auto` only inside that tile** (acceptable exception to “no scroll” for the main view).

### Content to retire or shrink

- Large **Recharts** bar sections (monthly shift bars, stacked week load) can be **removed or collapsed** into the rings above + tooltips / subtitle text so the view stays one screen.

### i18n

- Add **`wellbeing.welcome`**, **`wellbeing.welcomeGuest`**, ring titles/subtitles, **`wellbeing.editLimits`**, and adjust/remove obsolete strings if bars go away.

---

## 5. Testing & migration

- **New user** — Complete onboarding → limits modal appears → save → dashboard/wellbeing use new caps.
- **Legacy `localStorage`** — No `limitsConfigured` → treat as **false**, show gate once; pre-fill suggested defaults in the modal (e.g. 12 h/week study, 48 h/fortnight work) without silently persisting until Save.
- **`npm run build`** — Must pass; every new `t("…")` id must exist in `catalog`.

---

## 6. File touch list (expected)

| Area | Files |
|------|--------|
| Profile | `src/lib/profile-storage.ts` |
| Store | `src/stores/kira-store.ts` |
| Gate UI | `src/components/kira/limits-setup-modal.tsx`, `src/pages/app/app-shell.tsx` |
| Dashboard | `src/pages/app/dashboard-panel.tsx` |
| Wellbeing | `src/pages/app/wellbeing-panel.tsx` (largest UI change) |
| Copy | `src/i18n/strings.ts` |
| Docs / plan | `docs/plan-limits-wellbeing-welcome.md` (this file) |

---

## 7. Out of scope / follow-ups

- Real auth or server-side persistence of limits (demo remains `localStorage`).
- Changing limits mid-week policy (e.g. whether ISO week progress resets) — product default: **limits are targets/caps only**, calendar data unchanged.
- Accessibility audit on radial tiles (`aria-label` with full “used / limit” sentence).
