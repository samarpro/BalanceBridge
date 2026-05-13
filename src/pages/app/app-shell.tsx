import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
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

function revampNavIdleClass(): string {
    return "text-[var(--kira-revamp-text-primary)] hover:bg-[color-mix(in_srgb,var(--kira-revamp-bg-base)_55%,var(--kira-revamp-bg-sidebar))]";
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
        <div className="kira-revamp-card space-y-2 p-3">
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
}: {
    tab: AppTabId;
    labelsVisible: boolean;
    onSelect: (id: AppTabId) => void;
    afterSelect?: () => void;
    navId: string;
    pillLayoutId: string;
}) {
    const hitArea = (id: AppTabId, Icon: (typeof navItems)[number]["icon"], labelKey: (typeof navItems)[number]["labelKey"]) => {
        const selected = tab === id;
        const label = t(labelKey);
        const shell = cx(
            "relative z-0 flex w-full min-h-11 items-center rounded-xl py-2.5 text-left text-sm font-medium outline-hidden transition-[color] duration-150 ease-out",
            labelsVisible ? "gap-3 px-3" : "justify-center px-0",
            !selected && revampNavIdleClass(),
            selected && `font-semibold ${revampNavSelectedText(id)}`,
        );
        const inner = (
            <>
                {selected ? (
                    <motion.div
                        layoutId={pillLayoutId}
                        className="absolute inset-0 z-0 rounded-xl bg-[color-mix(in_srgb,var(--kira-revamp-text-primary)_8%,var(--kira-revamp-bg-card))] shadow-[inset_0_0_0_1px_var(--kira-revamp-border)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                ) : null}
                <span className={cx("relative z-10 flex min-w-0 items-center", labelsVisible ? "gap-3" : "justify-center")}>
                    <Icon data-icon aria-hidden className="size-5 shrink-0" />
                    {labelsVisible ? <span className="truncate">{label}</span> : null}
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
        <nav id={navId} className="flex flex-col gap-1.5" aria-label={t("app.menuTitle")}>
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
            <div className="kira-revamp-card space-y-2 p-3">
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
    const showMobileOverlay = !isMdUp && sidebarExpanded;

    const sidebarToggleLabel = sidebarExpanded ? t("aria.collapseAppSidebar") : t("aria.expandAppSidebar");

    return (
        <div className="flex min-h-dvh flex-col overflow-x-clip bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-primary)]">
            <header className="kira-app-header fixed top-0 right-0 left-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b-2 border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] px-5 shadow-sm md:gap-6 md:px-8 lg:px-10">
                <button
                    type="button"
                    onClick={() => setTab("dashboard")}
                    className="kira-revamp-focusable shrink-0 rounded-lg px-1 py-0.5 text-lg font-semibold tracking-tight text-[var(--kira-revamp-text-primary)] transition duration-100 ease-linear hover:bg-[color-mix(in_srgb,var(--kira-revamp-text-primary)_6%,transparent)]"
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
                <aside
                    aria-label={t("app.menuTitle")}
                    className={cx(
                        "fixed top-16 bottom-0 left-0 z-[30] hidden min-h-0 flex-col border-r border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-sidebar)] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] transition-[width] duration-200 ease-out md:flex",
                        sidebarExpanded ? "w-[var(--kira-revamp-sidebar-w)]" : "w-14",
                    )}
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
                        {sidebarExpanded ? (
                            <p className="hidden px-1 pt-1 md:block">
                                <span className="kira-revamp-section-label">{t("app.menuTitle")}</span>
                            </p>
                        ) : null}
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

                    {sidebarExpanded ? <SidebarFooter /> : null}
                </aside>

                {/* Mobile: fixed icon rail — top aligns to fixed header (h-16) */}
                <aside
                    aria-label={t("app.menuTitle")}
                    className="fixed top-16 bottom-0 left-0 z-[38] flex w-14 shrink-0 flex-col border-r border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-sidebar)] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] md:hidden"
                >
                    <div className="flex shrink-0 border-b border-[var(--kira-revamp-border)] p-1.5">
                        <button
                            type="button"
                            aria-expanded={sidebarExpanded}
                            aria-controls={showMobileOverlay ? "kira-app-sidebar-nav-mobile-sheet" : "kira-app-sidebar-nav-mobile"}
                            aria-label={sidebarToggleLabel}
                            onClick={toggleSidebar}
                            className="kira-revamp-focusable flex size-11 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)] text-[var(--kira-revamp-text-primary)] shadow-sm"
                        >
                            {sidebarExpanded ? (
                                <CloseIcon data-icon aria-hidden className="size-5" />
                            ) : (
                                <Menu02 data-icon aria-hidden className="size-5" />
                            )}
                        </button>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-1.5">
                        {!showMobileOverlay ? (
                            <AppSidebarNav
                                navId="kira-app-sidebar-nav-mobile"
                                pillLayoutId="kira-nav-pill-mobile-rail"
                                tab={tab}
                                labelsVisible={false}
                                onSelect={setTab}
                                afterSelect={() => persistSidebar(false)}
                            />
                        ) : null}
                    </div>
                </aside>

                {showMobileOverlay ? (
                    <>
                        <button
                            type="button"
                            aria-label={t("aria.collapseAppSidebar")}
                            className="fixed top-16 right-0 bottom-0 left-0 z-40 cursor-default bg-[var(--kira-revamp-drawer-scrim)] backdrop-blur-sm"
                            onClick={() => persistSidebar(false)}
                        />
                        <div className="fixed top-16 bottom-0 left-0 z-[42] flex w-[min(20rem,calc(100vw-1rem))] flex-col border-r border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-sidebar)] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-xl">
                            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--kira-revamp-border)] p-3">
                                <p className="min-w-0 truncate text-sm font-semibold text-[var(--kira-revamp-text-primary)]">{t("app.menuTitle")}</p>
                                <button
                                    type="button"
                                    aria-label={t("aria.collapseAppSidebar")}
                                    onClick={() => persistSidebar(false)}
                                    className="kira-revamp-focusable flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)]"
                                >
                                    <CloseIcon data-icon aria-hidden className="size-5" />
                                </button>
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
                                <AppSidebarNav
                                    navId="kira-app-sidebar-nav-mobile-sheet"
                                    pillLayoutId="kira-nav-pill-mobile-sheet"
                                    tab={tab}
                                    labelsVisible
                                    onSelect={setTab}
                                    afterSelect={() => persistSidebar(false)}
                                />
                            </div>
                            <SidebarFooter />
                        </div>
                    </>
                ) : null}

                <div
                    className={cx(
                        "flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-200 ease-out md:min-w-0",
                        sidebarExpanded ? "md:pl-[var(--kira-revamp-sidebar-w)]" : "md:pl-14",
                    )}
                >
                    <main className="kira-app-revamp-main kira-text-flow mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 py-6 pl-[calc(3.5rem+1rem)] md:px-8 md:py-8 md:pl-8">
                        {tab === "dashboard" && <DashboardPanel onOpenTab={(id) => setTab(id as AppTabId)} />}
                        {tab === "calendar" && <CalendarPanel />}
                        {tab === "wellbeing" && <WellbeingPanel />}
                        {tab === "events" && <EventsPanel />}
                        {tab === "profile" && <ProfilePanel />}
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
            <QuickAddFab fabClassName="bottom-6 right-4 md:bottom-6 md:right-6" />
            <LimitsSetupModal isOpen={!limitsConfigured || limitsEditorOpen} isRequired={!limitsConfigured} onOpenChange={() => undefined} />
        </div>
    );
}

export function AppShell() {
    return <AppShellBody />;
}
