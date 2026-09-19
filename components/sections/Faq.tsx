"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { faq, whatsapp } from "@/lib/content";

const items = faq.items.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
}));

export default function Faq() {
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="mx-auto w-full max-w-3xl px-3 py-20 md:px-5 md:py-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">{faq.eyebrow}</p>
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">{faq.title}</h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground md:text-lg">{faq.sub}</p>
      </motion.div>

      <div className="mt-10 md:mt-14">
        <BouncyAccordion
          items={items}
          defaultValue={items[0].id}
          classNames={{
            item: "border border-border shadow-sm",
            trigger: "min-h-[64px] py-4 md:min-h-[76px] md:px-7",
            // The component truncates titles by default; let long questions wrap on phones.
            title: "!whitespace-normal text-base font-semibold md:text-lg",
            description: "text-base leading-7",
            content: "md:px-2",
          }}
        />
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-muted-foreground">{faq.ctaLabel}</p>
        <a
          href={whatsapp.href}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-terra hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <MessageCircle className="size-4" aria-hidden />
          {faq.cta}
        </a>
      </div>
    </section>
  );
}
