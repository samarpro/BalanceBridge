import { useMemo, useState } from "react";
import {
    BarChartSquare02,
    Calendar as CalendarIcon,
    HeartRounded,
    SearchLg,
    User01,
    Users01,
    Menu02,
    X as CloseIcon,
} from "@untitledui/icons";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Avatar } from "@/components/base/avatar/avatar";
import { LimitsSetupModal } from "@/components/kira/limits-setup-modal";
import { QuickAddFab } from "@/components/kira/quick-add-fab";
import { HoverHint } from "@/components/kira/hover-hint";
import { ThemeToggle } from "@/components/kira/theme-toggle";
import { FocusModeControl } from "@/components/kira/focus-mode-overlay";
import { RevampProgressBar } from "@/components/kira/revamp-progress-bar";
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

const navItems = [
    { id: "dashboard" as const, icon: BarChartSquare02, labelKey: "app.nav.dashboard" as const },
    { id: "calendar" as const, icon: CalendarIcon, labelKey: "app.nav.schedule" as const },
    { id: "events" as const, icon: Users01, labelKey: "app.nav.explore" as const },
    { id: "wellbeing" as const, icon: HeartRounded, labelKey: "app.nav.wellbeing" as const },
    { id: "profile" as const, icon: User01, labelKey: "app.nav.profile" as const },
];

type AppTabId = (typeof navItems)[number]["id"];

/** Selected rail / bottom-tab tint — one accent per area for quick scanning. */
function revampNavSelectedSurface(id: AppTabId): string {
    switch (id) {
        case "dashboard":
            return "bg-[color-mix(in_srgb,var(--kira-revamp-accent-work)_34%,var(--kira-revamp-bg-card))] text-[var(--kira-revamp-accent-work-dark)]";
        case "calendar":
            return "bg-[color-mix(in_srgb,var(--kira-revamp-accent-study)_40%,var(--kira-revamp-bg-card))] text-[var(--kira-revamp-accent-study-dark)]";
        case "events":
            return "bg-[color-mix(in_srgb,var(--kira-revamp-accent-social)_48%,var(--kira-revamp-bg-card))] text-[var(--kira-revamp-accent-study-dark)]";
        case "wellbeing":
            return "bg-[color-mix(in_srgb,var(--kira-revamp-accent-wellbeing)_42%,var(--kira-revamp-bg-card))] text-[var(--kira-revamp-text-primary)]";
        case "profile":
            return "bg-[var(--kira-revamp-bg-sidebar)] text-[var(--kira-revamp-text-primary)] ring-1 ring-[color-mix(in_srgb,var(--kira-revamp-text-primary)_15%,transparent)]";
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

function RevampSidebarNav({ tab, onSelect }: { tab: AppTabId; onSelect: (id: AppTabId) => void }) {
    return (
        <nav className="flex flex-col gap-1.5" aria-label={t("app.menuTitle")}>
            {navItems.map(({ id, icon: Icon, labelKey }) => {
                const selected = tab === id;
                const label = t(labelKey);
                return (
                    <button
                        key={id}
                        type="button"
                        aria-current={selected ? "page" : undefined}
                        onClick={() => onSelect(id)}
                        className={cx(
                            "kira-revamp-focusable flex w-full items-center gap-3 rounded-xl py-2.5 text-left text-sm font-medium transition-[background,color,box-shadow] duration-150 ease-out",
                            "min-h-11 justify-center lg:justify-start lg:px-3",
                            selected ? revampNavSelectedSurface(id) : revampNavIdleClass(),
                        )}
                    >
                        <Icon data-icon aria-hidden className="size-5 shrink-0" />
                        <span className="sr-only lg:hidden">{label}</span>
                        <span className="hidden truncate lg:inline">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

function MobileDrawerNav({ tab, onSelect, close }: { tab: AppTabId; onSelect: (id: AppTabId) => void; close: () => void }) {
    return (
        <nav className="flex flex-col gap-3" aria-label={t("app.menuTitle")}>
            {navItems.map(({ id, icon: Icon, labelKey }) => {
                const selected = tab === id;
                const label = t(labelKey);
                return (
                    <button
                        key={id}
                        type="button"
                        aria-current={selected ? "page" : undefined}
                        onClick={() => {
                            onSelect(id);
                            close();
                        }}
                        className={cx(
                            "kira-revamp-focusable flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-lg font-bold leading-snug tracking-tight transition-[background,color,box-shadow,transform] duration-150 active:scale-[0.99]",
                            selected
                                ? cx("shadow-md", revampNavSelectedSurface(id), "border-[color-mix(in_srgb,var(--kira-revamp-text-primary)_12%,transparent)]")
                                : "border-[color-mix(in_srgb,var(--kira-revamp-text-primary)_18%,transparent)] bg-[var(--kira-revamp-bg-sidebar)] text-[var(--kira-revamp-text-primary)] shadow-sm hover:border-[color-mix(in_srgb,var(--kira-revamp-text-primary)_28%,transparent)] hover:bg-[color-mix(in_srgb,var(--kira-revamp-bg-base)_45%,var(--kira-revamp-bg-sidebar))]",
                        )}
                    >
                        <Icon data-icon aria-hidden className="size-7 shrink-0" />
                        <span className="min-w-0 flex-1">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

function BottomNav({ tab, onSelect }: { tab: AppTabId; onSelect: (id: AppTabId) => void }) {
    return (
        <nav
            className="fixed right-0 bottom-0 left-0 z-40 flex border-t-2 border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-sidebar)] px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[var(--kira-revamp-shadow-bottom-nav)] md:hidden"
            aria-label={t("aria.bottomNav")}
        >
            {navItems.map(({ id, icon: Icon, labelKey }) => {
                const selected = tab === id;
                const label = t(labelKey);
                return (
                    <button
                        key={id}
                        type="button"
                        aria-label={label}
                        aria-current={selected ? "page" : undefined}
                        onClick={() => onSelect(id)}
                        className={cx(
                            "kira-revamp-focusable mx-0.5 mb-0.5 flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-bold leading-tight transition-[background,color,box-shadow] duration-150",
                            selected
                                ? revampNavSelectedSurface(id)
                                : "bg-[var(--kira-revamp-bg-card)] text-[var(--kira-revamp-text-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--kira-revamp-text-primary)_12%,transparent)] hover:ring-[color-mix(in_srgb,var(--kira-revamp-text-primary)_20%,transparent)]",
                        )}
                    >
                        <Icon data-icon aria-hidden className="size-5 shrink-0" />
                        <span className="max-w-full truncate px-0.5">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

function AppContent() {
    const [tab, setTab] = useState<AppTabId>("dashboard");
    const displayName = useKiraStore((s) => s.userProfile.displayName);
    const mobileTitle = t(navItems.find((n) => n.id === tab)!.labelKey);

    return (
        <div className="flex min-h-dvh flex-row overflow-x-clip bg-[var(--kira-revamp-bg-base)] text-[var(--kira-revamp-text-primary)]">
            <aside
                aria-label={t("app.menuTitle")}
                className="sticky top-0 hidden h-dvh max-h-dvh w-14 shrink-0 flex-col border-r border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-sidebar)] md:flex lg:w-[var(--kira-revamp-sidebar-w)]"
            >
                <div className="flex shrink-0 items-center border-b border-[var(--kira-revamp-border)] px-2 py-3 lg:px-4">
                    <p className="hidden w-full truncate text-lg font-semibold tracking-tight lg:block">{t("app.name")}</p>
                    <p className="w-full text-center text-lg font-semibold tracking-tight lg:hidden" aria-hidden>
                        K
                    </p>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2 lg:p-3">
                    <div className="hidden lg:block">
                        <p className="kira-revamp-section-label px-1">{t("app.menuTitle")}</p>
                    </div>
                    <RevampSidebarNav tab={tab} onSelect={setTab} />
                </div>

                <div className="mt-auto hidden flex-col gap-3 border-t border-[var(--kira-revamp-border)] p-3 lg:flex">
                    <SidebarFortnightCard />
                    <div className="kira-revamp-card space-y-2 p-3">
                        <p className="kira-revamp-section-label">{t("dashboard.revamp.language")}</p>
                        <p className="text-sm font-medium text-[var(--kira-revamp-text-secondary)]">{t("dashboard.revamp.langEn")}</p>
                    </div>
                    <p className="text-center text-[10px] text-[var(--kira-revamp-text-muted)]">{tReplace("profile.revamp.version", { version: APP_VERSION })}</p>
                </div>
            </aside>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex min-h-14 shrink-0 flex-wrap items-center gap-3 border-b-2 border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-base)] px-4 py-3 shadow-sm md:px-6 lg:px-8">
                    <div className="md:hidden">
                        <AriaDialogTrigger>
                            <AriaButton
                                aria-label={t("aria.openAppMenu")}
                                className="group relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--kira-revamp-border)] bg-[var(--kira-revamp-bg-card)] text-[var(--kira-revamp-text-primary)] shadow-sm transition duration-150 kira-revamp-focusable hover:shadow-[var(--kira-revamp-shadow-card)]"
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
                                        "fixed inset-0 z-50 cursor-pointer bg-[var(--kira-revamp-drawer-scrim)] backdrop-blur-sm",
                                        isEntering && "duration-300 ease-out animate-in fade-in",
                                        isExiting && "duration-200 ease-in animate-out fade-out",
                                    )
                                }
                            >
                                {({ state }) => (
                                    <AriaModal
                                        className={({ isEntering, isExiting }) =>
                                            cx(
                                                "kira-app-revamp fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full max-w-none cursor-auto flex-col overflow-hidden border-0 bg-[var(--kira-revamp-bg-card)] shadow-none outline-hidden",
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
                                                    "kira-revamp-focusable absolute z-20 flex size-11 items-center justify-center rounded-xl border-2 border-[color-mix(in_srgb,var(--kira-revamp-text-primary)_18%,transparent)] bg-[var(--kira-revamp-bg-sidebar)] text-[var(--kira-revamp-text-primary)] shadow-md",
                                                    "right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))]",
                                                )}
                                            >
                                                <CloseIcon className="size-5 shrink-0" aria-hidden />
                                            </AriaButton>

                                            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto bg-[var(--kira-revamp-bg-card)] px-4 pb-10 pt-14">
                                                <div className="space-y-2 border-b-2 border-[color-mix(in_srgb,var(--kira-revamp-text-primary)_12%,transparent)] pb-5">
                                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--kira-revamp-text-primary)]">{t("app.name")}</p>
                                                    <p className="text-2xl font-bold leading-tight text-[var(--kira-revamp-text-primary)]">{t("app.menuTitle")}</p>
                                                    <div className="flex flex-wrap items-end gap-1.5 text-base font-medium leading-snug text-[var(--kira-revamp-text-primary)]">
                                                        <p className="min-w-0 flex-1">{t("app.tagline")}</p>
                                                        <HoverHint title={t("app.hover.tagline")} description={t("app.taglineDetail")} />
                                                    </div>
                                                </div>

                                                <MobileDrawerNav tab={tab} onSelect={setTab} close={() => state.close()} />
                                            </div>
                                        </AriaDialog>
                                    </AriaModal>
                                )}
                            </AriaModalOverlay>
                        </AriaDialogTrigger>
                    </div>

                    <div className="hidden min-w-0 flex-1 md:block lg:max-w-md">
                        <Input
                            icon={SearchLg}
                            size="md"
                            placeholder={t("app.searchPlaceholder")}
                            aria-label={t("aria.search")}
                            wrapperClassName="bg-[var(--kira-revamp-bg-card)] ring-[var(--kira-revamp-border)]"
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center md:hidden">
                        <p className="truncate text-sm font-semibold text-[var(--kira-revamp-text-primary)]">{mobileTitle}</p>
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <Button
                            color="secondary"
                            size="md"
                            aria-label={t("aria.search")}
                            iconLeading={SearchLg}
                            className="md:hidden"
                        />
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

                <main className="kira-app-revamp-main kira-text-flow mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 py-6 md:px-8 md:py-8">
                    {tab === "dashboard" && <DashboardPanel onOpenTab={(id) => setTab(id as AppTabId)} />}
                    {tab === "calendar" && <CalendarPanel />}
                    {tab === "wellbeing" && <WellbeingPanel />}
                    {tab === "events" && <EventsPanel />}
                    {tab === "profile" && <ProfilePanel />}
                </main>

                <BottomNav tab={tab} onSelect={setTab} />
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
            <QuickAddFab fabClassName="max-md:bottom-[4.5rem] max-md:right-4 md:bottom-6 md:right-6" />
            <LimitsSetupModal isOpen={!limitsConfigured || limitsEditorOpen} isRequired={!limitsConfigured} onOpenChange={() => undefined} />
        </div>
    );
}

export function AppShell() {
    return <AppShellBody />;
}
