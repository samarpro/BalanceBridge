/**
 * Central copy catalog for KIRA. Replace `catalog` values or wire `t()`
 * to react-i18next / Format.JS when you add real locales.
 */
export const catalog = {
    "app.name": "KIRA",
    "app.tagline": "Study, work, and wellbeing in one prioritized place.",

    "onboarding.welcome.title": "Welcome to KIRA",
    "onboarding.welcome.body":
        "Protect study time, stay inside work-hour limits, and find low-pressure campus connection—all in one schedule.",
    "onboarding.welcome.socialProof": "Trusted by 10+ students across campuses (pilot).",
    "onboarding.welcome.cta": "Continue",

    "onboarding.login.title": "Sign in with your university account",
    "onboarding.login.emailLabel": "University email",
    "onboarding.login.emailHint": "We use this to verify you are a student before enabling social features.",
    "onboarding.login.emailPlaceholder": "you@student.university.edu.au",
    "onboarding.login.ssoUniversity": "Continue with university SSO",
    "onboarding.login.ssoGoogle": "Continue with Google (Calendar)",
    "onboarding.login.ssoMicrosoft": "Continue with Microsoft (Outlook)",
    "onboarding.login.demoNote": "Demo only — SSO would open your institution’s login page.",
    "onboarding.login.next": "Continue",

    "onboarding.priorities.title": "What matters most in your week?",
    "onboarding.priorities.body":
        "Drag isn’t required—move items up or down. KIRA uses this order when two blocks collide: we’ll nudge you toward what you said matters most.",
    "onboarding.priorities.hint": "Typical for working students: study and exams, paid shifts, health, admin, friends, rest.",
    "onboarding.priorities.cta": "Save order & continue",

    "lifePriority.study": "Study & classes",
    "lifePriority.work": "Paid work / shifts",
    "lifePriority.health": "Health & movement",
    "lifePriority.personal": "Personal / admin",
    "lifePriority.social": "Social life",
    "lifePriority.rest": "Rest & recovery",

    "onboarding.timetable.title": "Bring your timetable into KIRA",
    "onboarding.timetable.body": "Import classes so we can layer shifts, exams, and wellbeing alongside your real week.",
    "onboarding.timetable.ics": "Upload .ics file",
    "onboarding.timetable.google": "Connect Google Calendar",
    "onboarding.timetable.outlook": "Connect Outlook Calendar",
    "onboarding.timetable.skip": "I’ll add this later",
    "onboarding.timetable.next": "Continue",

    "onboarding.start.title": "You’re set up to build better weeks",
    "onboarding.start.body":
        "Small, steady habits beat heroic cram sessions. Sync your timetable, log realistic shifts, and check in when energy dips—we’ll keep the interface calm so you can focus.",
    "onboarding.start.cta": "Open KIRA",

    "app.tab.dashboard": "Dashboard",
    "app.tab.calendar": "Calendar",
    "app.tab.wellbeing": "Wellbeing",
    "app.tab.events": "Events",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "Auto",

    "dashboard.workHours": "Work hours this fortnight",
    "dashboard.workHoursCaption": "Sum of shift blocks on your calendar in the last 14 days.",
    "dashboard.goalTitle": "Study goal — week progress",
    "dashboard.goalCaption": "Compared to your weekly study target using calendar study blocks this ISO week.",
    "dashboard.upcoming": "Upcoming",
    "dashboard.dayScheduleCaption": "All timed entries on your calendar for this day (same data as the Calendar tab).",
    "dashboard.dayScheduleClickHint": "Click an empty spot on the grid to add a 30-minute task (snapped to the nearest quarter hour). Click a block to edit.",
    "dashboard.timelineAddTaskAria": "Add task at clicked time",
    "dashboard.dayTimelineAria": "Daily schedule timeline",
    "dashboard.openFullCalendar": "Full calendar",
    "dashboard.nextAction.title": "Going nowhere to start?",
    "dashboard.nextAction.headline": "Do this first…",
    "dashboard.nextAction.hint": "Open calendar entries are ranked by overdue status, then deadline (if you set one) or scheduled date, then priority.",
    "dashboard.nextAction.empty": "You're all caught up — no open entries need a push.",
    "dashboard.nextAction.overdue": "Overdue",
    "dashboard.nextAction.deadline": "Deadline",
    "dashboard.nextAction.scheduled": "Scheduled",
    "dashboard.nextAction.alsoConsider": "Also consider",
    "aria.previousDay": "Previous day",
    "aria.nextDay": "Next day",

    "dashboard.calendarPreview": "This month",

    "calendar.newTaskDefaultTitle": "New task",
    "calendar.addPlaceholder": "What do you want to schedule?",
    "calendar.addHint": "Details stay inline below — the card lifts with a soft glow on hover or keyboard focus.",
    "calendar.quickAddSectionLabel": "Add to calendar",
    "calendar.quickAdd": "Quick add",
    "calendar.quickAddDetails": "More details",
    "calendar.quickAddHint": "Quick add creates a study block today with a typical window. Use More details for date, time, and type.",
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
    "calendar.plannerTitle.day": "Day view",
    "calendar.plannerTitle.week": "Week view",
    "calendar.plannerTitle.month": "Month view",

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

    "wellbeing.title": "Rhythm & recovery",
    "wellbeing.subtitle": "Study and work totals mirror your calendar; screen time is a gentle estimate from that rhythm.",
    "wellbeing.study": "Study focus",
    "wellbeing.studyHint": "Study-slot duration from your calendar this week.",
    "wellbeing.screen": "Screen time",
    "wellbeing.screenHint": "Estimated from your weekly study rhythm (demo heuristic).",
    "wellbeing.work": "Paid work",
    "wellbeing.workHint": "Shift duration from your calendar over the last 14 days.",
    "wellbeing.workMonthTitle": "Monthly shift distribution",
    "wellbeing.workMonthSubtitle": "Paid shift hours by calendar week (Mon–Sun). Only days inside this month are counted in each bar.",
    "wellbeing.workMonthTotal": "Month total",
    "wellbeing.workMonthAvg": "Avg / week",
    "wellbeing.workMonthPeak": "Peak week",
    "wellbeing.workMonthEmpty": "No shift blocks this month yet — add shifts on the Calendar tab to see your rhythm here.",
    "wellbeing.sleepChart": "Sleep hours (last 7 nights)",
    "wellbeing.addTask": "Wellbeing tasks",
    "wellbeing.addTaskButton": "Add task",
    "wellbeing.taskPlaceholder": "e.g. Walk 20 minutes after lab",
    "wellbeing.tasksSubtitle": "Check items off as you go, or remove what no longer fits your week.",
    "wellbeing.removeTask": "Remove task",

    "events.title": "Campus events",
    "events.subtitle": "Cards show headcount, topic, and RSVP — hover for glow; click opens a light panel anchored to the card.",
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

/** Simple interpolation helper for numeric placeholders. */
export function tf(id: "events.peopleGoing", values: { count: number }): string {
    return catalog[id].replace("{{count}}", String(values.count));
}

export function tCollisionSuggested(time: string): string {
    return catalog["collision.useSuggested"].replace("{{time}}", time);
}
