"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import { useRef } from "react";
import OrderForm from "@/components/sections/OrderForm";
import { order } from "@/lib/content";
import { useIsDesktop } from "@/lib/use-is-desktop";

const closeClass =
  "absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-terra";

/** Centered modal on desktop, swipe-to-dismiss bottom sheet on phones. Both are focus-trapped. */
export default function OrderModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isDesktop = useIsDesktop();
  const nameRef = useRef<HTMLInputElement>(null);
  const close = () => onOpenChange(false);

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup
            initialFocus={nameRef}
            className="fixed left-1/2 top-1/2 z-[70] max-h-[92dvh] w-[min(92vw,600px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-border bg-background p-8 shadow-2xl outline-none transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
          >
            <Dialog.Close aria-label={order.modal.close} className={closeClass}>
              <X className="size-5" aria-hidden />
            </Dialog.Close>
            <OrderForm
              Title={Dialog.Title}
              Description={Dialog.Description}
              nameRef={nameRef}
              onDone={close}
            />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-[70] flex items-end">
          <Drawer.Popup
            initialFocus={false}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] border border-b-0 border-border bg-background px-5 pb-8 pt-3 shadow-2xl outline-none transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [transform:translateY(var(--drawer-swipe-movement-y,0px))] data-[ending-style]:[transform:translateY(100%)] data-[starting-style]:[transform:translateY(100%)] data-[swiping]:transition-none"
          >
            <div
              aria-hidden
              className="mx-auto mb-2 h-1.5 w-11 rounded-full bg-foreground/20"
            />
            <Drawer.Close
              aria-label={order.modal.close}
              className={`${closeClass} top-3`}
            >
              <X className="size-5" aria-hidden />
            </Drawer.Close>
            <Drawer.Content>
              <OrderForm
                Title={Drawer.Title}
                Description={Drawer.Description}
                nameRef={nameRef}
                onDone={close}
              />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
