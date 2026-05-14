import { useState } from "react";
import { Calendar as CalendarIcon, Tag01, Users01 } from "@untitledui/icons";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButton } from "@/components/base/radio-buttons/radio-buttons";
import { RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { HoverHint } from "@/components/kira/hover-hint";
import { MOCK_EVENTS, type CampusEvent, type RsvpStatus } from "@/data/mock-events";
import { loadEventRsvpOverrides, saveEventRsvpOverrides } from "@/lib/event-rsvp-storage";
import { tf, t } from "@/i18n/strings";
import { cx } from "@/utils/cx";

function rsvpBadge(status: RsvpStatus) {
    switch (status) {
        case "going":
            return (
                <Badge type="pill-color" color="success" size="sm">
                    {t("events.going")}
                </Badge>
            );
        case "not-going":
            return (
                <Badge type="pill-color" color="error" size="sm">
                    {t("events.notGoing")}
                </Badge>
            );
        default:
            return (
                <Badge type="pill-color" color="gray" size="sm">
                    {t("events.undecided")}
                </Badge>
            );
    }
}

function mergeEventsWithStoredRsvp(source: CampusEvent[]): CampusEvent[] {
    const overrides = loadEventRsvpOverrides();
    return source.map((e) => ({ ...e, rsvp: overrides[e.id] ?? e.rsvp }));
}

function eventCoverClass(ev: CampusEvent): string {
    switch (ev.coverTone) {
        case "mint":
            return "bg-[linear-gradient(135deg,#A8D1B3_0%,#D7EEDF_45%,#F5EFE6_100%)] dark:bg-[linear-gradient(135deg,#3D664D_0%,#4F8363_52%,#2F2824_100%)]";
        case "violet":
            return "bg-[linear-gradient(135deg,#C7B8EB_0%,#B9AFE6_45%,#F5EFE6_100%)] dark:bg-[linear-gradient(135deg,#6C5A9A_0%,#594F87_52%,#2F2824_100%)]";
        case "sunset":
            return "bg-[linear-gradient(135deg,#DCAE45_0%,#E8A78D_45%,#F8E3D7_100%)] dark:bg-[linear-gradient(135deg,#9A6E16_0%,#6B3D2F_52%,#2F2824_100%)]";
    }
}

export function EventsPanel() {
    const [events, setEvents] = useState<CampusEvent[]>(() => mergeEventsWithStoredRsvp(MOCK_EVENTS));

    const updateRsvp = (id: string, rsvp: RsvpStatus) => {
        setEvents((prev) => {
            const next = prev.map((e) => (e.id === id ? { ...e, rsvp } : e));
            saveEventRsvpOverrides(Object.fromEntries(next.map((e) => [e.id, e.rsvp])));
            return next;
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-start gap-3">
                <h2 className="text-display-sm font-semibold tracking-tight text-primary">{t("events.title")}</h2>
                <HoverHint title={t("events.hintTitle")} description={t("events.subtitle")} className="mt-1.5 shrink-0" />
            </div>
            <p className="mt-3 max-w-2xl text-md leading-relaxed text-secondary">{t("events.lead")}</p>

            <ul className="grid gap-4 md:grid-cols-2">
                {events.map((ev) => (
                    <li key={ev.id}>
                        <DialogTrigger>
                            <AriaButton
                                className={cx(
                                    "flex h-full w-full flex-col rounded-3xl border border-[var(--kira-revamp-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,220,208,0.26),rgba(245,239,230,0.96))] p-4 text-left shadow-[0_14px_36px_rgba(120,100,80,0.1)] md:p-5 dark:bg-[linear-gradient(180deg,rgba(47,40,36,0.98),rgba(89,79,135,0.12),rgba(36,29,26,0.98))] dark:shadow-[0_18px_36px_rgba(0,0,0,0.28)]",
                                    "transition duration-200 ease-out",
                                    "hover:-translate-y-1 hover:border-[rgba(188,99,66,0.42)] hover:shadow-[0_20px_50px_-20px_rgba(188,99,66,0.34)] dark:hover:border-[rgba(195,182,240,0.32)] dark:hover:shadow-[0_24px_56px_-24px_rgba(125,114,191,0.36)]",
                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                                )}
                            >
                                <div className={cx("relative h-40 w-full overflow-hidden rounded-2xl", eventCoverClass(ev))}>
                                    <div
                                        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(255_255_255_/_0.72),transparent_56%),radial-gradient(circle_at_80%_78%,rgb(255_255_255_/_0.42),transparent_52%)]"
                                        aria-hidden
                                    />
                                    <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-1.5">
                                        {ev.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center rounded-full border border-white/50 bg-white/82 px-2 py-1 text-[11px] font-semibold tracking-wide text-[#2C2420] backdrop-blur dark:border-white/15 dark:bg-[rgba(31,25,22,0.42)] dark:text-white"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-start justify-between gap-2">
                                    <p className="text-lg font-bold leading-tight text-primary">{ev.title}</p>
                                    {rsvpBadge(ev.rsvp)}
                                </div>

                                <p className="mt-2 text-sm text-secondary">{ev.topic}</p>

                                <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    <div className="flex items-center gap-1.5 rounded-lg bg-[rgba(232,180,160,0.18)] px-2.5 py-2 dark:bg-[rgba(90,55,43,0.46)]">
                                        <CalendarIcon data-icon aria-hidden className="size-4 text-[var(--kira-revamp-accent-work-dark)]" />
                                        <dt className="sr-only">{t("events.type")}</dt>
                                        <dd className="font-medium text-secondary">{ev.when}</dd>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-[rgba(201,194,232,0.22)] px-2.5 py-2 dark:bg-[rgba(79,72,111,0.52)]">
                                        <Tag01 data-icon aria-hidden className="size-4 text-[var(--kira-revamp-accent-study-dark)]" />
                                        <dt className="sr-only">{t("events.type")}</dt>
                                        <dd className="font-medium text-secondary">{ev.typeLabel}</dd>
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-lg bg-[rgba(188,217,196,0.24)] px-2.5 py-2 dark:bg-[rgba(54,82,66,0.5)] sm:col-span-2">
                                        <Users01 data-icon aria-hidden className="size-4 text-[var(--kira-revamp-accent-success)]" />
                                        <dt className="sr-only">{t("events.headcount")}</dt>
                                        <dd className="font-medium text-secondary">{tf("events.peopleGoing", { count: ev.goingCount })}</dd>
                                    </div>
                                </dl>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {ev.tags.map((tag) => (
                                        <span
                                            key={`${ev.id}-${tag}`}
                                            className="inline-flex items-center rounded-full border border-[rgba(196,122,90,0.16)] bg-[rgba(245,239,230,0.95)] px-2 py-0.5 text-xs font-semibold text-[var(--kira-revamp-text-secondary)] dark:border-[rgba(201,194,232,0.16)] dark:bg-[rgba(47,40,36,0.92)]"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <span className="mt-4 text-sm font-semibold text-[var(--kira-revamp-accent-work-dark)] dark:text-[var(--kira-revamp-accent-study-dark)]">
                                    {t("events.rsvpPrompt")} →
                                </span>
                            </AriaButton>

                            <Popover
                                placement="bottom start"
                                offset={10}
                                shouldFlip
                                containerPadding={8}
                                className={({ isEntering, isExiting }) =>
                                    cx(
                                        "z-50 w-[min(100vw-2rem,22rem)] origin-(--trigger-anchor-point) rounded-xl border border-[rgba(196,122,90,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,239,230,0.98))] p-4 outline-hidden dark:border-[rgba(201,194,232,0.2)] dark:bg-[linear-gradient(180deg,rgba(47,40,36,0.98),rgba(36,29,26,0.98))]",
                                        "shadow-[0_22px_56px_-24px_rgba(196,122,90,0.32),0_10px_24px_-16px_rgba(44,36,32,0.2)]",
                                        "dark:shadow-[0_28px_72px_-26px_rgba(0,0,0,0.72),0_14px_44px_-22px_rgba(143,134,196,0.16)]",
                                        isEntering &&
                                            "duration-200 ease-out animate-in fade-in zoom-in-95 placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1",
                                        isExiting &&
                                            "duration-150 ease-in animate-out fade-out zoom-out-95 placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1",
                                    )
                                }
                            >
                                <Dialog aria-label={ev.title} className="outline-hidden">
                                    {({ close }) => (
                                        <div className="flex flex-col gap-4">
                                            <h2 className="text-display-xs font-bold text-primary">{ev.title}</h2>
                                            <p className="text-md text-secondary">{ev.when}</p>
                                            <RadioGroup
                                                value={ev.rsvp}
                                                onChange={(v) => updateRsvp(ev.id, v as RsvpStatus)}
                                                aria-label={t("events.rsvpPrompt")}
                                                className="gap-3"
                                            >
                                                <RadioButton value="going" label={t("events.going")} hint={tf("events.peopleGoing", { count: ev.goingCount })} />
                                                <RadioButton value="not-going" label={t("events.notGoing")} />
                                                <RadioButton value="undecided" label={t("events.undecided")} />
                                            </RadioGroup>
                                            <Button color="primary" className="mt-1 w-full sm:w-auto" onClick={close}>
                                                {t("events.saveRsvp")}
                                            </Button>
                                        </div>
                                    )}
                                </Dialog>
                            </Popover>
                        </DialogTrigger>
                    </li>
                ))}
            </ul>
        </div>
    );
}
