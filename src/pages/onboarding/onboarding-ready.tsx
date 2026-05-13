import { CheckCircle } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { HoverHint } from "@/components/kira/hover-hint";
import { useNavigate } from "react-router";
import { completeOnboarding } from "@/lib/onboarding-storage";
import { t } from "@/i18n/strings";

export function OnboardingReadyPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-10 px-5 py-14 kira-text-flow">
            <FeaturedIcon icon={CheckCircle} color="success" theme="modern" size="xl" />
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.start.title")}</h1>
                <p className="text-md text-tertiary">{t("onboarding.start.lead")}</p>
                <div className="flex justify-center pt-1">
                    <HoverHint title={t("onboarding.start.hintTitle")} description={t("onboarding.start.body")} />
                </div>
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
    );
}
