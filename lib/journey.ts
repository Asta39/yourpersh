/**
 * Geometry for the "two ways to order" map. Everything is expressed in viewBox units, so the
 * whole scene scales with its container: `x`/`y` are sticker centres, `w` is sticker width.
 */

export type SpriteId =
  | "receipt-a"
  | "receipt-b"
  | "receipt-c"
  | "van-terra"
  | "van-ink"
  | "van-green"
  | "plane-side"
  | "dubai"
  | "nairobi"
  | "home";

/** Natural pixel size of each baked sprite (used for aspect ratio). */
export const SPRITES: Record<SpriteId, { src: string; w: number; h: number }> = {
  "receipt-a": { src: "/journey/receipt-a.webp", w: 424, h: 516 },
  "receipt-b": { src: "/journey/receipt-b.webp", w: 407, h: 516 },
  "receipt-c": { src: "/journey/receipt-c.webp", w: 432, h: 516 },
  "van-terra": { src: "/journey/van-terra.webp", w: 516, h: 435 },
  "van-ink": { src: "/journey/van-ink.webp", w: 516, h: 414 },
  "van-green": { src: "/journey/van-green.webp", w: 516, h: 457 },
  "plane-side": { src: "/journey/plane-side.webp", w: 516, h: 283 },
  dubai: { src: "/journey/dubai.webp", w: 465, h: 516 },
  nairobi: { src: "/journey/nairobi.webp", w: 507, h: 516 },
  home: { src: "/journey/home.webp", w: 516, h: 511 },
};

export type Lane = "a" | "b";

export type Receipt = {
  sprite: SpriteId;
  store: "shein" | "amazon" | "temu" | "zara" | "asos" | "sephora";
  x: number;
  y: number;
  w: number;
  rotate: number;
};

export type Rider = {
  id: string;
  sprite: SpriteId;
  w: number;
  /** Max tilt (deg) the sprite may lean into the path direction. */
  tilt: number;
};

export type Layout = {
  W: number;
  H: number;
  lanes: Record<Lane, { d: string; tag: { x: number; y: number }; receipts: Receipt[]; van: Rider }>;
  trunk: { d: string; plane: Rider };
  last: { d: string; van: Rider };
  places: {
    dubai: { x: number; y: number; w: number; label: { x: number; y: number } };
    nairobi: { x: number; y: number; w: number; label: { x: number; y: number } };
    home: { x: number; y: number; w: number; label: { x: number; y: number } };
  };
};

export const desktop: Layout = {
  W: 1200,
  H: 940,
  lanes: {
    a: {
      d: "M 84 200 H 300 C 410 200, 400 400, 520 400",
      tag: { x: 40, y: 92 },
      receipts: [
        { sprite: "receipt-a", store: "shein", x: 130, y: 95, w: 104, rotate: -6 },
        { sprite: "receipt-b", store: "amazon", x: 245, y: 90, w: 104, rotate: 3 },
        { sprite: "receipt-c", store: "temu", x: 360, y: 96, w: 104, rotate: -3 },
      ],
      van: { id: "van-a", sprite: "van-terra", w: 124, tilt: 22 },
    },
    b: {
      d: "M 84 600 H 300 C 410 600, 400 400, 520 400",
      tag: { x: 40, y: 712 },
      receipts: [
        { sprite: "receipt-c", store: "zara", x: 130, y: 715, w: 104, rotate: 5 },
        { sprite: "receipt-a", store: "asos", x: 245, y: 720, w: 104, rotate: -4 },
        { sprite: "receipt-b", store: "sephora", x: 360, y: 714, w: 104, rotate: 3 },
      ],
      van: { id: "van-b", sprite: "van-ink", w: 124, tilt: 22 },
    },
  },
  trunk: {
    d: "M 520 400 C 700 260, 900 170, 1040 290 C 1140 380, 1080 520, 950 545 C 850 565, 760 520, 660 575",
    plane: { id: "plane", sprite: "plane-side", w: 168, tilt: 40 },
  },
  last: {
    d: "M 730 705 C 800 810, 880 820, 918 790",
    van: { id: "van-c", sprite: "van-green", w: 120, tilt: 25 },
  },
  places: {
    dubai: { x: 520, y: 400, w: 200, label: { x: 520, y: 535 } },
    nairobi: { x: 640, y: 685, w: 210, label: { x: 640, y: 812 } },
    home: { x: 1030, y: 775, w: 210, label: { x: 1030, y: 900 } },
  },
};

export const mobile: Layout = {
  W: 390,
  H: 1600,
  lanes: {
    a: {
      d: "M 150 118 V 420 C 150 520, 195 540, 195 610",
      tag: { x: 150, y: 28 },
      receipts: [
        { sprite: "receipt-a", store: "shein", x: 62, y: 120, w: 88, rotate: -5 },
        { sprite: "receipt-b", store: "amazon", x: 62, y: 250, w: 88, rotate: 4 },
        { sprite: "receipt-c", store: "temu", x: 62, y: 380, w: 88, rotate: -3 },
      ],
      van: { id: "van-a", sprite: "van-terra", w: 84, tilt: 18 },
    },
    b: {
      d: "M 240 118 V 420 C 240 520, 195 540, 195 610",
      tag: { x: 240, y: 28 },
      receipts: [
        { sprite: "receipt-c", store: "zara", x: 328, y: 120, w: 88, rotate: 5 },
        { sprite: "receipt-a", store: "asos", x: 328, y: 250, w: 88, rotate: -4 },
        { sprite: "receipt-b", store: "sephora", x: 328, y: 380, w: 88, rotate: 3 },
      ],
      van: { id: "van-b", sprite: "van-ink", w: 84, tilt: 18 },
    },
  },
  trunk: {
    d: "M 195 790 C 195 860, 325 860, 325 940 C 325 1020, 65 1000, 65 1090 C 65 1130, 90 1150, 130 1170",
    plane: { id: "plane", sprite: "plane-side", w: 120, tilt: 32 },
  },
  last: {
    d: "M 225 1300 C 320 1300, 330 1350, 300 1390",
    van: { id: "van-c", sprite: "van-green", w: 86, tilt: 22 },
  },
  places: {
    dubai: { x: 195, y: 700, w: 172, label: { x: 90, y: 790 } },
    nairobi: { x: 150, y: 1262, w: 176, label: { x: 150, y: 1370 } },
    home: { x: 255, y: 1478, w: 176, label: { x: 255, y: 1580 } },
  },
};
