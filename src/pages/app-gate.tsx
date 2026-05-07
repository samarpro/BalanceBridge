import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { isOnboardingComplete } from "@/lib/onboarding-storage";

export function AppGate({ children }: { children: ReactNode }) {
    if (!isOnboardingComplete()) {
        return <Navigate to="/onboarding/welcome" replace />;
    }
    return children;
}
