"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { footer, whatsapp } from "@/lib/content";
import { openOrder } from "@/lib/order";

// Where the orb sits inside the mark image (fractions), used to centre the glow.
const ORB = { x: 0.482, y: 0.442 };

const linkClass =
  "block py-1.5 text-[0.95rem] text-foreground/90 transition-colors hover:text-terra focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra";

function FooterLink({
  link,
}: {
  link: (typeof footer.columns)[number]["links"][number];
}) {
  if ("action" in link) {
    return (
      <button
        type="button"
        onClick={openOrder}
        className={`${linkClass} text-left`}
      >
        {link.label}
      </button>
    );
  }
  if (link.href === null) {
    return (
      <span className="block py-1.5 text-[0.95rem] text-muted-foreground">
        {link.label}
      </span>
    );
  }
  const external = link.href.startsWith("http");
  const href =
    link.href === "whatsapp"
      ? whatsapp.href
      : link.href === "tel"
        ? `tel:+${whatsapp.href.split("/").pop()}`
        : link.href;
  const label = link.href === "tel" ? whatsapp.display : link.label;
  return (
    <a
      href={href}
      {...(external || link.href === "whatsapp"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={linkClass}
    >
      {label}
    </a>
  );
}

/** Concentric rings and spokes behind the mark, drifting slowly. */
function Orbits({ reduce }: { reduce: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1000 1000"
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150%] max-w-[1500px] -translate-x-1/2 -translate-y-1/2 text-foreground md:w-[135%]"
      style={{
        maskImage: "radial-gradient(circle, #000 35%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(circle, #000 35%, transparent 72%)",
      }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 240, ease: "linear", repeat: Infinity }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.14">
        <circle cx="500" cy="500" r="190" />
        <circle cx="500" cy="500" r="320" />
        <circle cx="500" cy="500" r="455" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={500 + Math.cos(angle) * 190}
              y1={500 + Math.sin(angle) * 190}
              x2={500 + Math.cos(angle) * 500}
              y2={500 + Math.sin(angle) * 500}
            />
          );
        })}
      </g>
    </motion.svg>
  );
}

/** The big mark: tilts toward the pointer, with a breathing orb glow. */
function Mark() {
  const reduce = Boolean(useReducedMotion());
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), {
    stiffness: 120,
    damping: 16,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 16,
  });

  return (
    <div
      className="relative mx-auto w-[min(88vw,640px)] [perspective:1100px]"
      onPointerMove={(event) => {
        if (reduce || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <Orbits reduce={reduce} />
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={reduce ? undefined : { rotateX, rotateY }}
        className="relative"
      >
        {/* glow under the orb */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${ORB.x * 100}%`,
            top: `${ORB.y * 100}%`,
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--terra) 55%, transparent) 0%, transparent 62%)",
          }}
          animate={
            reduce
              ? undefined
              : { opacity: [0.65, 1, 0.65], scale: [0.94, 1.06, 0.94] }
          }
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/mark.webp"
          alt={footer.markAlt}
          width={1100}
          height={1086}
          draggable={false}
          className="relative block h-auto w-full select-none drop-shadow-[0_30px_40px_rgb(0_0_0/0.25)]"
        />
      </motion.div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="footer"
      className="overflow-hidden bg-muted/70 dark:bg-[#0f0f0f]"
    >
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-16 md:px-8 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {footer.columns.map((column) => (
            <nav key={column.id} aria-label={column.title}>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/trust/icons/${column.icon}.webp`}
                  alt=""
                  width={128}
                  height={128}
                  draggable={false}
                  className="size-6 select-none"
                />
                {column.title}
              </div>
              <ul className="mt-4 border-l border-foreground/10 pl-5 md:ml-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="relative mt-16 md:mt-24">
          <Mark />
        </div>

        <div className="relative z-10 mt-10 flex flex-col items-center gap-2 border-t border-foreground/10 pt-6 text-center text-xs text-muted-foreground md:mt-14">
          <p className="font-medium text-foreground/70">{footer.copyright}</p>
          <p className="max-w-2xl text-pretty">{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
