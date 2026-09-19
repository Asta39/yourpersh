/**
 * Site content as data. Sections render from here so copy stays in one place
 * (and reduced-motion fallbacks can reuse the same source). Grows step by step.
 */

export const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#estimate" },
  { label: "Stores", href: "#stores" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

/** Stub number for the concept — every CTA resolves here. Not Yopersh's real line. */
export const whatsapp = {
  display: "+256 700 000000",
  href: "https://wa.me/256700000000",
} as const;

export const hero = {
  headline: "Shop the world, delivered home.",
  sub: "Your trusted personal shopper for Shein, Temu, Amazon & more — purchased, consolidated in Dubai, and delivered to your door in Uganda & Kenya, with live tracking.",
  primaryCta: "Place an order",
  secondaryCta: "How it works",
  video: {
    mp4: "/video/animaps.mp4",
    webm: "/video/animaps.webm",
    poster: "/video/animaps-poster.jpg",
    still: "/video/animaps-still.jpg",
    label: "Animated route from Dubai to Kampala and Nairobi",
  },
} as const;

export const solutions = {
  eyebrow: "The problem, solved",
  title: "Online shopping has problems. We fixed them.",
  /** Same headline, broken into lines for the fur lettering (wide screens / narrow screens). */
  titleLines: {
    wide: [
      { text: "Online shopping has problems.", tone: "ink" },
      { text: "We fixed them.", tone: "terra" },
    ],
    narrow: [
      { text: "Online shopping", tone: "ink" },
      { text: "has problems.", tone: "ink" },
      { text: "We fixed them.", tone: "terra" },
    ],
  },
  labels: { problem: "The problem", fix: "Our fix" },
  items: [
    {
      id: "shipping",
      label: "Shipping",
      problem: {
        title: "Stores that won't ship here",
        detail:
          "Shein, Temu and Amazon often refuse to deliver to East African addresses, so the cart you filled never becomes an order.",
      },
      fix: {
        title: "We shop it for you",
        detail:
          "We place the order on your behalf and route it through our Dubai hub, so it no longer matters whether the store ships to your address.",
      },
      link: "See how it works",
      href: "#how-it-works",
    },
    {
      id: "fees",
      label: "Fees",
      problem: {
        title: "Surprise fees at the door",
        detail:
          "Customs and delivery charges that only surface after you've already paid, and again when the parcel arrives.",
      },
      fix: {
        title: "One price, before we buy",
        detail:
          "You see the full delivered price up front, so nothing gets added at the door.",
      },
      link: "Estimate your order",
      href: "#estimate",
    },
    {
      id: "tracking",
      label: "Tracking",
      problem: {
        title: "No idea where it is",
        detail:
          "Between “I ordered it” and “it arrived” there's a long silence, with nothing to tell you where your parcel is.",
      },
      fix: {
        title: "Live tracking, start to finish",
        detail:
          "Follow your order at every stage, from the moment we buy it until it reaches your door.",
      },
      link: "See live tracking",
      href: "#estimate",
    },
    {
      id: "parcels",
      label: "Parcels",
      problem: {
        title: "A parcel from every store",
        detail:
          "Ordering from several stores means separate shipments, separate fees and separate tracking numbers to chase.",
      },
      fix: {
        title: "One parcel from Dubai",
        detail:
          "Everything lands at our Dubai hub first and is consolidated into a single shipment to you.",
      },
      link: "See how it works",
      href: "#how-it-works",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "How it works",
  title: "Four steps from cart to doorstep.",
  steps: [
    {
      title: "Send your cart",
      description:
        "Share your Shein, Temu or Amazon cart link, or photos of what you want, right on WhatsApp.",
      tone: "terra",
    },
    {
      title: "Get a quote",
      description:
        "We reply with the item cost, our service fee and delivery, so the full delivered price is clear before anything is bought.",
      tone: "ink",
    },
    {
      title: "We buy & ship",
      description:
        "We purchase your items, consolidate them at our Dubai hub, and ship them on to you.",
      tone: "terra",
    },
    {
      title: "Track & receive",
      description:
        "Follow your order with live tracking until it reaches your doorstep in Uganda or Kenya.",
      tone: "delivered",
    },
  ],
} as const;

/**
 * Stores board. Items are positioned by their centre: `dx`/`dy` (% of the board) on wide
 * screens; on phones they snap to a 3-column grid in array order (see StoresBoard).
 * `w` is the desktop width in px; smaller screens scale it down.
 */
export const stores = {
  eyebrow: "Stores we shop from",
  title: "Any cart, from the stores you already love.",
  sub: "Shein, Temu, Amazon, Zara, ASOS and Sephora. We shop them all for you.",
  hint: "They're loose. Drag them around.",
  legal:
    "Store logos are trademarks of their respective owners. This is a concept redesign and is not affiliated with or endorsed by them.",
  items: [
    { kind: "logo", id: "shein", name: "Shein", src: "/logos/shein.svg", ratio: [530, 110], w: 170, dx: 13, dy: 16, rotate: -6 },
    { kind: "sticker", id: "parcel", src: "/stickers/parcel.webp", w: 152, dx: 30, dy: 14, rotate: 7 },
    { kind: "logo", id: "temu", name: "Temu", src: "/logos/temu.svg", ratio: [68, 16.5], w: 150, dx: 46, dy: 17, rotate: 4 },
    { kind: "sticker", id: "plane", src: "/stickers/plane.webp", w: 172, dx: 62, dy: 12, rotate: -8 },
    { kind: "logo", id: "amazon", name: "Amazon", src: "/logos/amazon.svg", ratio: [603, 182], w: 180, dx: 78, dy: 18, rotate: -3 },
    { kind: "sticker", id: "globe", src: "/stickers/globe.webp", w: 136, dx: 92, dy: 14, rotate: 9 },
    { kind: "sticker", id: "crying-bags", src: "/stickers/crying-bags.webp", w: 156, dx: 8, dy: 47, rotate: -7 },
    { kind: "logo", id: "zara", name: "Zara", src: "/logos/zara.svg", ratio: [1000, 420], w: 128, dx: 23, dy: 52, rotate: 5 },
    { kind: "sticker", id: "money-face", src: "/stickers/money-face.webp", w: 147, dx: 38, dy: 45, rotate: 6 },
    { kind: "logo", id: "asos", name: "ASOS", src: "/logos/asos.svg", ratio: [110, 32], w: 148, dx: 53, dy: 54, rotate: -4 },
    { kind: "sticker", id: "mind-blown", src: "/stickers/mind-blown.webp", w: 161, dx: 69, dy: 45, rotate: 8 },
    { kind: "logo", id: "sephora", name: "Sephora", src: "/logos/sephora.svg", ratio: [1000, 129.6], w: 196, dx: 86, dy: 54, rotate: 3 },
    { kind: "sticker", id: "heart-eyes-dress", src: "/stickers/heart-eyes-dress.webp", w: 161, dx: 14, dy: 81, rotate: -5 },
    { kind: "sticker", id: "van", src: "/stickers/van.webp", w: 172, dx: 34, dy: 83, rotate: 5 },
    { kind: "sticker", id: "cool-gift", src: "/stickers/cool-gift.webp", w: 156, dx: 55, dy: 81, rotate: -6 },
    { kind: "sticker", id: "pleading-cart", src: "/stickers/pleading-cart.webp", w: 152, dx: 76, dy: 82, rotate: 7 },
  ],
} as const;

export const twoWays = {
  eyebrow: "Two ways to order",
  title: "Two ways in. One way home.",
  sub: "Send us a cart, or buy it yourself and ship it to our Dubai address. Either way it lands at the same hub and travels the same road to your door.",
  modes: [
    {
      lane: "a",
      tag: "A",
      title: "We shop it for you",
      lead: "Send us a cart link or photos of what you want.",
      you: "Send the cart on WhatsApp",
      we: "Buy it, consolidate in Dubai, ship and deliver",
    },
    {
      lane: "b",
      tag: "B",
      title: "You shop, we forward",
      lead: "Buy from any store and ship it to our Dubai address.",
      you: "Order to our Dubai address",
      we: "Receive it, consolidate, ship and deliver",
    },
  ],
  places: { dubai: "Dubai hub", nairobi: "Nairobi", home: "Home" },
  youLabel: "You",
  weLabel: "We",
} as const;

export const estimate = {
  eyebrow: "Estimate & track",
  title: "See the price before we buy. Follow it until it lands.",
  sub: "Pack a sample box to see how your delivered price adds up, then track a demo order from the store to your door.",
  builder: {
    title: "Fill your box",
    hint: "Drag items into the box, or tap them.",
    boxLabel: "Your box",
    empty: "Nothing packed yet. Add an item to see your price.",
    itemsLabel: "Items",
    serviceFee: "Service fee",
    total: "Delivered price",
    stamp: "Quoted before we buy",
    note: "Item prices are illustrative. The 10% service fee is the rate stated in Yopersh's FAQ.",
    dropHint: "Drop here",
  },
  /** The 10% service fee is stated in Yopersh's FAQ; it covers buying, Dubai shipping, customs and local delivery. */
  rates: { serviceFeePct: 0.1 },
  items: [
    { id: "dress", name: "Summer dress", price: 28, src: "/estimate/dress.webp", w: 254, h: 352 },
    { id: "sneakers", name: "Sneakers", price: 45, src: "/estimate/sneakers.webp", w: 352, h: 326 },
    { id: "handbag", name: "Handbag", price: 60, src: "/estimate/handbag.webp", w: 327, h: 352 },
    { id: "perfume", name: "Perfume", price: 55, src: "/estimate/perfume.webp", w: 259, h: 352 },
    { id: "jacket", name: "Denim jacket", price: 55, src: "/estimate/jacket.webp", w: 352, h: 339 },
    { id: "palette", name: "Makeup palette", price: 35, src: "/estimate/palette.webp", w: 345, h: 352 },
  ],
} as const;

export const tracking = {
  title: "Track it live",
  prompt: "Enter your order code",
  hint: "This is a demo. Use the sample code to see an order travel.",
  demoCode: "4821",
  demoLabel: "Use demo code",
  errorText: "That code isn't right. Try the demo code.",
  checking: "Finding your order",
  replay: "Replay",
  orderLabel: "Order",
  stages: [
    { id: "received", label: "Order received", detail: "We've got your cart", src: "/journey/receipt-a.webp", w: 424, h: 516 },
    { id: "bought", label: "Bought for you", detail: "Purchased from the store", src: "/stickers/parcel.webp", w: 448, h: 448 },
    { id: "hub", label: "At the Dubai hub", detail: "Consolidated with your other items", src: "/journey/dubai.webp", w: 465, h: 516 },
    { id: "flight", label: "In flight", detail: "On its way to Nairobi", src: "/journey/plane-side.webp", w: 516, h: 283 },
    { id: "nairobi", label: "Landed in Nairobi", detail: "Clearing customs", src: "/journey/nairobi.webp", w: 507, h: 516 },
    { id: "van", label: "Out for delivery", detail: "A van is heading your way", src: "/journey/van-green.webp", w: 516, h: 457 },
    { id: "home", label: "Delivered", detail: "Enjoy it!", src: "/journey/home.webp", w: 516, h: 511 },
  ],
} as const;

export const trust = {
  eyebrow: "Why shoppers stay",
  title: "Built on the boring part: doing what we said.",
  sub: "Anyone can buy a dress abroad. The hard part is everything that happens after, and that's the part we built the business around.",
  promisesLabel: "Our promises",
  promises: [
    {
      title: "Trust first",
      body: "Prices and timelines you can rely on, and we tell you early if something will take longer.",
    },
    {
      title: "Quality curation",
      body: "We only suggest pieces we'd order ourselves.",
    },
    {
      title: "Reliable delivery",
      body: "Tracked from Dubai to your door, with real updates along the way.",
    },
    {
      title: "People over parcels",
      body: "Real humans on WhatsApp who care how it goes.",
    },
  ],
  stats: {
    orders: { label: "Orders delivered", to: 40, suffix: "k+", decimals: 0 },
    rating: { label: "Google rating", to: 4.7, suffix: "", decimals: 1 },
    reviews: { label: "Verified reviews", to: 88, suffix: "+", decimals: 0 },
    countries: { label: "Countries served", to: 2, suffix: "", decimals: 0, names: ["Kenya", "Uganda"] },
  },
  chat: {
    label: "Support",
    title: "Real people on WhatsApp",
    body: "Message us any time. A person answers, not a bot.",
    cta: "Chat on WhatsApp",
    messages: [
      { from: "you", text: "Hi! Can you get this from Shein?" },
      { from: "us", text: "Of course. Send the cart link and we'll quote it." },
    ],
  },
  note: "Figures as shown on Yopersh's own site, used here for this concept.",
} as const;

export const faq = {
  eyebrow: "The usual questions",
  title: "Questions, answered.",
  sub: "The things shoppers ask us most, from Yopersh's own FAQ.",
  ctaLabel: "Still have a question?",
  cta: "Ask us on WhatsApp",
  items: [
    {
      id: "place-order",
      title: "How do I place a Shein order?",
      description:
        "Browse Shein, copy the links to items you want (or your full cart link) and send them to us on WhatsApp. We'll quote the total cost including delivery.",
    },
    {
      id: "delivery-cost",
      title: "How much does Shein delivery cost?",
      description:
        "We charge 10% of your Shein order total as our service fee. This covers purchasing, Dubai shipping, customs clearance and local delivery.",
    },
    {
      id: "delivery-time",
      title: "How long does delivery take?",
      description:
        "Typically 2\u20133 weeks. We ship from Dubai every Friday, and customs clearance takes 3\u20137 days on arrival.",
    },
    {
      id: "platforms",
      title: "What other platforms can I order from?",
      description:
        "Amazon, Temu, Zara, ASOS, Sephora, Fashion Nova, PrettyLittleThing, H&M and more. Shop on the app, use our Dubai address at checkout, and we handle the rest.",
    },
    {
      id: "restricted",
      title: "What items are restricted?",
      description:
        "We can't ship mobile phones, power banks, lithium batteries, or items over 30kg. Contact us if you're unsure about a specific item.",
    },
  ],
} as const;
