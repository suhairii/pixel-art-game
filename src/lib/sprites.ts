// Procedural Pixel Art Matrix Definitions & Renderer
// Color Palettes (Pico-8 / Retro Cyber arcade style)
export const PALETTE = {
  transparent: "transparent",
  black: "#050508",
  darkBlue: "#1d2b53",
  darkPurple: "#7e2553",
  darkGreen: "#008751",
  brown: "#ab5236",
  darkGray: "#5f574f",
  lightGray: "#c2c3c7",
  white: "#fff1e8",
  red: "#ff004d",
  orange: "#ffa300",
  yellow: "#ffec27",
  green: "#00e436",
  blue: "#29adff",
  lavender: "#83769c",
  pink: "#ff77a8",
  peach: "#ffccaa",
  // Cyber highlights
  neonCyan: "#00f0ff",
  neonPink: "#ff007f",
  gold: "#ffd700",
  goldDark: "#b8860b",
};

// 16x16 Player Frames
// . = transparent
// R = red bandana/cape
// S = skin/peach
// W = white eyes/shine
// B = blue armor
// D = dark armor / outline
// Y = gold belt
// K = black shoes / outline
const HERO_IDLE = [
  "....RRRRRR......",
  "...RRRRRRRR.....",
  "..RRSSSSSSRR....",
  "..RRSSWWSSRR....",
  "..RRSSKKSSRR....",
  "..RRSSSSSSRR....",
  "....DDDDDD......",
  "...DBBBBBDD.....",
  "...DBYBYBDD.....",
  "...DBBBBBDD.....",
  "....DDDDDD......",
  "....BBDDBB......",
  "....BBDDBB......",
  "....DD..DD......",
  "...KK....KK.....",
  "..KKK....KKK....",
];

const HERO_RUN_1 = [
  "....RRRRRR......",
  "...RRRRRRRR.....",
  "..RRSSSSSSRR....",
  "..RRSSWWSSRR....",
  "..RRSSKKSSRR....",
  "..RRSSSSSSRR....",
  "....DDDDDD......",
  "...DBBBBBDD.....",
  "...DBYBYBDD.....",
  "...DBBBBBDD.....",
  "....DDDDDD......",
  "....BBDD........",
  "...BBDD.BB......",
  "..KK.....BB.....",
  ".KKK......KK....",
  ".........KKK....",
];

const HERO_RUN_2 = [
  "....RRRRRR......",
  "...RRRRRRRR.....",
  "..RRSSSSSSRR....",
  "..RRSSWWSSRR....",
  "..RRSSKKSSRR....",
  "..RRSSSSSSRR....",
  "....DDDDDD......",
  "...DBBBBBDD.....",
  "...DBYBYBDD.....",
  "...DBBBBBDD.....",
  "....DDDDDD......",
  "........DDBB....",
  "......BB.DDBB...",
  ".....BB.....KK..",
  "....KK......KKK.",
  "....KKK.........",
];

const HERO_JUMP = [
  "...RRRRRR.......",
  "..RRRRRRRR......",
  ".RRSSSSSSRR.....",
  ".RRSSWWSSRR.....",
  ".RRSSKKSSRR.....",
  ".RRSSSSSSRR.....",
  "...DDDDDD.......",
  "..DBBBBBDD......",
  "..DBYBYBDD......",
  "..DBBBBBDD......",
  "...DDDDDD.......",
  "..BB....BB......",
  ".BBDD..DDBB.....",
  "KK........KK....",
  "KKK......KKK....",
  "................",
];

// 12x10 Slime Frames
const SLIME_1 = [
  "....GGGG....",
  "..GGGGGGGG..",
  ".GGGGGGGGGG.",
  ".GGWWGGWWGG.",
  "GGKKGGKKGGGG",
  "GGGGGGGGGGGG",
  "GGGGGGGGGGGG",
  "GGGGGGGGGGGG",
  ".GGGGGGGGGG.",
  "..GGGGGGGG..",
];

const SLIME_2 = [
  "............",
  "....GGGG....",
  "..GGGGGGGG..",
  ".GGWWGGWWGG.",
  "GGKKGGKKGGGG",
  "GGGGGGGGGGGG",
  "GGGGGGGGGGGG",
  "GGGGGGGGGGGG",
  "GGGGGGGGGGGG",
  ".GGGGGGGGGG.",
];

// 8x8 Coin Animation
const COIN_1 = [
  "..YYYY..",
  ".YYYYYY.",
  "YYYWWYYY",
  "YYYWWYYY",
  "YYYWWYYY",
  "YYYWWYYY",
  ".YYYYYY.",
  "..YYYY..",
];

const COIN_2 = [
  "...YY...",
  "..YYYY..",
  ".YYWWYY.",
  ".YYWWYY.",
  ".YYWWYY.",
  ".YYWWYY.",
  "..YYYY..",
  "...YY...",
];

const COIN_3 = [
  "....Y...",
  "...YY...",
  "...WY...",
  "...WY...",
  "...WY...",
  "...WY...",
  "...YY...",
  "....Y...",
];

// 12x12 Portal / Flag
const PORTAL = [
  "....CCCC....",
  "..CCCCCCCC..",
  ".CCCCCCCCCC.",
  ".CCWWWWWWCC.",
  "CCWWCCCCWWCC",
  "CCWCCCCCCWCC",
  "CCWCCCCCCWCC",
  "CCWWCCCCWWCC",
  ".CCWWWWWWCC.",
  ".CCCCCCCCCC.",
  "..CCCCCCCC..",
  "....CCCC....",
];

// Map characters to palette colors
const CHAR_MAP: Record<string, string> = {
  ".": "transparent",
  R: PALETTE.red,
  S: PALETTE.peach,
  W: PALETTE.white,
  B: PALETTE.blue,
  D: PALETTE.darkBlue,
  Y: PALETTE.yellow,
  K: PALETTE.black,
  G: PALETTE.green,
  C: PALETTE.neonCyan,
};

// Render pixel matrix directly into an OffscreenCanvas / Canvas Image
export function drawPixelMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  x: number,
  y: number,
  pixelSize: number = 2,
  flipX: boolean = false
) {
  const height = matrix.length;
  const width = matrix[0].length;

  ctx.save();
  if (flipX) {
    ctx.translate(x + width * pixelSize, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }

  for (let r = 0; r < height; r++) {
    const row = matrix[r];
    for (let c = 0; c < width; c++) {
      const char = row[c];
      const color = CHAR_MAP[char];
      if (color && color !== "transparent") {
        ctx.fillStyle = color;
        ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  ctx.restore();
}

export const SPRITES = {
  hero: {
    idle: HERO_IDLE,
    run1: HERO_RUN_1,
    run2: HERO_RUN_2,
    jump: HERO_JUMP,
  },
  slime: {
    frame1: SLIME_1,
    frame2: SLIME_2,
  },
  coin: [COIN_1, COIN_2, COIN_3, COIN_2],
  portal: PORTAL,
};
