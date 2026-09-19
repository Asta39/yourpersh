"use client";

import { Battery, Check, Signal, Wifi } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { tracking } from "@/lib/content";

type Phase = "idle" | "checking" | "tracking";
const last = tracking.stages.length - 1;
const spring = { type: "spring", stiffness: 320, damping: 26 } as const;

function StageSticker({ stage, className }: { stage: (typeof tracking.stages)[number]; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={stage.src}
      alt=""
      width={stage.w}
      height={stage.h}
      draggable={false}
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  );
}

export default function PhoneTracker() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stage, setStage] = useState(0);

  const submit = (value: string) => {
    if (value === tracking.demoCode) {
      setError(false);
      setPhase("checking");
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (phase !== "checking") return;
    const t = setTimeout(() => {
      setStage(reduce ? last : 0);
      setPhase("tracking");
    }, 800);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "tracking" || reduce || stage >= last) return;
    const t = setTimeout(() => setStage((s) => s + 1), 1700);
    return () => clearTimeout(t);
  }, [phase, stage, reduce]);

  const reset = () => {
    setPhase("idle");
    setCode("");
    setStage(0);
    setError(false);
  };

  const current = tracking.stages[stage];
  const done = phase === "tracking" && stage === last;
  const island =
    phase === "tracking"
      ? { width: 286, height: 84, borderRadius: 42 }
      : phase === "checking"
        ? { width: 168, height: 36, borderRadius: 18 }
        : { width: 116, height: 34, borderRadius: 17 };

  return (
    <div className="relative mx-auto w-full max-w-[318px]">
      {/* device */}
      <div className="rounded-[3.1rem] bg-neutral-800 p-[3px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-black/40">
        <div className="rounded-[3rem] bg-black p-[9px]">
          <div className="relative h-[640px] overflow-hidden rounded-[2.4rem] bg-[#f2f2f7] text-neutral-900 dark:bg-black dark:text-white">
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-7 pt-[14px] text-[0.8rem] font-semibold">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <Signal className="size-3.5" aria-hidden />
                <Wifi className="size-3.5" aria-hidden />
                <Battery className="size-4" aria-hidden />
              </span>
            </div>

            {/* dynamic island */}
            <motion.div
              aria-live="polite"
              initial={false}
              animate={island}
              transition={reduce ? { duration: 0 } : spring}
              className="absolute left-1/2 top-[10px] z-20 -translate-x-1/2 overflow-hidden bg-black text-white shadow-[0_0_0_1px_rgb(255_255_255/0.06)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {phase === "checking" ? (
                  <motion.div
                    key="checking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full items-center justify-center gap-2 text-[0.7rem] font-medium"
                  >
                    <span className="size-3 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    {tracking.checking}
                  </motion.div>
                ) : null}
                {phase === "tracking" ? (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full items-center gap-3 px-4"
                  >
                    <div className="grid size-11 shrink-0 place-items-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={current.id}
                          initial={reduce ? false : { scale: 0.4, rotate: -20, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        >
                          <StageSticker stage={current} className="size-11" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8rem] font-semibold leading-tight">{current.label}</p>
                      <p className="truncate text-[0.68rem] text-white/60">{current.detail}</p>
                      <div className="mt-1.5 flex gap-1" aria-hidden>
                        {tracking.stages.map((s, i) => (
                          <span key={s.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= stage ? (done ? "bg-[#30d158]" : "bg-terra") : "bg-white/20"}`} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>

            {/* screen content */}
            <div className="absolute inset-0 px-5 pb-8 pt-[64px]">
              <AnimatePresence mode="wait" initial={false}>
                {phase !== "tracking" ? (
                  <motion.div
                    key="entry"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex h-full flex-col items-center pt-10 text-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/journey/van-terra.webp" alt="" width={516} height={435} draggable={false} className="pointer-events-none h-24 w-auto select-none" />
                    <h3 className="mt-5 text-2xl">{tracking.title}</h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{tracking.prompt}</p>

                    <motion.label
                      animate={error && !reduce ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative mt-6 block"
                    >
                      <span className="sr-only">{tracking.prompt}</span>
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        autoComplete="one-time-code"
                        value={code}
                        disabled={phase === "checking"}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setCode(v);
                          setError(false);
                          if (v.length === 4) submit(v);
                        }}
                        className="absolute inset-0 z-10 size-full cursor-text opacity-0"
                      />
                      <span className="flex gap-2.5" aria-hidden>
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`grid size-12 place-items-center rounded-2xl bg-white text-xl font-semibold shadow-sm ring-1 transition-all dark:bg-[#1c1c1e] ${
                              error
                                ? "ring-2 ring-red-500"
                                : focused && i === Math.min(code.length, 3)
                                  ? "ring-2 ring-terra"
                                  : "ring-black/5 dark:ring-white/10"
                            }`}
                          >
                            {code[i] ?? ""}
                          </span>
                        ))}
                      </span>
                    </motion.label>

                    <p className={`mt-3 h-4 text-xs ${error ? "text-red-500" : "text-transparent"}`}>{tracking.errorText}</p>

                    <button
                      type="button"
                      disabled={phase === "checking"}
                      onClick={() => {
                        setCode(tracking.demoCode);
                        submit(tracking.demoCode);
                      }}
                      className="mt-5 rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {tracking.demoLabel} {tracking.demoCode}
                    </button>
                    <p className="mt-4 max-w-[220px] text-xs text-neutral-500 dark:text-neutral-400">{tracking.hint}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col"
                  >
                    <div className="flex items-center justify-between pt-9 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{tracking.orderLabel} #{tracking.demoCode}</span>
                      <button type="button" onClick={reset} className="font-semibold text-terra">{tracking.replay}</button>
                    </div>

                    <div className="mt-2 grid h-24 place-items-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={current.id}
                          initial={reduce ? false : { scale: 0.5, y: 14, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <StageSticker stage={current} className="h-24 w-32" />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <ol className="mt-3 flex-1 space-y-0.5 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-[#1c1c1e] dark:ring-white/10">
                      {tracking.stages.map((s, i) => {
                        const state = i < stage || done ? "done" : i === stage ? "now" : "next";
                        return (
                          <li key={s.id} className="flex gap-3 py-1.5">
                            <span
                              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white ${
                                state === "done" ? "bg-[#30d158]" : state === "now" ? "bg-terra" : "bg-neutral-200 dark:bg-neutral-700"
                              }`}
                            >
                              {state === "done" ? <Check className="size-3" aria-hidden /> : state === "now" ? <span className="size-1.5 animate-pulse rounded-full bg-white" /> : null}
                            </span>
                            <div className="min-w-0">
                              <p className={`text-[0.8rem] font-semibold leading-tight ${state === "next" ? "text-neutral-400 dark:text-neutral-500" : ""}`}>{s.label}</p>
                              {state === "now" && !done ? <p className="text-[0.68rem] text-neutral-500 dark:text-neutral-400">{s.detail}</p> : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* home indicator */}
            <div className="absolute inset-x-0 bottom-2 z-10 mx-auto h-1 w-28 rounded-full bg-black/80 dark:bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
