const CONFLICT_BLOCKS_SAVED_KEY = "kira.conflict-blocks-shown-v2";

function clampCount(value: unknown): number {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
}

export function loadConflictBlocksShown(): number {
    try {
        return clampCount(localStorage.getItem(CONFLICT_BLOCKS_SAVED_KEY));
    } catch {
        return 0;
    }
}

export function saveConflictBlocksShown(count: number): void {
    try {
        localStorage.setItem(CONFLICT_BLOCKS_SAVED_KEY, String(clampCount(count)));
    } catch {
        // Ignore storage write failures (private mode, quota, etc).
    }
}
