import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { cx } from "@/utils/cx";

export const DialogTrigger = AriaDialogTrigger;

const overlayEnter = "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 motion-safe:ease-out";
const overlayExit = "motion-safe:animate-out motion-safe:fade-out motion-safe:duration-200 motion-safe:ease-in";
const modalEnter =
    "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-6 motion-safe:duration-350 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] sm:motion-safe:slide-in-from-bottom-0";
const modalExit = "motion-safe:animate-out motion-safe:fade-out motion-safe:zoom-out-95 motion-safe:duration-200 motion-safe:ease-in";

export const ModalOverlay = (props: AriaModalOverlayProps) => {
    return (
        <AriaModalOverlay
            {...props}
            className={(state) =>
                cx(
                    "pointer-events-auto fixed inset-0 z-[100] flex min-h-dvh w-full items-end justify-center overflow-y-auto bg-neutral-950/92 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-sm sm:items-center sm:justify-center sm:p-8 dark:bg-neutral-900/94",
                    state.isEntering && overlayEnter,
                    state.isExiting && overlayExit,
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        />
    );
};

export const Modal = (props: AriaModalOverlayProps) => (
    <AriaModal
        {...props}
        className={(state) =>
            cx(
                "pointer-events-auto relative z-[1] max-h-full w-full align-middle outline-hidden max-sm:overflow-y-auto max-sm:rounded-xl",
                state.isEntering && modalEnter,
                state.isExiting && modalExit,
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);

export const Dialog = (props: AriaDialogProps) => (
    <AriaDialog {...props} className={cx("flex w-full items-center justify-center outline-hidden", props.className)} />
);
