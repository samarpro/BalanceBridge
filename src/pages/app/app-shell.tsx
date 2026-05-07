import type { TabRenderProps } from "react-aria-components";
import { useState } from "react";
import { BarChartSquare02, Calendar as CalendarIcon, HeartRounded, Users01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { ThemeToggle } from "@/components/balance-bridge/theme-toggle";
import { t } from "@/i18n/strings";
import { DashboardPanel } from "@/pages/app/dashboard-panel";
import { CalendarPanel } from "@/pages/app/calendar-panel";
import { WellbeingPanel } from "@/pages/app/wellbeing-panel";
import { EventsPanel } from "@/pages/app/events-panel";
import { cx } from "@/utils/cx";

function glassNavTabClass({ isSelected, isFocusVisible, isHovered }: TabRenderProps) {
    return cx(
        "relative rounded-full px-4 py-2.5 font-semibold transition-[background-color,color,box-shadow] duration-200 ease-out max-md:min-h-11 max-md:flex-1 max-md:px-3",
        !isSelected && "text-tertiary hover:text-secondary",
        !isSelected && isHovered && "bg-white/15 dark:bg-white/10",
        // Selected: flush inside the rail — no vertical pop (avoids awkward overlap with content)
        isSelected &&
            "bg-primary_alt text-brand-secondary shadow-[inset_0_1px_2px_rgba(255,255,255,0.55)] ring-1 ring-brand-secondary/30 ring-inset dark:bg-white/[0.09] dark:text-brand-secondary dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] dark:ring-brand-secondary/40",
        isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
    );
}

function AppTabs() {
    const [tab, setTab] = useState("dashboard");

    return (
        <Tabs selectedKey={tab} onSelectionChange={(k) => k != null && setTab(String(k))} className="flex min-h-dvh flex-col bg-primary">
            <header className="sticky top-0 z-30 border-b border-white/25 bg-primary/55 pb-3 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/35 dark:shadow-[0_14px_48px_-18px_rgba(0,0,0,0.55)] supports-[backdrop-filter]:bg-primary/45 supports-[backdrop-filter]:dark:bg-black/30">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-4 md:flex-row md:items-center md:justify-between md:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary drop-shadow-sm">{t("app.name")}</p>
                        <p className="text-sm text-secondary/90 dark:text-tertiary">{t("app.tagline")}</p>
                    </div>
                    <div className="rounded-xl border border-white/30 bg-white/15 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Glass pill rail — tabs stay flush (no vertical offset) */}
                <div className="mx-auto mt-2 max-w-6xl px-4 md:mt-3 md:px-8">
                    <div className="rounded-full border border-white/30 bg-gradient-to-b from-white/25 to-white/10 p-1.5 shadow-[inset_0_2px_6px_rgba(255,255,255,0.45),inset_0_-1px_2px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:from-white/[0.14] dark:to-white/[0.04] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.06),inset_0_-1px_2px_rgba(0,0,0,0.35)]">
                        <Tabs.List
                            type="button-brand"
                            size="md"
                            fullWidth
                            className="gap-1 rounded-full bg-transparent p-0 shadow-none ring-0 [--tw-shadow:0_0_#0000]"
                        >
                            <Tabs.Item id="dashboard" icon={BarChartSquare02} aria-label={t("app.tab.dashboard")} className={glassNavTabClass}>
                                <span className="hidden md:inline">{t("app.tab.dashboard")}</span>
                            </Tabs.Item>
                            <Tabs.Item id="calendar" icon={CalendarIcon} aria-label={t("app.tab.calendar")} className={glassNavTabClass}>
                                <span className="hidden md:inline">{t("app.tab.calendar")}</span>
                            </Tabs.Item>
                            <Tabs.Item id="wellbeing" icon={HeartRounded} aria-label={t("app.tab.wellbeing")} className={glassNavTabClass}>
                                <span className="hidden md:inline">{t("app.tab.wellbeing")}</span>
                            </Tabs.Item>
                            <Tabs.Item id="events" icon={Users01} aria-label={t("app.tab.events")} className={glassNavTabClass}>
                                <span className="hidden md:inline">{t("app.tab.events")}</span>
                            </Tabs.Item>
                        </Tabs.List>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
                <Tabs.Panel id="dashboard" className="outline-hidden">
                    <DashboardPanel onOpenTab={(id) => setTab(id)} />
                </Tabs.Panel>
                <Tabs.Panel id="calendar" className="outline-hidden">
                    <CalendarPanel />
                </Tabs.Panel>
                <Tabs.Panel id="wellbeing" className="outline-hidden">
                    <WellbeingPanel />
                </Tabs.Panel>
                <Tabs.Panel id="events" className="outline-hidden">
                    <EventsPanel />
                </Tabs.Panel>
            </main>
        </Tabs>
    );
}

export function AppShell() {
    return (
        <AppTabs />
    );
}
