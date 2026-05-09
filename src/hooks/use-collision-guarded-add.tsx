import { useState } from "react";
import type { ScheduleEntry } from "@/components/balance-bridge/calendar-month";
import { ScheduleCollisionModal } from "@/components/balance-bridge/schedule-collision-modal";
import { useKiraStore } from "@/stores/kira-store";
import { entriesOverlappingInterval, findNextFreeSlotStart, syntheticEntryForCollision } from "@/utils/schedule-collisions";
import { getEntryTimeRange } from "@/utils/schedule-time";

type CollisionState = {
    overlaps: ScheduleEntry[];
    payload: Omit<ScheduleEntry, "id">;
    startMin: number;
    endMin: number;
    suggested: number | null;
    onSuccess?: (id: string) => void;
};

/**
 * Intercepts adds when the proposed block overlaps existing timed entries; surfaces priority-aware resolution.
 */
export function useCollisionGuardedAdd() {
    const entries = useKiraStore((s) => s.entries);
    const lifePriorityOrder = useKiraStore((s) => s.lifePriorityOrder);
    const addEntry = useKiraStore((s) => s.addEntry);

    const [collision, setCollision] = useState<CollisionState | null>(null);

    const tryAdd = (payload: Omit<ScheduleEntry, "id">, onSuccess?: (id: string) => void) => {
        const { start, end } = getEntryTimeRange(syntheticEntryForCollision(payload));
        const overlaps = entriesOverlappingInterval(entries, payload.isoDate, start, end);
        if (overlaps.length > 0) {
            const dur = end - start;
            const suggested = findNextFreeSlotStart(entries, payload.isoDate, dur, undefined, start);
            setCollision({ overlaps, payload, startMin: start, endMin: end, suggested, onSuccess });
            return;
        }
        const id = addEntry(payload);
        onSuccess?.(id);
        setCollision(null);
    };

    const finish = (payload: Omit<ScheduleEntry, "id">) => {
        const id = addEntry(payload);
        collision?.onSuccess?.(id);
        setCollision(null);
    };

    const modal =
        collision != null ? (
            <ScheduleCollisionModal
                isOpen
                onOpenChange={(open) => {
                    if (!open) setCollision(null);
                }}
                overlaps={collision.overlaps}
                proposedTitle={collision.payload.title}
                proposedKind={collision.payload.kind}
                proposedStartMin={collision.startMin}
                proposedEndMin={collision.endMin}
                lifePriorityOrder={lifePriorityOrder}
                suggestedStartMin={collision.suggested}
                onContinueAnyway={() => finish(collision.payload)}
                onUseSuggestedTime={(sm) => {
                    finish({ ...collision.payload, startMinutes: sm });
                }}
            />
        ) : null;

    return { tryAdd, collisionModal: modal };
}
