"use client";

import { ArrowRight, Check, X } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import {
  MorphingTabs,
  type MorphingTabsItem,
} from "@/components/motion/morphing-tabs";
import { solutions } from "@/lib/content";

type Solution = (typeof solutions.items)[number];

// FeralUI physics piece: below the fold, client-only, lazy-loaded.
const FurHeading = dynamic(() => import("@/components/feral/FurHeading"), {
  ssr: false,
  loading: () => <div className="min-h-[200px] md:min-h-[200px]" />,
});

function SolutionPanel({ item }: { item: Solution }) {
  return (
    <div className="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 dark:bg-[radial-gradient(circle_at_1px_1px,#2e2e2e_1px,transparent_1.5px)] md:px-12 md:py-10">
      <div className="relative grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground/40">
            <X aria-hidden className="size-3.5" />
            {solutions.labels.problem}
          </p>
          <h3 className="mt-3 text-2xl font-light tracking-[-0.045em] text-foreground/60 md:text-4xl">
            {item.problem.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-foreground/50 md:text-base">
            {item.problem.detail}
          </p>
        </div>

        <div className="md:border-l md:border-foreground/10 md:pl-12">
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-terra">
            <Check aria-hidden className="size-3.5" />
            {solutions.labels.fix}
          </p>
          <h3 className="mt-3 text-2xl font-light tracking-[-0.045em] text-foreground md:text-4xl">
            {item.fix.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-foreground/65 md:text-base">
            {item.fix.detail}
          </p>
          <a
            href={item.href}
            className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-foreground transition-colors hover:text-terra focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground md:text-sm"
          >
            {item.link}
            <ArrowRight aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

const items: MorphingTabsItem[] = solutions.items.map((item) => ({
  id: item.id,
  label: item.label,
  content: <SolutionPanel item={item} />,
}));

export default function Solutions() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="solutions"
      className="mx-auto w-full max-w-6xl px-3 py-20 md:px-5 md:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-10 w-full max-w-4xl text-center md:mb-14"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
          {solutions.eyebrow}
        </p>
        <h2 className="sr-only">{solutions.title}</h2>
        <div className="mt-6">
          <FurHeading
            wide={solutions.titleLines.wide}
            narrow={solutions.titleLines.narrow}
          />
        </div>
      </motion.div>

      <MorphingTabs
        items={items}
        defaultValue={solutions.items[0].id}
        ariaLabel="How Yopersh handles your order"
        classNames={{
          tab: "px-2 md:px-3 dark:aria-selected:text-white",
          label: "text-sm md:text-base",
          // The panel and its liquid tab notch must share one surface colour.
          activeTab: "dark:text-[#1c1c1c]",
          content: "dark:bg-[#1c1c1c]",
        }}
        className="w-full"
      />
    </section>
  );
}
