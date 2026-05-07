import { Calendar } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";
import { useNavigate } from "react-router";
import { t } from "@/i18n/strings";

export function OnboardingTimetablePage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
            <FeaturedIcon icon={Calendar} color="brand" theme="modern" size="xl" />
            <div className="w-full max-w-md space-y-4 text-center">
                <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.timetable.title")}</h1>
                <p className="text-md text-tertiary">{t("onboarding.timetable.body")}</p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3">
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
    );
}
