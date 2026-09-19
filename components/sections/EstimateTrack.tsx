"use client";

import { motion, useReducedMotion } from "motion/react";
import Estimator from "@/components/sections/Estimator";
import PhoneTracker from "@/components/sections/PhoneTracker";
import { estimate } from "@/lib/content";

export default function EstimateTrack() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="estimate"
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
          {estimate.eyebrow}
        </p>
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">
          {estimate.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground md:text-lg">
          {estimate.sub}
        </p>
      </motion.div>

      {/* Side by side on large screens; the estimator stacks above the phone on smaller ones. */}
      <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <Estimator />
        <PhoneTracker />
      </div>
    </section>
  );
}
