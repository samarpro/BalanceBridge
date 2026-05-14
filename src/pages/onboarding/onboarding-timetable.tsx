import { Calendar } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";
import { OnboardingShell } from "@/components/kira/onboarding-shell";
import { OnboardingSloganStrip } from "@/components/kira/onboarding-slogan-strip";
import { useNavigate } from "react-router";
import { t } from "@/i18n/strings";

export function OnboardingTimetablePage() {
    const navigate = useNavigate();

    return (
        <OnboardingShell>
            <div className="flex flex-col items-center gap-8 kira-text-flow">
                <FeaturedIcon icon={Calendar} color="brand" theme="modern" size="xl" />
                <div className="w-full max-w-md space-y-5 text-center">
                    <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.timetable.title")}</h1>
                    <OnboardingSloganStrip slogans={["Plug in your week", "See it clearly", "Start strong"]} />
                </div>

                <div className="flex w-full max-w-md flex-col gap-4">
                    <FileTrigger acceptedFileTypes={[".ics", "text/calendar"]} onSelect={() => navigate("/onboarding/ready")}>
                        <Button color="secondary" size="lg" className="w-full">
                            {t("onboarding.timetable.ics")}
                        </Button>
                    </FileTrigger>
                    <SocialButton social="google" theme="gray" size="lg" className="w-full" onClick={() => navigate("/onboarding/ready")}>
                        {t("onboarding.timetable.google")}
                    </SocialButton>
                    <Button color="secondary" size="lg" className="w-full" onClick={() => navigate("/onboarding/ready")}>
                        {t("onboarding.timetable.outlook")}
                    </Button>
                    <Button color="link-gray" size="lg" className="w-full" onClick={() => navigate("/onboarding/ready")}>
                        {t("onboarding.timetable.skip")}
                    </Button>
                    <Button color="primary" size="lg" className="w-full" onClick={() => navigate("/onboarding/ready")}>
                        {t("onboarding.timetable.next")}
                    </Button>
                </div>
            </div>
        </OnboardingShell>
    );
}
