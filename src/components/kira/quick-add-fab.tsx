import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { motion } from "motion/react";
import { ScheduleEntryCreateDetailsModal } from "@/components/kira/schedule-entry-modal";
import { t } from "@/i18n/strings";
import { cx } from "@/utils/cx";

export interface QuickAddFabProps {
    /** Overrides default `fixed` corner positioning (e.g. above mobile bottom nav). */
    fabClassName?: string;
}

/**
 * Global floating action — opens the same “task details” flow as Calendar → More options.
 */
export function QuickAddFab({ fabClassName }: QuickAddFabProps) {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <motion.div
                className={cx("fixed z-40 size-14", fabClassName ?? "right-4 bottom-5 md:right-6 md:bottom-6")}
                initial={false}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
            >
                <button
                    type="button"
                    aria-label={t("aria.quickAdd")}
                    onClick={() => setCreateOpen(true)}
                    className={cx(
                        "kira-revamp-focusable relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--kira-revamp-accent-work-dark)] text-white shadow-xl",
                        "ring-2 ring-white/30 transition-[filter] duration-150 hover:brightness-110 active:brightness-95",
                    )}
                >
                    <Plus data-icon aria-hidden className="size-6 shrink-0" />
                </button>
            </motion.div>
            <ScheduleEntryCreateDetailsModal
                isOpen={createOpen}
                onOpenChange={setCreateOpen}
                initialTitle=""
                onSaved={() => undefined}
            />
        </>
    );
}
