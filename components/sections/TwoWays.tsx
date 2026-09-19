"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import JourneyMap from "@/components/sections/JourneyMap";
import { twoWays } from "@/lib/content";
import type { Lane } from "@/lib/journey";

export default function TwoWays() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Lane | null>(null);

  return (
    <section
      id="two-ways"
      className="mx-auto w-full max-w-6xl px-3 py-20 md:px-5 md:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
          {twoWays.eyebrow}
        </p>
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">
          {twoWays.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground md:text-lg">
          {twoWays.sub}
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
        {twoWays.modes.map((mode) => (
          <div
            key={mode.lane}
            tabIndex={0}
            onPointerEnter={() => setActive(mode.lane)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(mode.lane)}
            onBlur={() => setActive(null)}
            className={`rounded-3xl border bg-card p-6 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring md:p-8 ${
              active === mode.lane
                ? "border-foreground/40 shadow-lg"
                : "border-border"
            } ${active && active !== mode.lane ? "opacity-60" : "opacity-100"}`}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={`grid size-8 place-items-center rounded-full text-sm font-bold ${mode.lane === "a" ? "bg-terra text-white" : "bg-foreground text-background"}`}
              >
                {mode.tag}
              </span>
              <h3 className="text-2xl md:text-3xl">{mode.title}</h3>
            </div>
            <p className="mt-4 text-muted-foreground">{mode.lead}</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-9 shrink-0 font-semibold uppercase tracking-[0.14em] text-foreground/50">
                  {twoWays.youLabel}
                </dt>
                <dd>{mode.you}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-9 shrink-0 font-semibold uppercase tracking-[0.14em] text-terra">
                  {twoWays.weLabel}
                </dt>
                <dd>{mode.we}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-10 md:mt-14">
        <JourneyMap active={active} />
      </div>
    </section>
  );
}
