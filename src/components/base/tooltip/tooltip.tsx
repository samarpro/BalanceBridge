import type { ReactNode } from "react";
import type {
    ButtonProps as AriaButtonProps,
    TooltipProps as AriaTooltipProps,
    TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
} from "react-aria-components";
import { Button as AriaButton, OverlayArrow as AriaOverlayArrow, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { cx } from "@/utils/cx";

export type TooltipTone = "inverse" | "work" | "exam" | "wellbeing";

function tooltipSurfaceClass(tone: TooltipTone): string {
    switch (tone) {
        case "work":
            return cx(
                "w-max max-w-[min(18rem,calc(100vw-2rem))] flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center shadow-xl ring-1",
                "border-[var(--kira-revamp-popover-work-border)] bg-[var(--kira-revamp-popover-work-bg)] ring-[color-mix(in_srgb,var(--kira-revamp-popover-work-border)_38%,transparent)]",
            );
        case "exam":
            return cx(
                "w-max max-w-[min(18rem,calc(100vw-2rem))] flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center shadow-xl ring-1",
                "border-[var(--kira-revamp-popover-exam-border)] bg-[var(--kira-revamp-popover-exam-bg)] ring-[color-mix(in_srgb,var(--kira-revamp-popover-exam-border)_38%,transparent)]",
            );
        case "wellbeing":
            return cx(
                "w-max max-w-[min(18rem,calc(100vw-2rem))] flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center shadow-xl ring-1",
                "border-[var(--kira-revamp-popover-wellbeing-border)] bg-[var(--kira-revamp-popover-wellbeing-bg)] ring-[color-mix(in_srgb,var(--kira-revamp-popover-wellbeing-border)_38%,transparent)]",
            );
        default:
            return cx("max-w-xs flex-col items-start gap-1 rounded-lg bg-primary-solid px-3 shadow-lg");
    }
}

interface TooltipProps extends AriaTooltipTriggerComponentProps, Omit<AriaTooltipProps, "children"> {
    /**
     * The title of the tooltip.
     */
    title: ReactNode;
    /**
     * The description of the tooltip.
     */
    description?: ReactNode;
    /**
     * Visual treatment: default dark popover, or warm tinted panels (centered, max-width).
     * @default "inverse"
     */
    tone?: TooltipTone;
    /**
     * Whether to show the arrow on the tooltip.
     *
     * @default false
     */
    arrow?: boolean;
    /**
     * Delay in milliseconds before the tooltip is shown.
     *
     * @default 300
     */
    delay?: number;
}

export const Tooltip = ({
    title,
    description,
    children,
    tone = "inverse",
    arrow = false,
    delay = 300,
    closeDelay = 0,
    trigger,
    isDisabled,
    isOpen,
    defaultOpen,
    offset = 6,
    crossOffset,
    placement = "top",
    onOpenChange,
    ...tooltipProps
}: TooltipProps) => {
    const isTopOrBottomLeft = ["top left", "top end", "bottom left", "bottom end"].includes(placement);
    const isTopOrBottomRight = ["top right", "top start", "bottom right", "bottom start"].includes(placement);
    // Set negative cross offset for left and right placement to visually balance the tooltip.
    const calculatedCrossOffset = isTopOrBottomLeft ? -12 : isTopOrBottomRight ? 12 : 0;

    return (
        <AriaTooltipTrigger {...{ trigger, delay, closeDelay, isDisabled, isOpen, defaultOpen, onOpenChange }}>
            {children}

            <AriaTooltip
                {...tooltipProps}
                offset={offset}
                placement={placement}
                crossOffset={crossOffset ?? calculatedCrossOffset}
                className={({ isEntering, isExiting }) => cx(isEntering && "ease-out animate-in", isExiting && "ease-in animate-out")}
            >
                {({ isEntering, isExiting }) => (
                    <div
                        className={cx(
                            "z-50 flex origin-(--trigger-anchor-point) will-change-transform",
                            tooltipSurfaceClass(tone),
                            tone === "inverse" && !description && "py-2",
                            tone === "inverse" && description && "py-3",

                            isEntering &&
                                "ease-out animate-in fade-in zoom-in-95 in-placement-left:slide-in-from-right-0.5 in-placement-right:slide-in-from-left-0.5 in-placement-top:slide-in-from-bottom-0.5 in-placement-bottom:slide-in-from-top-0.5",
                            isExiting &&
                                "ease-in animate-out fade-out zoom-out-95 in-placement-left:slide-out-to-right-0.5 in-placement-right:slide-out-to-left-0.5 in-placement-top:slide-out-to-bottom-0.5 in-placement-bottom:slide-out-to-top-0.5",
                        )}
                    >
                        <span
                            className={cx(
                                "text-xs font-semibold",
                                tone === "inverse"
                                    ? "text-white"
                                    : cx(
                                          "w-full",
                                          tone === "work" && "text-[var(--kira-revamp-popover-work-text)]",
                                          tone === "exam" && "text-[var(--kira-revamp-popover-exam-text)]",
                                          tone === "wellbeing" && "text-[var(--kira-revamp-popover-wellbeing-text)]",
                                      ),
                            )}
                        >
                            {title}
                        </span>

                        {description && (
                            <span
                                className={cx(
                                    "text-xs font-medium leading-snug",
                                    tone === "inverse"
                                        ? "text-tooltip-supporting-text"
                                        : cx(
                                              "w-full",
                                              tone === "work" && "text-[var(--kira-revamp-popover-work-muted)]",
                                              tone === "exam" && "text-[var(--kira-revamp-popover-exam-muted)]",
                                              tone === "wellbeing" && "text-[var(--kira-revamp-popover-wellbeing-muted)]",
                                          ),
                                )}
                            >
                                {description}
                            </span>
                        )}

                        {arrow && (
                            <AriaOverlayArrow>
                                <svg
                                    viewBox="0 0 100 100"
                                    className="size-2.5 fill-bg-primary-solid in-placement-left:-rotate-90 in-placement-right:rotate-90 in-placement-top:rotate-0 in-placement-bottom:rotate-180"
                                >
                                    <path d="M0,0 L35.858,35.858 Q50,50 64.142,35.858 L100,0 Z" />
                                </svg>
                            </AriaOverlayArrow>
                        )}
                    </div>
                )}
            </AriaTooltip>
        </AriaTooltipTrigger>
    );
};

interface TooltipTriggerProps extends AriaButtonProps {}

export const TooltipTrigger = ({ children, className, ...buttonProps }: TooltipTriggerProps) => {
    return (
        <AriaButton {...buttonProps} className={(values) => cx("h-max w-max outline-hidden", typeof className === "function" ? className(values) : className)}>
            {children}
        </AriaButton>
    );
};
