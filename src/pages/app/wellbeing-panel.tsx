import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChartSquare02, Clock, Eye, Laptop02, Moon02, Trash01 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { useKiraStore } from "@/stores/kira-store";
import {
    calendarWeekKindMinutes,
    estimatedWeekScreenMinutes,
    formatMinutesAsHoursMinutes,
    fortnightShiftMinutes,
    monthlyShiftMinutesByWeek,
} from "@/utils/schedule-aggregates";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

const sleepSeed = [6.5, 7.25, 6.0, 7.8, 5.5, 8.0, 7.1];

export function WellbeingPanel() {
    const entries = useKiraStore((s) => s.entries);
    const wellbeingTasks = useKiraStore((s) => s.wellbeingTasks);
    const addWellbeingTask = useKiraStore((s) => s.addWellbeingTask);
    const toggleWellbeingTask = useKiraStore((s) => s.toggleWellbeingTask);
    const removeWellbeingTask = useKiraStore((s) => s.removeWellbeingTask);

    const [task, setTask] = useState("");

    const refDay = useMemo(() => new Date(), []);

    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);
    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const screenMinutesWeek = useMemo(() => estimatedWeekScreenMinutes(weekStudyMinutes), [weekStudyMinutes]);

    const workMonthSeries = useMemo(() => monthlyShiftMinutesByWeek(entries, refDay), [entries, refDay]);
    const monthShiftTotalMinutes = useMemo(() => workMonthSeries.reduce((s, w) => s + w.minutes, 0), [workMonthSeries]);
    const peakWeek = useMemo(() => {
        if (!workMonthSeries.length) return null;
        return workMonthSeries.reduce((a, b) => (b.minutes > a.minutes ? b : a));
    }, [workMonthSeries]);
    const avgWeekMinutes = workMonthSeries.length ? monthShiftTotalMinutes / workMonthSeries.length : 0;
    const monthHeading = refDay.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const maxWeekHours = Math.max(...workMonthSeries.map((w) => w.hours), 0);
    const yAxisMax = maxWeekHours <= 0 ? 6 : Math.ceil(maxWeekHours * 1.2 * 2) / 2;

    const data = useMemo(
        () =>
            sleepSeed.map((hours, i) => ({
                day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
                sleepHours: hours,
                label: `${hours} h sleep`,
            })),
        [],
    );

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-xl font-semibold text-secondary">{t("wellbeing.title")}</h2>
                <p className="mt-2 max-w-2xl text-md text-tertiary">{t("wellbeing.subtitle")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard icon={Laptop02} label={t("wellbeing.study")} value={formatMinutesAsHoursMinutes(weekStudyMinutes)} hint={t("wellbeing.studyHint")} />
                <MetricCard icon={Eye} label={t("wellbeing.screen")} value={formatMinutesAsHoursMinutes(screenMinutesWeek)} hint={t("wellbeing.screenHint")} />
                <MetricCard icon={Clock} label={t("wellbeing.work")} value={formatMinutesAsHoursMinutes(fortnightWorkMinutes)} hint={t("wellbeing.workHint")} />
            </div>

            <section className="rounded-xl bg-gradient-to-br from-brand-secondary/[0.08] via-primary_alt to-primary_alt p-5 ring-1 ring-secondary dark:from-brand-secondary/[0.12]">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <FeaturedIcon icon={BarChartSquare02} color="brand" theme="modern" size="md" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">{monthHeading}</p>
                            <h3 className="mt-0.5 text-lg font-semibold text-secondary">{t("wellbeing.workMonthTitle")}</h3>
                            <p className="mt-1 max-w-xl text-sm text-tertiary">{t("wellbeing.workMonthSubtitle")}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                        <StatPill label={t("wellbeing.workMonthTotal")} value={formatMinutesAsHoursMinutes(monthShiftTotalMinutes)} />
                        <StatPill label={t("wellbeing.workMonthAvg")} value={formatMinutesAsHoursMinutes(Math.round(avgWeekMinutes))} />
                        <StatPill
                            label={t("wellbeing.workMonthPeak")}
                            value={peakWeek && peakWeek.minutes > 0 ? peakWeek.label : "—"}
                            secondary={peakWeek && peakWeek.minutes > 0 ? formatMinutesAsHoursMinutes(peakWeek.minutes) : undefined}
                        />
                    </div>
                </div>

                {monthShiftTotalMinutes === 0 ? (
                    <p className="rounded-lg bg-primary/80 py-8 text-center text-sm text-tertiary ring-1 ring-secondary ring-inset">{t("wellbeing.workMonthEmpty")}</p>
                ) : (
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workMonthSeries} margin={{ top: 12, right: 8, bottom: 8, left: 0 }} barCategoryGap="18%">
                                <defs>
                                    <linearGradient id="wellbeingShiftBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#A78BFA" />
                                        <stop offset="55%" stopColor="#7C3AED" />
                                        <stop offset="100%" stopColor="#5B21B6" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border-secondary" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "var(--color-fg-quaternary)", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={{ className: "stroke-border-secondary" }}
                                />
                                <YAxis
                                    width={36}
                                    domain={[0, yAxisMax]}
                                    tick={{ fill: "var(--color-fg-quaternary)", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${v}h`}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(105, 56, 239, 0.06)" }}
                                    content={({ active, payload }) =>
                                        active && payload?.[0] ? (
                                            <div className="rounded-xl bg-primary px-3 py-2.5 text-sm shadow-xl ring-1 ring-brand-secondary/30">
                                                <p className="font-semibold text-secondary">{payload[0].payload.label}</p>
                                                <p className="mt-0.5 text-brand-secondary">{formatMinutesAsHoursMinutes(payload[0].payload.minutes)}</p>
                                            </div>
                                        ) : null
                                    }
                                />
                                <Bar dataKey="hours" radius={[10, 10, 0, 0]} stroke="rgba(255,255,255,0.12)" strokeWidth={1}>
                                    {workMonthSeries.map((entry) => (
                                        <Cell
                                            key={entry.label}
                                            fill={entry.minutes > 0 ? "url(#wellbeingShiftBar)" : "var(--color-bg-quaternary)"}
                                            className={entry.minutes > 0 ? "drop-shadow-[0_8px_20px_rgba(91,33,182,0.25)]" : ""}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            <section className="rounded-xl ring-1 ring-secondary bg-primary_alt p-5">
                <div className="mb-4 flex items-center gap-3">
                    <FeaturedIcon icon={Moon02} color="brand" theme="modern" size="md" />
                    <div>
                        <h3 className="text-lg font-semibold text-secondary">{t("wellbeing.sleepChart")}</h3>
                        <p className="text-sm text-tertiary">Bars show hours; tooltip repeats the number as text.</p>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border-secondary" vertical={false} />
                            <XAxis dataKey="day" tick={{ fill: "#535862", fontSize: 12 }} />
                            <YAxis width={32} tick={{ fill: "#535862", fontSize: 12 }} domain={[0, 10]} />
                            <Tooltip
                                cursor={{ fill: "rgba(83, 88, 98, 0.08)" }}
                                content={({ active, payload }) =>
                                    active && payload?.[0] ? (
                                        <div className="rounded-lg bg-primary px-3 py-2 text-sm shadow-lg ring-1 ring-secondary">
                                            <p className="font-semibold text-secondary">{payload[0].payload.day}</p>
                                            <p className="text-tertiary">{payload[0].payload.label}</p>
                                        </div>
                                    ) : null
                                }
                            />
                            <Bar dataKey="sleepHours" fill="#6938EF" radius={[6, 6, 0, 0]} stroke="#D5D7DA" strokeWidth={1} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section
                className={cx(
                    "rounded-xl bg-primary_alt p-5 ring-1 ring-secondary",
                    "transition-[box-shadow,ring-color] duration-300 ease-out",
                    "hover:shadow-[0_0_36px_-14px_rgba(105,56,239,0.35)] hover:ring-brand-secondary/40",
                    "focus-within:shadow-[0_0_40px_-12px_rgba(105,56,239,0.45)] focus-within:ring-brand-secondary/55",
                    "dark:hover:shadow-[0_0_36px_-14px_rgba(167,139,250,0.28)] dark:focus-within:shadow-[0_0_40px_-12px_rgba(167,139,250,0.38)]",
                )}
            >
                <div>
                    <h3 className="text-lg font-semibold text-secondary">{t("wellbeing.addTask")}</h3>
                    <p className="mt-1 text-sm text-tertiary">{t("wellbeing.tasksSubtitle")}</p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Input className="flex-1" placeholder={t("wellbeing.taskPlaceholder")} value={task} onChange={setTask} />
                    <Button
                        color="primary"
                        size="lg"
                        className="sm:w-auto"
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

                <ul className="mt-5 divide-y divide-secondary overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                    {wellbeingTasks.map((item) => (
                        <li
                            key={item.id}
                            className={cx(
                                "flex items-start gap-3 px-4 py-3 transition-colors duration-100 ease-linear",
                                item.completed && "bg-secondary_alt/80",
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
    );
}

function MetricCard({ icon: Icon, label, value, hint }: { icon: typeof Laptop02; label: string; value: string; hint: string }) {
    return (
        <div className="flex gap-3 rounded-xl bg-primary_alt p-4 ring-1 ring-secondary">
            <FeaturedIcon icon={Icon} color="gray" theme="modern" size="md" />
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{label}</p>
                <p className="mt-1 text-display-xs font-semibold text-secondary">{value}</p>
                <p className="mt-1 text-xs text-tertiary">{hint}</p>
            </div>
        </div>
    );
}

function StatPill({ label, value, secondary }: { label: string; value: string; secondary?: string }) {
    return (
        <div className="min-w-[7.5rem] rounded-xl bg-primary/90 px-3 py-2 ring-1 ring-secondary ring-inset">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-quaternary">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-secondary">{value}</p>
            {secondary && <p className="text-xs text-brand-secondary">{secondary}</p>}
        </div>
    );
}
