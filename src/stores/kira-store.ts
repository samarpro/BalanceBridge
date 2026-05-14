import { create } from "zustand";
import type { ScheduleEntry } from "@/components/kira/calendar-month";
import { loadLifePriorityOrder, saveLifePriorityOrder } from "@/lib/life-priority-storage";
import { loadUserProfile, saveUserProfile, type UserProfile } from "@/lib/profile-storage";
import { loadScheduleEntries, saveScheduleEntries } from "@/lib/schedule-entries-storage";
import { loadWellbeingTasks, saveWellbeingTasks } from "@/lib/wellbeing-tasks-storage";
import { loadConflictBlocksShown, saveConflictBlocksShown } from "@/lib/conflict-metrics-storage";
import type { LifePriorityId } from "@/types/life-priority";
import type { WellbeingTask } from "@/types/wellbeing-task";
import { addDays, isoFromDate, startOfWeekMonday } from "@/utils/schedule-time";

export type { WellbeingTask } from "@/types/wellbeing-task";

function newEntryId(): string {
    return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`;
}

function newWellbeingId(): string {
    return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `w-${Date.now()}`;
}

function seedEntries(): ScheduleEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = startOfWeekMonday(today);
    const prevWeekStart = addDays(weekStart, -7);
    const nextWeekStart = addDays(weekStart, 7);
    const yesterday = addDays(today, -1);
    const tomorrow = addDays(today, 1);

    const m = (d: Date) => isoFromDate(d);
    const mon = addDays(weekStart, 0);
    const tue = addDays(weekStart, 1);
    const wed = addDays(weekStart, 2);
    const thu = addDays(weekStart, 3);
    const fri = addDays(weekStart, 4);
    const sat = addDays(weekStart, 5);
    const sun = addDays(weekStart, 6);

    const prevWed = addDays(prevWeekStart, 2);
    const prevThu = addDays(prevWeekStart, 3);
    const prevSat = addDays(prevWeekStart, 5);
    const nextTue = addDays(nextWeekStart, 1);
    const nextThu = addDays(nextWeekStart, 3);

    return [
        /* --- Rolling fortnight shifts (visa / rings) */
        { id: "demo-s-prev1", isoDate: m(prevWed), title: "Retail floor — late trade", kind: "shift", priority: "low", completed: true, startMinutes: 16 * 60, durationMinutes: 240 },
        { id: "demo-s-prev2", isoDate: m(prevThu), title: "Warehouse pick shift", kind: "shift", priority: "medium", completed: true, startMinutes: 9 * 60, durationMinutes: 480 },
        { id: "demo-s-prev3", isoDate: m(prevSat), title: "Weekend bar support", kind: "shift", priority: "medium", completed: true, startMinutes: 18 * 60, durationMinutes: 300 },
        { id: "demo-s-yest", isoDate: m(yesterday), title: "Supermarket express checkout", kind: "shift", priority: "low", completed: true, startMinutes: 17 * 60, durationMinutes: 180 },
        { id: "demo-s-today", isoDate: m(today), title: "City library event setup", kind: "shift", priority: "medium", completed: false, startMinutes: 9 * 60, durationMinutes: 420 },
        { id: "demo-s-tmr", isoDate: m(tomorrow), title: "Campus catering — dinner rush", kind: "shift", priority: "high", completed: false, startMinutes: 16 * 60, durationMinutes: 300 },
        { id: "demo-s-fri", isoDate: m(fri), title: "Nightfill — general merchandise", kind: "shift", priority: "medium", completed: false, startMinutes: 20 * 60 + 30, durationMinutes: 240 },
        { id: "demo-s-sat", isoDate: m(sat), title: "Saturday brunch service", kind: "shift", priority: "low", completed: false, startMinutes: 8 * 60, durationMinutes: 360 },
        /* --- This week — study & exams */
        { id: "demo-st-mon1", isoDate: m(mon), title: "SIT216 sprint planning", kind: "study", priority: "medium", completed: true, startMinutes: 8 * 60, durationMinutes: 50 },
        { id: "demo-st-mon2", isoDate: m(mon), title: "UML diagrams polish", kind: "study", priority: "low", completed: false, startMinutes: 14 * 60, durationMinutes: 75 },
        { id: "demo-st-tue1", isoDate: m(tue), title: "SIT216 — live lecture", kind: "study", priority: "medium", completed: false, startMinutes: 10 * 60, durationMinutes: 60 },
        { id: "demo-st-tue2", isoDate: m(tue), title: "Lab pair programming", kind: "study", priority: "high", completed: false, startMinutes: 13 * 60 + 30, durationMinutes: 120 },
        { id: "demo-st-tue3", isoDate: m(tue), title: "Peer review comments", kind: "study", priority: "medium", completed: false, deadlineIso: m(wed), startMinutes: 19 * 60, durationMinutes: 60 },
        { id: "demo-st-wed1", isoDate: m(wed), title: "Tutorial prep — design patterns", kind: "study", priority: "high", completed: false, startMinutes: 9 * 60, durationMinutes: 90 },
        { id: "demo-st-wed2", isoDate: m(wed), title: "Campus club committee", kind: "study", priority: "low", completed: false, startMinutes: 17 * 60, durationMinutes: 45 },
        { id: "demo-ex-thu", isoDate: m(thu), title: "In‑class quiz — systems analysis", kind: "exam", priority: "high", completed: false, startMinutes: 11 * 60, durationMinutes: 75 },
        { id: "demo-st-thu1", isoDate: m(thu), title: "Quiz debrief + flashcards", kind: "study", priority: "medium", completed: false, startMinutes: 14 * 60, durationMinutes: 60 },
        { id: "demo-st-thu2", isoDate: m(thu), title: "Portfolio site tweaks", kind: "study", priority: "low", completed: false, startMinutes: 18 * 60, durationMinutes: 90 },
        { id: "demo-st-fri1", isoDate: m(fri), title: "Guest lecture — industry panel", kind: "study", priority: "medium", completed: false, startMinutes: 10 * 60, durationMinutes: 90 },
        { id: "demo-st-fri2", isoDate: m(fri), title: "Assignment checkpoint draft", kind: "study", priority: "high", completed: false, deadlineIso: m(sun), startMinutes: 15 * 60, durationMinutes: 120 },
        { id: "demo-st-sat1", isoDate: m(sat), title: "Deep work — literature review", kind: "study", priority: "medium", completed: false, startMinutes: 10 * 60, durationMinutes: 150 },
        { id: "demo-st-sat2", isoDate: m(sat), title: "Practice MCQs (timed)", kind: "study", priority: "high", completed: false, startMinutes: 15 * 60 + 30, durationMinutes: 90 },
        { id: "demo-ex-sun", isoDate: m(sun), title: "Mock exam — full paper", kind: "exam", priority: "high", completed: false, startMinutes: 9 * 60, durationMinutes: 180 },
        { id: "demo-st-sun1", isoDate: m(sun), title: "Sunday reset & week plan", kind: "study", priority: "low", completed: false, startMinutes: 17 * 60, durationMinutes: 60 },
        /* --- Next week teaser */
        { id: "demo-nx-tue", isoDate: m(nextTue), title: "SIT216 — release retrospective", kind: "study", priority: "medium", completed: false, startMinutes: 14 * 60, durationMinutes: 60 },
        { id: "demo-nx-thu", isoDate: m(nextThu), title: "Final presentation dry run", kind: "study", priority: "high", completed: false, deadlineIso: m(nextThu), startMinutes: 16 * 60, durationMinutes: 90 },
    ];
}

const defaultWellbeingTasks: WellbeingTask[] = [
    { id: "wb-demo-1", label: "Glass of water before first class", completed: true },
    { id: "wb-demo-2", label: "Stretch shoulders between study blocks", completed: true },
    { id: "wb-demo-3", label: "10‑minute walk after lunch", completed: false },
    { id: "wb-demo-4", label: "Text a friend you have not seen lately", completed: false },
    { id: "wb-demo-5", label: "Pack snacks before long shift", completed: false },
    { id: "wb-demo-6", label: "Inbox zero for uni email (5 min)", completed: false },
    { id: "wb-demo-7", label: "Dim screens 45 min before bed", completed: false },
    { id: "wb-demo-8", label: "Log one win from today", completed: true },
    { id: "wb-demo-9", label: "Tidy desk for tomorrow’s deep work", completed: false },
    { id: "wb-demo-10", label: "Listen to one calm playlist", completed: false },
];

function initialEntries(): ScheduleEntry[] {
    const stored = loadScheduleEntries();
    if (stored === null) return seedEntries();
    return stored;
}

function initialWellbeingTasks(): WellbeingTask[] {
    const stored = loadWellbeingTasks();
    if (stored === null) return defaultWellbeingTasks;
    return stored;
}

interface KiraStoreState {
    entries: ScheduleEntry[];
    wellbeingTasks: WellbeingTask[];
    /** Target focused study minutes for the current calendar week (synced with dashboard goal). */
    weeklyStudyGoalMinutes: number;
    /** Rolling 14-day shift total is compared against this cap (hours). Persisted with profile. */
    fortnightWorkLimitHours: number;
    /** True while the optional “edit limits” dialog is open (required gate uses profile flag instead). */
    limitsEditorOpen: boolean;
    openLimitsEditor: () => void;
    closeLimitsEditor: () => void;
    completeLimitsSetup: (weeklyStudyGoalMinutes: number, fortnightWorkLimitHours: number) => void;
    /** Onboarding life-area ranking (first = most important). Persisted in localStorage. */
    lifePriorityOrder: LifePriorityId[];
    setLifePriorityOrder: (order: LifePriorityId[]) => void;
    /** Name + university email from onboarding; persisted in localStorage. */
    userProfile: UserProfile;
    setUserProfile: (patch: Partial<UserProfile>) => void;
    /** Number of times overlap-resolution modal has been shown while adding entries. */
    conflictBlocksShown: number;
    incrementConflictBlocksShown: () => void;
    addEntry: (entry: Omit<ScheduleEntry, "id">) => string;
    updateEntry: (id: string, patch: Partial<Omit<ScheduleEntry, "id">>) => void;
    removeEntry: (id: string) => void;
    addWellbeingTask: (label: string) => void;
    toggleWellbeingTask: (id: string) => void;
    removeWellbeingTask: (id: string) => void;
}

const initialProfile = loadUserProfile();

export const useKiraStore = create<KiraStoreState>((set) => ({
    entries: initialEntries(),
    wellbeingTasks: initialWellbeingTasks(),
    weeklyStudyGoalMinutes: initialProfile.weeklyStudyGoalMinutes,
    fortnightWorkLimitHours: initialProfile.fortnightWorkLimitHours,
    limitsEditorOpen: false,
    openLimitsEditor: () => set({ limitsEditorOpen: true }),
    closeLimitsEditor: () => set({ limitsEditorOpen: false }),
    completeLimitsSetup: (weeklyStudyGoalMinutes, fortnightWorkLimitHours) =>
        set((s) => {
            const nextProfile: UserProfile = {
                ...s.userProfile,
                limitsConfigured: true,
                weeklyStudyGoalMinutes,
                fortnightWorkLimitHours,
            };
            saveUserProfile(nextProfile);
            return {
                userProfile: nextProfile,
                weeklyStudyGoalMinutes,
                fortnightWorkLimitHours,
                limitsEditorOpen: false,
            };
        }),
    lifePriorityOrder: loadLifePriorityOrder(),
    userProfile: initialProfile,
    conflictBlocksShown: loadConflictBlocksShown(),
    setLifePriorityOrder: (order) => {
        saveLifePriorityOrder(order);
        set({ lifePriorityOrder: [...order] });
    },
    setUserProfile: (patch) =>
        set((s) => {
            const next: UserProfile = { ...s.userProfile, ...patch };
            saveUserProfile(next);
            return {
                userProfile: next,
                ...(typeof patch.weeklyStudyGoalMinutes === "number" ? { weeklyStudyGoalMinutes: patch.weeklyStudyGoalMinutes } : {}),
                ...(typeof patch.fortnightWorkLimitHours === "number" ? { fortnightWorkLimitHours: patch.fortnightWorkLimitHours } : {}),
            };
        }),
    incrementConflictBlocksShown: () =>
        set((s) => {
            const next = s.conflictBlocksShown + 1;
            saveConflictBlocksShown(next);
            return { conflictBlocksShown: next };
        }),
    addEntry: (entry) => {
        const id = newEntryId();
        set((s) => {
            const entries = [...s.entries, { ...entry, id, completed: entry.completed ?? false }];
            saveScheduleEntries(entries);
            return { entries };
        });
        return id;
    },
    updateEntry: (id, patch) =>
        set((s) => {
            const entries = s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
            saveScheduleEntries(entries);
            return { entries };
        }),
    removeEntry: (id) =>
        set((s) => {
            const entries = s.entries.filter((e) => e.id !== id);
            saveScheduleEntries(entries);
            return { entries };
        }),
    addWellbeingTask: (label) =>
        set((s) => {
            const wellbeingTasks = [{ id: newWellbeingId(), label, completed: false }, ...s.wellbeingTasks];
            saveWellbeingTasks(wellbeingTasks);
            return { wellbeingTasks };
        }),
    toggleWellbeingTask: (id) =>
        set((s) => {
            const wellbeingTasks = s.wellbeingTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
            saveWellbeingTasks(wellbeingTasks);
            return { wellbeingTasks };
        }),
    removeWellbeingTask: (id) =>
        set((s) => {
            const wellbeingTasks = s.wellbeingTasks.filter((t) => t.id !== id);
            saveWellbeingTasks(wellbeingTasks);
            return { wellbeingTasks };
        }),
}));
