import { useMemo, useState } from "react";
import { parseDate } from "@internationalized/date";
import { AnimatePresence, motion } from "motion/react";
import type { DateValue } from "react-aria-components";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Calendar } from "@/components/application/date-picker/calendar";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import type { ScheduleEntry } from "@/components/kira/calendar-month";
import { DayScheduleTimeline, WeekScheduleTimeline } from "@/components/kira/day-schedule-timeline";
import { ScheduleEntryEditModal } from "@/components/kira/schedule-entry-modal";
import { HoverHint } from "@/components/kira/hover-hint";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { addDays, dateFromIso, defaultStartMinutesForNewTaskOnDay, isoFromDate, startOfWeekMonday } from "@/utils/schedule-time";
import { scheduleKindLegendSwatchClass } from "@/utils/schedule-kind-styles";
import { t } from "@/i18n/strings";

export type PlannerView = "day" | "week" | "month";

function calendarDateFromJs(d: Date): DateValue {
    return parseDate(isoFromDate(d));
}

function jsFromCalendarDate(v: DateValue): Date {
    return new Date(v.year, v.month - 1, v.day);
}

interface SchedulePlannerProps {
    entries: ScheduleEntry[];
}

export function SchedulePlanner({ entries }: SchedulePlannerProps) {
    const { tryAdd, collisionModal } = useCollisionGuardedAdd();
    const [view, setView] = useState<PlannerView>("week");
    const [anchorDate, setAnchorDate] = useState(() => {
        const x = new Date();
        x.setHours(0, 0, 0, 0);
        return x;
    });
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const highlightedDates = useMemo(() => {
        const uniq = [...new Set(entries.map((e) => e.isoDate))];
        return uniq.map((iso) => parseDate(iso));
    }, [entries]);

    const completionHighlightedDates = useMemo(() => {
        const uniq = [...new Set(entries.filter((e) => e.completed).map((e) => e.isoDate))];
        return uniq.map((iso) => parseDate(iso));
    }, [entries]);

    const editingEntry = useMemo(() => entries.find((e) => e.id === editingEntryId) ?? null, [entries, editingEntryId]);

    const weekStart = useMemo(() => startOfWeekMonday(anchorDate), [anchorDate]);

    const title = useMemo(() => {
        if (view === "day") {
            return anchorDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        }
        if (view === "week") {
            const end = addDays(weekStart, 6);
            const a = weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            const b = end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
            return `${a} – ${b}`;
        }
        return anchorDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }, [anchorDate, view, weekStart]);

    const plannerTitle =
        view === "day" ? t("calendar.plannerTitle.day") : view === "week" ? t("calendar.plannerTitle.week") : t("calendar.plannerTitle.month");

    const plannerHover =
        view === "month"
            ? { title: t("app.hover.plannerMonth"), description: t("calendar.monthPlannerClickHint") }
            : {
                  title: t("app.hover.plannerDayWeek"),
                  description: `${t("dashboard.dayScheduleCaption")} ${t("dashboard.dayScheduleClickHint")}`,
              };
    const panelMotion = { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

    const NEW_BLOCK_MINUTES = 30;

    const createTaskAndEdit = (day: Date, startMinutes: number) => {
        tryAdd(
            {
                isoDate: isoFromDate(day),
                title: t("calendar.newTaskDefaultTitle"),
                kind: "study",
                priority: "medium",
                completed: false,
                startMinutes,
                durationMinutes: NEW_BLOCK_MINUTES,
            },
            (id) => setEditingEntryId(id),
        );
    };

    const handleTimelineCreate = (startMinutes: number) => {
        createTaskAndEdit(anchorDate, startMinutes);
    };

    const handleMonthDayPress = (dateValue: DateValue) => {
        const day = jsFromCalendarDate(dateValue);
        const iso = isoFromDate(day);
        const startMinutes = defaultStartMinutesForNewTaskOnDay(iso, new Date(), NEW_BLOCK_MINUTES);
        createTaskAndEdit(day, startMinutes);
    };

    return (
        <motion.section
            className="rounded-xl ring-1 ring-secondary bg-primary_alt p-5 md:p-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={panelMotion}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-1.5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{plannerTitle}</p>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.h2
                                key={`${view}-${title}`}
                                className="mt-1 text-lg font-semibold text-secondary"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                {title}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                    <HoverHint title={plannerHover.title} description={plannerHover.description} className="mt-5 shrink-0 md:mt-6" />
                </div>

                <ButtonGroup
                    selectedKeys={new Set<PlannerView>([view])}
                    onSelectionChange={(keys) => {
                        const next = [...keys][0] as PlannerView | undefined;
                        if (next) setView(next);
                    }}
                    size="sm"
                    className="w-full shrink-0 md:w-max"
                >
                    <ButtonGroupItem id="day">{t("calendar.view.day")}</ButtonGroupItem>
                    <ButtonGroupItem id="week">{t("calendar.view.week")}</ButtonGroupItem>
                    <ButtonGroupItem id="month">{t("calendar.view.month")}</ButtonGroupItem>
                </ButtonGroup>
            </div>

            {view !== "month" && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={ChevronLeft}
                        aria-label={view === "week" ? t("aria.previousMonth") : t("aria.previousDay")}
                        onClick={() =>
                            setAnchorDate((d) => {
                                const n = new Date(d);
                                n.setDate(n.getDate() - (view === "week" ? 7 : 1));
                                return n;
                            })
                        }
                    />
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={ChevronRight}
                        aria-label={view === "week" ? t("aria.nextMonth") : t("aria.nextDay")}
                        onClick={() =>
                            setAnchorDate((d) => {
                                const n = new Date(d);
                                n.setDate(n.getDate() + (view === "week" ? 7 : 1));
                                return n;
                            })
                        }
                    />
                    <Button color="secondary" size="sm" onClick={() => setAnchorDate(new Date())}>
                        {t("calendar.goToday")}
                    </Button>
                </div>
            )}

            <div className="mt-7 space-y-4">
                <AnimatePresence mode="wait" initial={false}>
                    {view === "month" ? (
                        <motion.div
                            key="planner-month"
                            className="overflow-x-auto scrollbar-hide"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={panelMotion}
                        >
                            <Calendar
                                highlightedDates={highlightedDates}
                                completionHighlightedDates={completionHighlightedDates}
                                focusedValue={calendarDateFromJs(anchorDate)}
                                onFocusChange={(v) => v && setAnchorDate(jsFromCalendarDate(v))}
                                onDayPress={handleMonthDayPress}
                                className="min-w-max"
                            >
                                <div className="flex justify-end">
                                    <Button
                                        slot={null}
                                        size="sm"
                                        color="secondary"
                                        onClick={() => {
                                            const n = new Date();
                                            n.setHours(0, 0, 0, 0);
                                            setAnchorDate(n);
                                        }}
                                    >
                                        {t("calendar.goToday")}
                                    </Button>
                                </div>
                            </Calendar>
                        </motion.div>
                    ) : view === "week" ? (
                        <motion.div
                            key={`planner-week-${isoFromDate(weekStart)}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={panelMotion}
                        >
                            <WeekScheduleTimeline
                                entries={entries}
                                weekStart={weekStart}
                                onEntryClick={(entry) => setEditingEntryId(entry.id)}
                                onTimelineBackgroundClick={(payload) => createTaskAndEdit(dateFromIso(payload.iso), payload.startMinutes)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`planner-day-${isoFromDate(anchorDate)}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={panelMotion}
                        >
                            <DayScheduleTimeline
                                entries={entries}
                                day={anchorDate}
                                onEntryClick={(entry) => setEditingEntryId(entry.id)}
                                onTimelineBackgroundClick={handleTimelineCreate}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ScheduleEntryEditModal
                entry={editingEntry}
                isOpen={editingEntryId !== null && editingEntry !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingEntryId(null);
                }}
            />
            {collisionModal}

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-secondary pt-4 text-xs text-tertiary">
                <li className="flex items-center gap-1.5">
                    <span className={scheduleKindLegendSwatchClass("shift")} /> {t("calendar.legend.shift")}
                </li>
                <li className="flex items-center gap-1.5">
                    <span className={scheduleKindLegendSwatchClass("exam")} /> {t("calendar.legend.exam")}
                </li>
                <li className="flex items-center gap-1.5">
                    <span className={scheduleKindLegendSwatchClass("study")} /> {t("calendar.legend.study")}
                </li>
                <li className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full bg-[#4F9A72] ring-1 ring-secondary dark:bg-[#90C9A5]" /> {t("calendar.legend.completed")}
                </li>
            </ul>
        </motion.section>
    );
}
