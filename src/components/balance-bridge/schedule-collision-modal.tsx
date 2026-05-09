import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { lifeAreaForScheduleKind, rankOfLifeArea, type LifePriorityId } from "@/types/life-priority";
import { formatHm, getEntryTimeRange } from "@/utils/schedule-time";
import { cx } from "@/utils/cx";
import { t, tCollisionSuggested } from "@/i18n/strings";

function lifePriorityLabel(id: LifePriorityId): string {
    return t(`lifePriority.${id}`);
}

export interface ScheduleCollisionModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    overlaps: ScheduleEntry[];
    proposedTitle: string;
    proposedKind: ScheduleEntry["kind"];
    proposedStartMin: number;
    proposedEndMin: number;
    lifePriorityOrder: LifePriorityId[];
    suggestedStartMin: number | null;
    onContinueAnyway: () => void;
    onUseSuggestedTime: (startMinutes: number) => void;
}

export function ScheduleCollisionModal({
    isOpen,
    onOpenChange,
    overlaps,
    proposedTitle,
    proposedKind,
    proposedStartMin,
    proposedEndMin,
    lifePriorityOrder,
    suggestedStartMin,
    onContinueAnyway,
    onUseSuggestedTime,
}: ScheduleCollisionModalProps) {
    const newArea = lifeAreaForScheduleKind(proposedKind);
    const newRank = rankOfLifeArea(newArea, lifePriorityOrder);

    let bestOverlapRank = lifePriorityOrder.length;
    for (const o of overlaps) {
        const r = rankOfLifeArea(lifeAreaForScheduleKind(o.kind), lifePriorityOrder);
        bestOverlapRank = Math.min(bestOverlapRank, r);
    }

    let coachKey: "collision.coach.favourNew" | "collision.coach.favourExisting" | "collision.coach.neutral";
    if (newRank < bestOverlapRank) coachKey = "collision.coach.favourNew";
    else if (newRank > bestOverlapRank) coachKey = "collision.coach.favourExisting";
    else coachKey = "collision.coach.neutral";

    const orderSummary = lifePriorityOrder.map((id) => lifePriorityLabel(id)).join(" → ");

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="z-[70]">
            <Modal className={cx("max-h-[min(90vh,720px)] w-full overflow-y-auto rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-warning-secondary sm:max-w-lg")}>
                <Dialog aria-label={t("collision.title")} className="outline-hidden">
                    <div className="w-full">
                        <h2 className="text-md font-semibold text-secondary">{t("collision.title")}</h2>
                        <p className="mt-2 text-sm text-tertiary">{t("collision.subtitle")}</p>

                        <div className="mt-4 rounded-lg bg-warning-secondary/15 px-3 py-2 text-sm text-secondary ring-1 ring-warning-secondary/30">
                            <p className="font-medium text-secondary">{t(coachKey)}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("collision.yourOrder")}</p>
                            <p className="mt-1 text-sm text-tertiary">{orderSummary}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-quaternary">{t("collision.newBlock")}</p>
                            <p className="mt-1 text-sm font-medium text-secondary">{proposedTitle}</p>
                            <p className="text-xs text-tertiary">
                                {formatHm(proposedStartMin)}–{formatHm(proposedEndMin)} · {lifePriorityLabel(newArea)}
                            </p>
                        </div>

                        <ul className="mt-4 space-y-2">
                            {overlaps.map((e) => {
                                const { start, end } = getEntryTimeRange(e);
                                const area = lifeAreaForScheduleKind(e.kind);
                                return (
                                    <li key={e.id} className="rounded-lg bg-secondary_alt px-3 py-2 text-sm ring-1 ring-secondary ring-inset">
                                        <span className="font-medium text-secondary">{e.title}</span>
                                        <span className="mt-0.5 block text-xs text-tertiary">
                                            {formatHm(start)}–{formatHm(end)} · {lifePriorityLabel(area)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-6 flex flex-col gap-3">
                            {suggestedStartMin != null && (
                                <Button color="primary" size="lg" className="w-full" onClick={() => onUseSuggestedTime(suggestedStartMin)}>
                                    {tCollisionSuggested(formatHm(suggestedStartMin))}
                                </Button>
                            )}
                            <Button color="secondary" size="lg" className="w-full" onClick={onContinueAnyway}>
                                {t("collision.addAnyway")}
                            </Button>
                            <Button color="secondary" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                                {t("collision.backToEdit")}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
