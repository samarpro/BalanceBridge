import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChartSquare02, Calendar as CalendarIcon, HeartRounded, Menu02, User01, Users01, X as CloseIcon } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { LimitsSetupModal } from "@/components/kira/limits-setup-modal";
import { QuickAddFab } from "@/components/kira/quick-add-fab";
import { ThemeToggle } from "@/components/kira/theme-toggle";
import { FocusModeControl } from "@/components/kira/focus-mode-overlay";
import { RevampProgressBar } from "@/components/kira/revamp-progress-bar";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useKiraStore } from "@/stores/kira-store";
import { fortnightShiftMinutes } from "@/utils/schedule-aggregates";
import { APP_VERSION } from "@/lib/app-version";
import { t, tReplace } from "@/i18n/strings";
import { DashboardPanel } from "@/pages/app/dashboard-panel";
import { CalendarPanel } from "@/pages/app/calendar-panel";
import { WellbeingPanel } from "@/pages/app/wellbeing-panel";
import { EventsPanel } from "@/pages/app/events-panel";
import { ProfilePanel } from "@/pages/app/profile-panel";
import { cx } from "@/utils/cx";

const SIDEBAR_EXPANDED_KEY = "kira.sidebar-expanded";

const navItems = [
    { id: "dashboard" as const, icon: BarChartSquare02, labelKey: "app.nav.dashboard" as const },
    { id: "calendar" as const, icon: CalendarIcon, labelKey: "app.nav.schedule" as const },
    { id: "events" as const, icon: Users01, labelKey: "app.nav.explore" as const },
    { id: "wellbeing" as const, icon: HeartRounded, labelKey: "app.nav.wellbeing" as const },
    { id: "profile" as const, icon: User01, labelKey: "app.nav.profile" as const },
];

type AppTabId = (typeof navItems)[number]["id"];

/** Selected rail tint — text/icon emphasis (sliding pill uses neutral fill). */
function revampNavSelectedText(id: AppTabId): string {
    switch (id) {
        case "dashboard":
            return "text-[var(--kira-revamp-accent-work-dark)]";
        case "calendar":
            return "text-[var(--kira-revamp-accent-study-dark)]";
        case "events":
            return "text-[var(--kira-revamp-accent-study-dark)]";
        case "wellbeing":
            return "text-[var(--kira-revamp-text-primary)]";
        case "profile":
            return "text-[var(--kira-revamp-text-primary)]";
    }
}

function revampNavSelectedPill(id: AppTabId): string {
    switch (id) {
        case "dashboard":
            return "bg-[linear-gradient(135deg,rgba(226,157,126,0.62),rgba(240,214,152,0.56))] shadow-[inset_0_0_0_1px_rgba(188,99,66,0.28)] dark:bg-[linear-gradient(135deg,rgba(107,61,47,0.98),rgba(138,90,40,0.96))] dark:shadow-[inset_0_0_0_1px_rgba(240,178,154,0.22)]";
        case "calendar":
            return "bg-[linear-gradient(135deg,rgba(185,175,230,0.66),rgba(210,190,236,0.58))] shadow-[inset_0_0_0_1px_rgba(125,114,191,0.24)] dark:bg-[linear-gradient(135deg,rgba(89,79,135,0.98),rgba(108,90,154,0.96))] dark:shadow-[inset_0_0_0_1px_rgba(195,182,240,0.22)]";
        case "events":
            return "bg-[linear-gradient(135deg,rgba(199,184,235,0.68),rgba(168,209,179,0.42))] shadow-[inset_0_0_0_1px_rgba(108,90,154,0.22)] dark:bg-[linear-gradient(135deg,rgba(108,90,154,0.98),rgba(61,102,77,0.9))] dark:shadow-[inset_0_0_0_1px_rgba(199,184,235,0.22)]";
        case "wellbeing":
            return "bg-[linear-gradient(135deg,rgba(168,209,179,0.62),rgba(220,174,69,0.4))] shadow-[inset_0_0_0_1px_rgba(79,154,114,0.22)] dark:bg-[linear-gradient(135deg,rgba(61,102,77,0.98),rgba(112,84,24,0.9))] dark:shadow-[inset_0_0_0_1px_rgba(144,201,165,0.22)]";
        case "profile":
            return "bg-[linear-gradient(135deg,rgba(220,174,69,0.54),rgba(226,157,126,0.44))] shadow-[inset_0_0_0_1px_rgba(220,174,69,0.22)] dark:bg-[linear-gradient(135deg,rgba(112,84,24,0.98),rgba(107,61,47,0.92))] dark:shadow-[inset_0_0_0_1px_rgba(223,178,75,0.22)]";
    }
}

function revampNavIdleClass(): string {
    return "text-[var(--kira-revamp-text-primary)] hover:bg-[color-mix(in_srgb,var(--kira-revamp-bg-card)_78%,white)] dark:hover:bg-[color-mix(in_srgb,var(--kira-revamp-bg-card)_88%,white_4%)]";
}

function initialsFromName(name: string): string {
    const p = name.trim().split(/\s+/).filter(Boolean);
    if (p.length === 0) return "?";
    if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
    return `${p[0]!.charAt(0)}${p[1]!.charAt(0)}`.toUpperCase();
}

function readIsMdUp(): boolean {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
}

function SidebarFortnightCard() {
    const entries = useKiraStore((s) => s.entries);
    const cap = useKiraStore((s) => s.fortnightWorkLimitHours);
    const refDay = useMemo(() => new Date(), []);
    const minutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const hours = minutes / 60;
    const maxH = Math.max(cap, 1);
    const headsUp = maxH - hours <= 16 && maxH - hours > 0;

    return (
        <div className="kira-revamp-card space-y-2 bg-[linear-gradient(180deg,rgba(226,157,126,0.42),rgba(240,214,152,0.32))] p-3 dark:bg-[linear-gradient(180deg,rgba(107,61,47,0.76),rgba(138,90,40,0.78))]">
            <p className="kira-revamp-section-label">{t("dashboard.revamp.sidebarFortnight")}</p>
            <p className="text-lg font-bold tabular-nums text-[var(--kira-revamp-text-primary)]">
                {hours.toFixed(1)} / {cap} h
            </p>
            <RevampProgressBar value={hours} max={maxH} />
            {headsUp ? <p className="text-xs font-medium text-[var(--kira-revamp-accent-work-dark)]">{t("dashboard.revamp.sidebarHeadsUp")}</p> : null}
        </div>
    );
}

function AppSidebarNav({
    tab,
    labelsVisible,
    onSelect,
    afterSelect,
    navId,
    pillLayoutId,
    direction = "vertical",
    showTooltips = !labelsVisible,
}: {
    tab: AppTabId;
    labelsVisible: boolean;
    onSelect: (id: AppTabId) => void;
    afterSelect?: () => void;
    navId: string;
    pillLayoutId: string;
    direction?: "vertical" | "horizontal";
    showTooltips?: boolean;
}) {
    const hitArea = (id: AppTabId, Icon: (typeof navItems)[number]["icon"], labelKey: (typeof navItems)[number]["labelKey"]) => {
        const selected = tab === id;
        const label = t(labelKey);
        const isBottomDock = direction === "horizontal";
        const shell = cx(
            "relative z-0 flex w-full min-h-11 items-center text-left text-sm font-medium outline-hidden transition-[color] duration-150 ease-out",
            labelsVisible ? "gap-3 rounded-xl px-3 py-2.5" : isBottomDock ? "justify-center rounded-full px-0 py-3" : "justify-center rounded-xl px-0 py-2.5",
            !selected && revampNavIdleClass(),
            selected && `font-semibold ${revampNavSelectedText(id)}`,
        );
        const inner = (
            <>
                {selected ? (
                    <motion.div
                        layoutId={pillLayoutId}
                        className={cx("absolute inset-0 z-0", isBottomDock ? "rounded-full" : "rounded-xl", revampNavSelectedPill(id))}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                ) : null}
                <span className={cx("relative z-10 flex min-w-0 items-center", labelsVisible ? "gap-3" : "justify-center")}>
                    <Icon data-icon aria-hidden className="size-5 shrink-0" />
                    <AnimatePresence initial={false}>
                        {labelsVisible ? (
                            <motion.span
                                key={`${id}-label`}
                                className="truncate"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                            >
                                {label}
                            </motion.span>
                        ) : null}
                    </AnimatePresence>
                </span>
            </>
        );

        if (labelsVisible) {
            return (
                <button
                    type="button"
                    aria-current={selected ? "page" : undefined}
                    onClick={() => {
                        onSelect(id);
                        afterSelect?.();
                    }}
                    className={shell}
                >
                    {inner}
                </button>
            );
        }

        if (!showTooltips) {
            return (
                <button
                    type="button"
                    aria-current={selected ? "page" : undefined}
                    aria-label={label}
                    onClick={() => {
                        onSelect(id);
                        afterSelect?.();
                    }}
                    className={shell}
                >
                    {inner}
                </button>
            );
        }

        return (
            <Tooltip title={label} placement="right">
                <TooltipTrigger
                    aria-current={selected ? "page" : undefined}
                    aria-label={label}
                    onPress={() => {
                        onSelect(id);
                        afterSelect?.();
                    }}
                    className={cx(shell, "flex w-full cursor-pointer")}
                >
                    {inner}
                </TooltipTrigger>
            </Tooltip>
        );
    };

    return (
        <nav id={navId} className={cx(direction === "horizontal" ? "grid grid-cols-5 gap-1" : "flex flex-col gap-1.5")} aria-label={t("app.menuTitle")}>
            {navItems.map(({ id, icon: Icon, labelKey }) => (
                <Fragment key={id}>{hitArea(id, Icon, labelKey)}</Fragment>
            ))}
        </nav>
    );
}

function SidebarFooter() {
    return (
        <div className="mt-auto flex flex-col gap-3 border-t border-[var(--kira-revamp-border)] p-3">
            <SidebarFortnightCard />
            <div className="kira-revamp-card space-y-2 bg-[linear-gradient(180deg,rgba(199,184,235,0.46),rgba(168,209,179,0.22))] p-3 dark:bg-[linear-gradient(180deg,rgba(108,90,154,0.7),rgba(61,102,77,0.72))]">
                <p className="kira-revamp-section-label">{t("dashboard.revamp.language")}</p>
                <p className="text-sm font-medium text-[var(--kira-revamp-text-secondary)]">{t("dashboard.revamp.langEn")}</p>
            </div>
            <p className="text-center text-[10px] text-[var(--kira-revamp-text-muted)]">{tReplace("profile.revamp.version", { version: APP_VERSION })}</p>
        </div>
    );
}

function AppContent() {
    const [tab, setTab] = useState<AppTabId>("dashboard");
    const [isMdUp, setIsMdUp] = useState(readIsMdUp);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const displayName = useKiraStore((s) => s.userProfile.displayName);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const fn = () => setIsMdUp(mq.matches);
        mq.addEventListener("change", fn);
        return () => mq.removeEventListener("change", fn);
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
        if (raw === "1") {
            setSidebarExpanded(true);
            return;
        }
        if (raw === "0") {
            setSidebarExpanded(false);
            return;
        }
        setSidebarExpanded(window.matchMedia("(min-width: 1024px)").matches);
    }, []);

    const persistSidebar = useCallback((next: boolean) => {
        localStorage.setItem(SIDEBAR_EXPANDED_KEY, next ? "1" : "0");
        setSidebarExpanded(next);
    }, []);

    const toggleSidebar = useCallback(() => {
        persistSidebar(!sidebarExpanded);
    }, [persistSidebar, sidebarExpanded]);

    const labelsInRail = isMdUp && sidebarExpanded;

    const sidebarToggleLabel = sidebarExpanded ? t("aria.collapseAppSidebar") : t("aria.expandAppSidebar");
    const activePanel = (() => {
        if (tab === "dashboard") return <DashboardPanel onOpenTab={(id) => setTab(id as AppTabId)} />;
        if (tab === "calendar") return <CalendarPanel />;
        if (tab === "wellbeing") return <WellbeingPanel />;
        if (tab === "events") return <EventsPanel />;
        return <ProfilePanel />;
    })();

    return (
        <div className="flex min-h-dvh flex-col overflow-x-clip bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-primary)]">
            <header className="kira-app-header fixed top-0 right-0 left-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b border-[var(--kira-revamp-border)] bg-[linear-gradient(90deg,rgba(247,220,208,0.9),rgba(240,214,152,0.52),rgba(199,184,235,0.44))] px-5 shadow-[0_12px_30px_rgba(120,100,80,0.1)] backdrop-blur-xl md:gap-6 md:px-8 lg:px-10 dark:bg-[linear-gradient(90deg,rgba(31,25,22,0.96),rgba(107,61,47,0.32),rgba(89,79,135,0.3))] dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                <button
                    type="button"
                    onClick={() => setTab("dashboard")}
                    className="kira-revamp-focusable shrink-0 rounded-xl px-3 py-1.5 text-lg font-semibold tracking-tight text-[var(--kira-revamp-text-primary)] transition duration-100 ease-linear hover:bg-[linear-gradient(135deg,rgba(226,157,126,0.4),rgba(185,175,230,0.34))]"
                >
                    {t("app.name")}
                </button>
                <div className="min-w-0 flex-1" aria-hidden />
                <div className="flex shrink-0 items-center gap-3 md:gap-4">
                    <FocusModeControl />
                    <ThemeToggle />
                    <button
                        type="button"
                        aria-label={t("app.nav.profile")}
                        onClick={() => setTab("profile")}
                        className="kira-revamp-focusable shrink-0 rounded-full transition-transform duration-150 ease-out hover:scale-105"
                    >
                        <Avatar size="sm" initials={initialsFromName(displayName)} alt="" />
                    </button>
                </div>
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-row pt-16">
                {/* md+: fixed left rail — does not scroll with main */}
                <motion.aside
                    aria-label={t("app.menuTitle")}
                    className={cx(
                        "fixed top-16 bottom-0 left-0 z-[30] hidden min-h-0 flex-col overflow-hidden border-r border-[var(--kira-revamp-border)] bg-[linear-gradient(180deg,rgba(247,220,208,0.58),rgba(240,214,152,0.18),rgba(199,184,235,0.18))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] md:flex dark:bg-[linear-gradient(180deg,rgba(36,29,26,0.98),rgba(107,61,47,0.18),rgba(89,79,135,0.16))]",
                    )}
                    initial={false}
                    animate={{ width: sidebarExpanded ? 220 : 56 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex shrink-0 flex-col gap-1 border-b border-[var(--kira-revamp-border)] p-2">
                        <button
                            type="button"
                            aria-expanded={sidebarExpanded}
                            aria-controls="kira-app-sidebar-nav-desktop"
                            aria-label={sidebarToggleLabel}
                            onClick={toggleSidebar}
                            className="kira-revamp-focusable flex size-11 items-center justify-center self-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)] text-[var(--kira-revamp-text-primary)] shadow-sm transition duration-150 hover:shadow-[var(--kira-revamp-shadow-card)] md:self-start md:px-0"
                        >
                            {sidebarExpanded ? (
                                <CloseIcon data-icon aria-hidden className="size-5" />
                            ) : (
                                <Menu02 data-icon aria-hidden className="size-5" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {sidebarExpanded ? (
                                <motion.p
                                    key="desktop-sidebar-title"
                                    className="hidden px-1 pt-1 md:block"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.16, ease: "easeOut" }}
                                >
                                    <span className="kira-revamp-section-label">{t("app.menuTitle")}</span>
                                </motion.p>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2 md:p-3">
                        <AppSidebarNav
                            navId="kira-app-sidebar-nav-desktop"
                            pillLayoutId="kira-nav-pill-desktop"
                            tab={tab}
                            labelsVisible={labelsInRail}
                            onSelect={setTab}
                        />
                    </div>

                    <AnimatePresence initial={false}>
                        {sidebarExpanded ? (
                            <motion.div
                                key="desktop-sidebar-footer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                <SidebarFooter />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </motion.aside>

                {!isMdUp ? (
                    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[38] flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] md:hidden">
                        <div className="pointer-events-auto w-full max-w-sm rounded-full border border-[var(--kira-revamp-border)] bg-[linear-gradient(180deg,rgba(247,220,208,0.84),rgba(240,214,152,0.48),rgba(199,184,235,0.38))] p-1.5 shadow-[var(--kira-revamp-shadow-bottom-nav)] backdrop-blur-xl dark:bg-[linear-gradient(180deg,rgba(36,29,26,0.96),rgba(107,61,47,0.36),rgba(89,79,135,0.3))]">
                            <AppSidebarNav
                                navId="kira-app-sidebar-nav-mobile-dock"
                                pillLayoutId="kira-nav-pill-mobile-dock"
                                tab={tab}
                                labelsVisible={false}
                                onSelect={setTab}
                                direction="horizontal"
                                showTooltips={false}
                            />
                        </div>
                    </div>
                ) : null}

                <div
                    className={cx(
                        "flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-200 ease-out md:min-w-0",
                        sidebarExpanded ? "md:pl-[var(--kira-revamp-sidebar-w)]" : "md:pl-14",
                    )}
                >
                    <main className="kira-app-revamp-main kira-text-flow mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto overscroll-y-contain px-3 py-4 md:px-8 md:py-8 md:pl-8">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={tab}
                                className="flex min-h-0 flex-1 flex-col"
                                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {activePanel}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

function AppShellBody() {
    const limitsConfigured = useKiraStore((s) => s.userProfile.limitsConfigured);
    const limitsEditorOpen = useKiraStore((s) => s.limitsEditorOpen);

    return (
        <div className="kira-app-revamp">
            <AppContent />
            <QuickAddFab fabClassName="right-4 bottom-[calc(var(--kira-revamp-bottom-nav-h)+1rem+env(safe-area-inset-bottom,0px))] md:right-6 md:bottom-6" />
            <LimitsSetupModal isOpen={!limitsConfigured || limitsEditorOpen} isRequired={!limitsConfigured} onOpenChange={() => undefined} />
        </div>
    );
}

export function AppShell() {
    return <AppShellBody />;
}
