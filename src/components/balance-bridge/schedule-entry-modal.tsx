import { useEffect, useMemo, useState } from "react";
import { Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { RadioButton } from "@/components/base/radio-buttons/radio-buttons";
import { RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import type { ScheduleEntry, ScheduleKind } from "@/components/balance-bridge/calendar-month";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useBalanceBridgeStore } from "@/stores/balance-bridge-store";
import { formatMinutesForTimeInput, parseOptionalTimeToMinutes } from "@/utils/schedule-form";
import { defaultTimeRange, getEntryTimeRange, isoFromDate } from "@/utils/schedule-time";
import { cx } from "@/utils/cx";
import { t } from "@/i18n/strings";

interface ScheduleEntryEditModalProps {
    entry: ScheduleEntry | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ScheduleEntryEditModal({ entry, isOpen, onOpenChange }: ScheduleEntryEditModalProps) {
    const updateEntry = useBalanceBridgeStore((s) => s.updateEntry);
    const removeEntry = useBalanceBridgeStore((s) => s.removeEntry);

    const [title, setTitle] = useState("");
    const [isoDate, setIsoDate] = useState("");
    const [kind, setKind] = useState<ScheduleKind>("study");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [completed, setCompleted] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("120");
    const [deadlineIso, setDeadlineIso] = useState("");

    useEffect(() => {
        if (!entry || !isOpen) return;
        setTitle(entry.title);
        setIsoDate(entry.isoDate);
        setDeadlineIso(entry.deadlineIso ?? "");
        setKind(entry.kind);
        setPriority(entry.priority);
        setCompleted(!!entry.completed);
        const range = getEntryTimeRange(entry);
        setStartTime(formatMinutesForTimeInput(range.start));
        const dur = range.end - range.start;
        setDurationMinutes(String(Math.max(15, dur)));
    }, [entry, isOpen]);

    const durationOptions = useMemo(
        () =>
            (
                [
                    ["30", "calendar.duration.30"],
                    ["60", "calendar.duration.60"],
                    ["120", "calendar.duration.120"],
                    ["180", "calendar.duration.180"],
                    ["240", "calendar.duration.240"],
                    ["480", "calendar.duration.480"],
                ] as const
            ).map(([value, labelKey]) => ({ value, label: t(labelKey) })),
        [],
    );

    const handleSave = () => {
        if (!entry) return;
        const dm = Number.parseInt(durationMinutes, 10);
        const parsedStart = parseOptionalTimeToMinutes(startTime);
        updateEntry(entry.id, {
            title: title.trim() || "Untitled",
            isoDate,
            deadlineIso: deadlineIso.trim() ? deadlineIso.trim() : undefined,
            kind,
            priority,
            completed,
            startMinutes: parsedStart ?? defaultTimeRange(kind).start,
            durationMinutes: Number.isFinite(dm) ? dm : undefined,
        });
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (!entry) return;
        removeEntry(entry.id);
        onOpenChange(false);
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="z-[60]">
            <Modal className={cx("max-h-[min(90vh,720px)] w-full overflow-y-auto rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-secondary sm:max-w-lg")}>
                <Dialog aria-label={t("calendar.editModal.title")} className="outline-hidden">
                    <div className="w-full">
                        <h2 className="text-md font-semibold text-secondary">{t("calendar.editModal.title")}</h2>

                        <div className="mt-5 space-y-4">
                            <Checkbox isSelected={completed} onChange={setCompleted} label={t("calendar.editModal.completed")} />

                            <Input label={t("calendar.modal.nameLabel")} value={title} onChange={setTitle} />

                            <Input label={t("calendar.modal.dateLabel")} type="date" value={isoDate} onChange={setIsoDate} />

                            <Input
                                label={t("calendar.modal.deadlineOptional")}
                                type="date"
                                value={deadlineIso}
                                onChange={setDeadlineIso}
                                hint={t("calendar.modal.deadlineHint")}
                            />

                            <Input label={t("calendar.modal.startOptional")} type="time" value={startTime} onChange={setStartTime} hint={t("calendar.modal.startHint")} />

                            <NativeSelect
                                label={t("calendar.modal.duration")}
                                options={durationOptions}
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                            />

                            <div>
                                <p className="mb-2 text-sm font-medium text-secondary">{t("calendar.modal.typeLabel")}</p>
                                <RadioGroup value={kind} onChange={(v) => setKind(v as ScheduleKind)} className="gap-3">
                                    <RadioButton value="shift" label={t("calendar.modal.type.shift")} />
                                    <RadioButton value="exam" label={t("calendar.modal.type.exam")} />
                                    <RadioButton value="study" label={t("calendar.modal.type.study")} />
                                </RadioGroup>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-secondary">{t("calendar.modal.priorityLabel")}</p>
                                <RadioGroup value={priority} onChange={(v) => setPriority(v as typeof priority)} className="gap-3">
                                    <RadioButton value="low" label={t("calendar.priority.low")} />
                                    <RadioButton value="medium" label={t("calendar.priority.medium")} />
                                    <RadioButton value="high" label={t("calendar.priority.high")} />
                                </RadioGroup>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button color="primary" size="lg" onClick={handleSave}>
                                    {t("calendar.editModal.save")}
                                </Button>
                                <Button color="secondary" size="lg" onClick={() => onOpenChange(false)}>
                                    {t("calendar.cancel")}
                                </Button>
                                <Button color="secondary-destructive" size="lg" iconLeading={Trash01} className="ml-auto" onClick={handleDelete}>
                                    {t("calendar.editModal.delete")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

interface ScheduleEntryCreateDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /** Seed title from quick-add field */
    initialTitle: string;
    onSaved: () => void;
}

export function ScheduleEntryCreateDetailsModal({ isOpen, onOpenChange, initialTitle, onSaved }: ScheduleEntryCreateDetailsModalProps) {
    const addEntry = useBalanceBridgeStore((s) => s.addEntry);

    const [title, setTitle] = useState("");
    const [isoDate, setIsoDate] = useState(() => isoFromDate(new Date()));
    const [kind, setKind] = useState<ScheduleKind>("study");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [startTime, setStartTime] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("120");
    const [deadlineIso, setDeadlineIso] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setTitle(initialTitle.trim());
        setIsoDate(isoFromDate(new Date()));
        setDeadlineIso("");
        setKind("study");
        setPriority("medium");
        setStartTime("");
        setDurationMinutes("120");
    }, [isOpen, initialTitle]);

    const durationOptions = useMemo(
        () =>
            (
                [
                    ["30", "calendar.duration.30"],
                    ["60", "calendar.duration.60"],
                    ["120", "calendar.duration.120"],
                    ["180", "calendar.duration.180"],
                    ["240", "calendar.duration.240"],
                    ["480", "calendar.duration.480"],
                ] as const
            ).map(([value, labelKey]) => ({ value, label: t(labelKey) })),
        [],
    );

    const handleSave = () => {
        const dm = Number.parseInt(durationMinutes, 10);
        addEntry({
            isoDate,
            deadlineIso: deadlineIso.trim() ? deadlineIso.trim() : undefined,
            title: title.trim() || "Untitled",
            kind,
            priority,
            completed: false,
            startMinutes: parseOptionalTimeToMinutes(startTime),
            durationMinutes: Number.isFinite(dm) ? dm : undefined,
        });
        onSaved();
        onOpenChange(false);
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="z-[60]">
            <Modal className={cx("max-h-[min(90vh,720px)] w-full overflow-y-auto rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-secondary sm:max-w-lg")}>
                <Dialog aria-label={t("calendar.detailsModal.title")} className="outline-hidden">
                    <div className="w-full">
                        <h2 className="text-md font-semibold text-secondary">{t("calendar.detailsModal.title")}</h2>
                        <p className="mt-1 text-sm text-tertiary">{t("calendar.detailsModal.subtitle")}</p>

                        <div className="mt-5 space-y-4">
                            <Input label={t("calendar.modal.nameLabel")} value={title} onChange={setTitle} />

                            <Input label={t("calendar.modal.dateLabel")} type="date" value={isoDate} onChange={setIsoDate} />

                            <Input
                                label={t("calendar.modal.deadlineOptional")}
                                type="date"
                                value={deadlineIso}
                                onChange={setDeadlineIso}
                                hint={t("calendar.modal.deadlineHint")}
                            />

                            <Input label={t("calendar.modal.startOptional")} type="time" value={startTime} onChange={setStartTime} hint={t("calendar.modal.startHint")} />

                            <NativeSelect
                                label={t("calendar.modal.duration")}
                                options={durationOptions}
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                            />

                            <div>
                                <p className="mb-2 text-sm font-medium text-secondary">{t("calendar.modal.typeLabel")}</p>
                                <RadioGroup value={kind} onChange={(v) => setKind(v as ScheduleKind)} className="gap-3">
                                    <RadioButton value="shift" label={t("calendar.modal.type.shift")} />
                                    <RadioButton value="exam" label={t("calendar.modal.type.exam")} />
                                    <RadioButton value="study" label={t("calendar.modal.type.study")} />
                                </RadioGroup>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-secondary">{t("calendar.modal.priorityLabel")}</p>
                                <RadioGroup value={priority} onChange={(v) => setPriority(v as typeof priority)} className="gap-3">
                                    <RadioButton value="low" label={t("calendar.priority.low")} />
                                    <RadioButton value="medium" label={t("calendar.priority.medium")} />
                                    <RadioButton value="high" label={t("calendar.priority.high")} />
                                </RadioGroup>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button color="primary" size="lg" onClick={handleSave}>
                                    {t("calendar.save")}
                                </Button>
                                <Button color="secondary" size="lg" onClick={() => onOpenChange(false)}>
                                    {t("calendar.cancel")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
