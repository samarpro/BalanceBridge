import { DEFAULT_LIFE_PRIORITY_ORDER, LIFE_PRIORITY_IDS, type LifePriorityId } from "@/types/life-priority";

const KEY = "kira-life-priority-order";
const LEGACY_KEY = "balance-bridge-life-priority-order";

function isValidOrder(arr: unknown): arr is LifePriorityId[] {
    if (!Array.isArray(arr) || arr.length !== LIFE_PRIORITY_IDS.length) return false;
    const set = new Set(arr);
    return LIFE_PRIORITY_IDS.every((id) => set.has(id));
}

export function loadLifePriorityOrder(): LifePriorityId[] {
    if (typeof window === "undefined") return [...DEFAULT_LIFE_PRIORITY_ORDER];
    try {
        const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
        if (!raw) return [...DEFAULT_LIFE_PRIORITY_ORDER];
        const parsed = JSON.parse(raw) as unknown;
        if (!isValidOrder(parsed)) return [...DEFAULT_LIFE_PRIORITY_ORDER];
        return parsed;
    } catch {
        return [...DEFAULT_LIFE_PRIORITY_ORDER];
    }
}

export function saveLifePriorityOrder(order: LifePriorityId[]): void {
    if (typeof window === "undefined") return;
    if (!isValidOrder(order)) return;
    window.localStorage.setItem(KEY, JSON.stringify(order));
    window.localStorage.removeItem(LEGACY_KEY);
}
