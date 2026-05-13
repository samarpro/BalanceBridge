import { HeartRounded } from "@untitledui/icons";
import { t, tReplace } from "@/i18n/strings";
import { cx } from "@/utils/cx";

export interface WellbeingSpiritMeterProps {
    /** Number of wellbeing checklist tasks marked complete. */
    completedCount: number;
    /** Total wellbeing tasks (for ratio and caption). */
    totalCount: number;
    className?: string;
}

/** Heights for the four outer columns (energy-rank style), left pair then right pair of the centre pulse bar. */
const OUTER_BAR_HEIGHTS_PCT = [42, 58, 52, 38] as const;

/**
 * “Spirit level” style meter inspired by `t-animation-dash.html` (energy bars +
 * calm wellbeing framing): vertical bars with a glowing centre column tied to
 * completion ratio, label **Wellbeing**, and the completed count.
 */
export function WellbeingSpiritMeter({ completedCount, totalCount, className }: WellbeingSpiritMeterProps) {
    const safeTotal = Math.max(0, totalCount);
    const safeCompleted = safeTotal > 0 ? Math.min(Math.max(0, completedCount), safeTotal) : Math.max(0, completedCount);
    const ratio = safeTotal > 0 ? safeCompleted / safeTotal : 0;
    const centerHeightPct = safeTotal === 0 ? 30 : Math.round(26 + ratio * 66);

    const ariaLabel = tReplace("dashboard.revamp.wellbeingSpiritAria", {
        completed: safeCompleted,
        total: safeTotal,
    });

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            className={cx("relative flex flex-col items-center", className)}
        >
            <div
                className="pointer-events-none absolute -inset-6 rounded-[60%_40%_70%_30%/40%_50%_60%_70%] bg-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing)_32%,transparent)] opacity-50 blur-2xl dark:opacity-40"
                aria-hidden
            />
            <div className="relative flex h-32 items-end justify-center gap-2 sm:gap-2.5">
                {OUTER_BAR_HEIGHTS_PCT.slice(0, 2).map((h, i) => (
                    <div
                        key={`L${i}`}
                        className="w-2 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing)_22%,var(--kira-revamp-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--kira-revamp-border)_55%,transparent)]"
                        style={{ height: `${h}%` }}
                        aria-hidden
                    />
                ))}
                <div
                    className={cx(
                        "kira-wellbeing-spirit-pulse w-3 shrink-0 rounded-full bg-[var(--kira-revamp-accent-wellbeing)]",
                        "ring-1 ring-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing-fg)_25%,transparent)]",
                    )}
                    style={{ height: `${centerHeightPct}%` }}
                    aria-hidden
                />
                {OUTER_BAR_HEIGHTS_PCT.slice(2).map((h, i) => (
                    <div
                        key={`R${i}`}
                        className="w-2 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing)_22%,var(--kira-revamp-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--kira-revamp-border)_55%,transparent)]"
                        style={{ height: `${h}%` }}
                        aria-hidden
                    />
                ))}
            </div>
            <div className="relative mt-4 flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-1.5">
                    <HeartRounded data-icon aria-hidden className="size-4 text-[var(--kira-revamp-accent-wellbeing-fg)]" />
                    <p className="kira-revamp-section-label tracking-wide text-[var(--kira-revamp-text-primary)]">{t("app.nav.wellbeing")}</p>
                </div>
                <p className="text-4xl font-bold tabular-nums leading-none text-[var(--kira-revamp-accent-wellbeing-fg)]">{safeCompleted}</p>
                <p className="max-w-[14rem] text-xs font-medium text-[var(--kira-revamp-text-muted)]">
                    {safeTotal === 0
                        ? t("dashboard.revamp.wellbeingSpiritCaptionEmpty")
                        : tReplace("dashboard.revamp.wellbeingSpiritCaption", { completed: safeCompleted, total: safeTotal })}
                </p>
            </div>
        </div>
    );
}
