import { create } from "zustand";
import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { loadLifePriorityOrder, saveLifePriorityOrder } from "@/lib/life-priority-storage";
import type { LifePriorityId } from "@/types/life-priority";
import { isoFromDate } from "@/utils/schedule-time";

export interface WellbeingTask {
    id: string;
    label: string;
    completed: boolean;
}

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

interface KiraStoreState {
    entries: ScheduleEntry[];
    wellbeingTasks: WellbeingTask[];
    /** Target focused study minutes for the current calendar week (synced with dashboard goal). */
    weeklyStudyGoalMinutes: number;
    /** Onboarding life-area ranking (first = most important). Persisted in localStorage. */
    lifePriorityOrder: LifePriorityId[];
    setLifePriorityOrder: (order: LifePriorityId[]) => void;
    addEntry: (entry: Omit<ScheduleEntry, "id">) => string;
    updateEntry: (id: string, patch: Partial<Omit<ScheduleEntry, "id">>) => void;
    removeEntry: (id: string) => void;
    addWellbeingTask: (label: string) => void;
    toggleWellbeingTask: (id: string) => void;
    removeWellbeingTask: (id: string) => void;
}

export const useKiraStore = create<KiraStoreState>((set) => ({
    entries: seedEntries(),
    wellbeingTasks: [
        { id: newWellbeingId(), label: "Hydrate before evening shift", completed: false },
        { id: newWellbeingId(), label: "Phone-free hour before sleep", completed: false },
    ],
    weeklyStudyGoalMinutes: 720,
    lifePriorityOrder: loadLifePriorityOrder(),
    setLifePriorityOrder: (order) => {
        saveLifePriorityOrder(order);
        set({ lifePriorityOrder: [...order] });
    },
    addEntry: (entry) => {
        const id = newEntryId();
        set((s) => ({
            entries: [...s.entries, { ...entry, id, completed: entry.completed ?? false }],
        }));
        return id;
    },
    updateEntry: (id, patch) =>
        set((s) => ({
            entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
    removeEntry: (id) =>
        set((s) => ({
            entries: s.entries.filter((e) => e.id !== id),
        })),
    addWellbeingTask: (label) =>
        set((s) => ({
            wellbeingTasks: [{ id: newWellbeingId(), label, completed: false }, ...s.wellbeingTasks],
        })),
    toggleWellbeingTask: (id) =>
        set((s) => ({
            wellbeingTasks: s.wellbeingTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
    removeWellbeingTask: (id) =>
        set((s) => ({
            wellbeingTasks: s.wellbeingTasks.filter((t) => t.id !== id),
        })),
}));
