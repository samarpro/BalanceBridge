import type { ScheduleEntry } from "@/components/kira/calendar-month";
import { motion } from "motion/react";
import {
    DAY_END_MIN,
    DAY_START_MIN,
    addDays,
    formatHm,
    getEntryTimeRange,
    isoFromDate,
    startMinutesFromTimelineClick,
} from "@/utils/schedule-time";
import { t } from "@/i18n/strings";
import { scheduleEntryBlockClass } from "@/utils/schedule-kind-styles";
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
const HOUR_PX = 40;
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
        <div className="relative w-9 shrink-0 text-[11px] tabular-nums text-quaternary md:w-11 md:text-xs" style={{ height: DAY_TIMELINE_HEIGHT_PX }}>
            {Array.from({ length: DAY_SLOT_COUNT + 1 }, (_, i) => {
                const hour = Math.floor((DAY_START_MIN + i * 60) / 60);
                return (
                    <span key={i} className="absolute right-1.5 md:right-2" style={{ top: `${(i / DAY_SLOT_COUNT) * 100}%`, transform: "translateY(-50%)" }}>
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
                    <motion.button
                        layout
                        key={entry.id}
                        type="button"
                        disabled={!interactive}
                        onClick={() => onEntryClick?.(entry)}
                        className={cx(
                            "absolute right-1 left-1 z-10 overflow-hidden rounded-lg px-2 py-1 text-left shadow-xs ring-inset transition-[filter,transform] duration-150 ease-out",
                            interactive && "cursor-pointer hover:brightness-110 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:scale-[0.99]",
                            !interactive && "cursor-default",
                            scheduleEntryBlockClass(entry),
                        )}
                        style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        whileHover={interactive ? { y: -2 } : undefined}
                        whileTap={interactive ? { scale: 0.985 } : undefined}
                    >
                        <p className={cx("line-clamp-2 text-xs font-semibold text-white")}>{entry.title}</p>
                        <p className="text-[10px] font-medium text-white/90">
                            {formatHm(clampedStart)}–{formatHm(clampedEnd)} · {entryKindLabel(entry.kind)}
                            {entry.completed ? ` · ${t("calendar.editModal.doneSuffix")}` : ""}
                        </p>
                    </motion.button>
                );
            })}
        </>
    );
}

const DEFAULT_CLICK_BLOCK_MINUTES = 30;

/** Payload when clicking empty space on a day timeline (week grid needs `iso`). */
export type TimelineBackgroundClickPayload = {
    iso: string;
    startMinutes: number;
};

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
    onTimelineBackgroundClick?: (payload: TimelineBackgroundClickPayload) => void;
    timelineBackgroundClickLabel?: string;
}) {
    const dayEntries = entriesForIso(entries, iso);
    const dayNum = iso.slice(8);
    return (
        <div className="min-w-0 flex-1 border-l border-secondary">
            <div className="border-b border-secondary bg-secondary_alt px-2 py-1.5 text-center md:py-2">
                <p className="text-xs font-semibold text-quaternary">{dayLabel}</p>
                <p className="text-sm font-semibold text-secondary">{dayNum.startsWith("0") ? dayNum.slice(1) : dayNum}</p>
            </div>
            <div className="relative bg-primary" style={{ height: DAY_TIMELINE_HEIGHT_PX }}>
                {onTimelineBackgroundClick && (
                    <motion.button
                        type="button"
                        aria-label={timelineBackgroundClickLabel ?? t("dashboard.timelineAddTaskAria")}
                        className="absolute inset-0 z-0 cursor-crosshair border-0 bg-transparent p-0 outline-none hover:bg-primary_hover/30"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            const fraction = rect.height > 0 ? y / rect.height : 0;
                            const startMinutes = startMinutesFromTimelineClick(fraction, DEFAULT_CLICK_BLOCK_MINUTES);
                            onTimelineBackgroundClick({ iso, startMinutes });
                        }}
                        whileTap={{ scale: 0.997 }}
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
            <div className="h-11 shrink-0 border-b border-secondary bg-secondary_alt md:h-[52px]" />
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

export interface WeekScheduleTimelineProps {
    entries: ScheduleEntry[];
    /** Monday 00:00 local for the visible ISO week. */
    weekStart: Date;
    className?: string;
    onEntryClick?: (entry: ScheduleEntry) => void;
    onTimelineBackgroundClick?: (payload: TimelineBackgroundClickPayload) => void;
    timelineBackgroundClickLabel?: string;
    "aria-label"?: string;
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
        <div className={cx("overflow-x-auto scrollbar-hide rounded-lg ring-1 ring-secondary", className)} aria-label={t("dashboard.dayTimelineAria")}>
            <div className="flex w-full min-w-[240px] md:min-w-[280px]">
                <TimelineRulerColumn />
                <DayColumn
                    iso={iso}
                    dayLabel={label}
                    entries={entries}
                    onEntryClick={onEntryClick}
                    onTimelineBackgroundClick={
                        onTimelineBackgroundClick
                            ? (payload) => onTimelineBackgroundClick(payload.startMinutes)
                            : undefined
                    }
                    timelineBackgroundClickLabel={timelineBackgroundClickLabel}
                />
            </div>
        </div>
    );
}

/** Ruler + seven day columns (Monday–Sunday) for a compact week planner. */
export function WeekScheduleTimeline({
    entries,
    weekStart,
    className,
    onEntryClick,
    onTimelineBackgroundClick,
    timelineBackgroundClickLabel,
    "aria-label": ariaLabel,
}: WeekScheduleTimelineProps) {
    return (
        <div className={cx("overflow-x-auto scrollbar-hide rounded-lg ring-1 ring-secondary", className)} aria-label={ariaLabel ?? t("aria.weekPlannerGrid")}>
            <div className="flex min-w-[720px]">
                <TimelineRulerColumn />
                {Array.from({ length: 7 }, (_, i) => {
                    const d = addDays(weekStart, i);
                    const iso = isoFromDate(d);
                    return (
                        <DayColumn
                            key={iso}
                            iso={iso}
                            dayLabel={d.toLocaleDateString(undefined, { weekday: "short" })}
                            entries={entries}
                            onEntryClick={onEntryClick}
                            onTimelineBackgroundClick={onTimelineBackgroundClick}
                            timelineBackgroundClickLabel={timelineBackgroundClickLabel}
                        />
                    );
                })}
            </div>
        </div>
    );
}
