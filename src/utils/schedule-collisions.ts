import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { DAY_END_MIN, DAY_START_MIN, getEntryTimeRange } from "@/utils/schedule-time";

export function syntheticEntryForCollision(payload: Omit<ScheduleEntry, "id">): ScheduleEntry {
    return {
        ...payload,
        id: "__collision__",
        title: payload.title?.trim() || "Untitled",
        priority: payload.priority ?? "medium",
        completed: payload.completed ?? false,
    };
}

function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && bStart < aEnd;
}

/** Entries on `isoDate` whose visible time range overlaps [startMin, endMin) (minutes from midnight). */
export function entriesOverlappingInterval(
    entries: ScheduleEntry[],
    isoDate: string,
    startMin: number,
    endMin: number,
    excludeEntryId?: string,
): ScheduleEntry[] {
    const out: ScheduleEntry[] = [];
    for (const e of entries) {
        if (e.isoDate !== isoDate) continue;
        if (excludeEntryId && e.id === excludeEntryId) continue;
        const { start, end } = getEntryTimeRange(e);
        const cs = Math.max(start, DAY_START_MIN);
        const ce = Math.min(end, DAY_END_MIN);
        if (ce <= DAY_START_MIN || cs >= DAY_END_MIN) continue;
        if (intervalsOverlap(startMin, endMin, cs, ce)) out.push(e);
    }
    return out;
}

const SNAP = 15;

/** Next start minute (snapped) on the same day where `durationMinutes` fits without overlapping `entries` (excluding one id). */
export function findNextFreeSlotStart(
    entries: ScheduleEntry[],
    isoDate: string,
    durationMinutes: number,
    excludeEntryId: string | undefined,
    scanFromMin: number,
): number | null {
    const maxStart = DAY_END_MIN - durationMinutes;
    if (maxStart < DAY_START_MIN) return null;

    let t = Math.max(DAY_START_MIN, Math.ceil(scanFromMin / SNAP) * SNAP);
    while (t <= maxStart) {
        const end = t + durationMinutes;
        if (entriesOverlappingInterval(entries, isoDate, t, end, excludeEntryId).length === 0) return t;
        t += SNAP;
    }
    return null;
}
