import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Flag02 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Button } from "@/components/base/buttons/button";
import { useNavigate } from "react-router";
import { useKiraStore } from "@/stores/kira-store";
import { DEFAULT_LIFE_PRIORITY_ORDER, type LifePriorityId } from "@/types/life-priority";
import { t } from "@/i18n/strings";
import { cx } from "@/utils/cx";

function lifeLabel(id: LifePriorityId): string {
    return t(`lifePriority.${id}`);
}

export function OnboardingPrioritiesPage() {
    const navigate = useNavigate();
    const setLifePriorityOrder = useKiraStore((s) => s.setLifePriorityOrder);
    const [order, setOrder] = useState<LifePriorityId[]>(() => [...DEFAULT_LIFE_PRIORITY_ORDER]);

    const rows = useMemo(
        () =>
            order.map((id, index) => ({
                id,
                label: lifeLabel(id),
                index,
            })),
        [order],
    );

    const move = (from: number, to: number) => {
        if (to < 0 || to >= order.length) return;
        setOrder((prev) => {
            const next = [...prev];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return next;
        });
    };

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
            <FeaturedIcon icon={Flag02} color="brand" theme="modern" size="xl" />
            <div className="w-full max-w-md space-y-4 text-center">
                <h1 className="text-display-xs font-semibold text-secondary">{t("onboarding.priorities.title")}</h1>
                <p className="text-md text-tertiary">{t("onboarding.priorities.body")}</p>
                <p className="text-sm text-quaternary">{t("onboarding.priorities.hint")}</p>
            </div>

            <ol className="w-full max-w-md space-y-2" aria-label={t("onboarding.priorities.title")}>
                {rows.map(({ id, label, index }) => (
                    <li
                        key={id}
                        className={cx(
                            "flex items-center gap-2 rounded-xl bg-primary_alt px-3 py-3 ring-1 ring-secondary",
                            index === 0 && "ring-2 ring-brand-secondary/40",
                        )}
                    >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-secondary/15 text-xs font-bold text-brand-secondary">
                            {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 text-left text-sm font-semibold text-secondary">{label}</span>
                        <div className="flex shrink-0 gap-1">
                            <Button
                                color="secondary"
                                size="sm"
                                iconLeading={ArrowUp}
                                className="size-9 shrink-0 px-0"
                                aria-label="Move up"
                                isDisabled={index === 0}
                                onClick={() => move(index, index - 1)}
                            />
                            <Button
                                color="secondary"
                                size="sm"
                                iconLeading={ArrowDown}
                                className="size-9 shrink-0 px-0"
                                aria-label="Move down"
                                isDisabled={index === order.length - 1}
                                onClick={() => move(index, index + 1)}
                            />
                        </div>
                    </li>
                ))}
            </ol>

            <Button
                color="primary"
                size="xl"
                className="min-w-48"
                onClick={() => {
                    setLifePriorityOrder(order);
                    navigate("/onboarding/timetable");
                }}
            >
                {t("onboarding.priorities.cta")}
            </Button>
        </div>
    );
}
