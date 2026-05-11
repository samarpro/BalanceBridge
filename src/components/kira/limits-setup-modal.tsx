import { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useKiraStore } from "@/stores/kira-store";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

export interface LimitsSetupModalProps {
    isOpen: boolean;
    /** When true, overlay cannot be dismissed until limits are saved. */
    isRequired: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LimitsSetupModal({ isOpen, isRequired, onOpenChange }: LimitsSetupModalProps) {
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
        closeLimitsEditor();
        onOpenChange(false);
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open && !isRequired) {
                    handleDismiss();
                }
            }}
            isDismissable={!isRequired}
            isKeyboardDismissDisabled={isRequired}
        >
            <Modal
                className={cx(
                    "w-full max-w-md rounded-2xl border border-white/30 bg-primary/95 p-6 shadow-2xl ring-1 ring-secondary",
                    "backdrop-blur-xl dark:border-white/10 dark:bg-primary/90",
                )}
            >
                <Dialog aria-label={t("limits.modalTitle")} className="outline-hidden">
                    <div className="relative z-[2] w-full pointer-events-auto">
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
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
