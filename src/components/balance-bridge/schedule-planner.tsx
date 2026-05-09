import { useMemo, useState } from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Calendar } from "@/components/application/date-picker/calendar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { DayColumn, DayScheduleTimeline, TimelineRulerColumn } from "@/components/balance-bridge/day-schedule-timeline";
import { ScheduleEntryEditModal } from "@/components/balance-bridge/schedule-entry-modal";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { addDays, defaultStartMinutesForNewTaskOnDay, isoFromDate, startOfWeekMonday } from "@/utils/schedule-time";
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
        <section className="rounded-xl ring-1 ring-secondary bg-primary_alt p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{plannerTitle}</p>
                    <h2 className="mt-1 text-lg font-semibold text-secondary">{title}</h2>
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
                    {(view === "day" || view === "week") && (
                        <p className="mt-2 w-full text-sm text-quaternary">{t("dashboard.dayScheduleClickHint")}</p>
                    )}
                </div>
            )}

            <div className="mt-6 space-y-4">
                {view === "month" && (
                    <div className="overflow-x-auto">
                        <p className="mb-3 text-sm text-quaternary">{t("calendar.monthPlannerClickHint")}</p>
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
                    </div>
                )}

                {view === "week" && (
                    <div className="overflow-x-auto rounded-lg ring-1 ring-secondary" aria-label={t("aria.weekPlannerGrid")}>
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
                                        onEntryClick={(entry) => setEditingEntryId(entry.id)}
                                        onTimelineBackgroundClick={(startMinutes) => createTaskAndEdit(d, startMinutes)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {view === "day" && (
                    <DayScheduleTimeline
                        entries={entries}
                        day={anchorDate}
                        onEntryClick={(entry) => setEditingEntryId(entry.id)}
                        onTimelineBackgroundClick={handleTimelineCreate}
                    />
                )}
            </div>

            <ScheduleEntryEditModal
                entry={editingEntry}
                isOpen={editingEntryId !== null && editingEntry !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingEntryId(null);
                }}
            />
            {collisionModal}

            <div className="mt-6 flex flex-wrap gap-2 border-t border-secondary pt-4">
                <Badge type="pill-color" color="brand" size="sm">
                    {t("calendar.legend.shift")}
                </Badge>
                <Badge type="pill-color" color="warning" size="sm">
                    {t("calendar.legend.exam")}
                </Badge>
                <Badge type="pill-color" color="success" size="sm">
                    {t("calendar.legend.study")}
                </Badge>
                <Badge type="pill-color" color="success" size="sm">
                    {t("calendar.legend.completed")}
                </Badge>
            </div>
        </section>
    );
}
