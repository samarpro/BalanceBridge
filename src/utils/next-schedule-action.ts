import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { isoFromDate } from "@/utils/schedule-time";

/** Due-date used for “what first?” ranking: explicit deadline, else scheduled calendar date. */
export function effectiveDeadlineIso(entry: ScheduleEntry): string {
    const d = entry.deadlineIso?.trim();
    return d || entry.isoDate;
}

function priorityRank(p: ScheduleEntry["priority"]): number {
    switch (p) {
        case "high":
            return 3;
        case "medium":
            return 2;
        case "low":
            return 1;
    }
}

/**
 * Incomplete entries sorted for attention: overdue first (oldest overdue first),
 * then soonest effective deadline, then higher priority.
 */
export function sortedIncompleteByAttention(entries: ScheduleEntry[], refDay = new Date()): ScheduleEntry[] {
    const todayIso = isoFromDate(refDay);

    return entries
        .filter((e) => !e.completed)
        .sort((a, b) => {
            const da = effectiveDeadlineIso(a);
            const db = effectiveDeadlineIso(b);
            const aOver = da < todayIso;
            const bOver = db < todayIso;
            if (aOver !== bOver) return aOver ? -1 : 1;
            const cmp = da.localeCompare(db);
            if (cmp !== 0) return cmp;
            return priorityRank(b.priority) - priorityRank(a.priority);
        });
}
