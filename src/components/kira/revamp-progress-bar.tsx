import { motion } from "motion/react";
import { cx } from "@/utils/cx";

export interface RevampProgressBarProps {
    value: number;
    max: number;
    min?: number;
    className?: string;
    trackClassName?: string;
}

/**
 * Pill progress bar for the dashboard revamp — green &lt;85% of cap, amber ≥85%, red over cap.
 */
export function RevampProgressBar({ value, max, min = 0, className, trackClassName }: RevampProgressBarProps) {
    const span = Math.max(max - min, 0.0001);
    const pct = Math.min(100, Math.max(0, ((value - min) * 100) / span));
    const over = value > max;

    const fillClass = over
        ? "bg-[var(--kira-revamp-accent-danger)]"
        : pct >= 85
          ? "bg-[var(--kira-revamp-accent-warning)]"
          : "bg-[var(--kira-revamp-accent-success)]";

    const x = `${-(100 - pct)}%`;

    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(value * 100) / 100}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={over ? "Over limit" : undefined}
            className={cx(
                "h-2.5 w-full overflow-hidden rounded-full bg-[var(--kira-revamp-bg-base)] ring-1 ring-[var(--kira-revamp-border)]",
                className,
                trackClassName,
            )}
        >
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cx("size-full rounded-full will-change-transform", fillClass)}
            />
        </div>
    );
}
