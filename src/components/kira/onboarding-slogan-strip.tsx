import { cx } from "@/utils/cx";

interface OnboardingSloganStripProps {
    slogans: string[];
    className?: string;
}

export function OnboardingSloganStrip({ slogans, className }: OnboardingSloganStripProps) {
    return (
        <div className={cx("flex flex-wrap items-center justify-center gap-2", className)}>
            {slogans.map((slogan) => (
                <span
                    key={slogan}
                    className="rounded-full border border-[rgba(120,100,80,0.14)] bg-white/55 px-3 py-1 text-xs font-semibold text-[var(--kira-revamp-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-white/10 dark:bg-white/[0.06]"
                >
                    {slogan}
                </span>
            ))}
        </div>
    );
}
