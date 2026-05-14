import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { OnboardingShell } from "@/components/kira/onboarding-shell";
import { OnboardingSloganStrip } from "@/components/kira/onboarding-slogan-strip";
import { useNavigate } from "react-router";
import { t } from "@/i18n/strings";

export function OnboardingWelcomePage() {
    const navigate = useNavigate();

    return (
        <OnboardingShell>
            <div className="flex flex-col items-center gap-8 text-center kira-text-flow">
                <FeaturedIcon icon={Users01} color="brand" theme="modern" size="xl" />
                <div className="mx-auto max-w-md space-y-5 text-center">
                    <h1 className="text-display-xs font-semibold text-secondary md:text-display-sm">{t("onboarding.welcome.title")}</h1>
                    <OnboardingSloganStrip slogans={["Built for students", "Stay ahead", "Feel in control"]} />
                </div>
                <Button color="primary" size="xl" className="min-w-48" onClick={() => navigate("/onboarding/login")}>
                    {t("onboarding.welcome.cta")}
                </Button>
            </div>
        </OnboardingShell>
    );
}
