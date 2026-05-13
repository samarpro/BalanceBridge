import type { ReactNode } from "react";
import { HelpCircle } from "@untitledui/icons";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export interface HoverHintProps {
    /** Primary line in the tooltip. */
    title: string;
    /** Supporting detail (optional). */
    description?: ReactNode;
    className?: string;
}

function srSummary(title: string, description?: ReactNode): string {
    if (typeof description === "string" && description.trim()) return `${title}. ${description}`;
    return title;
}

export function HoverHint({ title, description, className }: HoverHintProps) {
    return (
        <Tooltip title={title} description={description} placement="top">
            <TooltipTrigger
                type="button"
                className={cx(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-fg-quaternary outline-offset-2 transition duration-100 ease-linear hover:bg-secondary_alt hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-focus-ring",
                    className,
                )}
            >
                <HelpCircle className="size-4" aria-hidden />
                <span className="sr-only">{srSummary(title, description)}</span>
            </TooltipTrigger>
        </Tooltip>
    );
}
