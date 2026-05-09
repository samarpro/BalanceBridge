import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SchedulePlanner } from "@/components/balance-bridge/schedule-planner";
import { ScheduleEntryCreateDetailsModal } from "@/components/balance-bridge/schedule-entry-modal";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { useKiraStore } from "@/stores/kira-store";
import { isoFromDate } from "@/utils/schedule-time";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

export function CalendarPanel() {
    const entries = useKiraStore((s) => s.entries);
    const { tryAdd, collisionModal } = useCollisionGuardedAdd();

    const [title, setTitle] = useState("");
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleQuickAdd = () => {
        const trimmed = title.trim();
        tryAdd(
            {
                isoDate: isoFromDate(new Date()),
                title: trimmed || "Untitled",
                kind: "study",
                priority: "medium",
                completed: false,
            },
            () => setTitle(""),
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <section
                className={cx(
                    "rounded-xl bg-primary_alt p-4 md:p-6",
                    "ring-1 ring-secondary",
                    "transition-[box-shadow,ring-color,transform] duration-300 ease-out",
                    "hover:-translate-y-px",
                    "hover:shadow-[0_0_42px_-12px_rgba(105,56,239,0.4)] hover:ring-brand-secondary/45",
                    "focus-within:-translate-y-px",
                    "focus-within:shadow-[0_0_48px_-10px_rgba(105,56,239,0.55)] focus-within:ring-brand-secondary/65",
                    "dark:hover:shadow-[0_0_42px_-12px_rgba(167,139,250,0.35)] dark:focus-within:shadow-[0_0_48px_-10px_rgba(167,139,250,0.45)]",
                )}
            >
                <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("calendar.quickAddSectionLabel")}</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Input
                        label={t("calendar.modal.nameLabel")}
                        placeholder={t("calendar.addPlaceholder")}
                        className="flex-1"
                        value={title}
                        onChange={setTitle}
                        hint={t("calendar.quickAddHint")}
                    />
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Button color="primary" size="lg" onClick={handleQuickAdd}>
                            {t("calendar.quickAdd")}
                        </Button>
                        <Button color="secondary" size="lg" onClick={() => setDetailsOpen(true)}>
                            {t("calendar.quickAddDetails")}
                        </Button>
                    </div>
                </div>
            </section>

            <ScheduleEntryCreateDetailsModal
                isOpen={detailsOpen}
                onOpenChange={setDetailsOpen}
                initialTitle={title}
                onSaved={() => setTitle("")}
            />
            {collisionModal}

            <SchedulePlanner entries={entries} />
        </div>
    );
}
