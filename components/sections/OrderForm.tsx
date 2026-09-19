"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Blob, BlobSay } from "@/components/feral/BlobMascot";
import { order } from "@/lib/content";
import { storeIn, track, whatsappUrl } from "@/lib/order";
import type { JellyBlobMood } from "feral-blob";

type Field = "name" | "cart" | "country";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent";

const GAZE: Record<Field, { x: number; y: number }> = {
  name: { x: -14, y: -6 },
  cart: { x: 10, y: 9 },
  country: { x: 0, y: 12 },
};

const inputClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-terra aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/30";

/**
 * The order form. The blob above it reads along: it looks at the field you're in, nods while you
 * type, sparkles at a store link, waves at a country, frowns at a mistake, and celebrates on send.
 */
export default function OrderForm({
  Title,
  Description,
  nameRef,
  onDone,
}: {
  Title: ComponentType<{ className?: string; children?: ReactNode }>;
  Description: ComponentType<{ className?: string; children?: ReactNode }>;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [cart, setCart] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [focus, setFocus] = useState<Field | null>(null);
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [hello, setHello] = useState(true);
  const [celebrate, setCelebrate] = useState(0);
  const [url, setUrl] = useState("");
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const store = storeIn(cart);
  const seenStore = useRef<string | null>(null);
  const firstError = errors.name ?? errors.cart ?? errors.country;

  // Wave on open, then settle.
  useEffect(() => {
    const t = setTimeout(() => setHello(false), 2400);
    return () => clearTimeout(t);
  }, []);

  // A small celebration the first time a supported store link shows up.
  useEffect(() => {
    if (store && seenStore.current !== store) {
      seenStore.current = store;
      setCelebrate((n) => n + 1);
    }
    if (!store) seenStore.current = null;
  }, [store]);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    },
    [],
  );

  const pulseTyping = () => {
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 600);
  };

  const clearError = (field: Field) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  let mood: JellyBlobMood = "neutral";
  let line: string = order.speech.idle;
  if (status !== "idle") {
    mood = "love";
    line = status === "sending" ? order.sending : order.speech.sent;
  } else if (store && !errors.cart) {
    // A recognised store link is the happy moment, even if another field still has an error.
    mood = "happy";
    line = order.speech.store.replace("{store}", store);
  } else if (firstError) {
    mood = "sad";
    line = firstError;
  } else if (
    focus === "country" ||
    (country && focus !== "name" && focus !== "cart")
  ) {
    mood = "wave";
    line = country
      ? order.speech.country.replace("{country}", country)
      : order.speech.idle;
  } else if (focus === "name") {
    mood = "curious";
    line = order.speech.name;
  } else if (focus === "cart") {
    mood = "curious";
    line = order.speech.cart;
  } else if (hello) {
    mood = "wave";
    line = order.speech.hello;
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = order.errors.name;
    if (cart.trim().length < 3) next.cart = order.errors.cart;
    if (!country) next.country = order.errors.country;
    setErrors(next);
    if (next.name || next.cart || next.country) {
      track("quote_invalid", { fields: Object.keys(next) });
      return;
    }

    const target = whatsappUrl({
      name: name.trim(),
      country,
      cart: cart.trim(),
    });
    setUrl(target);
    setStatus("sending");
    setCelebrate((n) => n + 1);
    track("quote_submit", { country, store });
    setTimeout(() => {
      setStatus("sent");
      setCelebrate((n) => n + 1);
    }, 1400);
    setTimeout(() => {
      track("whatsapp_handoff", { country });
      window.open(target, "_blank", "noopener,noreferrer");
    }, 3000);
  };

  const reset = () => {
    setName("");
    setCart("");
    setCountry("");
    setErrors({});
    setStatus("idle");
    setUrl("");
    setHello(true);
    setTimeout(() => setHello(false), 2400);
  };

  return (
    <div>
      <div className="flex items-end gap-2">
        <Blob
          tone={status === "sent" ? "green" : "terra"}
          mood={mood}
          gaze={focus ? GAZE[focus] : { x: 0, y: 0 }}
          nod={typing}
          sparkle={Boolean(store) && status === "idle"}
          celebrate={celebrate}
          className="aspect-square w-28 shrink-0 md:w-32"
        />
        <div aria-live="polite" className="mb-6 min-w-0">
          <BlobSay
            tone={status === "sent" ? "green" : "terra"}
            mood={mood}
            messages={{ [mood]: line }}
          />
        </div>
      </div>

      <Title className="mt-2 text-3xl leading-tight md:text-4xl">
        {status === "sent" ? order.sent.title : order.modal.title}
      </Title>
      <Description className="mt-2 text-muted-foreground">
        {status === "sent" ? order.sent.body : order.modal.description}
      </Description>

      <AnimatePresence mode="wait" initial={false}>
        {status !== "sent" ? (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="order-name"
                className="mb-1.5 block text-sm font-medium"
              >
                {order.fields.name.label}
              </label>
              <input
                ref={nameRef}
                id="order-name"
                value={name}
                autoComplete="name"
                placeholder={order.fields.name.placeholder}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "order-name-error" : undefined}
                disabled={status === "sending"}
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                  pulseTyping();
                }}
                className={inputClass}
              />
              {errors.name ? (
                <p
                  id="order-name-error"
                  className="mt-1.5 text-sm text-red-500"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="order-cart"
                className="mb-1.5 block text-sm font-medium"
              >
                {order.fields.cart.label}
              </label>
              <textarea
                id="order-cart"
                rows={3}
                value={cart}
                placeholder={order.fields.cart.placeholder}
                aria-invalid={Boolean(errors.cart)}
                aria-describedby={errors.cart ? "order-cart-error" : undefined}
                disabled={status === "sending"}
                onFocus={() => setFocus("cart")}
                onBlur={() => setFocus(null)}
                onChange={(e) => {
                  setCart(e.target.value);
                  clearError("cart");
                  pulseTyping();
                }}
                className={`${inputClass} resize-none`}
              />
              {errors.cart ? (
                <p
                  id="order-cart-error"
                  className="mt-1.5 text-sm text-red-500"
                >
                  {errors.cart}
                </p>
              ) : null}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">
                {order.fields.country.label}
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {order.fields.country.options.map((option) => {
                  const selected = country === option;
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-base font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terra ${
                        selected
                          ? "border-terra bg-terra/10 text-terra"
                          : "border-border hover:bg-muted"
                      } ${errors.country ? "border-red-500" : ""}`}
                    >
                      <input
                        type="radio"
                        name="country"
                        value={option}
                        checked={selected}
                        disabled={status === "sending"}
                        onFocus={() => setFocus("country")}
                        onBlur={() => setFocus(null)}
                        onChange={() => {
                          setCountry(option);
                          clearError("country");
                        }}
                        className="sr-only"
                      />
                      {selected ? (
                        <Check className="size-4" aria-hidden />
                      ) : null}
                      {option}
                    </label>
                  );
                })}
              </div>
              {errors.country ? (
                <p className="mt-1.5 text-sm text-red-500">{errors.country}</p>
              ) : null}
            </fieldset>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-terra px-6 py-3.5 text-base font-semibold text-white transition-transform hover:bg-terra-deep active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra disabled:opacity-70"
            >
              {status === "sending" ? order.sending : order.submit}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="sent"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="mt-6"
          >
            <div className="relative rounded-2xl bg-white px-5 pb-6 pt-5 font-mono text-[0.8rem] text-neutral-900 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/10">
              <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                {order.sent.summary}
              </p>
              <dl className="mt-3 space-y-2 border-t border-dashed border-neutral-300 pt-3">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">{order.sent.nameLabel}</dt>
                  <dd className="text-right">{name.trim()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">
                    {order.sent.countryLabel}
                  </dt>
                  <dd className="text-right">{country}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">{order.sent.cartLabel}</dt>
                  <dd className="line-clamp-3 break-all text-right">
                    {cart.trim()}
                  </dd>
                </div>
              </dl>
              <motion.div
                aria-hidden
                initial={
                  reduce ? false : { scale: 2.2, opacity: 0, rotate: -2 }
                }
                animate={{ scale: 1, opacity: 1, rotate: -7 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 16,
                  delay: 0.25,
                }}
                className="mx-auto mt-5 w-fit rounded-md border-2 border-[#22a352] px-2 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[#22a352]"
              >
                <span className="block rounded-[3px] border border-[#22a352]/70 px-2 py-0.5">
                  {order.sent.stamp}
                </span>
              </motion.div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-terra px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-terra-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra"
              >
                {order.sent.open}
              </a>
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-full border border-border px-6 py-3.5 text-base font-medium transition-colors hover:bg-muted"
              >
                {order.sent.again}
              </button>
            </div>
            <button
              type="button"
              onClick={onDone}
              className="mt-3 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {order.modal.close}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
