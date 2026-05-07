import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useNavigate } from "react-router";
import { t } from "@/i18n/strings";

export function OnboardingWelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
            <FeaturedIcon icon={Users01} color="brand" theme="modern" size="xl" />
            <div className="mx-auto max-w-md text-center">
                <h1 className="text-display-xs font-semibold text-secondary md:text-display-sm">{t("onboarding.welcome.title")}</h1>
                <p className="mt-3 text-md text-tertiary">{t("onboarding.welcome.body")}</p>
                <p className="mt-4 rounded-lg bg-brand-secondary px-4 py-3 text-sm font-medium text-brand-secondary ring-1 ring-brand-secondary ring-inset">
                    {t("onboarding.welcome.socialProof")}
                </p>
            </div>
            <Button color="primary" size="xl" className="min-w-48" onClick={() => navigate("/onboarding/login")}>
                {t("onboarding.welcome.cta")}
            </Button>
        </div>
    );
}
