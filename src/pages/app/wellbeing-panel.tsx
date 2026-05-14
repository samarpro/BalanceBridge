import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ActivityHeart, ClockStopwatch, FaceSmile, TrendUp02, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { FocusModeControl } from "@/components/kira/focus-mode-overlay";
import { HoverHint } from "@/components/kira/hover-hint";
import { useKiraStore } from "@/stores/kira-store";
import { calendarWeekKindMinutes, calendarWeekMinutesByDay, formatMinutesAsHoursMinutes, fortnightShiftMinutes } from "@/utils/schedule-aggregates";
import { cx } from "@/utils/cx";
import { t, tReplace, tWellbeingWelcome } from "@/i18n/strings";

const softCard =
    "rounded-2xl border border-[var(--kira-revamp-border)] bg-[linear-gradient(180deg,rgba(247,220,208,0.42),rgba(199,184,235,0.24),rgba(245,239,230,0.96))] p-5 shadow-[var(--kira-revamp-shadow-card)] dark:bg-[linear-gradient(180deg,rgba(107,61,47,0.22),rgba(89,79,135,0.2),rgba(36,29,26,0.98))]";
const moodCard =
    "bg-[linear-gradient(145deg,rgba(226,157,126,0.42),rgba(240,214,152,0.24)_42%,rgba(245,239,230,0.98))] dark:bg-[linear-gradient(145deg,rgba(107,61,47,0.84),rgba(138,90,40,0.4)_42%,rgba(36,29,26,0.98))]";
const focusCard =
    "bg-[linear-gradient(145deg,rgba(185,175,230,0.44),rgba(199,184,235,0.26)_42%,rgba(245,239,230,0.98))] dark:bg-[linear-gradient(145deg,rgba(89,79,135,0.86),rgba(108,90,154,0.42)_42%,rgba(36,29,26,0.98))]";
const studyStatCard =
    "bg-[linear-gradient(160deg,rgba(185,175,230,0.4),rgba(210,190,236,0.22))] dark:bg-[linear-gradient(160deg,rgba(89,79,135,0.82),rgba(108,90,154,0.34))]";
const workStatCard =
    "bg-[linear-gradient(160deg,rgba(226,157,126,0.42),rgba(240,214,152,0.18))] dark:bg-[linear-gradient(160deg,rgba(107,61,47,0.84),rgba(138,90,40,0.32))]";
const loadStatCard =
    "bg-[linear-gradient(160deg,rgba(168,209,179,0.4),rgba(220,174,69,0.14))] dark:bg-[linear-gradient(160deg,rgba(61,102,77,0.82),rgba(112,84,24,0.26))]";
const tasksCard =
    "bg-[linear-gradient(160deg,rgba(199,184,235,0.38),rgba(168,209,179,0.16))] dark:bg-[linear-gradient(160deg,rgba(108,90,154,0.8),rgba(61,102,77,0.24))]";

function clampPct(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function StatusRing({
    pct,
    tone,
    children,
}: {
    pct: number;
    tone: "study" | "work" | "wellbeing";
    children: ReactNode;
}) {
    const normalized = clampPct(pct);
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (normalized / 100) * circumference;
    const toneClass =
        tone === "study"
            ? "stroke-[var(--kira-revamp-accent-study-dark)]"
            : tone === "work"
              ? "stroke-[var(--kira-revamp-accent-work-dark)]"
              : "stroke-[var(--kira-revamp-accent-success)]";

    return (
        <div className="relative grid size-12 shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(31,25,22,0.5)]">
            <svg className="-rotate-90" viewBox="0 0 44 44" aria-hidden>
                <circle cx="22" cy="22" r={radius} fill="none" strokeWidth="4" className="stroke-[rgba(120,100,80,0.14)] dark:stroke-[rgba(247,241,234,0.12)]" />
                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className={toneClass}
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-[var(--kira-revamp-text-primary)]">{children}</div>
        </div>
    );
}

function WellbeingStatusPill({
    title,
    value,
    status,
    pct,
    tone,
    icon,
    className,
}: {
    title: string;
    value: string;
    status: string;
    pct: number;
    tone: "study" | "work" | "wellbeing";
    icon: ReactNode;
    className: string;
}) {
    return (
        <article
            className={cx(
                softCard,
                className,
                "flex items-center gap-3 rounded-[1.5rem] px-4 py-3 shadow-[var(--kira-revamp-shadow-card)]",
            )}
        >
            <StatusRing pct={pct} tone={tone}>
                {icon}
            </StatusRing>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--kira-revamp-text-muted)]">{title}</p>
                <p className="truncate text-sm font-semibold text-[var(--kira-revamp-text-primary)]">{value}</p>
                <p className="mt-0.5 text-xs text-[var(--kira-revamp-text-secondary)]">{status}</p>
            </div>
        </article>
    );
}

const moodOptions = [
    { id: "great", emoji: "😄", labelKey: "wellbeing.mood.great" as const },
    { id: "good", emoji: "🙂", labelKey: "wellbeing.mood.good" as const },
    { id: "okay", emoji: "😌", labelKey: "wellbeing.mood.okay" as const },
    { id: "tired", emoji: "😕", labelKey: "wellbeing.mood.tired" as const },
    { id: "stressed", emoji: "😣", labelKey: "wellbeing.mood.stressed" as const },
] as const;

type MoodOptionId = (typeof moodOptions)[number]["id"];

const MOOD_STORAGE_KEY = "kira.wellbeing.mood.v1";

export function WellbeingPanel() {
    const entries = useKiraStore((s) => s.entries);
    const wellbeingTasks = useKiraStore((s) => s.wellbeingTasks);
    const addWellbeingTask = useKiraStore((s) => s.addWellbeingTask);
    const toggleWellbeingTask = useKiraStore((s) => s.toggleWellbeingTask);
    const removeWellbeingTask = useKiraStore((s) => s.removeWellbeingTask);
    const weeklyStudyGoalMinutes = useKiraStore((s) => s.weeklyStudyGoalMinutes);
    const fortnightWorkLimitHours = useKiraStore((s) => s.fortnightWorkLimitHours);
    const displayName = useKiraStore((s) => s.userProfile.displayName);
    const openLimitsEditor = useKiraStore((s) => s.openLimitsEditor);

    const [task, setTask] = useState("");
    const [selectedMood, setSelectedMood] = useState<MoodOptionId | null>(null);

    const refDay = useMemo(() => new Date(), []);

    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);
    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekLoadSeries = useMemo(() => calendarWeekMinutesByDay(entries, refDay), [entries, refDay]);
    const weekTotalMinutes = useMemo(
        () => weekLoadSeries.reduce((sum, row) => sum + row.shift + row.study + row.exam, 0),
        [weekLoadSeries],
    );

    const workCapMinutes = Math.max(fortnightWorkLimitHours * 60, 1);
    const studyGoalSafe = Math.max(weeklyStudyGoalMinutes, 1);
    const workHours = fortnightWorkMinutes / 60;
    const workPct = (fortnightWorkMinutes / workCapMinutes) * 100;
    const completedWellbeingTasks = wellbeingTasks.filter((item) => item.completed).length;
    const wellbeingProgressPct = wellbeingTasks.length > 0 ? Math.round((completedWellbeingTasks / wellbeingTasks.length) * 100) : 0;
    const studyPct = clampPct((weekStudyMinutes / studyGoalSafe) * 100);
    const workPctClamped = clampPct(workPct);
    const loadPct = clampPct((weekTotalMinutes / (36 * 60)) * 100);

    const studyStatus = studyPct >= 100 ? "Study goal reached for this week." : studyPct >= 70 ? "Close to your weekly study target." : "A little more study time will help.";
    const workStatus = workPct > 100 ? "You are past your current work cap." : workPct >= 85 ? "Very close to your work limit." : workPct >= 55 ? "Work load is still within limit." : "Work load looks comfortable right now.";
    const loadStatus = weekTotalMinutes >= 32 * 60 ? "This week is looking quite full." : weekTotalMinutes >= 20 * 60 ? "This week has a steady pace." : "This week still has breathing room.";
    const tasksStatus =
        wellbeingProgressPct >= 80
            ? "Your self-care checklist is in good shape."
            : wellbeingProgressPct >= 40
              ? "Your wellbeing checklist is moving along."
              : "A few small resets are still worth doing.";

    const welcomeHeading = tWellbeingWelcome(displayName);
    const moodLabel = moodOptions.find((mood) => mood.id === selectedMood)?.labelKey;

    useEffect(() => {
        try {
            const raw = localStorage.getItem(MOOD_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as { date: string; mood: MoodOptionId };
            const today = new Date().toISOString().slice(0, 10);
            if (parsed.date === today) {
                setSelectedMood(parsed.mood);
            }
        } catch {
            // Ignore invalid storage.
        }
    }, []);

    const saveMood = (mood: MoodOptionId) => {
        setSelectedMood(mood);
        try {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify({ date: today, mood }));
        } catch {
            // Ignore write failures.
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-8 sm:gap-12 md:pb-10">
            <header className="space-y-5">
                <div className="flex flex-wrap items-start gap-2">
                    <h1 className="text-[1.75rem] font-semibold leading-snug tracking-tight text-[var(--kira-revamp-text-primary)] sm:text-4xl sm:leading-tight">
                        {welcomeHeading}
                    </h1>
                    <HoverHint
                        title={t("wellbeing.hintTitle")}
                        description={t("wellbeing.subtitle")}
                        tone="wellbeing"
                        className="mt-1 shrink-0 text-[var(--kira-revamp-text-secondary)]"
                    />
                </div>
                <p className="max-w-3xl text-base leading-relaxed text-[var(--kira-revamp-text-secondary)] sm:text-lg">{t("wellbeing.revamp.intro")}</p>
                <Button
                    color="link-color"
                    size="sm"
                    className="self-start px-0 text-[var(--kira-revamp-accent-work-dark)]"
                    onClick={() => openLimitsEditor()}
                >
                    {t("wellbeing.editLimits")}
                </Button>
            </header>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <article className={cx(softCard, moodCard, "p-6 sm:p-7")} aria-labelledby="wellbeing-mood-heading">
                    <div className="flex items-center gap-2">
                        <FaceSmile data-icon aria-hidden className="size-5 text-[var(--kira-revamp-accent-work-dark)]" />
                        <h2 id="wellbeing-mood-heading" className="text-xl font-semibold text-[var(--kira-revamp-text-primary)]">
                            {t("wellbeing.mood.title")}
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-[var(--kira-revamp-text-secondary)]">{t("wellbeing.mood.subtitle")}</p>
                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {moodOptions.map((option) => {
                            const selected = selectedMood === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => saveMood(option.id)}
                                    className={cx(
                                        "kira-revamp-focusable rounded-xl border px-3 py-3 text-left transition duration-150",
                                        selected
                                            ? "border-[var(--kira-revamp-accent-work-dark)] bg-[linear-gradient(180deg,rgba(226,157,126,0.34),rgba(255,255,255,0.96))] text-[var(--kira-revamp-text-primary)] dark:bg-[linear-gradient(180deg,rgba(107,61,47,0.84),rgba(47,40,36,0.96))]"
                                            : "border-[var(--kira-revamp-border)] bg-[rgba(255,255,255,0.84)] hover:border-[var(--kira-revamp-accent-work-dark)] dark:bg-[rgba(47,40,36,0.82)]",
                                    )}
                                    aria-pressed={selected}
                                >
                                    <div className="text-2xl leading-none" aria-hidden>
                                        {option.emoji}
                                    </div>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--kira-revamp-text-secondary)]">{t(option.labelKey)}</p>
                                </button>
                            );
                        })}
                    </div>
                    {moodLabel ? (
                        <p className="mt-4 rounded-xl border border-[rgba(196,122,90,0.16)] bg-[rgba(255,255,255,0.7)] px-3 py-2 text-sm text-[var(--kira-revamp-text-secondary)] dark:border-[rgba(232,180,160,0.14)] dark:bg-[rgba(47,40,36,0.72)]">
                            {tReplace("wellbeing.mood.selected", { mood: t(moodLabel) })}
                        </p>
                    ) : null}
                </article>

                <article className={cx(softCard, focusCard, "p-6 sm:p-7")} aria-labelledby="wellbeing-focus-heading">
                    <div className="flex items-center gap-2">
                        <ClockStopwatch data-icon aria-hidden className="size-5 text-[var(--kira-revamp-accent-study-dark)]" />
                        <h2 id="wellbeing-focus-heading" className="text-xl font-semibold text-[var(--kira-revamp-text-primary)]">
                            {t("wellbeing.focusWidgetTitle")}
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-[var(--kira-revamp-text-secondary)]">{t("wellbeing.focusWidgetBody")}</p>
                    <div className="mt-6">
                        <FocusModeControl />
                    </div>
                </article>
            </section>

            <section className="grid gap-3 md:grid-cols-2" aria-label="Wellbeing status">
                <WellbeingStatusPill
                    title={t("wellbeing.ringStudyTitle")}
                    value={`${formatMinutesAsHoursMinutes(weekStudyMinutes)} / ${formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}`}
                    status={studyStatus}
                    pct={studyPct}
                    tone="study"
                    icon={<TrendUp02 data-icon aria-hidden className="size-3.5 text-[var(--kira-revamp-accent-study-dark)]" />}
                    className={studyStatCard}
                />
                <WellbeingStatusPill
                    title={t("wellbeing.ringWorkTitle")}
                    value={`${workHours.toFixed(1)} h / ${fortnightWorkLimitHours} h`}
                    status={workStatus}
                    pct={workPctClamped}
                    tone="work"
                    icon={<ActivityHeart data-icon aria-hidden className="size-3.5 text-[var(--kira-revamp-accent-work-dark)]" />}
                    className={workStatCard}
                />
                <WellbeingStatusPill
                    title={t("wellbeing.revamp.paceTitle")}
                    value={formatMinutesAsHoursMinutes(weekTotalMinutes)}
                    status={loadStatus}
                    pct={loadPct}
                    tone="wellbeing"
                    icon={<ClockStopwatch data-icon aria-hidden className="size-3.5 text-[var(--kira-revamp-accent-success)]" />}
                    className={loadStatCard}
                />
                <WellbeingStatusPill
                    title={t("wellbeing.tasksTileTitle")}
                    value={`${completedWellbeingTasks}/${wellbeingTasks.length || 0} completed`}
                    status={tasksStatus}
                    pct={wellbeingProgressPct}
                    tone="wellbeing"
                    icon={<FaceSmile data-icon aria-hidden className="size-3.5 text-[var(--kira-revamp-accent-success)]" />}
                    className={tasksCard}
                />
            </section>

            {workPct >= 80 ? (
                <section
                    className={cx(
                        softCard,
                        "bg-[linear-gradient(145deg,rgba(232,201,126,0.2),rgba(255,255,255,0.98))] p-6 dark:bg-[linear-gradient(145deg,rgba(94,76,33,0.72),rgba(47,40,36,0.98))]",
                    )}
                    aria-labelledby="wellbeing-gentle-warning"
                >
                    <h2 id="wellbeing-gentle-warning" className="text-lg font-semibold text-[var(--kira-revamp-text-primary)]">
                        {t("wellbeing.revamp.workTitle")}
                    </h2>
                    <p className="mt-3 rounded-xl border border-[rgba(232,201,126,0.2)] bg-[rgba(255,255,255,0.54)] px-3 py-2.5 text-sm leading-relaxed text-[var(--kira-revamp-text-primary)] dark:border-[rgba(216,183,100,0.16)] dark:bg-[rgba(47,40,36,0.58)]">
                        {t("wellbeing.revamp.workGentle")}
                    </p>
                </section>
            ) : null}

            <section className={cx(softCard, loadStatCard, "flex max-h-[min(70vh,34rem)] flex-col p-6 sm:p-7")} aria-labelledby="wellbeing-tasks-heading">
                <div className="shrink-0 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 id="wellbeing-tasks-heading" className="text-lg font-semibold text-[var(--kira-revamp-text-primary)]">
                            {t("wellbeing.revamp.tasksTitle")}
                        </h2>
                        <HoverHint
                            title={t("wellbeing.tasksTileHintTitle")}
                            description={t("wellbeing.revamp.tasksBody")}
                            tone="wellbeing"
                            className="shrink-0 text-[var(--kira-revamp-text-secondary)]"
                        />
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)]">{t("wellbeing.revamp.tasksBody")}</p>
                </div>

                <div className="mt-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder={t("wellbeing.taskPlaceholder")}
                        value={task}
                        onChange={setTask}
                        wrapperClassName="bg-[rgba(255,255,255,0.84)] ring-[var(--kira-revamp-border)] dark:bg-[rgba(47,40,36,0.84)]"
                    />
                    <Button
                        color="primary"
                        size="md"
                        className="shrink-0 bg-[var(--kira-revamp-accent-work-dark)] text-white ring-0 hover:brightness-105 sm:w-auto"
                        onClick={() => {
                            const trimmed = task.trim();
                            if (!trimmed) return;
                            addWellbeingTask(trimmed);
                            setTask("");
                        }}
                    >
                        {t("wellbeing.addTaskButton")}
                    </Button>
                </div>

                <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain pr-0.5 [-webkit-overflow-scrolling:touch]">
                    {wellbeingTasks.length === 0 ? (
                        <li className="rounded-xl border border-dashed border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)]/80 px-3 py-6 text-center text-sm text-[var(--kira-revamp-text-muted)]">
                            {t("wellbeing.revamp.tasksEmpty")}
                        </li>
                    ) : (
                        wellbeingTasks.map((item) => (
                            <li
                                key={item.id}
                                className={cx(
                                    "flex items-start gap-3 rounded-xl border border-[var(--kira-revamp-border)] bg-[rgba(255,255,255,0.62)] px-3 py-3 dark:bg-[rgba(31,25,22,0.58)]",
                                    item.completed && "opacity-75",
                                )}
                            >
                                <Checkbox
                                    size="md"
                                    className="min-w-0 flex-1 [&_[role=checkbox]]:mt-0.5"
                                    isSelected={item.completed}
                                    onChange={() => toggleWellbeingTask(item.id)}
                                    label={
                                        <span className={cx("text-base text-[var(--kira-revamp-text-primary)]", item.completed && "text-[var(--kira-revamp-text-muted)] line-through")}>
                                            {item.label}
                                        </span>
                                    }
                                />
                                <Button
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={Trash01}
                                    className="shrink-0 text-[var(--kira-revamp-text-muted)]"
                                    aria-label={t("wellbeing.removeTask")}
                                    onClick={() => removeWellbeingTask(item.id)}
                                />
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}
