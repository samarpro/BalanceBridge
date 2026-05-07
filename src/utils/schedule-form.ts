/** Parse `HH:mm` or `H:mm` from `<input type="time">` to minutes from midnight. */
export function parseOptionalTimeToMinutes(value: string): number | undefined {
    const s = value.trim();
    if (!s) return undefined;
    const [h, m] = s.split(":").map((x) => Number(x));
    if (!Number.isFinite(h)) return undefined;
    return h * 60 + (Number.isFinite(m) ? m : 0);
}

/** Format minutes from midnight for `<input type="time">`. */
export function formatMinutesForTimeInput(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
