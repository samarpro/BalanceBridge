import type { ScheduleKind } from "@/components/balance-bridge/calendar-month";

/** Life areas working students juggle — ordered in onboarding (first = most important). */
export type LifePriorityId = "study" | "work" | "health" | "personal" | "social" | "rest";

export const LIFE_PRIORITY_IDS: LifePriorityId[] = ["study", "work", "health", "personal", "social", "rest"];

export const DEFAULT_LIFE_PRIORITY_ORDER: LifePriorityId[] = [...LIFE_PRIORITY_IDS];

/** Map schedule entry type to life area for collision coaching (user can align mental model with blocks). */
export function lifeAreaForScheduleKind(kind: ScheduleKind): LifePriorityId {
    switch (kind) {
        case "shift":
            return "work";
        case "exam":
        case "study":
            return "study";
    }
}

export function rankOfLifeArea(id: LifePriorityId, order: LifePriorityId[]): number {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
}
