import { HoverHint } from "@/components/kira/hover-hint";
import { cx } from "@/utils/cx";

const glassTile =
    "box-border flex w-fit max-w-full min-w-0 flex-col gap-2.5 justify-self-center rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-lg backdrop-blur-xl dark:border-white/12 dark:from-white/[0.14] dark:to-white/[0.05] md:w-full md:justify-self-auto";

const R = 46;
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
                <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">{title}</h3>
                    <HoverHint title={title} description={subtitle} className="-mr-1 mt-0.5 shrink-0" />
                </div>
            </div>
            <div className="relative mx-auto mb-2 flex aspect-square w-[min(100%,14rem)] max-w-full shrink-0 items-center justify-center">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
                    <circle cx="50" cy="50" r={R} fill="none" strokeWidth="9" className="stroke-border-secondary/90" />
                    <circle
                        cx="50"
                        cy="50"
                        r={R}
                        fill="none"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={`${CIRC} ${CIRC}`}
                        strokeDashoffset={offset}
                        className={cx("transition-[stroke-dashoffset] duration-300 ease-out", strokeClassName)}
                    />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
                    <p className="text-display-sm font-bold leading-none tracking-tight text-primary">{centerPrimary}</p>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-brand-secondary">{centerSecondary}</p>
                </div>
            </div>
        </section>
    );
}
