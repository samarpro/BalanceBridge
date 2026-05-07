import { Navigate } from "react-router";
import { isOnboardingComplete } from "@/lib/onboarding-storage";

export function RootRedirect() {
    if (isOnboardingComplete()) {
        return <Navigate to="/app" replace />;
    }
    return <Navigate to="/onboarding/welcome" replace />;
}
