"use client";

import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import { useThemeToggle } from "@/components/motion/theme-toggle";

/**
 * FeralUI PullCord driving the beUI circle-blur theme reveal.
 * The cord hangs at the top-right, so the reveal grows out of that corner.
 * Position and colour come from the --pullcord-* vars in globals.css.
 */
export default function ThemeCord() {
  const { isDark, toggle } = useThemeToggle({
    variant: "circle-blur",
    start: "top-right",
  });

  return (
    <PullCord
      onPull={toggle}
      pulled={isDark}
      ariaLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
}
