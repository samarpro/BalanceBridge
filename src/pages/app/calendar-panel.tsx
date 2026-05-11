import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { HintText } from "@/components/base/input/hint-text";
import { InputBase, TextField } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { SchedulePlanner } from "@/components/kira/schedule-planner";
import { ScheduleEntryCreateDetailsModal } from "@/components/kira/schedule-entry-modal";
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
                <TextField value={title} onChange={setTitle} size="lg" className="w-full gap-1.5">
                    {({ isRequired, isInvalid }) => (
                        <>
                            <Label isRequired={isRequired} isInvalid={isInvalid}>
                                {t("calendar.modal.nameLabel")}
                            </Label>
                            <div className="flex gap-5 sm:flex-row sm:items-center flex-wrap w-full ">
                                <div className="min-w-70 flex-1">
                                    <InputBase placeholder={t("calendar.addPlaceholder")} />
                                </div>
                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <Button color="primary" size="lg" onClick={handleQuickAdd}>
                                        {t("calendar.quickAdd")}
                                    </Button>
                                    <Button color="secondary" size="lg" onClick={() => setDetailsOpen(true)}>
                                        {t("calendar.quickAddDetails")}
                                    </Button>
                                </div>
                            </div>
                            <HintText isInvalid={isInvalid}>{t("calendar.quickAddHint")}</HintText>
                        </>
                    )}
                </TextField>
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
