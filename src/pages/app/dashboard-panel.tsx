import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import type { ScheduleEntry, ScheduleKind } from "@/components/balance-bridge/calendar-month";
import { DayScheduleTimeline } from "@/components/balance-bridge/day-schedule-timeline";
import { ScheduleEntryEditModal } from "@/components/balance-bridge/schedule-entry-modal";
import { MOCK_EVENTS } from "@/data/mock-events";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { useKiraStore } from "@/stores/kira-store";
import {
    calendarWeekKindMinutes,
    formatMinutesAsHoursMinutes,
    fortnightShiftMinutes,
} from "@/utils/schedule-aggregates";
import { effectiveDeadlineIso, sortedIncompleteByAttention } from "@/utils/next-schedule-action";
import { isoFromDate } from "@/utils/schedule-time";
import { t } from "@/i18n/strings";

interface DashboardPanelProps {
    onOpenTab: (tab: string) => void;
}

const FORTNIGHT_CAP_HOURS = 48;

function formatIsoShort(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function priorityBadgeColor(priority: ScheduleEntry["priority"]): "error" | "warning" | "gray" {
    switch (priority) {
        case "high":
            return "error";
        case "medium":
            return "warning";
        default:
            return "gray";
    }
}

function kindBadgeColor(kind: ScheduleKind): "brand" | "warning" | "success" {
    switch (kind) {
        case "shift":
            return "brand";
        case "exam":
            return "warning";
        default:
            return "success";
    }
}

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

function priorityLabel(priority: ScheduleEntry["priority"]): string {
    switch (priority) {
        case "high":
            return t("badges.priority.high");
        case "medium":
            return t("badges.priority.medium");
        case "low":
            return t("badges.priority.low");
    }
}

export function DashboardPanel({ onOpenTab }: DashboardPanelProps) {
    const entries = useKiraStore((s) => s.entries);
    const { tryAdd, collisionModal } = useCollisionGuardedAdd();
    const weeklyStudyGoalMinutes = useKiraStore((s) => s.weeklyStudyGoalMinutes);

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const [scheduleDay, setScheduleDay] = useState(() => {
        const x = new Date();
        x.setHours(0, 0, 0, 0);
        return x;
    });

    const refDay = useMemo(() => new Date(), []);

    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);

    const workHoursDisplay = Math.min(fortnightWorkMinutes / 60, FORTNIGHT_CAP_HOURS);
    const studyGoalPercent = Math.min(100, Math.round((weekStudyMinutes / Math.max(weeklyStudyGoalMinutes, 1)) * 100));

    const upcoming = useMemo(() => [...entries].sort((a, b) => a.isoDate.localeCompare(b.isoDate)).slice(0, 4), [entries]);

    const editingEntry = useMemo(() => entries.find((e) => e.id === editingEntryId) ?? null, [entries, editingEntryId]);

    const rankedIncomplete = useMemo(() => sortedIncompleteByAttention(entries, new Date()), [entries]);
    const todayIso = isoFromDate(new Date());
    const topPick = rankedIncomplete[0];
    const runnersUp = rankedIncomplete.slice(1, 3);

    const dayHeading = scheduleDay.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const shiftDay = (delta: number) => {
        setScheduleDay((d) => {
            const n = new Date(d);
            n.setDate(n.getDate() + delta);
            return n;
        });
    };

    const goToday = () => {
        const n = new Date();
        n.setHours(0, 0, 0, 0);
        setScheduleDay(n);
    };

    const handleTimelineCreate = (startMinutes: number) => {
        tryAdd(
            {
                isoDate: isoFromDate(scheduleDay),
                title: t("calendar.newTaskDefaultTitle"),
                kind: "study",
                priority: "medium",
                completed: false,
                startMinutes,
                durationMinutes: 30,
            },
            (id) => setEditingEntryId(id),
        );
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-xl ring-1 ring-secondary bg-primary_alt p-5">
                    <h2 className="text-lg font-semibold text-secondary">{t("dashboard.workHours")}</h2>
                    <p className="mt-1 text-sm text-tertiary">{t("dashboard.workHoursCaption")}</p>
                    <p className="mt-4 text-sm font-medium text-secondary">
                        {(fortnightWorkMinutes / 60).toFixed(1)} h / {FORTNIGHT_CAP_HOURS} h
                    </p>
                    <ProgressBar
                        className="mt-3"
                        value={workHoursDisplay}
                        max={FORTNIGHT_CAP_HOURS}
                        labelPosition="bottom"
                        valueFormatter={(v) => `${v.toFixed(1)} h`}
                    />
                </section>

                <section className="rounded-xl ring-1 ring-secondary bg-primary_alt p-5">
                    <h2 className="text-lg font-semibold text-secondary">{t("dashboard.goalTitle")}</h2>
                    <p className="mt-1 text-sm text-tertiary">{t("dashboard.goalCaption")}</p>
                    <p className="mt-4 text-sm font-medium text-secondary">
                        {formatMinutesAsHoursMinutes(weekStudyMinutes)} / {formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}
                    </p>
                    <ProgressBar className="mt-4" value={studyGoalPercent} labelPosition="right" valueFormatter={() => `${studyGoalPercent}%`} />
                </section>
            </div>

            <section className="rounded-xl ring-1 ring-secondary bg-primary_alt p-5">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("calendar.plannerTitle.day")}</p>
                        <h2 className="mt-1 text-lg font-semibold text-secondary">{dayHeading}</h2>
                        <p className="mt-1 text-sm text-tertiary">{t("dashboard.dayScheduleCaption")}</p>
                        <p className="mt-2 text-sm text-quaternary">{t("dashboard.dayScheduleClickHint")}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button color="secondary" size="sm" iconLeading={ChevronLeft} aria-label={t("aria.previousDay")} onClick={() => shiftDay(-1)} />
                        <Button color="secondary" size="sm" iconLeading={ChevronRight} aria-label={t("aria.nextDay")} onClick={() => shiftDay(1)} />
                        <Button color="secondary" size="sm" onClick={goToday}>
                            {t("calendar.goToday")}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 w-full">
                    <DayScheduleTimeline
                        entries={entries}
                        day={scheduleDay}
                        onEntryClick={(entry) => setEditingEntryId(entry.id)}
                        onTimelineBackgroundClick={handleTimelineCreate}
                    />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
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
                    <Button color="link-color" size="sm" className="justify-start px-0" iconTrailing={ArrowUpRight} onClick={() => onOpenTab("calendar")}>
                        {t("dashboard.openFullCalendar")}
                    </Button>
                </div>
            </section>

            <ScheduleEntryEditModal
                entry={editingEntry}
                isOpen={editingEntryId !== null && editingEntry !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingEntryId(null);
                }}
            />
            {collisionModal}

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <section className="flex flex-col rounded-xl bg-primary_alt p-5 ring-1 ring-secondary">
                    <h2 className="text-lg font-semibold text-secondary">{t("dashboard.nextAction.title")}</h2>
                    <p className="mt-2 text-md font-semibold text-brand-secondary">{t("dashboard.nextAction.headline")}</p>
                    <p className="mt-2 text-sm text-tertiary">{t("dashboard.nextAction.hint")}</p>

                    {topPick ? (
                        <>
                            <Button
                                color="secondary"
                                size="lg"
                                className="mt-5 h-auto w-full flex-col items-start gap-3 py-4 text-left shadow-xs ring-1 ring-secondary ring-inset"
                                onClick={() => setEditingEntryId(topPick.id)}
                            >
                                <div className="flex w-full flex-wrap items-center gap-2">
                                    <Badge type="pill-color" color={priorityBadgeColor(topPick.priority)} size="sm">
                                        {priorityLabel(topPick.priority)}
                                    </Badge>
                                    <Badge type="pill-color" color={kindBadgeColor(topPick.kind)} size="sm">
                                        {entryKindLabel(topPick.kind)}
                                    </Badge>
                                </div>
                                <p className="w-full text-md font-semibold text-secondary">{topPick.title}</p>
                                <div className="w-full space-y-1 text-xs text-tertiary">
                                    {effectiveDeadlineIso(topPick) < todayIso && (
                                        <p className="font-semibold text-error-primary">{t("dashboard.nextAction.overdue")}</p>
                                    )}
                                    {topPick.deadlineIso?.trim() ? (
                                        <>
                                            <p>
                                                <span className="font-medium text-quaternary">{t("dashboard.nextAction.deadline")}</span>{" "}
                                                <span className="text-secondary">{formatIsoShort(topPick.deadlineIso.trim())}</span>
                                            </p>
                                            <p>
                                                <span className="font-medium text-quaternary">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                                <span className="text-secondary">{formatIsoShort(topPick.isoDate)}</span>
                                            </p>
                                        </>
                                    ) : (
                                        <p>
                                            <span className="font-medium text-quaternary">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                            <span className="text-secondary">{formatIsoShort(topPick.isoDate)}</span>
                                        </p>
                                    )}
                                </div>
                            </Button>

                            {runnersUp.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("dashboard.nextAction.alsoConsider")}</p>
                                    <ul className="mt-2 space-y-2">
                                        {runnersUp.map((e) => (
                                            <li key={e.id}>
                                                <button
                                                    type="button"
                                                    className="w-full rounded-lg bg-primary px-3 py-2 text-left ring-1 ring-secondary ring-inset transition-colors duration-100 hover:bg-primary_hover"
                                                    onClick={() => setEditingEntryId(e.id)}
                                                >
                                                    <span className="block text-sm font-semibold text-secondary">{e.title}</span>
                                                    <span className="mt-0.5 block text-xs text-tertiary">
                                                        {formatIsoShort(effectiveDeadlineIso(e))} · {priorityLabel(e.priority)}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="mt-5 text-sm text-tertiary">{t("dashboard.nextAction.empty")}</p>
                    )}

                    <Button color="link-color" size="sm" className="mt-auto justify-start px-0 pt-6" iconTrailing={ArrowUpRight} onClick={() => onOpenTab("calendar")}>
                        {t("dashboard.openFullCalendar")}
                    </Button>
                </section>

                <section className="rounded-xl bg-primary_alt p-5 ring-1 ring-secondary">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-secondary">{t("dashboard.upcoming")}</h2>
                        <Button color="link-color" size="sm" className="px-0" onClick={() => onOpenTab("events")}>
                            {t("app.tab.events")}
                        </Button>
                    </div>
                    <ul className="mt-4 space-y-3">
                        {upcoming.map((e) => (
                            <li key={e.id} className="rounded-lg bg-primary px-3 py-2 ring-1 ring-secondary ring-inset">
                                <p className="text-sm font-semibold text-secondary">{e.title}</p>
                                <p className="text-xs text-tertiary">
                                    {e.isoDate} · {e.kind}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 border-t border-secondary pt-4">
                        <p className="text-xs font-semibold uppercase text-quaternary">{t("events.title")}</p>
                        <ul className="mt-2 space-y-2">
                            {MOCK_EVENTS.slice(0, 2).map((ev) => (
                                <li key={ev.id} className="text-sm text-secondary">
                                    <span className="font-medium">{ev.title}</span>
                                    <span className="text-tertiary"> — {ev.when}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
