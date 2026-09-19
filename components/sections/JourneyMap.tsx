"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { stores, twoWays } from "@/lib/content";
import { useIsDesktop } from "@/lib/use-is-desktop";
import {
  desktop,
  mobile,
  SPRITES,
  type Lane,
  type Layout,
  type Receipt,
  type Rider,
  type SpriteId,
} from "@/lib/journey";

/** Scroll windows (0..1 across the map) during which each leg plays. */
const LANE_WINDOW = [0.03, 0.3] as const;
const TRUNK_WINDOW = [0.3, 0.68] as const;
const LAST_WINDOW = [0.68, 0.95] as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (t: number) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};

const logoFor = (id: string) =>
  stores.items.find(
    (item): item is Extract<(typeof stores.items)[number], { kind: "logo" }> =>
      item.kind === "logo" && item.id === id,
  );

/* ---------- static pieces ---------- */

function Sticker({
  layout,
  sprite,
  x,
  y,
  w,
  rotate = 0,
  className = "",
  children,
}: {
  layout: Layout;
  sprite: SpriteId;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const s = SPRITES[sprite];
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{
        left: `${(x / layout.W) * 100}%`,
        top: `${(y / layout.H) * 100}%`,
        width: `${(w / layout.W) * 100}%`,
        rotate: `${rotate}deg`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.src}
        alt=""
        width={s.w}
        height={s.h}
        draggable={false}
        className="block h-auto w-full select-none"
      />
      {children}
    </div>
  );
}

function ReceiptSticker({ layout, receipt, dim }: { layout: Layout; receipt: Receipt; dim: boolean }) {
  const logo = logoFor(receipt.store);
  return (
    <Sticker
      layout={layout}
      sprite={receipt.sprite}
      x={receipt.x}
      y={receipt.y}
      w={receipt.w}
      rotate={receipt.rotate}
      className={`z-[2] transition-opacity duration-300 ${dim ? "opacity-30" : "opacity-100"}`}
    >
      {logo ? (
        <div className="absolute left-[17%] top-[10%] w-[66%] rounded-[5px] bg-white px-[5%] py-[4%] shadow-[0_2px_5px_rgb(0_0_0/0.18)] ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            width={logo.ratio[0]}
            height={logo.ratio[1]}
            draggable={false}
            className="block h-auto w-full"
          />
        </div>
      ) : null}
    </Sticker>
  );
}

function PlaceLabel({ layout, x, y, children }: { layout: Layout; x: number; y: number; children: React.ReactNode }) {
  return (
    <span
      className="absolute z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-background/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm backdrop-blur md:text-xs"
      style={{ left: `${(x / layout.W) * 100}%`, top: `${(y / layout.H) * 100}%` }}
    >
      {children}
    </span>
  );
}

function LaneTag({ layout, lane, x, y }: { layout: Layout; lane: Lane; x: number; y: number }) {
  return (
    <span
      aria-hidden
      className={`absolute z-[3] grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold md:size-9 md:text-sm ${lane === "a" ? "bg-terra text-white" : "bg-foreground text-background"}`}
      style={{ left: `${(x / layout.W) * 100}%`, top: `${(y / layout.H) * 100}%` }}
    >
      {lane.toUpperCase()}
    </span>
  );
}

/* ---------- animated pieces ---------- */

function Track({
  d,
  win,
  colorVar,
  progress,
  reduce,
  dim,
  dashed,
}: {
  d: string;
  win: readonly [number, number];
  colorVar: string;
  progress: MotionValue<number>;
  reduce: boolean;
  dim: boolean;
  dashed?: boolean;
}) {
  const drawn = useTransform(progress, [win[0], win[1]], [0, 1], { clamp: true });
  return (
    <g style={{ opacity: dim ? 0.3 : 1, transition: "opacity 300ms" }}>
      <path
        d={d}
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="1 14"
        style={{ stroke: "var(--muted-foreground)", opacity: 0.45 }}
      />
      <motion.path
        d={d}
        fill="none"
        strokeWidth={dashed ? 5 : 6}
        strokeLinecap="round"
        strokeDasharray={dashed ? "2 12" : undefined}
        style={{ stroke: colorVar, pathLength: reduce ? 1 : drawn }}
      />
    </g>
  );
}

/**
 * A sticker that rides along an SVG path, driven by scroll progress. Position comes from
 * `getPointAtLength`, so it follows the curve exactly at any container size.
 */
function RiderSprite({
  progress,
  layout,
  d,
  win,
  rider,
  reduce,
  dim,
  fadeOut,
  fadeIn = false,
  staticAt,
}: {
  progress: MotionValue<number>;
  layout: Layout;
  d: string;
  win: readonly [number, number];
  rider: Rider;
  reduce: boolean;
  dim: boolean;
  fadeOut: boolean;
  /** Hidden until its leg starts, then eases in. */
  fadeIn?: boolean;
  /** Where (0..1 along the path) to park when motion is reduced. */
  staticAt: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const left = useMotionValue("0%");
  const top = useMotionValue("0%");
  const rotate = useMotionValue(0);
  const flip = useMotionValue(1);
  const opacity = useMotionValue(1);
  const s = SPRITES[rider.sprite];

  const update = useCallback(
    (v: number) => {
      const path = pathRef.current;
      if (!path) return false;
      const len = path.getTotalLength();
      if (!len) return false;
      // progress can briefly be non-finite before the target is measured; treat that as "not started"
      const safe = Number.isFinite(v) ? v : 0;
      const t = reduce ? staticAt : clamp((safe - win[0]) / (win[1] - win[0]), 0, 1);
      const at = t * len;
      const p = path.getPointAtLength(at);
      const a = path.getPointAtLength(Math.max(0, at - 2));
      const b = path.getPointAtLength(Math.min(len, at + 2));
      let angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      let facing = 1;
      if (Math.abs(angle) > 90) {
        facing = -1;
        angle = angle > 0 ? angle - 180 : angle + 180;
      }
      const lean = clamp(angle, -rider.tilt, rider.tilt);
      left.set(`${(p.x / layout.W) * 100}%`);
      top.set(`${(p.y / layout.H) * 100}%`);
      flip.set(facing);
      // motion applies scale before rotate, so a mirrored sprite needs the lean mirrored too
      rotate.set(facing === -1 ? -lean : lean);
      const appear = fadeIn && !reduce ? smooth(t / 0.06) : 1;
      const vanish = fadeOut && !reduce ? 1 - smooth((t - 0.86) / 0.14) : 1;
      opacity.set(appear * vanish);
      return true;
    },
    [reduce, staticAt, win, rider.tilt, fadeOut, fadeIn, layout, left, top, rotate, flip, opacity],
  );

  useLayoutEffect(() => {
    // The path may not be measurable on the very first frame; retry until it is.
    let frame = 0;
    let tries = 0;
    const run = () => {
      if (!update(progress.get()) && tries++ < 30) frame = requestAnimationFrame(run);
    };
    run();
    return () => cancelAnimationFrame(frame);
  }, [update, progress, d, layout]);
  useMotionValueEvent(progress, "change", update);

  return (
    <>
      <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
        <path ref={pathRef} d={d} />
      </svg>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[4] -translate-x-1/2 -translate-y-1/2"
        style={{
          left,
          top,
          rotate,
          scaleX: flip,
          opacity,
          width: `${(rider.w / layout.W) * 100}%`,
        }}
      >
        <div className={`transition-opacity duration-300 ${dim ? "opacity-30" : "opacity-100"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt="" width={s.w} height={s.h} draggable={false} className="block h-auto w-full select-none" />
        </div>
      </motion.div>
    </>
  );
}

export default function JourneyMap({ active }: { active: Lane | null }) {
  const isDesktop = useIsDesktop();
  const layout = isDesktop ? desktop : mobile;
  const reduce = Boolean(useReducedMotion());
  const mapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const dimA = active === "b";
  const dimB = active === "a";
  const { places } = layout;

  return (
    <div
      ref={mapRef}
      className="relative w-full"
      style={{ aspectRatio: `${layout.W} / ${layout.H}` }}
    >
      <p className="sr-only">
        Your order goes from the store to our Dubai hub, flies to Nairobi, then a van
        drives it to your home.
      </p>

      <svg
        aria-hidden
        viewBox={`0 0 ${layout.W} ${layout.H}`}
        className="absolute inset-0 z-[1] size-full"
        preserveAspectRatio="none"
      >
        <Track d={layout.lanes.a.d} win={LANE_WINDOW} colorVar="var(--terra)" progress={scrollYProgress} reduce={reduce} dim={dimA} />
        <Track d={layout.lanes.b.d} win={LANE_WINDOW} colorVar="var(--foreground)" progress={scrollYProgress} reduce={reduce} dim={dimB} />
        <Track d={layout.trunk.d} win={TRUNK_WINDOW} colorVar="var(--terra)" progress={scrollYProgress} reduce={reduce} dim={false} dashed />
        <Track d={layout.last.d} win={LAST_WINDOW} colorVar="var(--delivered)" progress={scrollYProgress} reduce={reduce} dim={false} />
      </svg>

      {(["a", "b"] as const).map((lane) => (
        <div key={lane}>
          <LaneTag layout={layout} lane={lane} x={layout.lanes[lane].tag.x} y={layout.lanes[lane].tag.y} />
          {layout.lanes[lane].receipts.map((receipt) => (
            <ReceiptSticker
              key={receipt.store}
              layout={layout}
              receipt={receipt}
              dim={lane === "a" ? dimA : dimB}
            />
          ))}
          <RiderSprite
            progress={scrollYProgress}
            layout={layout}
            d={layout.lanes[lane].d}
            win={LANE_WINDOW}
            rider={layout.lanes[lane].van}
            reduce={reduce}
            dim={lane === "a" ? dimA : dimB}
            fadeOut
            staticAt={0.45}
          />
        </div>
      ))}

      <Sticker layout={layout} sprite="dubai" x={places.dubai.x} y={places.dubai.y} w={places.dubai.w} className="z-[2]" />
      <PlaceLabel layout={layout} x={places.dubai.label.x} y={places.dubai.label.y}>{twoWays.places.dubai}</PlaceLabel>

      <RiderSprite
        progress={scrollYProgress}
        layout={layout}
        d={layout.trunk.d}
        win={TRUNK_WINDOW}
        rider={layout.trunk.plane}
        reduce={reduce}
        dim={false}
        fadeOut
        fadeIn
        staticAt={0.4}
      />

      <Sticker layout={layout} sprite="nairobi" x={places.nairobi.x} y={places.nairobi.y} w={places.nairobi.w} className="z-[2]" />
      <PlaceLabel layout={layout} x={places.nairobi.label.x} y={places.nairobi.label.y}>{twoWays.places.nairobi}</PlaceLabel>

      <Sticker layout={layout} sprite="home" x={places.home.x} y={places.home.y} w={places.home.w} className="z-[2]" />
      <PlaceLabel layout={layout} x={places.home.label.x} y={places.home.label.y}>{twoWays.places.home}</PlaceLabel>

      <RiderSprite
        progress={scrollYProgress}
        layout={layout}
        d={layout.last.d}
        win={LAST_WINDOW}
        rider={layout.last.van}
        reduce={reduce}
        dim={false}
        fadeOut={false}
        fadeIn
        staticAt={1}
      />
    </div>
  );
}
