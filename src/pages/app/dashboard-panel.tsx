import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, Briefcase01, ChevronLeft, ChevronRight, HeartRounded, Trophy01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";
import { DayScheduleTimeline } from "@/components/kira/day-schedule-timeline";
import { HoverHint } from "@/components/kira/hover-hint";
import { RevampProgressBar } from "@/components/kira/revamp-progress-bar";
import { ScheduleEntryEditModal } from "@/components/kira/schedule-entry-modal";
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
import { scheduleKindLegendSwatchClass, scheduleKindPillClass } from "@/utils/schedule-kind-styles";
import { cx } from "@/utils/cx";
import { t, tReplace, type MessageId } from "@/i18n/strings";

const metricCardShell =
    "mx-auto flex w-full max-w-[280px] flex-col items-center rounded-2xl px-4 py-4 text-center shadow-[var(--kira-revamp-shadow-card)] transition duration-150 kira-revamp-focusable hover:-translate-y-px hover:shadow-[var(--kira-revamp-shadow-card-hover)]";

interface DashboardPanelProps {
    onOpenTab: (tab: string) => void;
}

function formatIsoShort(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function greetingPhraseId(now: Date): MessageId {
    const h = now.getHours();
    if (h < 12) return "dashboard.revamp.greetingMorning";
    if (h < 17) return "dashboard.revamp.greetingAfternoon";
    return "dashboard.revamp.greetingEvening";
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

function daysFromTodayToIso(iso: string): number {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return 0;
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);
    const t0 = new Date();
    t0.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - t0.getTime()) / 86400000);
}

function VisaStatusBadge({ fortnightPct }: { fortnightPct: number }) {
    if (fortnightPct > 100) {
        return (
            <span className="inline-flex shrink-0 items-center rounded-lg bg-[color-mix(in_srgb,var(--kira-revamp-accent-danger)_18%,var(--kira-revamp-bg-card))] px-2.5 py-1 text-xs font-semibold text-[var(--kira-revamp-accent-danger)] ring-1 ring-[var(--kira-revamp-border)]">
                {t("dashboard.revamp.statusOver")}
            </span>
        );
    }
    if (fortnightPct >= 85) {
        return (
            <span className="inline-flex shrink-0 items-center rounded-lg bg-[color-mix(in_srgb,var(--kira-revamp-accent-warning)_35%,var(--kira-revamp-bg-card))] px-2.5 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] ring-1 ring-[var(--kira-revamp-border)]">
                {t("dashboard.revamp.statusAtRisk")}
            </span>
        );
    }
    return (
        <span className="inline-flex shrink-0 items-center rounded-lg bg-[color-mix(in_srgb,var(--kira-revamp-accent-success)_22%,var(--kira-revamp-bg-card))] px-2.5 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] ring-1 ring-[var(--kira-revamp-border)]">
            {t("dashboard.revamp.statusCompliant")}
        </span>
    );
}

export function DashboardPanel({ onOpenTab }: DashboardPanelProps) {
    const entries = useKiraStore((s) => s.entries);
    const wellbeingTasks = useKiraStore((s) => s.wellbeingTasks);
    const { tryAdd, collisionModal } = useCollisionGuardedAdd();
    const weeklyStudyGoalMinutes = useKiraStore((s) => s.weeklyStudyGoalMinutes);
    const fortnightWorkLimitHours = useKiraStore((s) => s.fortnightWorkLimitHours);
    const openLimitsEditor = useKiraStore((s) => s.openLimitsEditor);
    const displayName = useKiraStore((s) => s.userProfile.displayName);

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const [scheduleDay, setScheduleDay] = useState(() => {
        const x = new Date();
        x.setHours(0, 0, 0, 0);
        return x;
    });

    const refDay = useMemo(() => new Date(), []);
    const nowLine = useMemo(() => new Date(), []);

    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekShiftMinutes = useMemo(() => calendarWeekKindMinutes(entries, "shift", refDay), [entries, refDay]);
    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);

    const workHoursActual = fortnightWorkMinutes / 60;
    const workCapHours = Math.max(fortnightWorkLimitHours, 1);
    const weekWorkHours = weekShiftMinutes / 60;
    const weekWorkCapHours = Math.max(1, fortnightWorkLimitHours / 2);
    const fortnightPct = (workHoursActual / workCapHours) * 100;
    const hoursToFortnightCap = workCapHours - workHoursActual;
    const showFortnightWarning = fortnightPct >= 85 || (hoursToFortnightCap <= 16 && hoursToFortnightCap > 0);

    const upcoming = useMemo(() => [...entries].sort((a, b) => a.isoDate.localeCompare(b.isoDate)).slice(0, 4), [entries]);

    const editingEntry = useMemo(() => entries.find((e) => e.id === editingEntryId) ?? null, [entries, editingEntryId]);

    const rankedIncomplete = useMemo(() => sortedIncompleteByAttention(entries, new Date()), [entries]);
    const todayIso = isoFromDate(new Date());
    const topPick = rankedIncomplete[0];
    const runnersUp = rankedIncomplete.slice(1, 3);

    const nextExam = useMemo(() => {
        const exams = entries.filter((e) => e.kind === "exam" && !e.completed && e.isoDate >= todayIso);
        exams.sort((a, b) => a.isoDate.localeCompare(b.isoDate) || (a.startMinutes ?? 0) - (b.startMinutes ?? 0));
        return exams[0] ?? null;
    }, [entries, todayIso]);

    const examDaysAway = nextExam ? daysFromTodayToIso(nextExam.isoDate) : null;

    const openWellbeingCount = useMemo(() => wellbeingTasks.filter((w) => !w.completed).length, [wellbeingTasks]);

    const dayHeading = scheduleDay.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const dateAccent = nowLine.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

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

    const statsList = {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
    };
    const statsItem = {
        hidden: { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 380, damping: 30 },
        },
    };

    const displayFirstName = displayName.trim() || t("profile.revamp.fallbackName");

    return (
        <div className="flex flex-col gap-8 text-[var(--kira-revamp-text-secondary)] max-md:gap-6">
            <header className="shrink-0 space-y-1">
                <h1 className="text-[clamp(1.5rem,4vw,1.75rem)] font-bold leading-tight text-[var(--kira-revamp-text-primary)]">
                    {t(greetingPhraseId(nowLine))}, {displayFirstName}
                </h1>
                <p className="text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[var(--kira-revamp-accent-work-dark)]">{dateAccent}</p>
            </header>

            {/* Visa hours */}
            <section className="kira-revamp-card p-4 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="kira-revamp-section-label">{t("dashboard.revamp.visaTitle")}</p>
                        <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)] max-md:hidden">
                            {t("dashboard.revamp.visaSubtitle")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <VisaStatusBadge fortnightPct={fortnightPct} />
                        <Button color="link-color" size="sm" className="px-0 text-[var(--kira-revamp-accent-work-dark)]" onClick={() => openLimitsEditor()}>
                            {t("dashboard.editLimits")}
                        </Button>
                    </div>
                </div>

                <div className="mt-4 md:hidden">
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="kira-revamp-metric tabular-nums">
                            {workHoursActual.toFixed(1)}
                            <span className="text-lg font-semibold text-[var(--kira-revamp-text-muted)]"> / {fortnightWorkLimitHours} h</span>
                        </span>
                        <span className="text-xs font-medium text-[var(--kira-revamp-text-muted)]">{t("dashboard.revamp.thisFortnight")}</span>
                    </div>
                    <RevampProgressBar className="mt-2" value={workHoursActual} max={workCapHours} />
                </div>

                <div className="mt-5 hidden gap-6 md:grid lg:grid-cols-2">
                    <div>
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-medium text-[var(--kira-revamp-text-primary)]">{t("dashboard.revamp.thisWeek")}</span>
                            <span className="text-sm font-semibold tabular-nums text-[var(--kira-revamp-text-primary)]">
                                {weekWorkHours.toFixed(1)} / {weekWorkCapHours} h
                            </span>
                        </div>
                        <RevampProgressBar className="mt-2" value={weekWorkHours} max={weekWorkCapHours} />
                        <p className="mt-1.5 text-xs text-[var(--kira-revamp-text-muted)]">{t("dashboard.revamp.weekWorkHint")}</p>
                    </div>
                    <div>
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-medium text-[var(--kira-revamp-text-primary)]">{t("dashboard.revamp.thisFortnight")}</span>
                            <span className="text-sm font-semibold tabular-nums text-[var(--kira-revamp-text-primary)]">
                                {workHoursActual.toFixed(1)} / {fortnightWorkLimitHours} h
                            </span>
                        </div>
                        <RevampProgressBar className="mt-2" value={workHoursActual} max={workCapHours} />
                        <p className="mt-1.5 text-xs text-[var(--kira-revamp-text-muted)]">{t("dashboard.revamp.fortnightHint")}</p>
                    </div>
                </div>

                {showFortnightWarning ? (
                    <div className="mt-4 flex gap-2 rounded-xl bg-[color-mix(in_srgb,var(--kira-revamp-accent-warning)_22%,transparent)] px-3 py-2 text-sm text-[var(--kira-revamp-text-primary)] ring-1 ring-[var(--kira-revamp-border)]">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--kira-revamp-accent-work-dark)]" aria-hidden />
                        <p>{t("dashboard.revamp.warningNearCap")}</p>
                    </div>
                ) : null}
            </section>

            {/* Summary metrics */}
            <motion.div
                className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3"
                variants={statsList}
                initial="hidden"
                animate="show"
            >
                <motion.article
                    variants={statsItem}
                    className={cx(
                        metricCardShell,
                        "border-2 border-[var(--kira-revamp-border)]",
                        "bg-[color-mix(in_srgb,var(--kira-revamp-accent-work)_42%,var(--kira-revamp-bg-card))]",
                    )}
                >
                    <div
                        className="flex size-10 items-center justify-center rounded-full"
                        style={{ background: "color-mix(in srgb, var(--kira-revamp-accent-work) 22%, transparent)" }}
                    >
                        <Briefcase01 data-icon aria-hidden className="size-5 text-[var(--kira-revamp-accent-work-dark)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                        <p className="kira-revamp-section-label">{t("dashboard.revamp.metricWorkTitle")}</p>
                        <HoverHint
                            tone="work"
                            title={t("dashboard.revamp.metricWorkTooltipTitle")}
                            description={t("dashboard.revamp.metricWorkTooltipBody")}
                            className="shrink-0 text-[var(--kira-revamp-accent-work-dark)]"
                        />
                    </div>
                    <p className="kira-revamp-metric mt-2 tabular-nums">
                        {weekWorkHours.toFixed(1)} / {weekWorkCapHours}
                    </p>
                    <p className="mt-1 max-w-[16rem] text-[13px] text-[var(--kira-revamp-text-muted)]">
                        {tReplace("dashboard.revamp.metricWorkSub", { hours: weekWorkHours.toFixed(1) })}
                    </p>
                </motion.article>

                <motion.article
                    variants={statsItem}
                    className={cx(
                        metricCardShell,
                        "border-2 border-[var(--kira-revamp-border)]",
                        "bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_44%,var(--kira-revamp-bg-card))]",
                    )}
                >
                    <div
                        className="flex size-10 items-center justify-center rounded-full"
                        style={{ background: "color-mix(in srgb, var(--kira-revamp-accent-study) 25%, transparent)" }}
                    >
                        <Trophy01 data-icon aria-hidden className="size-5 text-[var(--kira-revamp-accent-study-dark)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                        <p className="kira-revamp-section-label">{t("dashboard.revamp.metricExamTitle")}</p>
                        <HoverHint
                            tone="exam"
                            title={t("dashboard.revamp.metricExamTooltipTitle")}
                            description={t("dashboard.revamp.metricExamTooltipBody")}
                            className="shrink-0 text-[var(--kira-revamp-accent-study-dark)]"
                        />
                    </div>
                    <p className="kira-revamp-metric mt-2 tabular-nums">
                        {formatMinutesAsHoursMinutes(weekStudyMinutes)}
                        <span className="text-lg font-semibold text-[var(--kira-revamp-text-muted)]"> / </span>
                        {formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}
                    </p>
                    <p className="mt-1 max-w-[16rem] text-[13px] text-[var(--kira-revamp-text-muted)]">
                        {tReplace("dashboard.revamp.metricExamSub", { hours: formatMinutesAsHoursMinutes(weekStudyMinutes) })}
                    </p>
                    <p className="mt-0.5 max-w-[16rem] text-[13px] text-[var(--kira-revamp-text-muted)]">
                        {examDaysAway !== null && examDaysAway >= 0
                            ? tReplace("dashboard.revamp.metricExamCountdown", { days: examDaysAway })
                            : t("dashboard.revamp.metricExamNone")}
                    </p>
                </motion.article>

                <motion.article
                    variants={statsItem}
                    className={cx(
                        metricCardShell,
                        "min-[480px]:col-span-2 xl:col-span-1",
                        "border-2 border-[var(--kira-revamp-border)]",
                        "bg-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing)_40%,var(--kira-revamp-bg-card))]",
                    )}
                >
                    <div
                        className="flex size-10 items-center justify-center rounded-full"
                        style={{ background: "color-mix(in srgb, var(--kira-revamp-accent-wellbeing) 28%, transparent)" }}
                    >
                        <HeartRounded data-icon aria-hidden className="size-5 text-[var(--kira-revamp-text-secondary)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                        <p className="kira-revamp-section-label">{t("dashboard.revamp.metricBreakTitle")}</p>
                        <HoverHint
                            tone="wellbeing"
                            title={t("dashboard.revamp.metricWellbeingTooltipTitle")}
                            description={t("dashboard.revamp.metricWellbeingTooltipBody")}
                            className="shrink-0 text-[var(--kira-revamp-accent-wellbeing-fg)]"
                        />
                    </div>
                    <p className="kira-revamp-metric mt-2 tabular-nums">{openWellbeingCount}</p>
                    <p className="mt-1 max-w-[16rem] text-[13px] text-[var(--kira-revamp-text-muted)]">
                        {tReplace("dashboard.revamp.metricBreakSub", { open: openWellbeingCount })}
                    </p>
                </motion.article>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <section className="kira-revamp-card space-y-3 p-5">
                    <h2 className="text-base font-semibold text-[var(--kira-revamp-text-primary)]">{t("dashboard.nextAction.title")}</h2>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-[var(--kira-revamp-accent-work-dark)]">{t("dashboard.nextAction.headline")}</p>
                        <HoverHint
                            title={t("dashboard.nextAction.headline")}
                            description={t("dashboard.nextAction.hint")}
                            className="shrink-0 text-[var(--kira-revamp-text-secondary)]"
                        />
                    </div>

                    {topPick ? (
                        <>
                            <Button
                                color="secondary"
                                size="md"
                                className="kira-revamp-focusable mt-1 h-auto w-full flex-col items-start gap-2 border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] py-3 text-left shadow-none ring-1 ring-[var(--kira-revamp-border)] transition duration-150 hover:-translate-y-px hover:shadow-[var(--kira-revamp-shadow-card)]"
                                onClick={() => setEditingEntryId(topPick.id)}
                            >
                                <div className="flex w-full flex-wrap items-center gap-1.5">
                                    <Badge type="pill-color" color={priorityBadgeColor(topPick.priority)} size="sm">
                                        {priorityLabel(topPick.priority)}
                                    </Badge>
                                    <span
                                        className={cx(
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                                            scheduleKindPillClass(topPick.kind),
                                        )}
                                    >
                                        {entryKindLabel(topPick.kind)}
                                    </span>
                                </div>
                                <p className="w-full text-base font-semibold text-[var(--kira-revamp-text-primary)]">{topPick.title}</p>
                                <div className="w-full space-y-0.5 text-xs text-[var(--kira-revamp-text-secondary)]">
                                    {effectiveDeadlineIso(topPick) < todayIso && (
                                        <p className="font-semibold text-error-primary">{t("dashboard.nextAction.overdue")}</p>
                                    )}
                                    {topPick.deadlineIso?.trim() ? (
                                        <>
                                            <p>
                                                <span className="font-medium text-[var(--kira-revamp-text-muted)]">{t("dashboard.nextAction.deadline")}</span>{" "}
                                                <span>{formatIsoShort(topPick.deadlineIso.trim())}</span>
                                            </p>
                                            <p>
                                                <span className="font-medium text-[var(--kira-revamp-text-muted)]">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                                <span>{formatIsoShort(topPick.isoDate)}</span>
                                            </p>
                                        </>
                                    ) : (
                                        <p>
                                            <span className="font-medium text-[var(--kira-revamp-text-muted)]">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                            <span>{formatIsoShort(topPick.isoDate)}</span>
                                        </p>
                                    )}
                                </div>
                            </Button>

                            {runnersUp.length > 0 && (
                                <div className="mt-2">
                                    <p className="kira-revamp-section-label">{t("dashboard.nextAction.alsoConsider")}</p>
                                    <ul className="mt-2 space-y-2">
                                        {runnersUp.map((e) => (
                                            <li key={e.id}>
                                                <button
                                                    type="button"
                                                    className="kira-revamp-focusable w-full rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] px-3 py-2 text-left text-sm transition duration-150 hover:shadow-[var(--kira-revamp-shadow-card)]"
                                                    onClick={() => setEditingEntryId(e.id)}
                                                >
                                                    <span className="block font-semibold text-[var(--kira-revamp-text-primary)]">{e.title}</span>
                                                    <span className="mt-0.5 block text-xs text-[var(--kira-revamp-text-muted)]">
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
                        <p className="text-sm text-[var(--kira-revamp-text-muted)]">{t("dashboard.nextAction.empty")}</p>
                    )}

                    <Button
                        color="link-color"
                        size="sm"
                        className="justify-start px-0 pt-2 text-[var(--kira-revamp-accent-work-dark)]"
                        iconTrailing={ArrowUpRight}
                        onClick={() => onOpenTab("calendar")}
                    >
                        {t("dashboard.openFullCalendar")}
                    </Button>
                </section>

                <section className="kira-revamp-card space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-[var(--kira-revamp-text-primary)]">{t("dashboard.upcoming")}</h2>
                        <Button color="link-color" size="sm" className="px-0 text-[var(--kira-revamp-accent-work-dark)]" onClick={() => onOpenTab("events")}>
                            {t("app.nav.explore")}
                        </Button>
                    </div>
                    <ul className="space-y-2">
                        {upcoming.map((e) => (
                            <li key={e.id} className="rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] px-3 py-2">
                                <p className="text-sm font-semibold text-[var(--kira-revamp-text-primary)]">{e.title}</p>
                                <p className="mt-0.5 text-xs text-[var(--kira-revamp-text-muted)]">
                                    {e.isoDate} · {entryKindLabel(e.kind)}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-[var(--kira-revamp-border)] pt-3">
                        <p className="kira-revamp-section-label">{t("events.title")}</p>
                        <ul className="mt-2 space-y-1">
                            {MOCK_EVENTS.slice(0, 2).map((ev) => (
                                <li key={ev.id} className="text-xs text-[var(--kira-revamp-text-primary)]">
                                    <span className="font-medium">{ev.title}</span>
                                    <span className="text-[var(--kira-revamp-text-muted)]"> — {ev.when}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            <section className="kira-revamp-card p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <p className="kira-revamp-section-label">{t("calendar.plannerTitle.day")}</p>
                            <HoverHint
                                title={t("app.hover.plannerDayWeek")}
                                description={`${t("dashboard.dayScheduleCaption")} ${t("dashboard.dayScheduleClickHint")}`}
                                className="text-[var(--kira-revamp-text-secondary)]"
                            />
                        </div>
                        <h2 className="mt-1 text-lg font-bold text-[var(--kira-revamp-text-primary)]">{dayHeading}</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <Button color="secondary" size="sm" iconLeading={ChevronLeft} aria-label={t("aria.previousDay")} onClick={() => shiftDay(-1)} />
                        <Button color="secondary" size="sm" iconLeading={ChevronRight} aria-label={t("aria.nextDay")} onClick={() => shiftDay(1)} />
                        <Button color="secondary" size="sm" onClick={goToday}>
                            {t("calendar.goToday")}
                        </Button>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <DayScheduleTimeline
                        entries={entries}
                        day={scheduleDay}
                        onEntryClick={(entry) => setEditingEntryId(entry.id)}
                        onTimelineBackgroundClick={handleTimelineCreate}
                    />
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-[var(--kira-revamp-border)] pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Tooltip title={t("calendar.legend.shift")} placement="top">
                            <TooltipTrigger
                                className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-work)_12%,var(--kira-revamp-bg-base))]"
                                aria-label={t("calendar.legend.shift")}
                            >
                                <span className={scheduleKindLegendSwatchClass("shift")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.exam")} placement="top">
                            <TooltipTrigger
                                className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_15%,var(--kira-revamp-bg-base))]"
                                aria-label={t("calendar.legend.exam")}
                            >
                                <span className={scheduleKindLegendSwatchClass("exam")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.study")} placement="top">
                            <TooltipTrigger
                                className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_10%,var(--kira-revamp-bg-base))]"
                                aria-label={t("calendar.legend.study")}
                            >
                                <span className={scheduleKindLegendSwatchClass("study")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.completed")} placement="top">
                            <TooltipTrigger
                                className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150"
                                aria-label={t("calendar.legend.completed")}
                            >
                                <span className="size-2.5 shrink-0 rounded-full bg-[var(--kira-revamp-accent-success)] ring-1 ring-[var(--kira-revamp-border)]" aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                    </div>
                    <Button
                        color="link-color"
                        size="sm"
                        className="justify-start px-0 text-[var(--kira-revamp-accent-work-dark)]"
                        iconTrailing={ArrowUpRight}
                        onClick={() => onOpenTab("calendar")}
                    >
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
        </div>
    );
}
