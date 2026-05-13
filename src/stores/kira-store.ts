import { create } from "zustand";
import type { ScheduleEntry } from "@/components/kira/calendar-month";
import { loadLifePriorityOrder, saveLifePriorityOrder } from "@/lib/life-priority-storage";
import { loadUserProfile, saveUserProfile, type UserProfile } from "@/lib/profile-storage";
import { loadScheduleEntries, saveScheduleEntries } from "@/lib/schedule-entries-storage";
import { loadWellbeingTasks, saveWellbeingTasks } from "@/lib/wellbeing-tasks-storage";
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
    const d2 = new Date(today);
    d2.setDate(d2.getDate() + 2);
    const d4 = new Date(today);
    d4.setDate(d4.getDate() + 4);
    const soon = new Date(today);
    soon.setDate(soon.getDate() + 1);
    const weekStart = startOfWeekMonday(today);
    const tue = addDays(weekStart, 1);
    const wed = addDays(weekStart, 2);
    return [
        {
            id: "seed-1",
            isoDate: isoFromDate(today),
            title: "Retail shift",
            kind: "shift",
            priority: "medium",
            completed: false,
            startMinutes: 9 * 60 + 30,
            durationMinutes: 450,
        },
        {
            id: "seed-sit216-tue",
            isoDate: isoFromDate(tue),
            title: "SIT216 — lecture",
            kind: "study",
            priority: "medium",
            completed: false,
            startMinutes: 10 * 60,
            durationMinutes: 60,
        },
        {
            id: "seed-sit216-wed",
            isoDate: isoFromDate(wed),
            title: "SIT216 — lecture",
            kind: "study",
            priority: "medium",
            completed: false,
            startMinutes: 10 * 60,
            durationMinutes: 60,
        },
        {
            id: "seed-2",
            isoDate: isoFromDate(d2),
            title: "Statistics midterm",
            kind: "exam",
            priority: "high",
            completed: false,
            startMinutes: 10 * 60,
            durationMinutes: 180,
        },
        {
            id: "seed-3",
            isoDate: isoFromDate(d4),
            deadlineIso: isoFromDate(soon),
            title: "Deep work — literature review",
            kind: "study",
            priority: "high",
            completed: false,
            startMinutes: 15 * 60,
            durationMinutes: 120,
        },
    ];
}

const defaultWellbeingTasks: WellbeingTask[] = [
    { id: "wellbeing-seed-1", label: "Hydrate before evening shift", completed: false },
    { id: "wellbeing-seed-2", label: "Phone-free hour before sleep", completed: false },
];

function initialEntries(): ScheduleEntry[] {
    const stored = loadScheduleEntries();
    return stored !== null ? stored : seedEntries();
}

function initialWellbeingTasks(): WellbeingTask[] {
    const stored = loadWellbeingTasks();
    return stored !== null ? stored : defaultWellbeingTasks;
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
