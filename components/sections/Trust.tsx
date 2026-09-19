"use client";

import { Check, MessageCircle, Star } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import CountUp from "@/components/sections/CountUp";
import { trust, whatsapp } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

/** iOS-widget shell: soft card, small app-icon label, generous radius. */
function Widget({
  label,
  icon,
  className = "",
  children,
}: {
  label: string;
  icon: "orders" | "rating" | "reviews" | "countries" | "promises" | "support";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-[0_10px_30px_-14px_rgb(0_0_0/0.25)] dark:shadow-none md:p-6 ${className}`}
    >
      <div className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/trust/icons/${icon}.webp`}
          alt=""
          width={128}
          height={128}
          draggable={false}
          className="size-7 select-none"
        />
        {label}
      </div>
      {children}
    </div>
  );
}

const starPath =
  "M12 2.5l2.94 6.06 6.56.9-4.8 4.6 1.2 6.54L12 17.5l-5.9 3.1 1.2-6.54-4.8-4.6 6.56-.9L12 2.5z";

function StarRow({ className }: { className: string }) {
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="size-6 shrink-0 md:size-7"
          fill="currentColor"
          aria-hidden
        >
          <path d={starPath} />
        </svg>
      ))}
    </div>
  );
}

/** Five stars that fill to the rating when scrolled into view. */
function Stars({ rating }: { rating: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const pct = `${(rating / 5) * 100}%`;
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="relative inline-block"
    >
      <StarRow className="text-foreground/15" />
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 overflow-hidden text-[#ff9f0a]"
        initial={{ width: reduce ? pct : 0 }}
        animate={{ width: inView ? pct : reduce ? pct : 0 }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
      >
        <StarRow className="w-max" />
      </motion.div>
    </div>
  );
}

function Promise({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const on = inView || Boolean(reduce);
  return (
    <li ref={ref} className="flex gap-3">
      <motion.span
        initial={false}
        animate={{
          scale: on ? 1 : 0.6,
          backgroundColor: on ? "var(--delivered)" : "var(--muted)",
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 16,
          delay: reduce ? 0 : 0.25 + index * 0.35,
        }}
        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white"
      >
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </motion.span>
      <div>
        <p className="text-base font-semibold leading-tight">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

function ReviewStack() {
  return (
    <div className="group relative mt-4 h-24" aria-hidden>
      {[2, 1, 0].map((layer) => (
        <div
          key={layer}
          className="absolute inset-x-0 rounded-2xl border border-border bg-background p-3 shadow-sm transition-transform duration-300 ease-out"
          style={{
            top: layer * 10,
            transform: `scale(${1 - layer * 0.05})`,
            zIndex: 3 - layer,
            opacity: 1 - layer * 0.15,
          }}
        >
          <div className="flex gap-0.5 text-[#ff9f0a]">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
          </div>
          <div className="mt-2 h-1.5 w-4/5 rounded-full bg-foreground/10" />
          <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

function Bubble({
  from,
  text,
  delay,
}: {
  from: "you" | "us";
  text: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
      className={`flex items-end gap-2 ${from === "us" ? "justify-end" : ""}`}
    >
      {from === "us" ? null : null}
      <p
        className={`max-w-[80%] rounded-[1.2rem] px-3.5 py-2 text-sm leading-5 ${
          from === "us"
            ? "rounded-br-md bg-terra text-white"
            : "rounded-bl-md bg-muted"
        }`}
      >
        {text}
      </p>
      {from === "us" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/trust/host-avatar.webp"
          alt=""
          width={192}
          height={191}
          className="size-8 shrink-0 rounded-full"
        />
      ) : null}
    </motion.div>
  );
}

function Typing() {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-1.5 pl-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-foreground/30"
          animate={
            reduce ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }
          }
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function Trust() {
  const reduce = useReducedMotion();
  const { stats, chat } = trust;

  return (
    <section
      id="trust"
      className="mx-auto w-full max-w-6xl px-3 py-20 md:px-5 md:py-32"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terra">
          {trust.eyebrow}
        </p>
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] md:text-6xl">
          {trust.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground md:text-lg">
          {trust.sub}
        </p>
      </motion.div>

      {/* the "home screen" the widgets sit on */}
      <div className="mt-12 rounded-[2.5rem] bg-gradient-to-br from-terra-soft via-muted/60 to-muted/30 p-3 md:mt-16 md:p-5">
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {/* promises (large) */}
          <Widget
            label={trust.promisesLabel}
            icon="promises"
            className="col-span-2 lg:row-span-2"
          >
            <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <ul className="space-y-5">
                {trust.promises.map((promise, index) => (
                  <Promise
                    key={promise.title}
                    index={index}
                    title={promise.title}
                    body={promise.body}
                  />
                ))}
              </ul>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trust/host.webp"
                alt=""
                width={351}
                height={660}
                draggable={false}
                className="pointer-events-none mx-auto h-56 w-auto select-none sm:h-64 md:h-72 lg:h-[21rem]"
              />
            </div>
          </Widget>

          {/* orders */}
          <Widget
            label={stats.orders.label}
            icon="orders"
            className="min-h-[13rem]"
          >
            <p className="mt-6 font-display text-5xl leading-none tracking-tight md:text-6xl">
              <CountUp
                to={stats.orders.to}
                suffix={stats.orders.suffix}
                decimals={stats.orders.decimals}
              />
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/journey/van-terra.webp"
              alt=""
              width={516}
              height={435}
              draggable={false}
              className="pointer-events-none absolute -bottom-2 -right-3 w-28 select-none md:w-32"
            />
          </Widget>

          {/* rating */}
          <Widget
            label={stats.rating.label}
            icon="rating"
            className="min-h-[13rem]"
          >
            <p className="mt-6 font-display text-5xl leading-none tracking-tight md:text-6xl">
              <CountUp to={stats.rating.to} decimals={stats.rating.decimals} />
            </p>
            <div className="mt-4">
              <Stars rating={stats.rating.to} />
            </div>
          </Widget>

          {/* reviews */}
          <Widget
            label={stats.reviews.label}
            icon="reviews"
            className="min-h-[13rem]"
          >
            <p className="mt-6 font-display text-5xl leading-none tracking-tight md:text-6xl">
              <CountUp
                to={stats.reviews.to}
                suffix={stats.reviews.suffix}
                decimals={stats.reviews.decimals}
              />
            </p>
            <ReviewStack />
          </Widget>

          {/* countries */}
          <Widget
            label={stats.countries.label}
            icon="countries"
            className="min-h-[13rem]"
          >
            <p className="mt-6 font-display text-5xl leading-none tracking-tight md:text-6xl">
              <CountUp
                to={stats.countries.to}
                decimals={stats.countries.decimals}
              />
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {stats.countries.names.map((name) => (
                <li
                  key={name}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {name}
                </li>
              ))}
            </ul>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stickers/globe.webp"
              alt=""
              width={448}
              height={448}
              draggable={false}
              className="pointer-events-none absolute -bottom-3 -right-3 w-24 select-none md:w-28"
            />
          </Widget>

          {/* chat (wide) */}
          <Widget
            label={chat.label}
            icon="support"
            className="col-span-2 lg:col-span-4"
          >
            <div className="mt-5 grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-3xl leading-tight md:text-4xl">
                  {chat.title}
                </h3>
                <p className="mt-3 max-w-sm text-muted-foreground">
                  {chat.body}
                </p>
                <a
                  href={whatsapp.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-terra hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {chat.cta}
                </a>
              </div>
              <div className="space-y-2.5 rounded-3xl bg-background p-4 ring-1 ring-border">
                {chat.messages.map((message, index) => (
                  <Bubble
                    key={message.text}
                    from={message.from}
                    text={message.text}
                    delay={0.2 + index * 0.6}
                  />
                ))}
                <Typing />
              </div>
            </div>
          </Widget>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
        {trust.note}
      </p>
    </section>
  );
}
