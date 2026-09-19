"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import AnimatedNumber, {
  formatUsd,
} from "@/components/sections/AnimatedNumber";
import { estimate } from "@/lib/content";

type Item = (typeof estimate.items)[number];

/** Where packed items sit inside the box sprite (centre %, in packing order). */
const SLOTS = [
  [33, 38],
  [55, 31],
  [71, 42],
  [42, 52],
  [62, 54],
  [51, 43],
] as const;

const copy = estimate.builder;
const { rates } = estimate;

function price(packed: readonly Item[]) {
  const subtotal = packed.reduce((sum, item) => sum + item.price, 0);
  const kg = packed.reduce((sum, item) => sum + item.kg, 0);
  if (!packed.length)
    return { subtotal: 0, kg: 0, fee: 0, customs: 0, delivery: 0, total: 0 };
  const fee = Math.max(rates.serviceFeeMin, subtotal * rates.serviceFeePct);
  const customs = subtotal * rates.customsPct;
  const delivery = Math.max(rates.deliveryMin, kg * rates.deliveryPerKg);
  return {
    subtotal,
    kg,
    fee,
    customs,
    delivery,
    total: subtotal + fee + customs + delivery,
  };
}

export default function Estimator() {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const justDragged = useRef(false);
  const [packedIds, setPackedIds] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  const packed = packedIds
    .map((id) => estimate.items.find((item) => item.id === id))
    .filter((item): item is Item => Boolean(item));
  const totals = price(packed);

  const toggle = (id: string) =>
    setPackedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  const add = (id: string) =>
    setPackedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));

  const pointerOverBox = (point: { x: number; y: number }) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return false;
    const x = point.x - window.scrollX;
    const y = point.y - window.scrollY;
    return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
  };

  return (
    <div className="relative rounded-[2rem] border border-border bg-card p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl md:text-3xl">{copy.title}</h3>
        <p className="text-sm text-muted-foreground">{copy.hint}</p>
      </div>

      {/* tray */}
      <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {estimate.items.map((item) => {
          const isPacked = packedIds.includes(item.id);
          return (
            <li key={item.id} className="relative">
              <motion.button
                type="button"
                aria-pressed={isPacked}
                aria-label={`${item.name}, ${formatUsd(item.price)}. ${isPacked ? "In your box, tap to remove" : "Tap to add to your box"}`}
                drag={!isPacked}
                dragSnapToOrigin
                dragElastic={0.25}
                whileDrag={{ scale: 1.15, zIndex: 60 }}
                whileHover={isPacked ? undefined : { y: -3 }}
                onDragStart={() => {
                  justDragged.current = true;
                }}
                onDrag={(_, info) => setOver(pointerOverBox(info.point))}
                onDragEnd={(_, info) => {
                  setOver(false);
                  if (pointerOverBox(info.point)) add(item.id);
                  setTimeout(() => {
                    justDragged.current = false;
                  }, 0);
                }}
                onClick={() => {
                  if (justDragged.current) return;
                  toggle(item.id);
                }}
                style={{ touchAction: "none" }}
                className={`relative flex w-full cursor-grab flex-col items-center gap-1 rounded-2xl border p-2 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing ${
                  isPacked
                    ? "border-dashed border-border bg-transparent opacity-40"
                    : "border-border bg-muted/50 hover:bg-muted"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  width={item.w}
                  height={item.h}
                  draggable={false}
                  className="pointer-events-none block h-16 w-auto select-none object-contain sm:h-14 md:h-16"
                />
                <span className="text-[0.7rem] font-medium leading-tight">
                  {item.name}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {formatUsd(item.price)}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
        {/* box */}
        <div>
          <div
            ref={boxRef}
            className={`relative mx-auto aspect-[516/479] w-full max-w-[320px] rounded-3xl transition-all duration-200 ${
              over
                ? "scale-[1.03] bg-terra/10 ring-2 ring-terra ring-offset-2 ring-offset-card"
                : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/estimate/box.webp"
              alt=""
              width={516}
              height={479}
              draggable={false}
              className="pointer-events-none block size-full select-none"
            />
            <AnimatePresence>
              {packed.slice(0, SLOTS.length).map((item, index) => {
                const [x, y] = SLOTS[index];
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => toggle(item.id)}
                    initial={reduce ? false : { scale: 0, y: -40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={
                      reduce ? { opacity: 0 } : { scale: 0, y: -30, opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="absolute w-[24%] -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ left: `${x}%`, top: `${y}%`, zIndex: index + 2 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      width={item.w}
                      height={item.h}
                      draggable={false}
                      className="pointer-events-none block h-auto w-full select-none"
                    />
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {!packed.length ? (
              <span className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                {over ? copy.dropHint : copy.boxLabel}
              </span>
            ) : null}
          </div>
        </div>

        {/* receipt */}
        <div className="relative">
          <div
            aria-live="polite"
            className="relative rounded-2xl bg-white px-5 pb-8 pt-5 font-mono text-[0.8rem] text-neutral-900 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5 [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),96%_100%,92%_calc(100%-10px),88%_100%,84%_calc(100%-10px),80%_100%,76%_calc(100%-10px),72%_100%,68%_calc(100%-10px),64%_100%,60%_calc(100%-10px),56%_100%,52%_calc(100%-10px),48%_100%,44%_calc(100%-10px),40%_100%,36%_calc(100%-10px),32%_100%,28%_calc(100%-10px),24%_100%,20%_calc(100%-10px),16%_100%,12%_calc(100%-10px),8%_100%,4%_calc(100%-10px),0_100%)]"
          >
            <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Yopersh · Quote
            </p>
            <div className="mt-3 min-h-24 border-t border-dashed border-neutral-300 pt-3">
              {!packed.length ? (
                <p className="py-4 text-center text-neutral-500">
                  {copy.empty}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  <AnimatePresence initial={false}>
                    {packed.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex justify-between gap-3 overflow-hidden"
                      >
                        <span>{item.name}</span>
                        <span>{formatUsd(item.price)}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {packed.length ? (
              <div className="mt-3 space-y-1.5 border-t border-dashed border-neutral-300 pt-3 text-neutral-600">
                <div className="flex justify-between">
                  <span>{copy.itemsLabel}</span>
                  <AnimatedNumber value={totals.subtotal} />
                </div>
                <div className="flex justify-between">
                  <span>{copy.serviceFee}</span>
                  <AnimatedNumber value={totals.fee} />
                </div>
                <div className="flex justify-between">
                  <span>{copy.customs}</span>
                  <AnimatedNumber value={totals.customs} />
                </div>
                <div className="flex justify-between">
                  <span>
                    {copy.delivery} · {totals.kg.toFixed(1)} kg
                  </span>
                  <AnimatedNumber value={totals.delivery} />
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex items-baseline justify-between border-t-2 border-neutral-900 pt-3">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em]">
                {copy.total}
              </span>
              <AnimatedNumber
                value={totals.total}
                className="text-xl font-bold"
              />
            </div>

            <div className="mt-4 flex min-h-11 justify-center" aria-hidden>
              <AnimatePresence>
                {packed.length ? (
                  <motion.div
                    initial={
                      reduce ? false : { scale: 2.2, opacity: 0, rotate: -2 }
                    }
                    animate={{ scale: 1, opacity: 1, rotate: -6 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 420, damping: 16 }}
                    className="rounded-md border-2 border-terra px-2 py-1 text-center text-[0.6rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-terra"
                  >
                    <span className="block rounded-[3px] border border-terra/70 px-2 py-0.5">
                      {copy.stamp}
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">{copy.note}</p>
    </div>
  );
}
