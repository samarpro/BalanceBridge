import { cx } from "@/utils/cx";

const glassTile =
    "flex min-h-0 flex-col gap-2 rounded-2xl border border-white/25 bg-gradient-to-br from-white/15 to-white/5 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-white/[0.12] dark:to-white/[0.05]";

const R = 40;
const CIRC = 2 * Math.PI * R;

export interface GlassRadialTileProps {
    title: string;
    subtitle: string;
    /** Progress = numerator / max(denominator, ε); ring clamps at 100%. */
    numerator: number;
    denominator: number;
    /** Main label inside the ring (may exceed 100% in text). */
    centerPrimary: string;
    /** Supporting line under primary (goal/cap). */
    centerSecondary: string;
    /** Stroke for the progress arc. */
    strokeClassName: string;
    ariaLabel: string;
    className?: string;
}

export function GlassRadialTile({
    title,
    subtitle,
    numerator,
    denominator,
    centerPrimary,
    centerSecondary,
    strokeClassName,
    ariaLabel,
    className,
}: GlassRadialTileProps) {
    const safeDen = Math.max(denominator, 1e-6);
    const ratio = numerator / safeDen;
    const arcRatio = Math.min(1, Math.max(0, ratio));
    const offset = CIRC * (1 - arcRatio);

    return (
        <section className={cx(glassTile, className)} aria-label={ariaLabel}>
            <div className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-quaternary">{title}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-tertiary">{subtitle}</p>
            </div>
            <div className="relative mx-auto flex aspect-square w-[min(100%,7.5rem)] shrink-0 items-center justify-center">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
                    <circle cx="50" cy="50" r={R} fill="none" strokeWidth="8" className="stroke-border-secondary/80" />
                    <circle
                        cx="50"
                        cy="50"
                        r={R}
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${CIRC} ${CIRC}`}
                        strokeDashoffset={offset}
                        className={cx("transition-[stroke-dashoffset] duration-300 ease-out", strokeClassName)}
                    />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center">
                    <p className="text-display-xs font-semibold leading-tight text-secondary">{centerPrimary}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-tertiary">{centerSecondary}</p>
                </div>
            </div>
        </section>
    );
}
