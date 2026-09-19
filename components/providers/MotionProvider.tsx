"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Single animation runtime for the whole site. `reducedMotion="user"` makes every
 * Motion component honour the OS `prefers-reduced-motion` setting (transform/layout
 * animations are disabled, opacity still fades). Sections that need a fully static
 * fallback read `useReducedMotion()` themselves.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
