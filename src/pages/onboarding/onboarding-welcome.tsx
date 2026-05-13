import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { HoverHint } from "@/components/kira/hover-hint";
import { useNavigate } from "react-router";
import { t } from "@/i18n/strings";

export function OnboardingWelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-10 px-5 py-14 kira-text-flow">
            <FeaturedIcon icon={Users01} color="brand" theme="modern" size="xl" />
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-display-xs font-semibold text-secondary md:text-display-sm">{t("onboarding.welcome.title")}</h1>
                <p className="text-md text-tertiary">{t("onboarding.welcome.lead")}</p>
                <div className="flex justify-center pt-1">
                    <HoverHint
                        title={t("onboarding.welcome.hintTitle")}
                        description={`${t("onboarding.welcome.body")} ${t("onboarding.welcome.socialProof")}`}
                    />
                </div>
            </div>
            <Button color="primary" size="xl" className="min-w-48" onClick={() => navigate("/onboarding/login")}>
                {t("onboarding.welcome.cta")}
            </Button>
        </div>
    );
}
