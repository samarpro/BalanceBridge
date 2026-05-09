const KEY = "kira-onboarding-complete";
const LEGACY_KEY = "balance-bridge-onboarding-complete";

export function isOnboardingComplete(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(KEY) === "1" || window.localStorage.getItem(LEGACY_KEY) === "1";
}

export function completeOnboarding(): void {
    window.localStorage.setItem(KEY, "1");
    window.localStorage.removeItem(LEGACY_KEY);
}
