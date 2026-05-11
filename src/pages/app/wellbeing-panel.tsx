import { useMemo, useState } from "react";
import { Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { GlassRadialTile } from "@/components/kira/glass-radial-tile";
import { useKiraStore } from "@/stores/kira-store";
import {
    calendarWeekKindMinutes,
    calendarWeekMinutesByDay,
    estimatedWeekScreenMinutes,
    formatMinutesAsHoursMinutes,
    fortnightShiftMinutes,
    monthlyShiftMinutesByWeek,
} from "@/utils/schedule-aggregates";
import { cx } from "@/utils/cx";
import { t, tWellbeingWelcome } from "@/i18n/strings";

const SCREEN_SOFT_CAP_MINUTES = 960;
const MONTH_REFERENCE_MINUTES = 80 * 60;
const WEEK_LOAD_BASE_MINUTES = 40 * 60;

const tasksGlass =
    "flex min-h-0 flex-col rounded-2xl border border-white/25 bg-gradient-to-br from-white/15 to-white/5 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-white/[0.12] dark:to-white/[0.05]";

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
    const screenMinutesWeek = useMemo(() => estimatedWeekScreenMinutes(weekStudyMinutes), [weekStudyMinutes]);
    const workMonthSeries = useMemo(() => monthlyShiftMinutesByWeek(entries, refDay), [entries, refDay]);
    const monthShiftTotalMinutes = useMemo(() => workMonthSeries.reduce((s, w) => s + w.minutes, 0), [workMonthSeries]);

    const weekLoadSeries = useMemo(() => calendarWeekMinutesByDay(entries, refDay), [entries, refDay]);
    const weekTotalMinutes = useMemo(
        () => weekLoadSeries.reduce((s, r) => s + r.shift + r.study + r.exam, 0),
        [weekLoadSeries],
    );
    const peakDayMinutes = useMemo(() => {
        let m = 0;
        for (const row of weekLoadSeries) {
            const d = row.shift + row.study + row.exam;
            if (d > m) m = d;
        }
        return m;
    }, [weekLoadSeries]);
    const weekLoadCapMinutes = Math.max(WEEK_LOAD_BASE_MINUTES, peakDayMinutes * 1.2);

    const workCapMinutes = Math.max(fortnightWorkLimitHours * 60, 1);
    const studyGoalSafe = Math.max(weeklyStudyGoalMinutes, 1);

    const studyPct = Math.round((weekStudyMinutes / studyGoalSafe) * 100);
    const workPct = Math.round((fortnightWorkMinutes / workCapMinutes) * 100);
    const screenPct = Math.round((screenMinutesWeek / SCREEN_SOFT_CAP_MINUTES) * 100);
    const weekLoadPct = weekLoadCapMinutes > 0 ? Math.round((weekTotalMinutes / weekLoadCapMinutes) * 100) : 0;
    const monthPct = Math.round((monthShiftTotalMinutes / MONTH_REFERENCE_MINUTES) * 100);

    const welcomeHeading = tWellbeingWelcome(displayName);

    const pctOf = (id: "wellbeing.ringPercentOfGoal" | "wellbeing.ringPercentOfCap" | "wellbeing.ringPercentOfGuide", pct: number) =>
        t(id).replace("{{pct}}", String(pct));

    return (
        <div className="flex max-h-[calc(100dvh-11.5rem)] min-h-0 flex-1 flex-col gap-4 overflow-hidden md:max-h-[calc(100dvh-10rem)]">
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-secondary">{welcomeHeading}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-tertiary">{t("wellbeing.subtitle")}</p>
                </div>
                <Button color="link-color" size="sm" className="shrink-0 self-start sm:self-center" onClick={() => openLimitsEditor()}>
                    {t("wellbeing.editLimits")}
                </Button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 lg:grid-cols-3 lg:grid-rows-2">
                <GlassRadialTile
                    title={t("wellbeing.ringStudyTitle")}
                    subtitle={t("wellbeing.ringStudySubtitle")}
                    numerator={weekStudyMinutes}
                    denominator={studyGoalSafe}
                    centerPrimary={formatMinutesAsHoursMinutes(weekStudyMinutes)}
                    centerSecondary={pctOf("wellbeing.ringPercentOfGoal", studyPct)}
                    strokeClassName="stroke-fg-success-primary"
                    ariaLabel={`${t("wellbeing.ringStudyTitle")}: ${formatMinutesAsHoursMinutes(weekStudyMinutes)} of ${formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}`}
                />
                <GlassRadialTile
                    title={t("wellbeing.ringWorkTitle")}
                    subtitle={t("wellbeing.ringWorkSubtitle")}
                    numerator={fortnightWorkMinutes}
                    denominator={workCapMinutes}
                    centerPrimary={formatMinutesAsHoursMinutes(fortnightWorkMinutes)}
                    centerSecondary={pctOf("wellbeing.ringPercentOfCap", workPct)}
                    strokeClassName={workPct > 100 ? "stroke-fg-error-primary" : "stroke-fg-brand-primary"}
                    ariaLabel={`${t("wellbeing.ringWorkTitle")}: ${formatMinutesAsHoursMinutes(fortnightWorkMinutes)} of ${formatMinutesAsHoursMinutes(workCapMinutes)}`}
                />
                <GlassRadialTile
                    title={t("wellbeing.ringScreenTitle")}
                    subtitle={t("wellbeing.ringScreenSubtitle")}
                    numerator={screenMinutesWeek}
                    denominator={SCREEN_SOFT_CAP_MINUTES}
                    centerPrimary={formatMinutesAsHoursMinutes(screenMinutesWeek)}
                    centerSecondary={pctOf("wellbeing.ringPercentOfGuide", screenPct)}
                    strokeClassName="stroke-fg-brand-secondary"
                    ariaLabel={`${t("wellbeing.ringScreenTitle")}: ${formatMinutesAsHoursMinutes(screenMinutesWeek)} of ${formatMinutesAsHoursMinutes(SCREEN_SOFT_CAP_MINUTES)}`}
                />
                <GlassRadialTile
                    title={t("wellbeing.ringWeekLoadTitle")}
                    subtitle={t("wellbeing.ringWeekLoadSubtitle")}
                    numerator={weekTotalMinutes}
                    denominator={Math.max(weekLoadCapMinutes, 1)}
                    centerPrimary={formatMinutesAsHoursMinutes(weekTotalMinutes)}
                    centerSecondary={pctOf("wellbeing.ringPercentOfGuide", weekLoadPct)}
                    strokeClassName="stroke-fg-warning-primary"
                    ariaLabel={`${t("wellbeing.ringWeekLoadTitle")}: ${formatMinutesAsHoursMinutes(weekTotalMinutes)} of ${formatMinutesAsHoursMinutes(weekLoadCapMinutes)}`}
                />
                <GlassRadialTile
                    title={t("wellbeing.ringMonthTitle")}
                    subtitle={t("wellbeing.ringMonthSubtitle")}
                    numerator={monthShiftTotalMinutes}
                    denominator={MONTH_REFERENCE_MINUTES}
                    centerPrimary={formatMinutesAsHoursMinutes(monthShiftTotalMinutes)}
                    centerSecondary={pctOf("wellbeing.ringPercentOfGuide", monthPct)}
                    strokeClassName="stroke-fg-brand-primary"
                    ariaLabel={`${t("wellbeing.ringMonthTitle")}: ${formatMinutesAsHoursMinutes(monthShiftTotalMinutes)} of ${formatMinutesAsHoursMinutes(MONTH_REFERENCE_MINUTES)}`}
                />

                <section className={cx(tasksGlass, "min-h-0 flex-1")} aria-label={t("wellbeing.tasksTileTitle")}>
                    <div className="shrink-0">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("wellbeing.tasksTileTitle")}</h3>
                        <p className="mt-0.5 text-xs text-tertiary">{t("wellbeing.tasksTileSubtitle")}</p>
                    </div>

                    <div className="mt-3 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-end">
                        <Input className="min-w-0 flex-1" placeholder={t("wellbeing.taskPlaceholder")} value={task} onChange={setTask} />
                        <Button
                            color="primary"
                            size="md"
                            className="shrink-0 sm:w-auto"
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

                    <ul className="mt-3 min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain rounded-xl bg-primary/60 ring-1 ring-secondary/80 ring-inset">
                        {wellbeingTasks.map((item) => (
                            <li
                                key={item.id}
                                className={cx(
                                    "flex items-start gap-2 border-b border-secondary/60 px-3 py-2.5 last:border-b-0",
                                    item.completed && "bg-secondary_alt/50",
                                )}
                            >
                                <Checkbox
                                    size="md"
                                    className="min-w-0 flex-1 [&_[role=checkbox]]:mt-1"
                                    isSelected={item.completed}
                                    onChange={() => toggleWellbeingTask(item.id)}
                                    label={<span className={cx(item.completed && "text-tertiary line-through")}>{item.label}</span>}
                                />
                                <Button
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={Trash01}
                                    className="shrink-0"
                                    aria-label={t("wellbeing.removeTask")}
                                    onClick={() => removeWellbeingTask(item.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
