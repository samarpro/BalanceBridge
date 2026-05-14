import type { RsvpStatus } from "@/data/mock-events";

const KEY = "kira-event-rsvp-v2";

function isRsvp(x: unknown): x is RsvpStatus {
    return x === "going" || x === "not-going" || x === "undecided";
}

/** Per-event RSVP overrides keyed by event id. */
export function loadEventRsvpOverrides(): Record<string, RsvpStatus> {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return {};
        const out: Record<string, RsvpStatus> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            if (k.length > 0 && isRsvp(v)) {
                out[k] = v;
            }
        }
        return out;
    } catch {
        return {};
    }
}

export function saveEventRsvpOverrides(map: Record<string, RsvpStatus>): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(map));
    } catch {
        /* ignore */
    }
}
