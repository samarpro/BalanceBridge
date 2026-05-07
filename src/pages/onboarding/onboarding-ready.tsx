import { CheckCircle } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { useNavigate } from "react-router";
import { completeOnboarding } from "@/lib/onboarding-storage";
import { t } from "@/i18n/strings";

export function OnboardingReadyPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
            <FeaturedIcon icon={CheckCircle} color="success" theme="modern" size="xl" />
            <div className="mx-auto max-w-md text-center">
                <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.start.title")}</h1>
                <p className="mt-4 text-md leading-relaxed text-tertiary">{t("onboarding.start.body")}</p>
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
