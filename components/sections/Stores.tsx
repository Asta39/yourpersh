"use client";

import { Hand } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { stores } from "@/lib/content";

type Item = (typeof stores.items)[number];

const MOBILE_COLS = [17, 50, 83];

/** Phones get a 3-column grid (in array order) with gaps left between items so the page can still scroll. */
function mobilePosition(index: number, total: number) {
  const rows = Math.ceil(total / MOBILE_COLS.length);
  const row = Math.floor(index / MOBILE_COLS.length);
  const lastRowCount = total - (rows - 1) * MOBILE_COLS.length;
  const col = index % MOBILE_COLS.length;
  const x =
    row === rows - 1 && lastRowCount === 1
      ? 50
      : row === rows - 1 && lastRowCount === 2
        ? [33, 67][col]
        : MOBILE_COLS[col];
  return { mx: `${x}%`, my: `${((row + 0.5) / rows) * 100}%` };
}

/** Width that shrinks with the viewport: full `w` from ~1280px up, never below 58% of it. */
function fluidWidth(w: number) {
  return `clamp(${Math.round(w * 0.58)}px, ${((w / 1280) * 100).toFixed(2)}vw, ${w}px)`;
}

function Sticker({ item }: { item: Extract<Item, { kind: "sticker" }> }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt=""
      width={448}
      height={448}
      draggable={false}
      className="pointer-events-none block h-auto w-full select-none"
    />
  );
}

function Logo({ item }: { item: Extract<Item, { kind: "logo" }> }) {
  return (
    <div className="pointer-events-none rounded-2xl bg-white p-3 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.35)] ring-1 ring-black/5 md:p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.name}
        width={item.ratio[0]}
        height={item.ratio[1]}
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </div>
  );
}

export default function Stores() {
  const reduceMotion = useReducedMotion();
  const board = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState<string | null>(null);
  const [dragged, setDragged] = useState(false);
  const total = stores.items.length;

  return (
    <section
      id="stores"
      className="mx-auto w-full max-w-6xl px-3 py-20 md:px-5 md:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
          {stores.eyebrow}
        </p>
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">
          {stores.title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground md:text-lg">
          {stores.sub}
        </p>
      </motion.div>

      {/* Logos are content, so give assistive tech a plain list (the board itself is decorative play). */}
      <ul className="sr-only">
        {stores.items.map((item) =>
          item.kind === "logo" ? <li key={item.id}>{item.name}</li> : null,
        )}
      </ul>

      <div
        ref={board}
        className="relative h-[760px] overflow-hidden rounded-[2rem] border border-border bg-muted/40 bg-[radial-gradient(circle_at_1px_1px,var(--line)_1px,transparent_1.5px)] bg-[size:28px_28px] md:h-[640px] md:rounded-[2.5rem]"
      >
        {stores.items.map((item, index) => {
          const { mx, my } = mobilePosition(index, total);
          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={board}
              dragElastic={0.12}
              dragMomentum
              dragTransition={{ power: 0.2, timeConstant: 180 }}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.12 }}
              initial={
                reduceMotion
                  ? { rotate: item.rotate }
                  : { opacity: 0, scale: 0.5, rotate: item.rotate - 25 }
              }
              whileInView={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      scale: 1,
                      rotate: item.rotate,
                      transition: {
                        type: "spring",
                        stiffness: 240,
                        damping: 16,
                        delay: 0.15 + index * 0.05,
                      },
                    }
              }
              viewport={{ once: true, margin: "-60px" }}
              onPointerDown={() => setFront(item.id)}
              onDragStart={() => setDragged(true)}
              style={
                {
                  "--mx": mx,
                  "--my": my,
                  "--dx": `${item.dx}%`,
                  "--dy": `${item.dy}%`,
                  width: fluidWidth(item.w),
                  zIndex: front === item.id ? 30 : 1,
                  touchAction: "none",
                } as React.CSSProperties
              }
              className="absolute left-[var(--mx)] top-[var(--my)] -translate-x-1/2 -translate-y-1/2 cursor-grab select-none active:cursor-grabbing md:left-[var(--dx)] md:top-[var(--dy)]"
            >
              {item.kind === "logo" ? <Logo item={item} /> : <Sticker item={item} />}
            </motion.div>
          );
        })}

        <p
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-4 z-40 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition-opacity duration-500 ${dragged ? "opacity-0" : "opacity-100"}`}
        >
          <Hand className="size-4" />
          {stores.hint}
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
        {stores.legal}
      </p>
    </section>
  );
}
