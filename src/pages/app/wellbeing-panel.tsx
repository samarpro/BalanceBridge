import { useMemo, useState } from "react";
import { Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { HoverHint } from "@/components/kira/hover-hint";
import { RevampProgressBar } from "@/components/kira/revamp-progress-bar";
import { useKiraStore } from "@/stores/kira-store";
import { calendarWeekKindMinutes, calendarWeekMinutesByDay, formatMinutesAsHoursMinutes, fortnightShiftMinutes } from "@/utils/schedule-aggregates";
import { cx } from "@/utils/cx";
import { t, tReplace, tWellbeingWelcome } from "@/i18n/strings";

const softCard =
    "rounded-2xl border-2 border-[var(--kira-revamp-border)] bg-[color-mix(in_srgb,var(--kira-revamp-bg-card)_88%,var(--kira-revamp-bg-base))] p-5 shadow-[var(--kira-revamp-shadow-card)]";

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

    const refDay = useMemo(() => new Date(), []);

    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);
    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekLoadSeries = useMemo(() => calendarWeekMinutesByDay(entries, refDay), [entries, refDay]);
    const weekTotalMinutes = useMemo(
        () => weekLoadSeries.reduce((s, r) => s + r.shift + r.study + r.exam, 0),
        [weekLoadSeries],
    );

    const workCapMinutes = Math.max(fortnightWorkLimitHours * 60, 1);
    const studyGoalSafe = Math.max(weeklyStudyGoalMinutes, 1);
    const workHours = fortnightWorkMinutes / 60;
    const workCapHours = Math.max(fortnightWorkLimitHours, 1);
    const studyHours = weekStudyMinutes / 60;
    const studyGoalHours = studyGoalSafe / 60;
    const workPct = (fortnightWorkMinutes / workCapMinutes) * 100;

    const welcomeHeading = tWellbeingWelcome(displayName);

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 pb-6 sm:max-w-2xl sm:gap-10 md:pb-8">
            <header className="space-y-4">
                <div className="flex flex-wrap items-start gap-2">
                    <h1 className="text-[1.65rem] font-semibold leading-snug tracking-tight text-[var(--kira-revamp-text-primary)] sm:text-3xl sm:leading-tight">
                        {welcomeHeading}
                    </h1>
                    <HoverHint
                        title={t("wellbeing.hintTitle")}
                        description={t("wellbeing.subtitle")}
                        tone="wellbeing"
                        className="mt-1 shrink-0 text-[var(--kira-revamp-text-secondary)]"
                    />
                </div>
                <p className="text-base leading-relaxed text-[var(--kira-revamp-text-secondary)] sm:text-lg">{t("wellbeing.revamp.intro")}</p>
                <Button
                    color="link-color"
                    size="sm"
                    className="self-start px-0 text-[var(--kira-revamp-accent-work-dark)]"
                    onClick={() => openLimitsEditor()}
                >
                    {t("wellbeing.editLimits")}
                </Button>
            </header>

            <section className={softCard} aria-labelledby="wellbeing-study-heading">
                <h2 id="wellbeing-study-heading" className="text-lg font-semibold text-[var(--kira-revamp-text-primary)]">
                    {t("wellbeing.revamp.studyTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)] sm:text-base">
                    {tReplace("wellbeing.revamp.studyBody", {
                        logged: formatMinutesAsHoursMinutes(weekStudyMinutes),
                        goal: formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes),
                    })}
                </p>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-medium text-[var(--kira-revamp-text-muted)]">
                        <span>{formatMinutesAsHoursMinutes(weekStudyMinutes)}</span>
                        <span>{formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}</span>
                    </div>
                    <RevampProgressBar value={studyHours} max={studyGoalHours} />
                </div>
            </section>

            <section className={softCard} aria-labelledby="wellbeing-work-heading">
                <h2 id="wellbeing-work-heading" className="text-lg font-semibold text-[var(--kira-revamp-text-primary)]">
                    {t("wellbeing.revamp.workTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)] sm:text-base">
                    {tReplace("wellbeing.revamp.workBody", {
                        logged: formatMinutesAsHoursMinutes(fortnightWorkMinutes),
                        cap: `${fortnightWorkLimitHours} h`,
                    })}
                </p>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-medium text-[var(--kira-revamp-text-muted)]">
                        <span>{workHours.toFixed(1)} h</span>
                        <span>{fortnightWorkLimitHours} h</span>
                    </div>
                    <RevampProgressBar value={workHours} max={workCapHours} />
                </div>
                {workPct >= 80 ? (
                    <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--kira-revamp-accent-warning)_22%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-[var(--kira-revamp-text-primary)]">
                        {t("wellbeing.revamp.workGentle")}
                    </p>
                ) : null}
            </section>

            <section className={softCard} aria-labelledby="wellbeing-pace-heading">
                <h2 id="wellbeing-pace-heading" className="text-lg font-semibold text-[var(--kira-revamp-text-primary)]">
                    {t("wellbeing.revamp.paceTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)] sm:text-base">
                    {tReplace("wellbeing.revamp.paceBody", { hours: formatMinutesAsHoursMinutes(weekTotalMinutes) })}
                </p>
            </section>

            <section
                className={cx(softCard, "flex max-h-[min(70vh,32rem)] flex-col")}
                aria-labelledby="wellbeing-tasks-heading"
            >
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
                        wrapperClassName="bg-[var(--kira-revamp-bg-card)] ring-[var(--kira-revamp-border)]"
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
                                    "flex items-start gap-3 rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)]/60 px-3 py-3",
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
