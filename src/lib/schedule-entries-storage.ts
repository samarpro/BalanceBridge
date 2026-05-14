import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";

const KEY = "kira-schedule-entries-v2";

function isKind(x: unknown): x is ScheduleKind {
    return x === "shift" || x === "exam" || x === "study";
}

function isPriority(x: unknown): x is ScheduleEntry["priority"] {
    return x === "low" || x === "medium" || x === "high";
}

const isoDateRe = /^\d{4}-\d{2}-\d{2}$/;

function parseEntry(raw: unknown): ScheduleEntry | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    const id = typeof o.id === "string" && o.id.length > 0 ? o.id : null;
    const isoDate = typeof o.isoDate === "string" && isoDateRe.test(o.isoDate) ? o.isoDate : null;
    const title = typeof o.title === "string" && o.title.trim().length > 0 ? o.title.trim() : null;
    if (!id || !isoDate || !title) return null;
    if (!isKind(o.kind) || !isPriority(o.priority)) return null;

    const deadlineIso =
        typeof o.deadlineIso === "string" && isoDateRe.test(o.deadlineIso) ? o.deadlineIso : undefined;
    const completed = o.completed === true;

    const startMinutes =
        typeof o.startMinutes === "number" && Number.isFinite(o.startMinutes)
            ? Math.max(0, Math.min(24 * 60 - 1, Math.round(o.startMinutes)))
            : undefined;
    const durationMinutes =
        typeof o.durationMinutes === "number" && Number.isFinite(o.durationMinutes)
            ? Math.max(1, Math.min(24 * 60, Math.round(o.durationMinutes)))
            : undefined;

    return {
        id,
        isoDate,
        title,
        kind: o.kind,
        priority: o.priority,
        completed,
        deadlineIso,
        startMinutes,
        durationMinutes,
    };
}

/**
 * Returns `null` if nothing has been stored yet (caller should use demo seed).
 * Returns an array (possibly empty) once the user has touched the calendar.
 */
export function loadScheduleEntries(): ScheduleEntry[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return null;
        const out: ScheduleEntry[] = [];
        for (const item of parsed) {
            const e = parseEntry(item);
            if (e) out.push(e);
        }
        return out;
    } catch {
        return null;
    }
}

export function saveScheduleEntries(entries: ScheduleEntry[]): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
        /* quota or private mode — ignore */
    }
}
