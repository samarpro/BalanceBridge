import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUpRight, ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";
import { WeekScheduleTimeline, type TimelineBackgroundClickPayload } from "@/components/kira/day-schedule-timeline";
import { DashboardWeekScheduleList } from "@/components/kira/dashboard-week-schedule-list";
import { HoverHint } from "@/components/kira/hover-hint";
import { LiquidLevelOrb } from "@/components/kira/liquid-level-orb";
import { WellbeingSpiritMeter } from "@/components/kira/wellbeing-spirit-meter";
import { ScheduleEntryEditModal } from "@/components/kira/schedule-entry-modal";
import { MOCK_EVENTS } from "@/data/mock-events";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { useKiraStore } from "@/stores/kira-store";
import { calendarWeekKindMinutes, fortnightShiftMinutes } from "@/utils/schedule-aggregates";
import { effectiveDeadlineIso, sortedIncompleteByAttention } from "@/utils/next-schedule-action";
import { addDays, isoFromDate, startOfWeekMonday } from "@/utils/schedule-time";
import { scheduleKindDotClass, scheduleKindLegendSwatchClass, scheduleKindPillClass } from "@/utils/schedule-kind-styles";
import { cx } from "@/utils/cx";
import { t, type MessageId } from "@/i18n/strings";

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

function kindBlockClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "border-[#E8B4A0] bg-[#F8EBE3] dark:border-[#C47A5A]/45 dark:bg-[#5A372B]/28";
        case "exam":
            return "border-[#C9C2E8] bg-[#F1EEFB] dark:border-[#8F86C4]/45 dark:bg-[#4F486F]/30";
        case "study":
            return "border-[#D4C9EF] bg-[#F5F1FC] dark:border-[#A78FD6]/45 dark:bg-[#5F567D]/28";
    }
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
    const fortnightWorkLimitHours = useKiraStore((s) => s.fortnightWorkLimitHours);
    const openLimitsEditor = useKiraStore((s) => s.openLimitsEditor);
    const displayName = useKiraStore((s) => s.userProfile.displayName);

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [nextUpFilter, setNextUpFilter] = useState<"all" | "work" | "study">("all");

    const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()));

    const refDay = useMemo(() => new Date(), []);
    const nowLine = useMemo(() => new Date(), []);

    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekShiftMinutes = useMemo(() => calendarWeekKindMinutes(entries, "shift", refDay), [entries, refDay]);

    const workHoursActual = fortnightWorkMinutes / 60;
    const workCapHours = Math.max(fortnightWorkLimitHours, 1);
    const weekWorkHours = weekShiftMinutes / 60;
    const weekWorkCapHours = Math.max(1, fortnightWorkLimitHours / 2);
    const fortnightPct = (workHoursActual / workCapHours) * 100;
    const hoursToFortnightCap = workCapHours - workHoursActual;
    const showFortnightWarning = fortnightPct >= 85 || (hoursToFortnightCap <= 16 && hoursToFortnightCap > 0);

    const workWeekRatio = weekWorkCapHours > 0 ? Math.min(1, weekWorkHours / weekWorkCapHours) : 0;
    const fortnightFillRatio = workCapHours > 0 ? Math.min(1, workHoursActual / workCapHours) : 0;

    const upcoming = useMemo(() => [...entries].sort((a, b) => a.isoDate.localeCompare(b.isoDate)).slice(0, 4), [entries]);

    const editingEntry = useMemo(() => entries.find((e) => e.id === editingEntryId) ?? null, [entries, editingEntryId]);

    const rankedIncomplete = useMemo(() => sortedIncompleteByAttention(entries, new Date()), [entries]);
    const todayIso = isoFromDate(new Date());
    const filteredRankedIncomplete = useMemo(() => {
        if (nextUpFilter === "work") {
            return rankedIncomplete.filter((entry) => entry.kind === "shift");
        }
        if (nextUpFilter === "study") {
            return rankedIncomplete.filter((entry) => entry.kind === "study" || entry.kind === "exam");
        }
        return rankedIncomplete;
    }, [nextUpFilter, rankedIncomplete]);
    const topPick = filteredRankedIncomplete[0];
    const runnersUp = filteredRankedIncomplete.slice(1, 3);

    const completedWellbeingCount = useMemo(() => wellbeingTasks.filter((w) => w.completed).length, [wellbeingTasks]);

    const weekHeading = useMemo(() => {
        const end = addDays(weekStart, 6);
        const a = weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const b = end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
        return `${a} – ${b}`;
    }, [weekStart]);

    const dateAccent = nowLine.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

    const shiftWeek = (deltaWeeks: number) => {
        setWeekStart((d) => addDays(d, deltaWeeks * 7));
    };

    const goThisWeek = () => {
        setWeekStart(startOfWeekMonday(new Date()));
    };

    const handleWeekTimelineCreate = (payload: TimelineBackgroundClickPayload) => {
        tryAdd(
            {
                isoDate: payload.iso,
                title: t("calendar.newTaskDefaultTitle"),
                kind: "study",
                priority: "medium",
                completed: false,
                startMinutes: payload.startMinutes,
                durationMinutes: 30,
            },
            (id) => setEditingEntryId(id),
        );
    };

    const displayFirstName = displayName.trim() || t("profile.revamp.fallbackName");
    const sectionTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

    return (
        <motion.div
            className="kira-dashboard-surface flex flex-col gap-6 text-[var(--kira-revamp-text-secondary)] md:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.06,
                        delayChildren: 0.04,
                    },
                },
            }}
        >
            <motion.header
                className="kira-dashboard-hero shrink-0 p-4 md:p-6"
                variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={sectionTransition}
            >
                <div className="relative z-10 flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="kira-revamp-section-label text-[var(--kira-revamp-accent-work-dark)]">{dateAccent}</p>
                        <h1 className="mt-1 text-[clamp(1.5rem,6vw,2.35rem)] font-bold leading-tight text-[var(--kira-revamp-text-primary)]">
                            {t(greetingPhraseId(nowLine))}, {displayFirstName}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                        <motion.span
                            className="rounded-full border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--kira-revamp-text-primary)] md:px-3 md:text-xs"
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ ...sectionTransition, delay: 0.1 }}
                        >
                            {workHoursActual.toFixed(1)}h fortnight shifts
                        </motion.span>
                        <motion.span
                            className="rounded-full border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--kira-revamp-text-primary)] md:px-3 md:text-xs"
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ ...sectionTransition, delay: 0.15 }}
                        >
                            {completedWellbeingCount}/{wellbeingTasks.length} wellbeing
                        </motion.span>
                    </div>
                </div>
            </motion.header>

            {/* Visa hours */}
            <motion.section
                className="kira-revamp-card kira-visa-dashboard mx-auto w-full max-w-[56rem] p-3.5 md:p-6"
                variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={sectionTransition}
            >
                <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:text-left">
                    <div className="max-w-xl">
                        <p className="kira-revamp-section-label max-sm:text-center">{t("dashboard.revamp.visaTitle")}</p>
                        <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)] max-md:hidden">
                            {t("dashboard.revamp.visaSubtitle")}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                        <VisaStatusBadge fortnightPct={fortnightPct} />
                        <Button color="link-color" size="sm" className="px-0 text-[var(--kira-revamp-accent-work-dark)]" onClick={() => openLimitsEditor()}>
                            {t("dashboard.editLimits")}
                        </Button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col items-center justify-center gap-5 md:mt-6 md:gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-8 xl:gap-10">
                    <motion.div
                        className="flex w-full max-w-[36rem] flex-col items-center justify-center gap-5 md:flex-row md:items-stretch md:justify-center md:gap-6 lg:min-h-0 lg:w-auto lg:max-w-none lg:flex-none xl:gap-8"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.08,
                                },
                            },
                        }}
                    >
                        <motion.div
                            className="kira-visa-inset kira-visa-inset--week mx-auto flex w-full max-w-[15rem] flex-col items-center md:max-w-[min(100%,16rem)] lg:mx-0 lg:w-[16.5rem]"
                            variants={{
                                hidden: { opacity: 0, y: 18, scale: 0.98 },
                                visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            transition={sectionTransition}
                        >
                            <div className="hidden w-full max-w-[17.5rem] shrink-0 md:block">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm font-medium text-[var(--kira-revamp-text-primary)]">{t("dashboard.revamp.thisWeek")}</span>
                                    <span className="text-sm font-semibold tabular-nums text-[var(--kira-revamp-text-primary)]">
                                        {weekWorkHours.toFixed(1)} / {weekWorkCapHours} h
                                    </span>
                                </div>
                            </div>
                            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center md:mt-0">
                                <div className="flex w-full justify-center">
                                    <LiquidLevelOrb
                                        tone="work"
                                        fillRatio={workWeekRatio}
                                        variant="bottom-up"
                                        size="lg"
                                        className="max-md:size-24"
                                        aria-label={t("dashboard.revamp.liquidOrbAriaWork")}
                                    >
                                        <span className="text-center text-base font-bold leading-tight tabular-nums text-[var(--kira-revamp-text-primary)] drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.12)] md:text-lg dark:drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.45)]">
                                            {weekWorkHours.toFixed(1)}
                                            <span className="block text-xs font-semibold text-[var(--kira-revamp-text-muted)] md:text-sm">h</span>
                                        </span>
                                    </LiquidLevelOrb>
                                </div>
                            </div>
                            <p className="kira-revamp-section-label mt-2 shrink-0 text-center md:hidden">{t("dashboard.revamp.thisWeek")}</p>
                            <p className="mt-0.5 shrink-0 text-center text-[11px] font-medium text-[var(--kira-revamp-text-muted)] md:hidden">
                                {weekWorkHours.toFixed(1)} / {weekWorkCapHours} h
                            </p>
                            <p className="mt-3 hidden max-w-xs shrink-0 text-center text-xs text-[var(--kira-revamp-text-muted)] md:mt-auto md:block">
                                {t("dashboard.revamp.weekWorkHint")}
                            </p>
                        </motion.div>

                        <motion.div
                            className="kira-visa-inset kira-visa-inset--fortnight flex w-full max-w-[15rem] flex-col items-center md:max-w-[min(100%,16rem)] lg:w-[16.5rem]"
                            variants={{
                                hidden: { opacity: 0, y: 18, scale: 0.98 },
                                visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            transition={sectionTransition}
                        >
                            <div className="hidden w-full max-w-[17.5rem] shrink-0 md:block">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm font-medium text-[var(--kira-revamp-text-primary)]">{t("dashboard.revamp.thisFortnight")}</span>
                                    <span className="text-sm font-semibold tabular-nums text-[var(--kira-revamp-text-primary)]">
                                        {workHoursActual.toFixed(1)} / {fortnightWorkLimitHours} h
                                    </span>
                                </div>
                            </div>
                            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center md:mt-0">
                                <div className="flex w-full justify-center">
                                    <LiquidLevelOrb
                                        tone="study"
                                        fillRatio={fortnightFillRatio}
                                        variant="top-down"
                                        size="xl"
                                        emphasized
                                        className="max-md:size-28"
                                        aria-label={t("dashboard.revamp.visaLiquidOrbFortnightAria")}
                                    >
                                        <span className="text-center text-lg font-bold leading-tight text-[var(--kira-revamp-accent-study-dark)] drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.35)] md:text-xl dark:text-[var(--kira-revamp-text-primary)] dark:drop-shadow-[0_1px_3px_rgb(0_0_0_/_0.5)]">
                                            {workHoursActual.toFixed(1)}
                                            <span className="block text-xs font-semibold text-[var(--kira-revamp-text-muted)] md:text-sm">h</span>
                                        </span>
                                    </LiquidLevelOrb>
                                </div>
                            </div>
                            <p className="kira-revamp-section-label mt-2 shrink-0 text-center md:hidden">{t("dashboard.revamp.thisFortnight")}</p>
                            <p className="mt-0.5 shrink-0 text-center text-[11px] font-medium text-[var(--kira-revamp-text-muted)] md:hidden">
                                {workHoursActual.toFixed(1)} / {fortnightWorkLimitHours} h
                            </p>
                            <p className="mt-3 hidden max-w-xs shrink-0 text-center text-xs text-[var(--kira-revamp-text-muted)] md:mt-auto md:block">
                                {t("dashboard.revamp.fortnightHint")}
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 18, scale: 0.98 },
                            visible: { opacity: 1, y: 0, scale: 1 },
                        }}
                        transition={sectionTransition}
                        className="flex w-full justify-center lg:w-auto"
                    >
                        <WellbeingSpiritMeter
                            completedCount={completedWellbeingCount}
                            totalCount={wellbeingTasks.length}
                            className="kira-visa-inset kira-visa-inset--wellbeing mx-auto flex h-full min-h-0 w-full max-w-[15rem] shrink-0 flex-col justify-center md:max-w-[min(100%,16rem)] lg:mx-0 lg:w-[16.5rem] [--kira-revamp-accent-wellbeing:rgb(220_174_69)] [--kira-revamp-accent-wellbeing-fg:rgb(122_84_34)] max-md:px-3 max-md:py-4 dark:[--kira-revamp-accent-wellbeing:rgb(223_178_75)] dark:[--kira-revamp-accent-wellbeing-fg:rgb(247_220_144)]"
                        />
                    </motion.div>
                </div>

                <AnimatePresence initial={false}>
                {showFortnightWarning ? (
                    <motion.div
                        className="mt-3 flex gap-2 rounded-xl bg-[color-mix(in_srgb,var(--kira-revamp-accent-warning)_22%,transparent)] px-3 py-2 text-sm text-[var(--kira-revamp-text-primary)] ring-1 ring-[var(--kira-revamp-border)]"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--kira-revamp-accent-work-dark)]" aria-hidden />
                        <p>{t("dashboard.revamp.warningNearCap")}</p>
                    </motion.div>
                ) : null}
                </AnimatePresence>
            </motion.section>

            <motion.div
                className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start"
                variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={sectionTransition}
            >
                <motion.section layout className="kira-revamp-card kira-dashboard-card kira-card-variant-work space-y-3 p-4 md:p-5">
                    <h2 className="text-base font-semibold text-[var(--kira-revamp-text-primary)]">{t("dashboard.nextAction.title")}</h2>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-[var(--kira-revamp-accent-work-dark)]">{t("dashboard.nextAction.headline")}</p>
                        <HoverHint
                            title={t("dashboard.nextAction.headline")}
                            description={t("dashboard.nextAction.hint")}
                            className="shrink-0 text-[var(--kira-revamp-text-secondary)]"
                        />
                    </div>
                    <motion.div layout className="flex flex-wrap gap-1.5">
                        <motion.button
                            layout
                            type="button"
                            onClick={() => setNextUpFilter("all")}
                            className={cx(
                                "kira-revamp-focusable rounded-full border px-2.5 py-1 text-[11px] font-semibold transition md:px-3 md:text-xs motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                                nextUpFilter === "all"
                                    ? "border-[var(--kira-revamp-accent-work-dark)] bg-[color-mix(in_srgb,var(--kira-revamp-accent-work)_26%,var(--kira-revamp-bg-base))] text-[var(--kira-revamp-text-primary)]"
                                    : "border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-secondary)] hover:border-[var(--kira-revamp-accent-work-dark)]",
                            )}
                            aria-pressed={nextUpFilter === "all"}
                        >
                            All
                        </motion.button>
                        <motion.button
                            layout
                            type="button"
                            onClick={() => setNextUpFilter("work")}
                            className={cx(
                                "kira-revamp-focusable rounded-full border px-2.5 py-1 text-[11px] font-semibold transition md:px-3 md:text-xs motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                                nextUpFilter === "work"
                                    ? "border-[#C47A5A] bg-[#F8EBE3] text-[#4A2E22] dark:bg-[#5A372B]/35 dark:text-[#F7E7DF]"
                                    : "border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-secondary)] hover:border-[#C47A5A]",
                            )}
                            aria-pressed={nextUpFilter === "work"}
                        >
                            Work
                        </motion.button>
                        <motion.button
                            layout
                            type="button"
                            onClick={() => setNextUpFilter("study")}
                            className={cx(
                                "kira-revamp-focusable rounded-full border px-2.5 py-1 text-[11px] font-semibold transition md:px-3 md:text-xs motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
                                nextUpFilter === "study"
                                    ? "border-[#8F86C4] bg-[#F1EEFB] text-[#403962] dark:bg-[#4F486F]/35 dark:text-[#EFEAFF]"
                                    : "border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-secondary)] hover:border-[#8F86C4]",
                            )}
                            aria-pressed={nextUpFilter === "study"}
                        >
                            Study
                        </motion.button>
                    </motion.div>

                    <AnimatePresence mode="wait" initial={false}>
                    {topPick ? (
                        <motion.div
                            key={topPick.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <Button
                                color="secondary"
                                size="md"
                                className={cx(
                                    "kira-revamp-focusable mt-1 h-auto w-full flex-col items-start gap-2 border py-2.5 text-left shadow-none ring-1 ring-[var(--kira-revamp-border)] transition duration-150 hover:-translate-y-px hover:shadow-[var(--kira-revamp-shadow-card)] md:py-3",
                                    "kira-dashboard-block",
                                    kindBlockClass(topPick.kind),
                                )}
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
                                <p className="w-full text-sm font-semibold text-[var(--kira-revamp-text-primary)] md:text-base">{topPick.title}</p>
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
                                <motion.div layout className="mt-2">
                                    <p className="kira-revamp-section-label">{t("dashboard.nextAction.alsoConsider")}</p>
                                    <motion.ul layout className="mt-2 space-y-2">
                                        {runnersUp.map((e) => (
                                            <motion.li key={e.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                                                <button
                                                    type="button"
                                                    className={cx(
                                                        "kira-revamp-focusable kira-dashboard-block w-full rounded-xl border px-3 py-2 text-left text-sm transition duration-150 hover:shadow-[var(--kira-revamp-shadow-card)]",
                                                        kindBlockClass(e.kind),
                                                    )}
                                                    onClick={() => setEditingEntryId(e.id)}
                                                >
                                                    <span
                                                        className={cx(
                                                            "mb-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                                                            scheduleKindPillClass(e.kind),
                                                        )}
                                                    >
                                                        {entryKindLabel(e.kind)}
                                                    </span>
                                                    <span className="block font-semibold text-[var(--kira-revamp-text-primary)]">{e.title}</span>
                                                    <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--kira-revamp-text-muted)]">
                                                        <span className={scheduleKindDotClass(e.kind)} aria-hidden />
                                                        {formatIsoShort(effectiveDeadlineIso(e))} · {priorityLabel(e.priority)}
                                                    </span>
                                                </button>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.p
                            key="next-action-empty"
                            className="text-sm text-[var(--kira-revamp-text-muted)]"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                        >
                            {t("dashboard.nextAction.empty")}
                        </motion.p>
                    )}
                    </AnimatePresence>

                    <Button
                        color="link-color"
                        size="sm"
                        className="justify-start px-0 pt-2 text-[var(--kira-revamp-accent-work-dark)]"
                        iconTrailing={ArrowUpRight}
                        onClick={() => onOpenTab("calendar")}
                    >
                        {t("dashboard.openFullCalendar")}
                    </Button>
                </motion.section>

                <motion.section layout className="kira-revamp-card kira-dashboard-card kira-card-variant-study space-y-3 p-4 md:p-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-[var(--kira-revamp-text-primary)]">{t("dashboard.upcoming")}</h2>
                        <Button color="link-color" size="sm" className="px-0 text-[var(--kira-revamp-accent-work-dark)]" onClick={() => onOpenTab("events")}>
                            {t("app.nav.explore")}
                        </Button>
                    </div>
                    <motion.ul layout className="space-y-2">
                        {upcoming.map((e) => (
                            <motion.li
                                key={e.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className={cx("kira-dashboard-block rounded-xl border px-3 py-2", kindBlockClass(e.kind))}
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
                                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--kira-revamp-text-muted)]">
                                    <span className={scheduleKindDotClass(e.kind)} aria-hidden />
                                    {e.isoDate}
                                </p>
                            </motion.li>
                        ))}
                    </motion.ul>
                    <div className="border-t border-[var(--kira-revamp-border)] pt-3">
                        <p className="kira-revamp-section-label">{t("events.title")}</p>
                        <ul className="mt-2 space-y-1">
                            {MOCK_EVENTS.slice(0, 3).map((ev) => (
                                <li key={ev.id} className="text-xs text-[var(--kira-revamp-text-primary)]">
                                    <span className="font-medium">{ev.title}</span>
                                    <span className="text-[var(--kira-revamp-text-muted)]"> — {ev.when}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.section>
            </motion.div>

            <motion.section
                className="kira-revamp-card kira-dashboard-card kira-card-variant-wellbeing p-4 md:p-5"
                variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={sectionTransition}
            >
                <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <p className="kira-revamp-section-label">{t("calendar.plannerTitle.week")}</p>
                            <HoverHint
                                title={t("app.hover.plannerDayWeek")}
                                description={`${t("dashboard.weekScheduleCaption")} ${t("dashboard.dayScheduleClickHint")}`}
                                className="text-[var(--kira-revamp-text-secondary)]"
                            />
                        </div>
                        <h2 className="mt-1 text-base font-bold text-[var(--kira-revamp-text-primary)] md:text-lg">{weekHeading}</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <Button color="secondary" size="sm" iconLeading={ChevronLeft} aria-label={t("aria.previousWeek")} onClick={() => shiftWeek(-1)} />
                        <Button color="secondary" size="sm" iconLeading={ChevronRight} aria-label={t("aria.nextWeek")} onClick={() => shiftWeek(1)} />
                        <Button color="secondary" size="sm" onClick={goThisWeek}>
                            {t("calendar.goThisWeek")}
                        </Button>
                    </div>
                </div>

                <div className="mt-3 w-full md:mt-4">
                    <div className="hidden md:block">
                        <WeekScheduleTimeline
                            entries={entries}
                            weekStart={weekStart}
                            onEntryClick={(entry) => setEditingEntryId(entry.id)}
                            onTimelineBackgroundClick={handleWeekTimelineCreate}
                        />
                    </div>
                    <div className="md:hidden">
                        <DashboardWeekScheduleList
                            entries={entries}
                            weekStart={weekStart}
                            onEntryClick={(entry) => setEditingEntryId(entry.id)}
                        />
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-t border-[var(--kira-revamp-border)] pt-3 md:mt-4 md:pt-4">
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        <Tooltip title={t("calendar.legend.shift")} placement="top">
                            <TooltipTrigger
                                className="flex size-10 min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-work)_12%,var(--kira-revamp-bg-base))] md:size-11 md:min-h-11 md:min-w-11"
                                aria-label={t("calendar.legend.shift")}
                            >
                                <span className={scheduleKindLegendSwatchClass("shift")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.exam")} placement="top">
                            <TooltipTrigger
                                className="flex size-10 min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_15%,var(--kira-revamp-bg-base))] md:size-11 md:min-h-11 md:min-w-11"
                                aria-label={t("calendar.legend.exam")}
                            >
                                <span className={scheduleKindLegendSwatchClass("exam")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.study")} placement="top">
                            <TooltipTrigger
                                className="flex size-10 min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 hover:bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_10%,var(--kira-revamp-bg-base))] md:size-11 md:min-h-11 md:min-w-11"
                                aria-label={t("calendar.legend.study")}
                            >
                                <span className={scheduleKindLegendSwatchClass("study")} aria-hidden />
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip title={t("calendar.legend.completed")} placement="top">
                            <TooltipTrigger
                                className="flex size-10 min-h-10 min-w-10 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] kira-revamp-focusable transition duration-150 md:size-11 md:min-h-11 md:min-w-11"
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
            </motion.section>

            <ScheduleEntryEditModal
                entry={editingEntry}
                isOpen={editingEntryId !== null && editingEntry !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingEntryId(null);
                }}
            />
            {collisionModal}
        </motion.div>
    );
}
