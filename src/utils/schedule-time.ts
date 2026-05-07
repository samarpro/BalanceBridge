import type { ScheduleEntry, ScheduleKind } from "@/components/balance-bridge/calendar-month";

/** Visible planner range (local), 6:00–22:00 */
export const DAY_START_MIN = 6 * 60;
export const DAY_END_MIN = 22 * 60;

export const VISIBLE_DAY_MINUTES = DAY_END_MIN - DAY_START_MIN;

/** Snap clicks to the nearest N minutes on the visible day strip (e.g. 15 → :00, :15, :30, :45). */
export function snapMinutesToTimelineGrid(minutesFromMidnight: number, stepMinutes: number): number {
    const offset = minutesFromMidnight - DAY_START_MIN;
    const snappedOffset = Math.round(offset / stepMinutes) * stepMinutes;
    return DAY_START_MIN + snappedOffset;
}

/**
 * Map vertical position on the day timeline (0 = top/6:00, 1 = bottom/22:00) to a start time
 * snapped to `stepMinutes`, clamped so `durationMinutes` fits inside the visible range.
 */
export function startMinutesFromTimelineClick(fraction: number, durationMinutes: number, stepMinutes = 15): number {
    const clampedFrac = Math.min(1, Math.max(0, fraction));
    const raw = DAY_START_MIN + clampedFrac * VISIBLE_DAY_MINUTES;
    const snapped = snapMinutesToTimelineGrid(raw, stepMinutes);
    return Math.min(Math.max(snapped, DAY_START_MIN), DAY_END_MIN - durationMinutes);
}

export function isoFromDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function startOfWeekMonday(d: Date): Date {
    const x = new Date(d);
    const dow = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - dow);
    x.setHours(0, 0, 0, 0);
    return x;
}

export function addDays(d: Date, n: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}

export function defaultTimeRange(kind: ScheduleKind): { start: number; end: number } {
    switch (kind) {
        case "shift":
            return { start: 9 * 60 + 30, end: 17 * 60 };
        case "exam":
            return { start: 10 * 60, end: 13 * 60 };
        case "study":
            return { start: 14 * 60, end: 17 * 60 };
    }
}

/**
 * Start time for a quick-added task when the user picks a calendar day without a timeline Y-position
 * (e.g. month grid). Today uses local clock snapped to the planner grid; other days use the typical study start.
 */
export function defaultStartMinutesForNewTaskOnDay(isoDate: string, now: Date = new Date(), durationMinutes = 30): number {
    const todayIso = isoFromDate(now);
    if (isoDate === todayIso) {
        const mins = now.getHours() * 60 + now.getMinutes();
        const fraction = VISIBLE_DAY_MINUTES > 0 ? (mins - DAY_START_MIN) / VISIBLE_DAY_MINUTES : 0;
        return startMinutesFromTimelineClick(fraction, durationMinutes);
    }
    const studyStart = defaultTimeRange("study").start;
    return Math.min(Math.max(studyStart, DAY_START_MIN), DAY_END_MIN - durationMinutes);
}

/** Resolved timeline window for an entry (minutes from midnight). */
export function getEntryTimeRange(e: ScheduleEntry): { start: number; end: number } {
    const fb = defaultTimeRange(e.kind);
    if (e.startMinutes != null && e.durationMinutes != null) {
        return { start: e.startMinutes, end: e.startMinutes + e.durationMinutes };
    }
    if (e.startMinutes != null) {
        return { start: e.startMinutes, end: e.startMinutes + (fb.end - fb.start) };
    }
    if (e.durationMinutes != null) {
        return { start: fb.start, end: fb.start + e.durationMinutes };
    }
    return fb;
}

export function formatHm(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${String(m).padStart(2, "0")}`;
}
