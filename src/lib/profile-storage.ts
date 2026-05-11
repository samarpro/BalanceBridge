const KEY = "kira-user-profile";
const LEGACY_KEY = "balance-bridge-user-profile";

export interface UserProfile {
    displayName: string;
    universityEmail: string;
    /** When false or missing (legacy), the app prompts for study/work limits after onboarding. */
    limitsConfigured: boolean;
    /** Target focused study minutes for the current ISO calendar week. */
    weeklyStudyGoalMinutes: number;
    /** Max paid shift hours summed across the rolling last 14 days (dashboard + wellbeing). */
    fortnightWorkLimitHours: number;
}

const empty: UserProfile = {
    displayName: "",
    universityEmail: "",
    limitsConfigured: false,
    weeklyStudyGoalMinutes: 720,
    fortnightWorkLimitHours: 48,
};

function clampPositive(n: number, fallback: number, max: number): number {
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return Math.min(max, Math.round(n));
}

export function loadUserProfile(): UserProfile {
    if (typeof window === "undefined") return { ...empty };
    try {
        const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
        if (!raw) return { ...empty };
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return { ...empty };
        const o = parsed as Record<string, unknown>;
        const displayName = typeof o.displayName === "string" ? o.displayName : "";
        const universityEmail = typeof o.universityEmail === "string" ? o.universityEmail : "";
        const weeklyStudyGoalMinutes = clampPositive(
            typeof o.weeklyStudyGoalMinutes === "number" ? o.weeklyStudyGoalMinutes : NaN,
            empty.weeklyStudyGoalMinutes,
            100 * 60,
        );
        const fortnightWorkLimitHours = clampPositive(
            typeof o.fortnightWorkLimitHours === "number" ? o.fortnightWorkLimitHours : NaN,
            empty.fortnightWorkLimitHours,
            120,
        );
        const limitsConfigured = o.limitsConfigured === true;
        return { displayName, universityEmail, limitsConfigured, weeklyStudyGoalMinutes, fortnightWorkLimitHours };
    } catch {
        return { ...empty };
    }
}

export function saveUserProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
        KEY,
        JSON.stringify({
            displayName: profile.displayName,
            universityEmail: profile.universityEmail,
            limitsConfigured: profile.limitsConfigured,
            weeklyStudyGoalMinutes: profile.weeklyStudyGoalMinutes,
            fortnightWorkLimitHours: profile.fortnightWorkLimitHours,
        }),
    );
    window.localStorage.removeItem(LEGACY_KEY);
}
