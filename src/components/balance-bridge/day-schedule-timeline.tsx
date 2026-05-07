import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import {
    DAY_END_MIN,
    DAY_START_MIN,
    formatHm,
    getEntryTimeRange,
    isoFromDate,
    startMinutesFromTimelineClick,
} from "@/utils/schedule-time";
import { t } from "@/i18n/strings";
import { cx } from "@/utils/cx";

export function entriesForIso(entries: ScheduleEntry[], iso: string): ScheduleEntry[] {
    return entries.filter((e) => e.isoDate === iso);
}

function entryKindLabel(kind: ScheduleEntry["kind"]): string {
    switch (kind) {
        case "shift":
            return t("calendar.legend.shift");
        case "exam":
            return t("calendar.legend.exam");
        case "study":
            return t("calendar.legend.study");
    }
}

export const TOTAL_DAY_MIN = DAY_END_MIN - DAY_START_MIN;
export const DAY_SLOT_COUNT = TOTAL_DAY_MIN / 60;
const HOUR_PX = 44;
export const DAY_TIMELINE_HEIGHT_PX = DAY_SLOT_COUNT * HOUR_PX;

function HourGrid() {
    return (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: DAY_SLOT_COUNT + 1 }, (_, i) => (
                <div
                    key={i}
                    className="absolute right-0 left-0 border-t border-secondary"
                    style={{ top: `${(i / DAY_SLOT_COUNT) * 100}%` }}
                />
            ))}
        </div>
    );
}

function TimeRuler() {
    return (
        <div className="relative w-11 shrink-0 text-xs tabular-nums text-quaternary" style={{ height: DAY_TIMELINE_HEIGHT_PX }}>
            {Array.from({ length: DAY_SLOT_COUNT + 1 }, (_, i) => {
                const hour = Math.floor((DAY_START_MIN + i * 60) / 60);
                return (
                    <span key={i} className="absolute right-2" style={{ top: `${(i / DAY_SLOT_COUNT) * 100}%`, transform: "translateY(-50%)" }}>
                        {hour}:00
                    </span>
                );
            })}
        </div>
    );
}

function EventBlocks({ entries, onEntryClick }: { entries: ScheduleEntry[]; onEntryClick?: (entry: ScheduleEntry) => void }) {
    return (
        <>
            {entries.map((entry) => {
                const { start, end } = getEntryTimeRange(entry);
                const clampedStart = Math.max(start, DAY_START_MIN);
                const clampedEnd = Math.min(end, DAY_END_MIN);
                if (clampedEnd <= DAY_START_MIN || clampedStart >= DAY_END_MIN) return null;

                const topPct = ((clampedStart - DAY_START_MIN) / TOTAL_DAY_MIN) * 100;
                const heightPct = Math.max(((clampedEnd - clampedStart) / TOTAL_DAY_MIN) * 100, 4);

                const interactive = typeof onEntryClick === "function";

                return (
                    <button
                        key={entry.id}
                        type="button"
                        disabled={!interactive}
                        onClick={() => onEntryClick?.(entry)}
                        className={cx(
                            "absolute right-1 left-1 z-10 overflow-hidden rounded-lg px-2 py-1 text-left shadow-xs ring-1 ring-inset transition-colors duration-100 ease-linear",
                            interactive && "cursor-pointer hover:brightness-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                            !interactive && "cursor-default",
                            entry.completed
                                ? "bg-success-solid ring-success-solid hover:bg-success-solid_hover"
                                : entry.kind === "shift" && "bg-brand-secondary ring-brand-secondary",
                            !entry.completed && entry.kind === "exam" && "bg-warning-secondary ring-warning-secondary",
                            !entry.completed && entry.kind === "study" && "bg-success-secondary ring-success-secondary",
                        )}
                        style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                    >
                        <p
                            className={cx(
                                "line-clamp-2 text-xs font-semibold",
                                entry.completed ? "text-white" : "text-secondary",
                            )}
                        >
                            {entry.title}
                        </p>
                        <p className={cx("text-[10px] font-medium", entry.completed ? "text-white/90" : "text-tertiary")}>
                            {formatHm(clampedStart)}–{formatHm(clampedEnd)} · {entryKindLabel(entry.kind)}
                            {entry.completed ? ` · ${t("calendar.editModal.doneSuffix")}` : ""}
                        </p>
                    </button>
                );
            })}
        </>
    );
}

const DEFAULT_CLICK_BLOCK_MINUTES = 30;

/** Single day column — header + hourly blocks (used by week grid). */
export function DayColumn({
    dayLabel,
    iso,
    entries,
    onEntryClick,
    onTimelineBackgroundClick,
    timelineBackgroundClickLabel,
}: {
    dayLabel: string;
    iso: string;
    entries: ScheduleEntry[];
    onEntryClick?: (entry: ScheduleEntry) => void;
    /** When set, empty areas of the grid create a block at the clicked time (blocks still receive clicks above this layer). */
    onTimelineBackgroundClick?: (startMinutes: number) => void;
    timelineBackgroundClickLabel?: string;
}) {
    const dayEntries = entriesForIso(entries, iso);
    const dayNum = iso.slice(8);
    return (
        <div className="min-w-0 flex-1 border-l border-secondary">
            <div className="border-b border-secondary bg-secondary_alt px-2 py-2 text-center">
                <p className="text-xs font-semibold text-quaternary">{dayLabel}</p>
                <p className="text-sm font-semibold text-secondary">{dayNum.startsWith("0") ? dayNum.slice(1) : dayNum}</p>
            </div>
            <div className="relative bg-primary" style={{ height: DAY_TIMELINE_HEIGHT_PX }}>
                {onTimelineBackgroundClick && (
                    <button
                        type="button"
                        aria-label={timelineBackgroundClickLabel ?? t("dashboard.timelineAddTaskAria")}
                        className="absolute inset-0 z-0 cursor-crosshair border-0 bg-transparent p-0 outline-none hover:bg-primary_hover/30"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            const fraction = rect.height > 0 ? y / rect.height : 0;
                            const start = startMinutesFromTimelineClick(fraction, DEFAULT_CLICK_BLOCK_MINUTES);
                            onTimelineBackgroundClick(start);
                        }}
                    />
                )}
                <HourGrid />
                <EventBlocks entries={dayEntries} onEntryClick={onEntryClick} />
            </div>
        </div>
    );
}

/** Empty corner cell + hour labels (prefix column for week/day grids). */
export function TimelineRulerColumn() {
    return (
        <div className="flex shrink-0 flex-col">
            <div className="h-[52px] shrink-0 border-b border-secondary bg-secondary_alt" />
            <TimeRuler />
        </div>
    );
}

interface DayScheduleTimelineProps {
    entries: ScheduleEntry[];
    /** Calendar day (local); time-of-day is ignored. */
    day: Date;
    className?: string;
    onEntryClick?: (entry: ScheduleEntry) => void;
    onTimelineBackgroundClick?: (startMinutes: number) => void;
    timelineBackgroundClickLabel?: string;
}

/** Full-width daily planner strip: ruler + one day of timed entries. */
export function DayScheduleTimeline({
    entries,
    day,
    className,
    onEntryClick,
    onTimelineBackgroundClick,
    timelineBackgroundClickLabel,
}: DayScheduleTimelineProps) {
    const iso = isoFromDate(day);
    const label = day.toLocaleDateString(undefined, { weekday: "short" });

    return (
        <div className={cx("overflow-x-auto rounded-lg ring-1 ring-secondary", className)} aria-label={t("dashboard.dayTimelineAria")}>
            <div className="flex w-full min-w-[280px]">
                <TimelineRulerColumn />
                <DayColumn
                    iso={iso}
                    dayLabel={label}
                    entries={entries}
                    onEntryClick={onEntryClick}
                    onTimelineBackgroundClick={onTimelineBackgroundClick}
                    timelineBackgroundClickLabel={timelineBackgroundClickLabel}
                />
            </div>
        </div>
    );
}
