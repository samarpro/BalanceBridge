import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
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
    const prefersReducedMotion = useReducedMotion();
    const clamped = Math.min(1, Math.max(0, Number.isFinite(fillRatio) ? fillRatio : 0));
    const minVisible = 0.08;
    const heightPct = clamped <= 0 ? 0 : Math.max(minVisible, clamped) * 100;
    const bobRange = Math.min(3.5, Math.max(1.2, heightPct * 0.05));
    const minBobHeight = Math.max(minVisible * 100, heightPct - bobRange);
    const maxBobHeight = Math.min(100, heightPct + bobRange);
    const shouldBob = !prefersReducedMotion && heightPct > 0;
    const swayX = Math.min(8, Math.max(2.8, heightPct * 0.06));
    const fillWaveX = Math.min(12, Math.max(4, heightPct * 0.08));

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
                <motion.div
                    initial={{ height: "0%" }}
                    animate={{
                        height: shouldBob
                            ? [`${heightPct}%`, `${maxBobHeight}%`, `${minBobHeight}%`, `${heightPct}%`]
                            : `${heightPct}%`,
                    }}
                    transition={
                        shouldBob
                            ? {
                                  height: { duration: 4.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
                              }
                            : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                    }
                    className={cx(
                        "kira-liquid-body pointer-events-none absolute left-0 w-full overflow-hidden",
                        variant === "top-down" ? "top-0 rounded-b-[50%]" : "bottom-0 rounded-t-[50%]",
                    )}
                >
                    <motion.div
                        className={cx("kira-liquid-fill", variant === "top-down" && "kira-liquid-fill--inverted")}
                        initial={false}
                        animate={
                            shouldBob
                                ? variant === "top-down"
                                    ? {
                                          x: [0, -fillWaveX, fillWaveX * 0.7, 0],
                                          y: [0, 1, -2, 0],
                                          scaleX: [1, 1.14, 0.9, 1],
                                          scaleY: [1, 0.98, 1.04, 1],
                                      }
                                    : {
                                          x: [0, fillWaveX, -fillWaveX * 0.75, 0],
                                          y: [0, -1, 2, 0],
                                          scaleX: [1, 1.12, 0.92, 1],
                                          scaleY: [1, 1.03, 0.97, 1],
                                      }
                                : { x: 0, y: 0, scaleX: 1, scaleY: 1 }
                        }
                        transition={
                            shouldBob
                                ? {
                                      duration: 2.8,
                                      ease: "easeInOut",
                                      repeat: Number.POSITIVE_INFINITY,
                                  }
                                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                        }
                        style={{
                            width: `calc(100% + ${swayX * 2}px)`,
                            left: `${-swayX}px`,
                        }}
                    />
                </motion.div>
            ) : null}
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-1">{children}</div>
        </div>
    );
}
