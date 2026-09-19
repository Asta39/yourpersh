import { whatsapp } from "@/lib/content";

/** Anything on the page can open the order modal by calling this. */
export const ORDER_EVENT = "yopersh:order";
export const openOrder = () => window.dispatchEvent(new Event(ORDER_EVENT));

/** Conceptual analytics: logged to the console, documented as "if this were live". */
export const track = (event: string, data: Record<string, unknown> = {}) => {
  console.debug("[analytics]", event, data);
};

const STORES: [string, RegExp][] = [
  ["Shein", /shein\./i],
  ["Temu", /temu\./i],
  ["Amazon", /amazon\.|amzn\./i],
  ["Zara", /zara\./i],
  ["ASOS", /asos\./i],
  ["Sephora", /sephora\./i],
];

/** Name of a supported store mentioned in `text` (a pasted link), if any. */
export function storeIn(text: string) {
  return STORES.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

export function whatsappUrl({ name, country, cart }: { name: string; country: string; cart: string }) {
  const message = [
    "Hi Yopersh! I'd like to place an order.",
    `Name: ${name}`,
    `Country: ${country}`,
    `Cart / items: ${cart}`,
  ].join("\n");
  return `${whatsapp.href}?text=${encodeURIComponent(message)}`;
}
