"use client";

import { MetalFx } from "metal-fx";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { hero, whatsapp } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

// false on the server and during hydration, true afterwards.
const subscribeNoop = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <section
      id="top"
      className="flex h-svh min-h-[560px] flex-col px-3 pb-3 pt-24 md:px-5 md:pb-5 md:pt-28"
    >
      {/* Dark bezel the metal ring is painted on; the video card sits inside it. */}
      <div className="relative min-h-0 flex-1 rounded-[1.75rem] bg-neutral-950 p-2.5 md:rounded-[2.5rem]">
        <div className="relative size-full overflow-hidden rounded-[1.05rem] bg-black md:rounded-[1.9rem]">
          {reduceMotion ? (
            // Static fallback: poster frame only, no autoplay.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.video.still}
              alt={hero.video.label}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <video
              className="absolute inset-0 size-full object-cover"
              poster={hero.video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={hero.video.label}
            >
              <source src={hero.video.mp4} type="video/mp4" />
              <source src={hero.video.webm} type="video/webm" />
            </video>
          )}

          {/* scrim keeps the copy legible over bright satellite tiles */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
          />

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 text-white md:flex-row md:items-end md:justify-between md:gap-10 md:p-12"
          >
            <div className="max-w-2xl">
              <h1 className="text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-7xl">
                {hero.headline}
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-sm text-white/80 md:text-lg">
                {hero.sub}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href={whatsapp.href}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-terra hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-base"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-base"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </motion.div>
        </div>

        {/* metal-fx renders a different tree on the server (unsupported fallback) than on a
            WebGL2 client, so the ring mounts after hydration as an overlay: the video and
            copy underneath are never wrapped or remounted. */}
        {mounted ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
          >
            <MetalFx
              preset="chromatic"
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              ringCssPx={10}
              disableGlow
              innerShadow
              paused={Boolean(reduceMotion)}
              style={{
                display: "flex",
                alignItems: "stretch",
                width: "100%",
                height: "100%",
                // MetalFx paints a button-style fill on its wrapper; we only want the ring.
                background: "transparent",
              }}
            >
              <div
                className="size-full rounded-[1.75rem] md:rounded-[2.5rem]"
                style={{ pointerEvents: "none" }}
              />
            </MetalFx>
          </div>
        ) : null}
      </div>
    </section>
  );
}
