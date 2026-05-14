import { useMemo } from "react";
import { motion } from "motion/react";
import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";
import { addDays, formatHm, getEntryTimeRange, isoFromDate } from "@/utils/schedule-time";
import { scheduleKindDotClass, scheduleKindPillClass } from "@/utils/schedule-kind-styles";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

function entryKindLabel(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return t("calendar.legend.shift");
        case "exam":
            return t("calendar.legend.exam");
        case "study":
            return t("calendar.legend.study");
    }
}

function sortByStart(a: ScheduleEntry, b: ScheduleEntry): number {
    return getEntryTimeRange(a).start - getEntryTimeRange(b).start;
}

export interface DashboardWeekScheduleListProps {
    entries: ScheduleEntry[];
    /** Monday 00:00 local for the visible ISO week. */
    weekStart: Date;
    onEntryClick: (entry: ScheduleEntry) => void;
}

/**
 * Mobile dashboard: same week as the week grid, listed Monday → Sunday with
 * entries sorted by start time within each day.
 */
export function DashboardWeekScheduleList({ entries, weekStart, onEntryClick }: DashboardWeekScheduleListProps) {
    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = addDays(weekStart, i);
            const iso = isoFromDate(d);
            const dayEntries = entries.filter((e) => e.isoDate === iso).sort(sortByStart);
            const heading = d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
            return { iso, heading, dayEntries };
        });
    }, [entries, weekStart]);

    return (
        <motion.div
            className="space-y-6"
            aria-label={t("dashboard.weekListAria")}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.05,
                    },
                },
            }}
        >
            {days.map(({ iso, heading, dayEntries }) => (
                <motion.section key={iso} className="space-y-2" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                    <h3 className="text-xs font-semibold tracking-wide text-[var(--kira-revamp-text-muted)] uppercase">{heading}</h3>
                    {dayEntries.length === 0 ? (
                        <p className="text-sm text-[var(--kira-revamp-text-secondary)]">{t("dashboard.weekDayEmpty")}</p>
                    ) : (
                        <motion.ul layout className="space-y-2">
                            {dayEntries.map((e) => {
                                const { start, end } = getEntryTimeRange(e);
                                return (
                                    <motion.li key={e.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                                        <motion.button
                                            type="button"
                                            onClick={() => onEntryClick(e)}
                                            className={cx(
                                                "kira-revamp-focusable w-full rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] px-3 py-2.5 text-left transition duration-150 hover:shadow-[var(--kira-revamp-shadow-card)]",
                                            )}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.985 }}
                                        >
                                            <span
                                                className={cx(
                                                    "mb-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                                                    scheduleKindPillClass(e.kind),
                                                )}
                                            >
                                                {entryKindLabel(e.kind)}
                                            </span>
                                            <p className="text-sm font-semibold text-[var(--kira-revamp-text-primary)]">{e.title}</p>
                                            <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--kira-revamp-text-muted)]">
                                                <span className={scheduleKindDotClass(e.kind)} aria-hidden />
                                                <span className="tabular-nums">
                                                    {formatHm(start)}–{formatHm(end)}
                                                </span>
                                                {e.completed ? <span>· {t("calendar.editModal.doneSuffix")}</span> : null}
                                            </p>
                                        </motion.button>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>
                    )}
                </motion.section>
            ))}
        </motion.div>
    );
}
