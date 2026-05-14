import { CheckCircle } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { OnboardingShell } from "@/components/kira/onboarding-shell";
import { OnboardingSloganStrip } from "@/components/kira/onboarding-slogan-strip";
import { useNavigate } from "react-router";
import { completeOnboarding } from "@/lib/onboarding-storage";
import { t } from "@/i18n/strings";

export function OnboardingReadyPage() {
    const navigate = useNavigate();

    return (
        <OnboardingShell>
            <div className="flex flex-col items-center gap-8 text-center kira-text-flow">
                <FeaturedIcon icon={CheckCircle} color="success" theme="modern" size="xl" />
                <div className="mx-auto max-w-md space-y-5 text-center">
                    <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.start.title")}</h1>
                    <OnboardingSloganStrip slogans={["You are set", "Keep your pace", "Step into the term ready"]} />
                </div>
                <Button
                    color="primary"
                    size="xl"
                    className="min-w-48"
                    onClick={() => {
                        completeOnboarding();
                        navigate("/app");
                    }}
                >
                    {t("onboarding.start.cta")}
                </Button>
            </div>
        </OnboardingShell>
    );
}
