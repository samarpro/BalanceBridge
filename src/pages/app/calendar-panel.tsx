import { useMemo } from "react";
import { motion } from "motion/react";
import { SchedulePlanner } from "@/components/kira/schedule-planner";
import { HoverHint } from "@/components/kira/hover-hint";
import { useKiraStore } from "@/stores/kira-store";
import { entryDurationMinutes, formatMinutesAsHoursMinutes, fortnightShiftMinutes } from "@/utils/schedule-aggregates";
import { cx } from "@/utils/cx";
import { t, tReplace } from "@/i18n/strings";

export function CalendarPanel() {
    const entries = useKiraStore((s) => s.entries);
    const fortnightWorkLimitHours = useKiraStore((s) => s.fortnightWorkLimitHours);
    const conflictBlocksShown = useKiraStore((s) => s.conflictBlocksShown);

    const shiftMinutesUsed = useMemo(() => fortnightShiftMinutes(entries, new Date()), [entries]);
    const shiftMinutesCap = fortnightWorkLimitHours * 60;
    const shiftMinutesRemaining = Math.max(0, shiftMinutesCap - shiftMinutesUsed);

    const remainingTaskMinutes = useMemo(
        () => entries.filter((entry) => !entry.completed && entry.kind !== "shift").reduce((sum, entry) => sum + entryDurationMinutes(entry), 0),
        [entries],
    );
    const studySessionsRemaining = Math.ceil(remainingTaskMinutes / 60);

    return (
        <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.06,
                    },
                },
            }}
        >
            <motion.section
                className={cx(
                    "rounded-2xl border border-[var(--kira-revamp-border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(247,220,208,0.24),rgba(245,239,230,0.98))] p-6 md:p-7",
                    "transition-[box-shadow,ring-color] duration-300 ease-out",
                    "hover:shadow-[0_18px_44px_-18px_rgba(188,99,66,0.22)]",
                    "dark:bg-[linear-gradient(145deg,rgba(47,40,36,0.98),rgba(89,79,135,0.14),rgba(36,29,26,0.98))] dark:hover:shadow-[0_22px_50px_-20px_rgba(125,114,191,0.26)]",
                )}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex items-start justify-between gap-3 max-sm:flex-col">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--kira-revamp-accent-work-dark)]">{t("calendar.insightsSectionLabel")}</p>
                        <HoverHint title={t("calendar.insightsSectionLabel")} description={t("calendar.insightsHint")} className="-mt-0.5" />
                    </div>
                </div>

                <motion.div
                    className="mt-4 grid gap-3 md:grid-cols-3"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.06,
                            },
                        },
                    }}
                >
                    <motion.article
                        className="rounded-xl border border-[rgba(188,99,66,0.22)] bg-[linear-gradient(160deg,rgba(226,157,126,0.3),rgba(255,255,255,0.96))] p-4 dark:border-[rgba(240,178,154,0.18)] dark:bg-[linear-gradient(160deg,rgba(107,61,47,0.82),rgba(47,40,36,0.98))]"
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ y: -3 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kira-revamp-text-secondary)]">{t("calendar.insights.shiftRemainingTitle")}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--kira-revamp-text-primary)]">{formatMinutesAsHoursMinutes(shiftMinutesRemaining)}</p>
                        <p className="mt-1 text-xs text-[var(--kira-revamp-text-secondary)]">
                            {tReplace("calendar.insights.shiftRemainingSub", {
                                used: formatMinutesAsHoursMinutes(shiftMinutesUsed),
                                cap: formatMinutesAsHoursMinutes(shiftMinutesCap),
                            })}
                        </p>
                    </motion.article>

                    <motion.article
                        className="rounded-xl border border-[rgba(125,114,191,0.24)] bg-[linear-gradient(160deg,rgba(185,175,230,0.32),rgba(255,255,255,0.96))] p-4 dark:border-[rgba(195,182,240,0.2)] dark:bg-[linear-gradient(160deg,rgba(89,79,135,0.84),rgba(47,40,36,0.98))]"
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ y: -3 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kira-revamp-text-secondary)]">{t("calendar.insights.studySessionsTitle")}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--kira-revamp-text-primary)]">{studySessionsRemaining}</p>
                        <p className="mt-1 text-xs text-[var(--kira-revamp-text-secondary)]">
                            {tReplace("calendar.insights.studySessionsSub", {
                                time: formatMinutesAsHoursMinutes(remainingTaskMinutes),
                            })}
                        </p>
                    </motion.article>

                    <motion.article
                        className="rounded-xl border border-[rgba(220,174,69,0.26)] bg-[linear-gradient(160deg,rgba(220,174,69,0.28),rgba(255,255,255,0.96))] p-4 dark:border-[rgba(223,178,75,0.2)] dark:bg-[linear-gradient(160deg,rgba(112,84,24,0.84),rgba(47,40,36,0.98))]"
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ y: -3 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kira-revamp-text-secondary)]">{t("calendar.insights.conflictsSavedTitle")}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--kira-revamp-text-primary)]">{conflictBlocksShown}</p>
                        <p className="mt-1 text-xs text-[var(--kira-revamp-text-secondary)]">{t("calendar.insights.conflictsSavedSub")}</p>
                    </motion.article>
                </motion.div>
            </motion.section>

            <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
                <SchedulePlanner entries={entries} />
            </motion.div>
        </motion.div>
    );
}
