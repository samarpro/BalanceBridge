export function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** Monday-first week rows for the month containing `cursor`. */
export function buildMonthGrid(cursor: Date): { label: number; inMonth: boolean; iso: string }[][] {
    const first = startOfMonth(cursor);
    const firstDow = (first.getDay() + 6) % 7; // Mon = 0
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - firstDow);

    const rows: { label: number; inMonth: boolean; iso: string }[][] = [];
    let day = new Date(gridStart);

    for (let r = 0; r < 6; r++) {
        const row: { label: number; inMonth: boolean; iso: string }[] = [];
        for (let c = 0; c < 7; c++) {
            const inMonth = day.getMonth() === cursor.getMonth();
            const iso = day.toISOString().slice(0, 10);
            row.push({ label: day.getDate(), inMonth, iso });
            day.setDate(day.getDate() + 1);
        }
        rows.push(row);
    }

    return rows;
}
