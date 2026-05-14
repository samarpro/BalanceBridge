import type { WellbeingTask } from "@/types/wellbeing-task";

const KEY = "kira-wellbeing-tasks-v2";

function parseTask(raw: unknown): WellbeingTask | null {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    const id = typeof o.id === "string" && o.id.length > 0 ? o.id : null;
    const label = typeof o.label === "string" && o.label.trim().length > 0 ? o.label.trim() : null;
    if (!id || !label) return null;
    const completed = o.completed === true;
    return { id, label, completed };
}

/** `null` = never saved — use built-in starter tasks. */
export function loadWellbeingTasks(): WellbeingTask[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return null;
        const out: WellbeingTask[] = [];
        for (const item of parsed) {
            const t = parseTask(item);
            if (t) out.push(t);
        }
        return out;
    } catch {
        return null;
    }
}

export function saveWellbeingTasks(tasks: WellbeingTask[]): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
        /* ignore */
    }
}
