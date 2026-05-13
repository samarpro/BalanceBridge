import { useState } from "react";
import {
    BarChartSquare02,
    Calendar as CalendarIcon,
    HeartRounded,
    Users01,
    Menu02,
    X as CloseIcon,
    ChevronLeft,
    ChevronRight,
} from "@untitledui/icons";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { LimitsSetupModal } from "@/components/kira/limits-setup-modal";
import { QuickAddFab } from "@/components/kira/quick-add-fab";
import { HoverHint } from "@/components/kira/hover-hint";
import { ThemeToggle } from "@/components/kira/theme-toggle";
import { FocusModeControl } from "@/components/kira/focus-mode-overlay";
import { useKiraStore } from "@/stores/kira-store";
import { t } from "@/i18n/strings";
import { DashboardPanel } from "@/pages/app/dashboard-panel";
import { CalendarPanel } from "@/pages/app/calendar-panel";
import { WellbeingPanel } from "@/pages/app/wellbeing-panel";
import { EventsPanel } from "@/pages/app/events-panel";
import { cx } from "@/utils/cx";

const navItems = [
    { id: "dashboard" as const, icon: BarChartSquare02, labelKey: "app.nav.dashboard" as const },
    { id: "calendar" as const, icon: CalendarIcon, labelKey: "app.nav.calendar" as const },
    { id: "wellbeing" as const, icon: HeartRounded, labelKey: "app.nav.wellbeing" as const },
    { id: "events" as const, icon: Users01, labelKey: "app.nav.events" as const },
];

type AppTabId = (typeof navItems)[number]["id"];

const SIDEBAR_COLLAPSED_KEY = "kira-sidebar-collapsed";

function readSidebarCollapsedFromStorage(): boolean {
    if (typeof window === "undefined") return false;
    try {
        return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
    } catch {
        return false;
    }
}

function persistSidebarCollapsed(collapsed: boolean) {
    try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
        /* ignore */
    }
}

function appNavButtonClass(selected: boolean, density: "drawer" | "rail" | "rail-icon") {
    return cx(
        "w-full border shadow-xs transition duration-100 ease-linear",
        density === "drawer" && "justify-start gap-3 rounded-xl px-4 py-3.5 text-lg font-semibold",
        density === "rail" && "justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold",
        density === "rail-icon" && "justify-center rounded-xl px-0 py-2.5 data-icon-only:min-w-0",
        selected
            ? "border-brand-secondary/35 bg-brand-primary_alt text-brand-secondary ring-1 ring-brand-secondary/25 ring-inset hover:bg-brand-primary_alt hover:text-brand-secondary_hover"
            : "border-secondary_alt bg-primary hover:border-secondary hover:bg-secondary_alt",
    );
}

function AppNavLinks({
    tab,
    onSelect,
    variant,
    closeDrawer,
}: {
    tab: AppTabId;
    onSelect: (id: AppTabId) => void;
    variant: "drawer" | "rail-expanded" | "rail-collapsed";
    closeDrawer?: () => void;
}) {
    const drawer = variant === "drawer";
    const collapsed = variant === "rail-collapsed";

    return (
        <nav className="flex flex-col gap-2.5" aria-label={t("app.menuTitle")}>
            {navItems.map(({ id, icon: Icon, labelKey }) => {
                const selected = tab === id;
                const label = t(labelKey);
                const handle = () => {
                    onSelect(id);
                    closeDrawer?.();
                };

                if (drawer) {
                    return (
                        <Button
                            key={id}
                            color="secondary"
                            size="lg"
                            className={appNavButtonClass(selected, "drawer")}
                            iconLeading={<Icon data-icon aria-hidden className="size-6 shrink-0" />}
                            onClick={handle}
                            aria-current={selected ? "page" : undefined}
                        >
                            {label}
                        </Button>
                    );
                }

                if (collapsed) {
                    return (
                        <Button
                            key={id}
                            color="secondary"
                            size="md"
                            aria-label={label}
                            className={appNavButtonClass(selected, "rail-icon")}
                            iconLeading={<Icon data-icon aria-hidden className="size-5 shrink-0" />}
                            onClick={handle}
                            aria-current={selected ? "page" : undefined}
                        />
                    );
                }

                return (
                    <Button
                        key={id}
                        color="secondary"
                        size="md"
                        className={appNavButtonClass(selected, "rail")}
                        iconLeading={<Icon data-icon aria-hidden className="size-5 shrink-0" />}
                        onClick={handle}
                        aria-current={selected ? "page" : undefined}
                    >
                        {label}
                    </Button>
                );
            })}
        </nav>
    );
}

function AppContent() {
    const [tab, setTab] = useState<AppTabId>("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsedFromStorage);

    const toggleSidebarCollapsed = () => {
        setSidebarCollapsed((c) => {
            const next = !c;
            persistSidebarCollapsed(next);
            return next;
        });
    };

    return (
        <div className="flex min-h-dvh flex-row overflow-x-clip bg-primary">
            <aside
                aria-label={t("app.menuTitle")}
                className={cx(
                    "hidden shrink-0 flex-col border-r border-secondary bg-primary shadow-sm transition-[width] duration-300 ease-out lg:flex",
                    "lg:sticky lg:top-0 lg:h-dvh lg:max-h-dvh lg:self-start",
                    sidebarCollapsed ? "w-[4.5rem]" : "w-56",
                )}
            >
                <div className="h-1 shrink-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500" aria-hidden />
                <div
                    className={cx(
                        "flex min-h-[3.25rem] shrink-0 items-center border-b border-secondary px-3 py-2",
                        sidebarCollapsed && "justify-center px-2",
                    )}
                >
                    {sidebarCollapsed ? (
                        <p className="text-lg font-black tracking-tight text-brand-secondary" aria-hidden>
                            K
                        </p>
                    ) : (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase tracking-wide text-brand-secondary">{t("app.name")}</p>
                            <div className="flex min-w-0 items-center gap-1">
                                <p className="min-w-0 flex-1 truncate text-xs text-secondary">{t("app.tagline")}</p>
                                <HoverHint title={t("app.hover.tagline")} description={t("app.taglineDetail")} className="shrink-0" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-3">
                    {!sidebarCollapsed && (
                        <div className="shrink-0 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">{t("app.menuTitle")}</p>
                        </div>
                    )}
                    <AppNavLinks tab={tab} onSelect={setTab} variant={sidebarCollapsed ? "rail-collapsed" : "rail-expanded"} />
                </div>

                <div className="shrink-0 border-t border-secondary p-2">
                    <Button
                        color="secondary"
                        size="md"
                        aria-label={sidebarCollapsed ? t("aria.expandAppSidebar") : t("aria.collapseAppSidebar")}
                        className="w-full justify-center data-icon-only:rounded-xl"
                        iconLeading={
                            sidebarCollapsed ? (
                                <ChevronRight data-icon aria-hidden className="size-5 shrink-0" />
                            ) : (
                                <ChevronLeft data-icon aria-hidden className="size-5 shrink-0" />
                            )
                        }
                        onClick={toggleSidebarCollapsed}
                    />
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-4 border-b border-secondary bg-primary/95 px-5 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-primary/80 md:px-8">
                    <div className="lg:hidden">
                        <AriaDialogTrigger>
                            <AriaButton
                                aria-label={t("aria.openAppMenu")}
                                className="group relative flex shrink-0 items-center justify-center rounded-xl bg-secondary_alt p-2.5 text-fg-secondary shadow-xs ring-1 ring-secondary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <Menu02 className="size-6 transition duration-200 ease-in-out group-aria-expanded:opacity-0" aria-hidden />
                                <CloseIcon
                                    className="pointer-events-none absolute size-6 opacity-0 transition duration-200 ease-in-out group-aria-expanded:opacity-100"
                                    aria-hidden
                                />
                            </AriaButton>

                            <AriaModalOverlay
                                isDismissable
                                className={({ isEntering, isExiting }) =>
                                    cx(
                                        "fixed inset-0 z-50 cursor-pointer bg-overlay/80 backdrop-blur-[10px]",
                                        isEntering && "duration-300 ease-out animate-in fade-in",
                                        isExiting && "duration-200 ease-in animate-out fade-out",
                                    )
                                }
                            >
                                {({ state }) => (
                                    <AriaModal
                                        className={({ isEntering, isExiting }) =>
                                            cx(
                                                "fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full max-w-none cursor-auto flex-col overflow-hidden border-0 bg-primary shadow-none outline-hidden",
                                                isEntering &&
                                                    "motion-safe:duration-300 motion-safe:ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3",
                                                isExiting &&
                                                    "motion-safe:duration-200 motion-safe:ease-in motion-safe:animate-out motion-safe:fade-out motion-safe:slide-out-to-bottom-2",
                                            )
                                        }
                                    >
                                        <AriaDialog className="relative flex min-h-0 flex-1 flex-col outline-hidden focus:outline-hidden">
                                            <AriaButton
                                                aria-label={t("aria.closeAppMenu")}
                                                onPress={() => state.close()}
                                                className={cx(
                                                    "absolute z-20 flex size-11 cursor-pointer items-center justify-center rounded-xl bg-secondary_alt text-fg-secondary shadow-md ring-1 ring-secondary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                                    "right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))]",
                                                )}
                                            >
                                                <CloseIcon className="size-5 shrink-0" aria-hidden />
                                            </AriaButton>

                                            <div className="h-1 shrink-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500" aria-hidden />

                                            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-10 pt-14">
                                                <div className="space-y-2 border-b border-secondary pb-5">
                                                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">{t("app.name")}</p>
                                                    <p className="text-display-sm font-bold tracking-tight text-primary">{t("app.menuTitle")}</p>
                                                    <div className="flex flex-wrap items-end gap-1.5 text-md leading-snug text-secondary">
                                                        <p className="min-w-0 flex-1">{t("app.tagline")}</p>
                                                        <HoverHint title={t("app.hover.tagline")} description={t("app.taglineDetail")} />
                                                    </div>
                                                </div>

                                                <AppNavLinks tab={tab} onSelect={setTab} variant="drawer" closeDrawer={() => state.close()} />
                                            </div>
                                        </AriaDialog>
                                    </AriaModal>
                                )}
                            </AriaModalOverlay>
                        </AriaDialogTrigger>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold uppercase tracking-wide text-brand-secondary">{t("app.name")}</p>
                        <div className="flex min-w-0 items-center gap-1">
                            <p className="min-w-0 flex-1 truncate text-md text-secondary">{t("app.tagline")}</p>
                            <HoverHint title={t("app.hover.tagline")} description={t("app.taglineDetail")} className="shrink-0" />
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <FocusModeControl />
                        <ThemeToggle />
                    </div>
                </header>

                <main className="kira-text-flow mx-auto w-full max-w-6xl flex-1 px-5 py-6 pb-24 md:px-10 md:py-9 md:pb-10">
                    {tab === "dashboard" && <DashboardPanel onOpenTab={(id) => setTab(id as AppTabId)} />}
                    {tab === "calendar" && <CalendarPanel />}
                    {tab === "wellbeing" && <WellbeingPanel />}
                    {tab === "events" && <EventsPanel />}
                </main>
            </div>
        </div>
    );
}

function AppShellBody() {
    const limitsConfigured = useKiraStore((s) => s.userProfile.limitsConfigured);
    const limitsEditorOpen = useKiraStore((s) => s.limitsEditorOpen);

    return (
        <>
            <AppContent />
            <QuickAddFab />
            {/* Outside app chrome: RAC Tabs used to wrap this; keep modal sibling to avoid collection issues if tabs return. */}
            <LimitsSetupModal
                isOpen={!limitsConfigured || limitsEditorOpen}
                isRequired={!limitsConfigured}
                onOpenChange={() => undefined}
            />
        </>
    );
}

export function AppShell() {
    return <AppShellBody />;
}
