import { useState } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButton } from "@/components/base/radio-buttons/radio-buttons";
import { RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { MOCK_EVENTS, type CampusEvent, type RsvpStatus } from "@/data/mock-events";
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

export function EventsPanel() {
    const [events, setEvents] = useState<CampusEvent[]>(() => MOCK_EVENTS.map((e) => ({ ...e })));

    const updateRsvp = (id: string, rsvp: RsvpStatus) => {
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, rsvp } : e)));
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-semibold text-secondary">{t("events.title")}</h2>
                <p className="mt-2 max-w-2xl text-md text-tertiary">{t("events.subtitle")}</p>
            </div>

            <ul className="grid gap-4 md:grid-cols-2">
                {events.map((ev) => (
                    <li key={ev.id}>
                        <DialogTrigger>
                            <AriaButton
                                className={cx(
                                    "flex h-full w-full flex-col rounded-xl bg-primary_alt p-5 text-left ring-1 ring-secondary",
                                    "transition duration-200 ease-out",
                                    "hover:-translate-y-1 hover:shadow-[0_16px_48px_-18px_rgba(105,56,239,0.44)] hover:ring-brand-secondary/50",
                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                                    "dark:hover:shadow-[0_18px_52px_-18px_rgba(167,139,250,0.38)]",
                                )}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <p className="text-lg font-semibold text-secondary">{ev.title}</p>
                                    {rsvpBadge(ev.rsvp)}
                                </div>
                                <p className="mt-2 text-sm text-brand-secondary">{ev.when}</p>
                                <dl className="mt-4 space-y-1 text-sm">
                                    <div className="flex gap-2">
                                        <dt className="text-quaternary">{t("events.topic")}</dt>
                                        <dd className="font-medium text-secondary">{ev.topic}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="text-quaternary">{t("events.type")}</dt>
                                        <dd className="font-medium text-secondary">{ev.typeLabel}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="text-quaternary">{t("events.headcount")}</dt>
                                        <dd className="font-medium text-secondary">{tf("events.peopleGoing", { count: ev.goingCount })}</dd>
                                    </div>
                                </dl>
                                <span className="mt-4 text-sm font-semibold text-brand-secondary">{t("events.rsvpPrompt")} →</span>
                            </AriaButton>

                            <Popover
                                placement="bottom start"
                                offset={10}
                                shouldFlip
                                containerPadding={8}
                                className={({ isEntering, isExiting }) =>
                                    cx(
                                        "z-50 w-[min(100vw-2rem,22rem)] origin-(--trigger-anchor-point) rounded-xl bg-primary p-4 outline-hidden",
                                        "ring-2 ring-brand-secondary/40 dark:ring-brand-secondary/50",
                                        "shadow-[0_22px_60px_-22px_rgba(105,56,239,0.55),0_12px_36px_-18px_rgba(15,23,42,0.35)]",
                                        "dark:shadow-[0_28px_72px_-26px_rgba(0,0,0,0.72),0_14px_44px_-22px_rgba(167,139,250,0.22)]",
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
                                            <h2 className="text-lg font-semibold text-secondary">{ev.title}</h2>
                                            <p className="text-sm text-tertiary">{ev.when}</p>
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
