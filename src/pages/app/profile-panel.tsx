import { Button } from "@/components/base/buttons/button";
import { APP_VERSION } from "@/lib/app-version";
import { useKiraStore } from "@/stores/kira-store";
import { t, tReplace } from "@/i18n/strings";

export function ProfilePanel() {
    const displayName = useKiraStore((s) => s.userProfile.displayName);
    const email = useKiraStore((s) => s.userProfile.universityEmail);
    const openLimitsEditor = useKiraStore((s) => s.openLimitsEditor);

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
            <header>
                <p className="kira-revamp-section-label">{t("profile.revamp.section")}</p>
                <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-[var(--kira-revamp-text-primary)]">
                    {displayName.trim() || t("profile.revamp.fallbackName")}
                </h1>
                {email.trim() ? (
                    <p className="mt-2 text-sm text-[var(--kira-revamp-text-secondary)]">{email}</p>
                ) : (
                    <p className="mt-2 text-sm text-[var(--kira-revamp-text-muted)]">{t("profile.revamp.noEmail")}</p>
                )}
            </header>

            <section className="kira-revamp-card kira-dashboard-card kira-card-variant-wellbeing space-y-3 p-5">
                <p className="kira-revamp-section-label">{t("profile.revamp.limits")}</p>
                <p className="text-sm leading-relaxed text-[var(--kira-revamp-text-secondary)]">{t("profile.revamp.limitsBody")}</p>
                <Button color="secondary" size="md" className="mt-1" onClick={() => openLimitsEditor()}>
                    {t("dashboard.editLimits")}
                </Button>
            </section>

            <p className="text-center text-xs text-[var(--kira-revamp-text-muted)]">{tReplace("profile.revamp.version", { version: APP_VERSION })}</p>
        </div>
    );
}
