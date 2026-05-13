import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type LiquidOrbTone = "work" | "study" | "wellbeing";

export interface LiquidLevelOrbProps {
    /** Fill amount between 0 and 1. */
    fillRatio: number;
    tone: LiquidOrbTone;
    /** Bottom-up (weekly-style) or top-down (fortnight-style) liquid surface. */
    variant?: "bottom-up" | "top-down";
    /** `md` 96px · `lg` 128px · `xl` 160px (visa / small screens). */
    size?: "md" | "lg" | "xl";
    /** Stronger outer ring (matches larger orb in prototype). */
    emphasized?: boolean;
    className?: string;
    children?: ReactNode;
    "aria-label": string;
}

/**
 * Circular “liquid level” gauge from `t-animation-dash.html`, themed with
 * `--kira-revamp-accent-*` tokens (see `kira-revamp.css` `.kira-liquid-*`).
 */
export function LiquidLevelOrb({
    fillRatio,
    tone,
    variant = "bottom-up",
    size = "md",
    emphasized = false,
    className,
    children,
    "aria-label": ariaLabel,
}: LiquidLevelOrbProps) {
    const clamped = Math.min(1, Math.max(0, Number.isFinite(fillRatio) ? fillRatio : 0));
    const minVisible = 0.08;
    const heightPct = clamped <= 0 ? 0 : Math.max(minVisible, clamped) * 100;

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            data-tone={tone}
            className={cx(
                "kira-liquid-orb",
                size === "lg" && "kira-liquid-orb--lg",
                size === "xl" && "kira-liquid-orb--xl",
                emphasized && "kira-liquid-orb--emphasized",
                className,
            )}
        >
            <div className="kira-liquid-orb-glow pointer-events-none absolute inset-0 rounded-full" aria-hidden />
            {heightPct > 0 ? (
                <div
                    className={cx(
                        "kira-liquid-body pointer-events-none absolute left-0 w-full overflow-hidden",
                        variant === "top-down" ? "top-0 rounded-b-[50%]" : "bottom-0 rounded-t-[50%]",
                    )}
                    style={{ height: `${heightPct}%` }}
                >
                    <div className={cx("kira-liquid-fill", variant === "top-down" && "kira-liquid-fill--inverted")} />
                    <div className={cx("kira-liquid-ripple", variant === "top-down" && "kira-liquid-ripple--inverted")} aria-hidden />
                </div>
            ) : null}
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-1">{children}</div>
        </div>
    );
}
