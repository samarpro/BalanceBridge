/**
 * Central copy catalog for KIRA. Replace `catalog` values or wire `t()`
 * to react-i18next / Format.JS when you add real locales.
 */
export const catalog = {
    "app.name": "KIRA",
    "app.tagline": "Study, work & wellbeing — prioritized.",
    "app.taglineDetail": "✨ Study, work, and wellbeing in one prioritized place.",

    "onboarding.welcome.title": "👋 Welcome to KIRA",
    "onboarding.welcome.lead": "One calm place for your week.",
    "onboarding.welcome.body":
        "Protect study time, stay inside work-hour limits, and find low-pressure campus connection—all in one schedule.",
    "onboarding.welcome.socialProof": "Trusted by 10+ students across campuses (pilot).",
    "onboarding.welcome.hintTitle": "What KIRA does for you",
    "onboarding.welcome.cta": "Continue",

    "onboarding.login.title": "Your name and account",
    "onboarding.login.subtitle": "Local demo profile — details on hover.",
    "onboarding.login.subtitleDetail":
        "Tell us how to greet you and which email you use on campus. Your timetable, tasks, and RSVPs stay in this browser on your device until you connect a real account in a future build.",
    "onboarding.login.hintTitle": "Privacy & storage",
    "onboarding.login.nameLabel": "Preferred name",
    "onboarding.login.nameHint": "Used to personalise KIRA after onboarding.",
    "onboarding.login.namePlaceholder": "Alex",
    "onboarding.login.emailLabel": "University email",
    "onboarding.login.emailHint": "We use this to verify you are a student before enabling social features.",
    "onboarding.login.emailPlaceholder": "you@student.university.edu.au",
    "onboarding.login.passwordLabel": "Password",
    "onboarding.login.passwordHint":
        "Not sent anywhere — this build stores your profile and schedule only in your browser (localStorage). Use a disposable password if you prefer.",
    "onboarding.login.passwordPlaceholder": "Choose a password",
    "onboarding.login.ssoUniversity": "Continue with university SSO",
    "onboarding.login.ssoGoogle": "Continue with Google (Calendar)",
    "onboarding.login.ssoMicrosoft": "Continue with Microsoft (Outlook)",
    "onboarding.login.demoLead": "Demo only — SSO is simulated.",
    "onboarding.login.demoNote": "Demo only — SSO would open your institution’s login page.",
    "onboarding.login.next": "Continue",

    "onboarding.priorities.title": "What matters most in your week?",
    "onboarding.priorities.lead": "Reorder the list — top items win when times clash.",
    "onboarding.priorities.body":
        "Drag isn’t required—move items up or down. KIRA uses this order when two blocks collide: we’ll nudge you toward what you said matters most.",
    "onboarding.priorities.hint": "Typical for working students: study and exams, paid shifts, health, admin, friends, rest.",
    "onboarding.priorities.hintTitle": "How ordering works",
    "onboarding.priorities.cta": "Save order & continue",

    "lifePriority.study": "Study & classes",
    "lifePriority.work": "Paid work / shifts",
    "lifePriority.health": "Health & movement",
    "lifePriority.personal": "Personal / admin",
    "lifePriority.social": "Social life",
    "lifePriority.rest": "Rest & recovery",

    "onboarding.timetable.title": "Bring your timetable into KIRA",
    "onboarding.timetable.lead": "Import classes to layer shifts, exams, and wellbeing.",
    "onboarding.timetable.body": "Import classes so we can layer shifts, exams, and wellbeing alongside your real week.",
    "onboarding.timetable.hintTitle": "Why import",
    "onboarding.timetable.ics": "Upload .ics file",
    "onboarding.timetable.google": "Connect Google Calendar",
    "onboarding.timetable.outlook": "Connect Outlook Calendar",
    "onboarding.timetable.skip": "I’ll add this later",
    "onboarding.timetable.next": "Continue",

    "onboarding.start.title": "You’re set up to build better weeks",
    "onboarding.start.lead": "Small habits beat cram sessions — we keep the UI calm.",
    "onboarding.start.body":
        "Small, steady habits beat heroic cram sessions. Sync your timetable, log realistic shifts, and check in when energy dips—we’ll keep the interface calm so you can focus.",
    "onboarding.start.hintTitle": "What happens next",
    "onboarding.start.cta": "Open KIRA",

    "app.tab.dashboard": "🏠 Dashboard",
    "app.tab.calendar": "📆 Calendar",
    "app.tab.wellbeing": "💚 Wellbeing",
    "app.tab.events": "🎉 Events",
    "app.nav.dashboard": "Dashboard",
    "app.nav.calendar": "Calendar",
    "app.nav.schedule": "Schedule",
    "app.nav.explore": "Explore",
    "app.nav.wellbeing": "Wellbeing",
    "app.nav.events": "Events",
    "app.nav.profile": "Profile",
    "app.menuTitle": "✨ Where to next?",
    "app.searchPlaceholder": "Search schedule, events, tasks…",
    "app.hover.tagline": "About KIRA",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "Auto",

    "dashboard.workHours": "Fortnight work",
    "dashboard.workHoursCaption": "Sum of shift blocks on your calendar in the last 14 days.",
    "dashboard.goalTitle": "Weekly study",
    "dashboard.goalCaption": "Compared to your weekly study target using calendar study blocks this ISO week.",
    "dashboard.upcoming": "Upcoming",
    "dashboard.dayScheduleCaption": "All timed entries on your calendar for this day (same data as the Calendar tab).",
    "dashboard.weekScheduleCaption": "Timed entries for this Monday–Sunday week (same data as the Calendar tab).",
    "dashboard.weekDayEmpty": "No timed entries.",
    "dashboard.weekListAria": "This week’s schedule as a list by day",
    "dashboard.dayScheduleClickHint": "Click an empty spot on the grid to add a 30-minute task (snapped to the nearest quarter hour). Click a block to edit.",
    "dashboard.timelineAddTaskAria": "Add task at clicked time",
    "dashboard.dayTimelineAria": "Daily schedule timeline",
    "dashboard.openFullCalendar": "Full calendar",
    "dashboard.nextAction.title": "Next up",
    "dashboard.nextAction.headline": "Start here",
    "dashboard.nextAction.hint": "Open calendar entries are ranked by overdue status, then deadline (if you set one) or scheduled date, then priority.",
    "dashboard.nextAction.empty": "🎉 You're all caught up — no open entries need a push.",
    "dashboard.nextAction.overdue": "Overdue",
    "dashboard.nextAction.deadline": "Deadline",
    "dashboard.nextAction.scheduled": "Scheduled",
    "dashboard.nextAction.alsoConsider": "Also consider",
    "aria.previousDay": "Previous day",
    "aria.nextDay": "Next day",
    "aria.previousWeek": "Previous week",
    "aria.nextWeek": "Next week",

    "dashboard.calendarPreview": "This month",
    "dashboard.editLimits": "Adjust",

    "dashboard.revamp.greetingMorning": "Good morning",
    "dashboard.revamp.greetingAfternoon": "Good afternoon",
    "dashboard.revamp.greetingEvening": "Good evening",

    "dashboard.revamp.visaTitle": "Schedule health at a glance",
    "dashboard.revamp.visaSubtitle": "Paid shifts in your calendar compared to typical weekly and fortnight caps.",
    "dashboard.revamp.thisWeek": "This week",
    "dashboard.revamp.thisFortnight": "This fortnight",
    "dashboard.revamp.weekWorkHint": "Shift hours this ISO week vs half your fortnight cap (planning guide).",
    "dashboard.revamp.fortnightHint": "Rolling last 14 days of shift blocks vs your saved cap.",
    "dashboard.revamp.warningNearCap": "You are close to your fortnight shift cap — double-check upcoming rosters.",
    "dashboard.revamp.metricWorkTitle": "Work this week",
    "dashboard.revamp.metricWorkSub": "{{hours}} hrs logged · shifts",
    "dashboard.revamp.metricExamTitle": "Exam focus",
    "dashboard.revamp.metricExamSub": "{{hours}} hrs study logged this week",
    "dashboard.revamp.metricExamCountdown": "Next exam in {{days}} days",
    "dashboard.revamp.metricExamNone": "No exam blocks this week — keep steady study.",
    "dashboard.revamp.metricBreakTitle": "Wellbeing",
    "dashboard.revamp.metricBreakSub": "{{open}} open wellbeing tasks",
    "dashboard.revamp.metricWorkTooltipTitle": "Work this week",
    "dashboard.revamp.metricWorkTooltipBody": "Paid shift hours scheduled this ISO week, compared to half your saved fortnight cap (planning guide).",
    "dashboard.revamp.metricExamTooltipTitle": "Exam focus",
    "dashboard.revamp.metricExamTooltipBody": "Study blocks logged this week versus your weekly study goal. Countdown uses the next upcoming exam on your calendar.",
    "dashboard.revamp.metricWellbeingTooltipTitle": "Wellbeing",
    "dashboard.revamp.metricWellbeingTooltipBody": "How many wellbeing checklist tasks are still open — small wins you can tick off between shifts and study.",
    "dashboard.revamp.liquidOrbAriaWork": "Animated gauge: this week’s shift hours compared to your weekly planning cap.",
    "dashboard.revamp.visaLiquidOrbFortnightAria": "Animated gauge: rolling fortnight shift hours compared to your saved cap.",
    "dashboard.revamp.wellbeingSpiritCaption": "{{completed}} of {{total}} checklist tasks completed.",
    "dashboard.revamp.wellbeingSpiritCaptionEmpty": "No wellbeing tasks yet — add a small win on the Wellbeing tab.",
    "dashboard.revamp.wellbeingSpiritAria": "Wellbeing spirit level: {{completed}} of {{total}} wellbeing checklist tasks completed.",
    "dashboard.revamp.statusCompliant": "Compliant",
    "dashboard.revamp.statusAtRisk": "At risk",
    "dashboard.revamp.statusOver": "Over limit",
    "dashboard.revamp.sidebarFortnight": "Fortnight shifts",
    "dashboard.revamp.sidebarHeadsUp": "Heads up — within 16 h of your cap.",
    "dashboard.revamp.language": "Language",
    "dashboard.revamp.langEn": "English",

    "profile.revamp.section": "Profile",
    "profile.revamp.fallbackName": "Student",
    "profile.revamp.noEmail": "No university email on file yet.",
    "profile.revamp.limits": "Schedule limits",
    "profile.revamp.limitsBody": "Study targets and work caps power your progress bars on the dashboard and wellbeing view.",
    "profile.revamp.version": "KIRA v{{version}} — local demo",

    "aria.search": "Search",
    "aria.bottomNav": "Primary",

    "limits.modalTitle": "Set your weekly guardrails",
    "limits.modalBodyRequired":
        "Tell KIRA how much study time you are aiming for each week and how many paid hours you want to cap across a fortnight. You can change these later from the dashboard.",
    "limits.modalBodyOptional":
        "Update your weekly study target and fortnight work cap. These drive progress rings on your dashboard and wellbeing view.",
    "limits.studyHoursLabel": "Study target (hours per week)",
    "limits.studyHoursHint": "Typical range 8–25. Calendar study blocks this ISO week are compared to this goal.",
    "limits.workHoursLabel": "Work limit (hours per fortnight)",
    "limits.workHoursHint": "Typical range 20–48. Rolling 14-day shift totals from your calendar are compared to this cap.",
    "limits.save": "Save limits",
    "limits.cancel": "Cancel",

    "calendar.newTaskDefaultTitle": "New task",
    "calendar.addPlaceholder": "What do you want to schedule?",
    "calendar.addHint": "Details stay inline below — the card lifts with a soft glow on hover or keyboard focus.",
    "calendar.quickAddSectionLabel": "Quick add",
    "calendar.quickAdd": "Quick add",
    "calendar.quickAddDetails": "More details",
    "calendar.quickAddHint": "Quick add creates a study block today with a typical window. Use More details for date, time, and type.",
    "calendar.insightsSectionLabel": "Planner insights",
    "calendar.insightsHint": "Live status cards from your calendar data: remaining shift hours, estimated study sessions, and overlap blocks intercepted.",
    "calendar.insights.shiftRemainingTitle": "Shift hours left",
    "calendar.insights.shiftRemainingSub": "{{used}} used of {{cap}} fortnight cap.",
    "calendar.insights.studySessionsTitle": "Study sessions left",
    "calendar.insights.studySessionsSub": "{{time}} estimated across open study and exam tasks.",
    "calendar.insights.conflictsSavedTitle": "Conflicts intercepted",
    "calendar.insights.conflictsSavedSub": "Count increases each time the overlap-resolution prompt appears.",
    "calendar.detailsModal.title": "Task details",
    "calendar.detailsModal.subtitle": "Set date, time, duration, entry type, and priority — then save to your calendar.",
    "calendar.editModal.title": "Edit entry",
    "calendar.editModal.completed": "Mark as completed",
    "calendar.editModal.save": "Save changes",
    "calendar.editModal.delete": "Delete",
    "calendar.editModal.doneSuffix": "Done",
    "calendar.modal.title": "Schedule entry",
    "calendar.modal.nameLabel": "Title",
    "calendar.modal.dateLabel": "Date",
    "calendar.modal.deadlineOptional": "Deadline (optional)",
    "calendar.modal.deadlineHint": "Leave blank to use only the scheduled date. When set, this date is used first for “what should I do?” on the dashboard.",
    "calendar.modal.typeLabel": "Entry type",
    "calendar.modal.type.shift": "Work shift",
    "calendar.modal.type.exam": "Exam hours",
    "calendar.modal.type.study": "Study slot",
    "calendar.modal.priorityLabel": "Priority",
    "calendar.priority.low": "Low — flexible",
    "calendar.priority.medium": "Medium — important",
    "calendar.priority.high": "High — protect this time",
    "calendar.save": "Save to calendar",
    "calendar.cancel": "Cancel",
    "calendar.legend.shift": "Shift",
    "calendar.legend.exam": "Exam",
    "calendar.legend.study": "Study",
    "calendar.legend.completed": "Completed day",

    "calendar.view.day": "Day",
    "calendar.view.week": "Week",
    "calendar.view.month": "Month",
    "calendar.goToday": "Today",
    "calendar.goThisWeek": "This week",
    "calendar.plannerTitle.day": "Day",
    "calendar.plannerTitle.week": "Week",
    "calendar.plannerTitle.month": "Month",
    "app.hover.plannerDayWeek": "Day & week planner",
    "app.hover.plannerMonth": "Month planner",

    "calendar.monthPlannerClickHint":
        "Click a day to add a 30-minute study block (today starts near the current time; other days use a typical afternoon slot). In day view, click an empty spot on the timeline for a precise start time.",
    "calendar.modal.startOptional": "Start time (optional)",
    "calendar.modal.startHint": "If empty, we pick a typical window for the entry type.",
    "calendar.modal.duration": "Duration",
    "calendar.duration.30": "30 minutes",
    "calendar.duration.60": "1 hour",
    "calendar.duration.120": "2 hours",
    "calendar.duration.180": "3 hours",
    "calendar.duration.240": "4 hours",
    "calendar.duration.480": "8 hours (full shift)",

    "aria.weekPlannerGrid": "Week schedule grid",

    "wellbeing.welcome": "👋 Hi {{name}} — great to see you",
    "wellbeing.welcomeGuest": "👋 Hi there — great to see you",
    "wellbeing.editLimits": "Adjust study & work limits",
    "wellbeing.lead": "Rings mirror your calendar — screen time is an estimate.",
    "wellbeing.subtitle": "🧘 Study and work totals mirror your calendar; screen time is a gentle estimate from that rhythm.",
    "wellbeing.hintTitle": "How this page works",
    "wellbeing.ringStudyTitle": "Study focus",
    "wellbeing.ringStudySubtitle": "Calendar study blocks this ISO week vs your weekly target.",
    "wellbeing.ringWorkTitle": "Paid work",
    "wellbeing.ringWorkSubtitle": "Shift minutes in the last 14 days vs your fortnight cap.",
    "wellbeing.ringScreenTitle": "Screen time",
    "wellbeing.ringScreenSubtitle": "Estimated from your study rhythm (demo heuristic), capped at 16 h/week.",
    "wellbeing.ringWeekLoadTitle": "Week load",
    "wellbeing.ringWeekLoadSubtitle": "Shifts, study, and exams combined — compared to a soft week budget.",
    "wellbeing.ringMonthTitle": "Month shifts",
    "wellbeing.ringMonthSubtitle": "Paid shift hours this calendar month vs an 80 h/month reference pace.",
    "wellbeing.ringPercentOfGoal": "{{pct}}% of goal",
    "wellbeing.ringPercentOfCap": "{{pct}}% of cap",
    "wellbeing.ringPercentOfGuide": "{{pct}}% of guide",
    "wellbeing.tasksTileTitle": "Wellbeing tasks",
    "wellbeing.tasksTileSubtitle": "Compact checklist — the page scrolls if your list grows.",
    "wellbeing.tasksTileHintTitle": "Tasks list",
    "wellbeing.addTaskButton": "Add task",
    "wellbeing.taskPlaceholder": "e.g. Walk 20 minutes after lab",
    "wellbeing.removeTask": "Remove task",

    "wellbeing.revamp.intro": "This page is a gentle read — not a report card. It looks at what's already on your calendar and nudges you toward rest, not perfection.",
    "wellbeing.revamp.studyTitle": "Time for coursework",
    "wellbeing.revamp.studyBody": "You've logged {{logged}} of study blocks this week. Your own goal sits around {{goal}} — small steady stretches count more than hero days.",
    "wellbeing.revamp.workTitle": "Paid shifts (last 14 days)",
    "wellbeing.revamp.workBody": "That's about {{logged}} of shift time in the last fortnight, next to the cap you chose ({{cap}}).",
    "wellbeing.revamp.workGentle": "If you're close to that ceiling, breathe — rosters can shift, and it's fine to ask someone to swap.",
    "wellbeing.revamp.paceTitle": "How full the week looks",
    "wellbeing.revamp.paceBody": "Roughly {{hours}} of classes, shifts, and exams are on the calendar this week. Leave white space on purpose — you don't owe anyone a packed grid.",
    "wellbeing.revamp.tasksTitle": "Little things that help",
    "wellbeing.revamp.tasksBody": "Not KPIs — just reminders: water, air, a walk. Check them off when you can; skip them without guilt.",
    "wellbeing.revamp.tasksEmpty": "Nothing here yet — add one small thing that would feel good today.",
    "wellbeing.mood.title": "How are you feeling today?",
    "wellbeing.mood.subtitle": "Pick one feeling to check in with yourself. It helps you pace your day with intention.",
    "wellbeing.mood.selected": "Today you're feeling: {{mood}}",
    "wellbeing.mood.great": "Great",
    "wellbeing.mood.good": "Good",
    "wellbeing.mood.okay": "Okay",
    "wellbeing.mood.tired": "Tired",
    "wellbeing.mood.stressed": "Stressed",
    "wellbeing.mood.checklistProgress": "{{pct}}% of wellbeing tasks completed.",
    "wellbeing.focusWidgetTitle": "Focus mode",
    "wellbeing.focusWidgetBody": "Start a distraction-light focus session and save the minutes back to your study plan.",

    "events.title": "Campus events",
    "events.lead": "Pilot listings — tap a card to RSVP.",
    "events.subtitle":
        "Sample campus listings for the pilot. RSVP choices are saved on this device only. Cards show headcount, topic, and RSVP — hover for glow; click opens a light panel anchored to the card.",
    "events.hintTitle": "About these events",
    "events.going": "Going",
    "events.notGoing": "Not going",
    "events.undecided": "Undecided",
    "events.peopleGoing": "{{count}} people going",
    "events.topic": "Topic",
    "events.type": "Type",
    "events.rsvpPrompt": "Update RSVP",
    "events.headcount": "Responses",
    "events.saveRsvp": "Save RSVP",

    "badges.priority.high": "High priority",
    "badges.priority.medium": "Medium",
    "badges.priority.low": "Low",

    "aria.themeMode": "Colour appearance",
    "aria.switchToLightMode": "Switch to light mode",
    "aria.switchToDarkMode": "Switch to dark mode",
    "aria.openAppMenu": "Open navigation menu",
    "aria.openFocusMode": "Open focus mode",
    "aria.closeAppMenu": "Close navigation menu",
    "aria.expandAppSidebar": "Expand navigation sidebar",
    "aria.collapseAppSidebar": "Collapse navigation sidebar",
    "focus.controlLabel": "Focus mode",
    "focus.controlLabelShort": "Focus",
    "focus.title": "Focus",
    "focus.subtitle": "Breathe with the shape. When you end the session, rounded minutes are saved as study time for today.",
    "focus.elapsedHint": "Elapsed time",
    "focus.endSession": "End focus session",
    "focus.saveHint": "Press Escape or tap above to leave. Time rounds to the nearest minute; under 30 seconds is not saved.",
    "focus.sessionEntryTitle": "Focus session",

    "aria.quickAdd": "Add calendar block or task",
    "aria.previousMonth": "Previous month",
    "aria.nextMonth": "Next month",

    "collision.title": "Time clash",
    "collision.subtitle":
        "This block overlaps something already on your calendar. Use your priority order to decide—or take the next free slot we found.",
    "collision.yourOrder": "Your priority order",
    "collision.newBlock": "New block",
    "collision.coach.favourNew":
        "Based on your order, this new block lines up with a higher-priority area than at least one overlapping event. Stacking both is a conscious trade-off—consider the suggested time instead.",
    "collision.coach.favourExisting":
        "Something already on the calendar matches a higher-priority area for you than this new block. If you add both, you’re choosing to double-book—make sure that’s intentional.",
    "collision.coach.neutral":
        "These areas sit at a similar place in your priorities. Pick a time that fits your energy, or use the next free slot.",
    "collision.useSuggested": "Use next free slot at {{time}}",
    "collision.addAnyway": "Add anyway (I accept the overlap)",
    "collision.backToEdit": "Go back and change time",
} as const;

export type MessageId = keyof typeof catalog;

/** Translation-ready accessor — swap implementation for locale bundles later. */
export function t(id: MessageId): string {
    return catalog[id];
}

/** Personalised wellbeing greeting using onboarding preferred name. */
export function tWellbeingWelcome(displayName: string): string {
    const n = displayName.trim();
    if (!n) return catalog["wellbeing.welcomeGuest"];
    return catalog["wellbeing.welcome"].replace("{{name}}", n);
}

/** Simple interpolation helper for numeric placeholders. */
export function tf(id: "events.peopleGoing", values: { count: number }): string {
    return catalog[id].replace("{{count}}", String(values.count));
}

export function tReplace(id: MessageId, values: Record<string, string | number>): string {
    let s = catalog[id] as string;
    for (const [k, v] of Object.entries(values)) {
        s = s.replaceAll(`{{${k}}}`, String(v));
    }
    return s;
}

export function tCollisionSuggested(time: string): string {
    return catalog["collision.useSuggested"].replace("{{time}}", time);
}
