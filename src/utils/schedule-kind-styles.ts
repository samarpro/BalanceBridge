import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";

/** Saturated block styles for timeline / calendar (high contrast between kinds). */
export function scheduleEntryBlockClass(entry: Pick<ScheduleEntry, "completed" | "kind">): string {
    if (entry.completed) {
        return "bg-[#4F9A72] text-white ring-2 ring-[#2F5E46]/30 shadow-md dark:bg-[#90C9A5] dark:text-[#173624]";
    }
    switch (entry.kind) {
        case "shift":
            return "bg-[#C47A5A] text-white ring-2 ring-[#7A4A36]/35 shadow-md dark:bg-[#E8B4A0] dark:text-[#4A2E22]";
        case "exam":
            return "bg-[#8F86C4] text-white ring-2 ring-[#554C7E]/35 shadow-md dark:bg-[#C9C2E8] dark:text-[#403962]";
        case "study":
            return "bg-[#A78FD6] text-white ring-2 ring-[#6E58A0]/30 shadow-md dark:bg-[#D4C9EF] dark:text-[#4D456F]";
    }
}

export function scheduleKindDotClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "inline-block size-1.5 rounded-full bg-[#C47A5A] ring-1 ring-[#7A4A36]/25 dark:bg-[#E8B4A0]";
        case "exam":
            return "inline-block size-1.5 rounded-sm bg-[#8F86C4] ring-1 ring-[#554C7E]/25 dark:bg-[#C9C2E8]";
        case "study":
            return "inline-block size-1.5 rounded-full bg-[#A78FD6] ring-1 ring-[#6E58A0]/20 dark:bg-[#D4C9EF]";
    }
}

export function scheduleKindLegendSwatchClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "size-2 shrink-0 rounded-full bg-[#C47A5A] ring-1 ring-secondary dark:bg-[#E8B4A0]";
        case "exam":
            return "size-2 shrink-0 rounded-sm bg-[#8F86C4] ring-1 ring-secondary dark:bg-[#C9C2E8]";
        case "study":
            return "size-2 shrink-0 rounded-full bg-[#A78FD6] ring-1 ring-secondary dark:bg-[#D4C9EF]";
    }
}

export function scheduleKindPillClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "bg-[#C47A5A] text-white ring-1 ring-[#7A4A36]/30 dark:bg-[#E8B4A0] dark:text-[#4A2E22]";
        case "exam":
            return "bg-[#8F86C4] text-white ring-1 ring-[#554C7E]/30 dark:bg-[#C9C2E8] dark:text-[#403962]";
        case "study":
            return "bg-[#A78FD6] text-white ring-1 ring-[#6E58A0]/25 dark:bg-[#D4C9EF] dark:text-[#4D456F]";
    }
}
