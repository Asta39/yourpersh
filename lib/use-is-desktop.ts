"use client";

import { useSyncExternalStore } from "react";

/** True at the `md` breakpoint and up. False on the server and during hydration. */
export function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(min-width: 768px)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
}
