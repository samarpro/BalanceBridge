import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SocialButton } from "@/components/base/buttons/social-button";
import { HintText } from "@/components/base/input/hint-text";
import { useNavigate } from "react-router";
import { useState } from "react";
import { t } from "@/i18n/strings";

export function OnboardingLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const valid = email.includes("@") && email.includes(".");

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
            <FeaturedIcon icon={Mail01} color="brand" theme="modern" size="xl" />
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.login.title")}</h1>
                </div>

                <Input
                    label={t("onboarding.login.emailLabel")}
                    hint={t("onboarding.login.emailHint")}
                    placeholder={t("onboarding.login.emailPlaceholder")}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={Mail01}
                />

                <div className="flex flex-col gap-3">
                    <Button color="primary" size="lg" className="w-full" onClick={() => navigate("/onboarding/timetable")}>
                        {t("onboarding.login.ssoUniversity")}
                    </Button>
                    <SocialButton social="google" theme="gray" size="lg" className="w-full">
                        {t("onboarding.login.ssoGoogle")}
                    </SocialButton>
                    <Button color="secondary" size="lg" className="w-full" onClick={() => navigate("/onboarding/timetable")}>
                        {t("onboarding.login.ssoMicrosoft")}
                    </Button>
                </div>

                <HintText>{t("onboarding.login.demoNote")}</HintText>

                <Button color="secondary" size="lg" className="w-full" isDisabled={!valid} onClick={() => navigate("/onboarding/timetable")}>
                    {t("onboarding.login.next")}
                </Button>
            </div>
        </div>
    );
}
