import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Lock01, Mail01, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SocialButton } from "@/components/base/buttons/social-button";
import { OnboardingShell } from "@/components/kira/onboarding-shell";
import { OnboardingSloganStrip } from "@/components/kira/onboarding-slogan-strip";
import { useNavigate } from "react-router";
import { useState } from "react";
import { t } from "@/i18n/strings";
import { useKiraStore } from "@/stores/kira-store";

export function OnboardingLoginPage() {
    const navigate = useNavigate();
    const userProfile = useKiraStore((s) => s.userProfile);
    const setUserProfile = useKiraStore((s) => s.setUserProfile);

    const [name, setName] = useState(userProfile.displayName);
    const [email, setEmail] = useState(userProfile.universityEmail);
    const [password, setPassword] = useState("");

    const emailValid = email.includes("@") && email.includes(".");
    const nameValid = name.trim().length > 0;
    const passwordValid = password.trim().length > 0;
    const canContinue = nameValid && emailValid && passwordValid;

    const persistIdentityAndGo = () => {
        setUserProfile({ displayName: name.trim(), universityEmail: email.trim() });
        navigate("/onboarding/priorities");
    };

    return (
        <OnboardingShell>
            <div className="flex flex-col items-center gap-8 kira-text-flow">
                <FeaturedIcon icon={User01} color="brand" theme="modern" size="xl" />
                <div className="w-full max-w-md space-y-7">
                    <div className="space-y-5 text-center">
                        <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.login.title")}</h1>
                        <OnboardingSloganStrip slogans={["Fast start", "Uni-ready", "Your semester, sorted"]} />
                    </div>

                    <div className="space-y-4">
                        <Input
                            label={t("onboarding.login.nameLabel")}
                            hint={t("onboarding.login.nameHint")}
                            hintAsLabelTooltip
                            placeholder={t("onboarding.login.namePlaceholder")}
                            type="text"
                            value={name}
                            onChange={setName}
                            icon={User01}
                            isRequired
                        />
                        <Input
                            label={t("onboarding.login.emailLabel")}
                            hint={t("onboarding.login.emailHint")}
                            hintAsLabelTooltip
                            placeholder={t("onboarding.login.emailPlaceholder")}
                            type="email"
                            value={email}
                            onChange={setEmail}
                            icon={Mail01}
                            isRequired
                        />
                        <Input
                            label={t("onboarding.login.passwordLabel")}
                            hint={t("onboarding.login.passwordHint")}
                            hintAsLabelTooltip
                            placeholder={t("onboarding.login.passwordPlaceholder")}
                            type="password"
                            value={password}
                            onChange={setPassword}
                            icon={Lock01}
                            isRequired
                            autoComplete="new-password"
                        />
                    </div>

                    <Button color="primary" size="lg" className="w-full" isDisabled={!canContinue} onClick={persistIdentityAndGo}>
                        {t("onboarding.login.next")}
                    </Button>

                    <div className="flex flex-col gap-3">
                        <Button color="secondary" size="lg" className="w-full" isDisabled={!canContinue} onClick={persistIdentityAndGo}>
                            {t("onboarding.login.ssoUniversity")}
                        </Button>
                        <SocialButton
                            social="google"
                            theme="gray"
                            size="lg"
                            className="w-full"
                            disabled={!canContinue}
                            onClick={persistIdentityAndGo}
                        >
                            {t("onboarding.login.ssoGoogle")}
                        </SocialButton>
                        <Button color="secondary" size="lg" className="w-full" isDisabled={!canContinue} onClick={persistIdentityAndGo}>
                            {t("onboarding.login.ssoMicrosoft")}
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingShell>
    );
}
