"use client";

import { motion, useReducedMotion } from "motion/react";
import HowItWorksBoard, {
  type Step,
} from "@/components/sections/HowItWorksBoard";
import { howItWorks } from "@/lib/content";

// Brand-tinted card colours. They use the theme tokens (or explicit dark: pairs), so the
// cards follow light/dark mode with the rest of the site.
const TONES: Record<
  (typeof howItWorks.steps)[number]["tone"],
  NonNullable<Step["colors"]>
> = {
  terra: {
    bg: "bg-terra-soft",
    text: "text-terra",
    border: "border-terra/20",
  },
  ink: {
    bg: "bg-muted",
    text: "text-foreground",
    border: "border-border",
  },
  delivered: {
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-500/20",
  },
};

const features: Step[] = howItWorks.steps.map((step) => ({
  title: step.title,
  description: step.description,
  colors: TONES[step.tone],
}));

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-background">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl px-6 pt-20 text-center md:pt-32"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
          {howItWorks.eyebrow}
        </p>
        <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
          {howItWorks.title}
        </h2>
      </motion.div>

      <HowItWorksBoard features={features} />
    </section>
  );
}
