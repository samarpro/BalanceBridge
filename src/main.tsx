import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { RootRedirect } from "@/pages/root-redirect";
import { OnboardingWelcomePage } from "@/pages/onboarding/onboarding-welcome";
import { OnboardingLoginPage } from "@/pages/onboarding/onboarding-login";
import { OnboardingTimetablePage } from "@/pages/onboarding/onboarding-timetable";
import { OnboardingReadyPage } from "@/pages/onboarding/onboarding-ready";
import { AppGate } from "@/pages/app-gate";
import { AppShell } from "@/pages/app/app-shell";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/onboarding/welcome" element={<OnboardingWelcomePage />} />
                        <Route path="/onboarding/login" element={<OnboardingLoginPage />} />
                        <Route path="/onboarding/timetable" element={<OnboardingTimetablePage />} />
                        <Route path="/onboarding/ready" element={<OnboardingReadyPage />} />
                        <Route
                            path="/app"
                            element={
                                <AppGate>
                                    <AppShell />
                                </AppGate>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
