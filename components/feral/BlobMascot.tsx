"use client";

import "feral-blob/blob.css";
import type { BlobSpeechProps, JellyBlobMascotProps } from "feral-blob";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

// FeralUI physics piece: client-only and lazy-loaded (it sits below the fold).
const Mascot = dynamic(() => import("feral-blob").then((m) => m.JellyBlobMascot), {
  ssr: false,
  loading: () => <div className="aspect-square w-full" />,
});
const Speech = dynamic(() => import("feral-blob").then((m) => m.BlobSpeech), { ssr: false });

/** Brand terracotta jelly. Every colour is a --jelly-* variable on a wrapper. */
const TERRA = {
  "--jelly-body-top": "#f9c4b0",
  "--jelly-body-mid": "#e2775c",
  "--jelly-body-deep": "#c8553d",
  "--jelly-body-rim": "#f2957c",
  "--jelly-outline": "#a8432e",
  "--jelly-outline-light": "#d8705a",
  "--jelly-arm-light": "#f7ab94",
  "--jelly-arm-mid": "#dc694f",
  "--jelly-arm-deep": "#b94a33",
  "--jelly-cheek-light": "#ffdccb",
  "--jelly-cheek": "#ffb79c",
  "--jelly-cheek-deep": "#f5a086",
  "--jelly-belly-glow": "#ffcdb8",
  "--jelly-eye-sparkle": "#ffb08f",
} as CSSProperties;

/** "Delivered" green, used when an order has been sent. */
const GREEN = {
  "--jelly-body-top": "#b4f2c8",
  "--jelly-body-mid": "#43c273",
  "--jelly-body-deep": "#22a352",
  "--jelly-body-rim": "#82e2a4",
  "--jelly-outline": "#1c8a45",
  "--jelly-outline-light": "#4fc97e",
  "--jelly-arm-light": "#bff3d1",
  "--jelly-arm-mid": "#49c777",
  "--jelly-arm-deep": "#2b9b57",
  "--jelly-cheek-light": "#ffdccb",
  "--jelly-cheek": "#ffb79c",
  "--jelly-cheek-deep": "#f5a086",
  "--jelly-belly-glow": "#c9ffe0",
  "--jelly-eye-sparkle": "#7be8a5",
} as CSSProperties;

export type BlobTone = "terra" | "green";

export function Blob({
  tone = "terra",
  className,
  ...props
}: JellyBlobMascotProps & { tone?: BlobTone }) {
  return (
    <div style={tone === "green" ? GREEN : TERRA} className={className}>
      <Mascot eyeStyle="v1" {...props} />
    </div>
  );
}

export function BlobSay({ tone = "terra", ...props }: BlobSpeechProps & { tone?: BlobTone }) {
  return (
    <div style={tone === "green" ? GREEN : TERRA}>
      <Speech {...props} />
    </div>
  );
}
