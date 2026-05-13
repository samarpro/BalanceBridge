import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useKiraStore } from "@/stores/kira-store";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

export interface LimitsSetupModalProps {
    isOpen: boolean;
    /** When true, overlay cannot be dismissed until limits are saved. */
    isRequired: boolean;
    onOpenChange: (open: boolean) => void;
}

/** Limits gate uses `<dialog>.showModal()` (top layer) instead of RAC `ModalOverlay` for reliable hit-testing. */
export function LimitsSetupModal({ isOpen, isRequired, onOpenChange }: LimitsSetupModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const userProfile = useKiraStore((s) => s.userProfile);
    const completeLimitsSetup = useKiraStore((s) => s.completeLimitsSetup);
    const closeLimitsEditor = useKiraStore((s) => s.closeLimitsEditor);

    const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(() => String(Math.round(userProfile.weeklyStudyGoalMinutes / 60)));
    const [workHoursFortnight, setWorkHoursFortnight] = useState(() => String(userProfile.fortnightWorkLimitHours));

    useEffect(() => {
        if (!isOpen) return;
        setStudyHoursPerWeek(String(Math.round(userProfile.weeklyStudyGoalMinutes / 60)));
        setWorkHoursFortnight(String(userProfile.fortnightWorkLimitHours));
    }, [isOpen, userProfile.weeklyStudyGoalMinutes, userProfile.fortnightWorkLimitHours]);

    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;
        if (isOpen) {
            if (!el.open) el.showModal();
        } else if (el.open) {
            el.close();
        }
    }, [isOpen]);

    const studyNum = Number.parseFloat(studyHoursPerWeek.replace(",", "."));
    const workNum = Number.parseFloat(workHoursFortnight.replace(",", "."));
    const studyValid = Number.isFinite(studyNum) && studyNum >= 1 && studyNum <= 100;
    const workValid = Number.isFinite(workNum) && workNum >= 1 && workNum <= 120;
    const canSave = studyValid && workValid;

    const handleSave = () => {
        if (!canSave) return;
        const weeklyStudyGoalMinutes = Math.round(studyNum * 60);
        const fortnightWorkLimitHours = Math.round(workNum);
        completeLimitsSetup(weeklyStudyGoalMinutes, fortnightWorkLimitHours);
        if (!isRequired) {
            onOpenChange(false);
        }
    };

    const handleDismiss = () => {
        dialogRef.current?.close();
        closeLimitsEditor();
        onOpenChange(false);
    };

    const onDialogCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        if (isRequired) e.preventDefault();
    };

    const onDialogClose = () => {
        if (!isRequired) {
            closeLimitsEditor();
            onOpenChange(false);
        }
    };

    const onBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isRequired) return;
        if (e.target === e.currentTarget) handleDismiss();
    };

    return (
        <dialog
            ref={dialogRef}
            aria-label={t("limits.modalTitle")}
            className={cx(
                "m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 shadow-none ring-0",
                "open:grid open:place-items-stretch",
                "[&::backdrop]:bg-neutral-950/92 [&::backdrop]:backdrop-blur-sm dark:[&::backdrop]:bg-neutral-900/94",
            )}
            onCancel={onDialogCancel}
            onClose={onDialogClose}
        >
            <div
                className="flex min-h-dvh w-full flex-col justify-end px-4 pt-4 pb-[clamp(16px,8vh,64px)] sm:items-center sm:justify-center sm:py-8"
                onPointerDown={onBackdropPointerDown}
            >
                <div
                    className={cx(
                        "w-full max-w-md rounded-2xl border border-secondary bg-primary p-6 shadow-2xl ring-1 ring-secondary",
                        "max-h-[min(90dvh,720px)] overflow-y-auto",
                    )}
                >
                    <h2 className="text-lg font-semibold text-secondary">{t("limits.modalTitle")}</h2>
                    <p className="mt-2 text-sm text-tertiary">{t(isRequired ? "limits.modalBodyRequired" : "limits.modalBodyOptional")}</p>

                    <div className="mt-6 space-y-4">
                        <Input
                            autoFocus
                            label={t("limits.studyHoursLabel")}
                            hint={t("limits.studyHoursHint")}
                            type="number"
                            inputMode="decimal"
                            value={studyHoursPerWeek}
                            onChange={setStudyHoursPerWeek}
                            isRequired
                            isInvalid={studyHoursPerWeek.length > 0 && !studyValid}
                        />
                        <Input
                            label={t("limits.workHoursLabel")}
                            hint={t("limits.workHoursHint")}
                            type="number"
                            inputMode="decimal"
                            value={workHoursFortnight}
                            onChange={setWorkHoursFortnight}
                            isRequired
                            isInvalid={workHoursFortnight.length > 0 && !workValid}
                        />
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        {!isRequired && (
                            <Button color="secondary" size="lg" onClick={handleDismiss}>
                                {t("limits.cancel")}
                            </Button>
                        )}
                        <Button color="primary" size="lg" isDisabled={!canSave} onClick={handleSave}>
                            {t("limits.save")}
                        </Button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
