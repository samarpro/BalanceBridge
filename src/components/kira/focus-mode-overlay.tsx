import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClockStopwatch } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/base/buttons/button";
import { useKiraStore } from "@/stores/kira-store";
import { isoFromDate } from "@/utils/schedule-time";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

const BLOB_KEYFRAMES = [
    "42% 58% 70% 30% / 45% 55% 48% 52%",
    "58% 42% 35% 65% / 52% 48% 55% 45%",
    "48% 52% 62% 38% / 58% 42% 50% 50%",
    "55% 45% 40% 60% / 48% 52% 45% 55%",
];

function formatElapsed(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function MorphingFocusDiagram() {
    return (
        <div className="pointer-events-none relative mx-auto aspect-square w-[min(78vw,22rem)] max-w-full select-none" aria-hidden>
            <motion.div
                className="absolute inset-[-18%] rounded-full bg-gradient-to-br from-brand-600/35 via-purple-400/25 to-amber-400/30 blur-3xl dark:from-brand-500/25 dark:via-purple-400/20 dark:to-amber-300/20"
                animate={{ scale: [1, 1.12, 0.96, 1], rotate: [0, 8, -6, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute inset-[8%] bg-gradient-to-tr from-secondary_alt/80 via-brand-primary_alt/40 to-primary_alt/90 shadow-inner ring-1 ring-brand-secondary/20 dark:ring-brand-secondary/30"
                animate={{ borderRadius: BLOB_KEYFRAMES, rotate: [0, -4, 3, 0] }}
                transition={{
                    borderRadius: { duration: 18, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
                    rotate: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                }}
            />
            <motion.div
                className="absolute inset-[22%] bg-gradient-to-bl from-white/25 via-transparent to-brand-600/10 dark:from-white/10"
                animate={{ borderRadius: [...BLOB_KEYFRAMES].reverse(), scale: [1, 1.03, 1] }}
                transition={{
                    borderRadius: { duration: 14, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                }}
            />
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="size-[42%] rounded-full bg-gradient-to-br from-purple-300/30 to-brand-600/20 blur-md dark:from-purple-400/20 dark:to-brand-500/15" />
            </motion.div>
        </div>
    );
}

interface FocusSessionLayerProps {
    onRequestClose: () => void;
}

function FocusSessionLayer({ onRequestClose }: FocusSessionLayerProps) {
    const addEntry = useKiraStore((s) => s.addEntry);
    const startedAtRef = useRef<number>(Date.now());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        const id = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const finalizeSession = useCallback(() => {
        if (ending) return;
        setEnding(true);
        const elapsedMs = Date.now() - startedAtRef.current;
        const creditedMinutes = Math.max(0, Math.round(elapsedMs / 60000));
        if (creditedMinutes > 0) {
            const start = new Date(startedAtRef.current);
            const isoDate = isoFromDate(start);
            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const maxFit = Math.max(1, 24 * 60 - startMinutes);
            const durationMinutes = Math.min(creditedMinutes, maxFit);
            addEntry({
                isoDate,
                title: t("focus.sessionEntryTitle"),
                kind: "study",
                priority: "medium",
                completed: true,
                startMinutes,
                durationMinutes,
            });
        }
        onRequestClose();
    }, [addEntry, ending, onRequestClose]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                finalizeSession();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [finalizeSession]);

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-mode-title"
            aria-describedby="focus-mode-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col bg-gradient-to-b from-primary via-primary_alt to-brand-primary_alt/30 dark:from-primary dark:via-primary_alt dark:to-brand-950/40"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -left-1/4 top-1/4 size-[120vmin] rounded-full bg-brand-600/10 blur-3xl dark:bg-brand-500/15"
                    animate={{ x: [0, "8%", 0], y: [0, "-5%", 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-1/4 bottom-0 size-[100vmin] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-400/12"
                    animate={{ x: [0, "-6%", 0], y: [0, "6%", 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-10 pt-[max(2rem,env(safe-area-inset-top))]">
                <MorphingFocusDiagram />

                <div className="relative z-10 mt-10 flex max-w-md flex-col items-center text-center">
                    <h1 id="focus-mode-title" className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                        {t("focus.title")}
                    </h1>
                    <p id="focus-mode-desc" className="mt-3 text-md leading-relaxed text-secondary">
                        {t("focus.subtitle")}
                    </p>

                    <motion.p
                        className="mt-8 font-mono text-display-md font-light tabular-nums tracking-tight text-primary max-sm:text-display-sm"
                        key={elapsedSeconds}
                        initial={{ opacity: 0.85, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    >
                        {formatElapsed(elapsedSeconds)}
                    </motion.p>
                    <p className="mt-2 text-xs text-tertiary">{t("focus.elapsedHint")}</p>
                </div>
            </div>

            <div
                className={cx(
                    "relative z-10 flex shrink-0 flex-col items-center gap-3 border-t border-secondary/60 bg-primary/40 px-6 py-6 backdrop-blur-md",
                    "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
                )}
            >
                <Button color="secondary" size="lg" className="min-w-[12rem] shadow-md" onClick={finalizeSession} isDisabled={ending}>
                    {t("focus.endSession")}
                </Button>
                <p className="max-w-sm text-center text-xs leading-relaxed text-tertiary">{t("focus.saveHint")}</p>
            </div>
        </motion.div>
    );
}

export function FocusModeControl() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Button
                color="secondary"
                size="md"
                aria-label={t("aria.openFocusMode")}
                aria-expanded={open}
                iconLeading={ClockStopwatch}
                onClick={() => setOpen(true)}
                className={cx(
                    "max-h-11 max-w-[min(100%,10.5rem)] shrink-0 gap-1.5 px-2 sm:max-w-none sm:gap-2 sm:px-3.5",
                    "tabular-nums",
                )}
            >
                <span className="truncate text-xs font-semibold sm:hidden">{t("focus.controlLabelShort")}</span>
                <span className="hidden truncate text-sm font-semibold sm:inline">{t("focus.controlLabel")}</span>
            </Button>
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && <FocusSessionLayer onRequestClose={() => setOpen(false)} />}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}
