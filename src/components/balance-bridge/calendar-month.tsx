import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { buildMonthGrid } from "@/utils/calendar-grid";
import { t } from "@/i18n/strings";

export type ScheduleKind = "shift" | "exam" | "study";

export interface ScheduleEntry {
    id: string;
    isoDate: string;
    title: string;
    kind: ScheduleKind;
    priority: "low" | "medium" | "high";
    /** When true, the block shows as completed (green) in timeline views. */
    completed?: boolean;
    /** If set, used (with priority) for dashboard “do this first”; otherwise `isoDate` is used. */
    deadlineIso?: string;
    /** Minutes from midnight for day/week planner columns; optional — sensible defaults per kind. */
    startMinutes?: number;
    durationMinutes?: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface CalendarMonthProps {
    cursor: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    entries: ScheduleEntry[];
    compact?: boolean;
}

function kindsForDay(entries: ScheduleEntry[], iso: string): ScheduleKind[] {
    const set = new Set<ScheduleKind>();
    for (const e of entries) {
        if (e.isoDate === iso) set.add(e.kind);
    }
    return [...set];
}

export function CalendarMonth({ cursor, onPrevMonth, onNextMonth, entries, compact }: CalendarMonthProps) {
    const grid = buildMonthGrid(cursor);
    const title = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

    return (
        <section className={cx("rounded-xl ring-1 ring-secondary bg-primary_alt", compact ? "p-3" : "p-4")} aria-label={t("dashboard.calendarPreview")}>
            <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className={cx("font-semibold text-secondary", compact ? "text-sm" : "text-md")}>{title}</h2>
                <div className="flex gap-1">
                    <Button color="secondary" size="sm" iconLeading={ChevronLeft} aria-label={t("aria.previousMonth")} onClick={onPrevMonth} />
                    <Button color="secondary" size="sm" iconLeading={ChevronRight} aria-label={t("aria.nextMonth")} onClick={onNextMonth} />
                </div>
            </div>

            <div className={cx("grid grid-cols-7 gap-1 text-center", compact ? "text-xs" : "text-xs")}>
                {WEEKDAYS.map((d) => (
                    <div key={d} className="font-semibold text-quaternary">
                        {d}
                    </div>
                ))}
                {grid.flat().map((cell) => {
                    const kinds = kindsForDay(entries, cell.iso);
                    return (
                        <div
                            key={cell.iso}
                            className={cx(
                                "relative flex min-h-9 flex-col items-center justify-start rounded-md py-1",
                                cell.inMonth ? "text-secondary" : "text-disabled",
                                !compact && cell.inMonth && "ring-1 ring-transparent hover:bg-primary_hover",
                            )}
                        >
                            <span className="tabular-nums">{cell.label}</span>
                            <span className="mt-0.5 flex min-h-3 justify-center gap-0.5" aria-hidden={kinds.length === 0}>
                                {kinds.includes("shift") && (
                                    <span className="inline-block size-1.5 rounded-full bg-fg-brand-primary ring-1 ring-secondary" title={t("calendar.legend.shift")} />
                                )}
                                {kinds.includes("exam") && (
                                    <span
                                        className="inline-block size-1.5 rounded-sm bg-warning-solid ring-1 ring-secondary"
                                        title={t("calendar.legend.exam")}
                                    />
                                )}
                                {kinds.includes("study") && (
                                    <span
                                        className="inline-block size-1.5 rounded-full border-2 border-dashed border-success-solid bg-transparent"
                                        title={t("calendar.legend.study")}
                                    />
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            {!compact && (
                <ul className="mt-4 flex flex-wrap gap-3 text-xs text-tertiary">
                    <li className="flex items-center gap-1.5">
                        <span className="inline-block size-2 rounded-full bg-fg-brand-primary ring-1 ring-secondary" /> {t("calendar.legend.shift")}
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="inline-block size-2 rounded-sm bg-warning-solid ring-1 ring-secondary" /> {t("calendar.legend.exam")}
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="inline-block size-2 rounded-full border-2 border-dashed border-success-solid" /> {t("calendar.legend.study")}
                    </li>
                </ul>
            )}
        </section>
    );
}
