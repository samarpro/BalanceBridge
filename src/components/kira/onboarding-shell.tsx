import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import bookLoverSvg from "@/assets/onboarding/book-lover.svg";
import { cx } from "@/utils/cx";

interface OnboardingShellProps {
    children: ReactNode;
    className?: string;
    panelClassName?: string;
}

export function OnboardingShell({ children, className, panelClassName }: OnboardingShellProps) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div
            className={cx(
                "relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 md:px-6 md:py-14",
                "bg-[linear-gradient(135deg,rgba(247,220,208,0.88),rgba(240,214,152,0.42),rgba(199,184,235,0.44),rgba(168,209,179,0.34))]",
                "dark:bg-[linear-gradient(135deg,rgba(47,40,36,0.98),rgba(107,61,47,0.34),rgba(89,79,135,0.28),rgba(61,102,77,0.22))]",
                className,
            )}
        >
            <motion.div
                aria-hidden
                className="absolute -top-24 -left-20 size-64 rounded-full bg-[rgba(226,157,126,0.28)] blur-3xl dark:bg-[rgba(188,99,66,0.2)]"
                animate={prefersReducedMotion ? { opacity: 0.8 } : { x: [0, 36, 0], y: [0, 22, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="absolute top-[18%] right-[-3rem] size-72 rounded-full bg-[rgba(199,184,235,0.3)] blur-3xl dark:bg-[rgba(108,90,154,0.22)]"
                animate={prefersReducedMotion ? { opacity: 0.8 } : { x: [0, -30, 0], y: [0, -18, 0], scale: [1, 0.94, 1] }}
                transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="absolute bottom-[-5rem] left-[12%] size-80 rounded-full bg-[rgba(168,209,179,0.26)] blur-3xl dark:bg-[rgba(79,154,114,0.18)]"
                animate={prefersReducedMotion ? { opacity: 0.75 } : { x: [0, 22, 0], y: [0, -26, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full opacity-70 dark:opacity-45"
                viewBox="0 0 1200 900"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="onboarding-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(188,99,66,0.34)" />
                        <stop offset="55%" stopColor="rgba(125,114,191,0.24)" />
                        <stop offset="100%" stopColor="rgba(79,154,114,0.2)" />
                    </linearGradient>
                </defs>
                <circle cx="180" cy="130" r="94" fill="none" stroke="url(#onboarding-orbit)" strokeWidth="1.5" />
                <circle cx="1020" cy="220" r="140" fill="none" stroke="url(#onboarding-orbit)" strokeWidth="1.2" />
                <circle cx="930" cy="700" r="116" fill="none" stroke="url(#onboarding-orbit)" strokeWidth="1.4" />
                <path d="M40 710C230 630 298 520 468 514C632 509 720 630 930 588C1056 563 1128 500 1180 446" fill="none" stroke="url(#onboarding-orbit)" strokeWidth="1.4" />
            </svg>

            <div className={cx("relative z-10 w-full max-w-4xl", panelClassName)}>
                <div
                    className={cx(
                        "mx-auto w-full rounded-[2rem] border border-[rgba(120,100,80,0.14)] px-5 py-6 shadow-[0_24px_80px_rgba(120,100,80,0.12)] backdrop-blur-xl sm:px-7 sm:py-8",
                        "bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(247,220,208,0.2),rgba(245,239,230,0.78))]",
                        "dark:border-[rgba(247,241,234,0.12)] dark:bg-[linear-gradient(180deg,rgba(47,40,36,0.86),rgba(89,79,135,0.12),rgba(36,29,26,0.9))]",
                    )}
                >
                    <div className="mb-5 flex flex-col gap-4 border-b border-[rgba(120,100,80,0.12)] pb-5 md:mb-6 md:flex-row md:items-center md:justify-between dark:border-white/10">
                        <div className="min-w-0 space-y-3">
                            <span className="inline-flex rounded-full border border-[rgba(120,100,80,0.16)] bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(83,51,38,0.8)] dark:border-white/10 dark:bg-white/[0.06] dark:text-[rgba(247,241,234,0.82)]">
                                Kira
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-[rgba(226,157,126,0.18)] px-3 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] dark:bg-[rgba(188,99,66,0.18)]">
                                    Own your semester
                                </span>
                                <span className="rounded-full bg-[rgba(199,184,235,0.2)] px-3 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] dark:bg-[rgba(108,90,154,0.2)]">
                                    Less chaos
                                </span>
                                <span className="rounded-full bg-[rgba(168,209,179,0.22)] px-3 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] dark:bg-[rgba(79,154,114,0.18)]">
                                    More momentum
                                </span>
                            </div>
                        </div>

                        <motion.div
                            aria-hidden
                            className="relative flex shrink-0 justify-center md:justify-end"
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.div
                                className="absolute inset-x-6 top-3 h-20 rounded-full bg-[linear-gradient(135deg,rgba(226,157,126,0.22),rgba(240,214,152,0.16),rgba(199,184,235,0.2))] blur-2xl dark:bg-[linear-gradient(135deg,rgba(188,99,66,0.18),rgba(223,178,75,0.1),rgba(108,90,154,0.16))]"
                                animate={prefersReducedMotion ? { opacity: 0.85 } : { x: [0, 10, 0], scale: [1, 1.04, 1] }}
                                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            />
                            <motion.img
                                src={bookLoverSvg}
                                alt=""
                                className="relative z-10 h-28 w-auto max-w-[11rem] drop-shadow-[0_16px_30px_rgba(88,60,44,0.14)] md:h-32 md:max-w-[13rem]"
                                animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
                                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
