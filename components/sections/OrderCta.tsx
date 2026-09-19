"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Blob, BlobSay } from "@/components/feral/BlobMascot";
import OrderModal from "@/components/sections/OrderModal";
import { order } from "@/lib/content";
import { ORDER_EVENT, track } from "@/lib/order";
import type { JellyBlobMood } from "feral-blob";

/**
 * Final CTA. The blob starts asleep on the card: poking it wakes it and opens the order modal.
 * A plain button does the same, so nobody has to poke a mascot to order.
 */
export default function OrderCta() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<JellyBlobMood>("sleepy");
  const [line, setLine] = useState<string>(order.pokeHint);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const openModal = useCallback((source: string) => {
    track("quote_open", { source });
    setOpen(true);
  }, []);

  // Other CTAs (e.g. the hero button) open the same modal.
  useEffect(() => {
    const handler = () => {
      setMood("happy");
      setLine(order.awake);
      openModal("event");
    };
    window.addEventListener(ORDER_EVENT, handler);
    return () => window.removeEventListener(ORDER_EVENT, handler);
  }, [openModal]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Blob dozes back off after the modal closes so it can be poked again.
      later(() => {
        setMood("sleepy");
        setLine(order.pokeHint);
      }, 900);
    }
  };

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl px-3 py-20 md:px-5 md:py-32"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-12 text-background md:px-14 md:py-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-terra/30 blur-3xl"
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
              {order.eyebrow}
            </p>
            <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">
              {order.title}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty opacity-70 md:mx-0 md:text-lg">
              {order.sub}
            </p>
            <button
              type="button"
              onClick={() => {
                setMood("happy");
                setLine(order.awake);
                openModal("button");
              }}
              className="mt-8 rounded-full bg-terra px-8 py-4 text-base font-semibold text-white transition-transform hover:bg-terra-deep active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {order.button}
            </button>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2">
            <div aria-live="polite" className="min-h-14">
              <BlobSay mood={mood} messages={{ [mood]: line }} />
            </div>
            <Blob
              mood={mood}
              className="aspect-square w-52 md:w-64"
              onWake={() => {
                setMood("happy");
                setLine(order.awake);
                later(() => openModal("blob"), 700);
              }}
              onOverpoke={() => {
                setMood("angry");
                setLine(order.grumpy);
                later(() => {
                  setMood("sleepy");
                  setLine(order.pokeHint);
                }, 1800);
              }}
            />
          </div>
        </div>
      </motion.div>

      <OrderModal open={open} onOpenChange={handleOpenChange} />
    </section>
  );
}
