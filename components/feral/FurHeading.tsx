"use client";

import { Fur } from "feral-fur";
import "feral-fur/fur.css";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export type FurLine = { text: string; tone: "ink" | "terra" };

// Fur paints canvas, so it needs concrete colours (CSS vars don't resolve there).
const TONES = {
  light: { ink: "#171717", terra: "#c8553d" },
  dark: { ink: "#f5f5f5", terra: "#e26a51" },
} as const;

// Fur draws text in this stack at weight 900, one line, fitted to its box.
// We measure with the same stack so every line lands at the same type size.
const FUR_FONT = `ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, 'Segoe UI', system-ui, sans-serif`;

const MAX_LINE_HEIGHT = 64; // px, caps the type size on wide screens
const MIN_WIDE_LINE_HEIGHT = 46; // below this the 3-line set is too small, use the narrow set

type Layout = { lines: { text: string; tone: FurLine["tone"]; width: number }[]; height: number };

function measureEm(ctx: CanvasRenderingContext2D, text: string) {
  ctx.font = `900 100px ${FUR_FONT}`;
  return ctx.measureText(text).width / 100;
}

/** Width Fur needs so `text` is height-bound (type size = 0.86 × height), including its letter-spacing. */
function widthFor(em: number, chars: number, height: number) {
  return (0.86 * height * (100 * em + 0.04 * chars * height) * 1.04) / 90;
}

function layoutFor(ctx: CanvasRenderingContext2D, lines: readonly FurLine[], available: number) {
  const ems = lines.map((line) => measureEm(ctx, line.text));
  const widest = () => Math.max(...lines.map((line, i) => widthFor(ems[i], line.text.length, height)));

  let height = MAX_LINE_HEIGHT;
  while (widest() > available && height > 12) height *= 0.96;

  return {
    height,
    lines: lines.map((line, i) => ({
      ...line,
      width: widthFor(ems[i], line.text.length, height),
    })),
  } satisfies Layout;
}

/**
 * Headline lettering grown from fur. Purely visual (Fur's canvas is aria-hidden),
 * so the caller renders the real heading text for assistive tech.
 */
export default function FurHeading({
  wide,
  narrow,
}: {
  wide: readonly FurLine[];
  narrow: readonly FurLine[];
}) {
  const { resolvedTheme } = useTheme();
  const tones = TONES[resolvedTheme === "dark" ? "dark" : "light"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!container || !ctx) return;

    const update = () => {
      const available = container.clientWidth;
      if (!available) return;
      const wideLayout = layoutFor(ctx, wide, available);
      setLayout(
        wideLayout.height >= MIN_WIDE_LINE_HEIGHT
          ? wideLayout
          : layoutFor(ctx, narrow, available),
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [wide, narrow]);

  return (
    <div ref={containerRef} aria-hidden className="flex w-full flex-col items-center">
      {layout?.lines.map((line) => (
        <Fur
          key={line.text}
          text={line.text}
          color={tones[line.tone]}
          style={{ width: line.width, height: layout.height }}
        />
      ))}
    </div>
  );
}
