// Kembara Dani: Character Poses & Malaysian Cultural Pixel Sprites Engine
// Palet Warna Dani (Hijab Dusty Rose + Jaket Teal Petualang + Trekking Pants)
export const DANI_PALETTE = {
  transparent: "transparent",
  // Hijab Dusty Rose & Crimson
  H1: "#f472b6", // Hijab highlight
  H2: "#db2777", // Hijab base
  H3: "#9d174d", // Hijab shadow / drape
  // Wajah & Kulit
  S1: "#fed7aa", // Kulit cerah
  S2: "#fba670", // Kulit bayangan
  // Mata & Rambut/Alis
  E1: "#0f172a", // Mata hitam
  W1: "#ffffff", // Kilau mata putih
  BL: "#f43f5e", // Rona pipi (blush)
  // Jaket Petualang Teal / Cyan
  J1: "#22d3ee", // Jaket highlight
  J2: "#0891b2", // Jaket base
  J3: "#164e63", // Jaket shadow
  Z1: "#facc15", // Ritsleting emas
  // Celana Trekking & Sepatu
  P1: "#334155", // Celana abu gelap
  P2: "#1e293b", // Celana shadow
  K1: "#f8fafc", // Sepatu putih
  K2: "#0284c7", // Trim sepatu biru
  // Malaysian Item Colors
  KP_GOLD: "#eab308", // Karipap emas
  KP_CRUST: "#ca8a04", // Kulit karipap
  KP_DARK: "#854d0e", // Lipatan karipap
  TT_TEA: "#d97706", // Teh tarik
  TT_FOAM: "#fef3c7", // Busa teh tarik
  TT_GLASS: "#e2e8f0", // Cangkir kaca
  HIB_RED: "#e11d48", // Bunga Raya merah
  HIB_GOLD: "#facc15", // Putik bunga emas
};

// 1. POSE 1: IDLE_1 (Berdiri tenang, nafas rileks) - 16x18 matrix
const DANI_IDLE_1 = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1P1......",
  "....P1P2P2P1......",
  "....P1....P1......",
  "....P2....P2......",
  "...K1K2..K1K2.....",
  "..K1K1K2K1K1K2....",
];

// 2. POSE 2: IDLE_2 (Kedipan lembut / fokus tekad) - 16x18 matrix
const DANI_IDLE_2 = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1E1E1S1S1H3..", // Mata merem/kedip
  "..H2S1BLBLS1S1H3..",
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1P1......",
  "....P1P2P2P1......",
  "....P1....P1......",
  "....P2....P2......",
  "...K1K2..K1K2.....",
  "..K1K1K2K1K1K2....",
];

// 3. POSE 3: RUN_1 (Langkah kanan maju, tangan kiri ayun)
const DANI_RUN_1 = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3H3", // Hijab berkibar ke belakang
  "..J1H3H3H3H3H3H3..",
  ".J1J1J1Z1Z1J1.....",
  ".J1J2J2Z1Z1J2.....",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3.......",
  "....P1P1..........",
  "....P1P2..P1P1....",
  "....P1.....P1.....",
  "...K1K2.....P2....",
  "..K1K1K2....K1K2..",
  "...........K1K1K2.",
];

// 4. POSE 4: RUN_2 (Passing stance / transisi langkah)
const DANI_RUN_2 = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3H3",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1........",
  "....P1P2P2P1......",
  "....P1..P1........",
  "....P2...P2.......",
  "...K1K2..K1K2.....",
  "..K1K1K2..K1K2....",
];

// 5. POSE 5: RUN_3 (Langkah kiri maju, tangan kanan ayun)
const DANI_RUN_3 = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3H3",
  "...H3H3H3H3H3H3...",
  "....J1Z1Z1J1J1J1..",
  "....J2Z1Z1J2J2J1..",
  "....J2Z1Z1J2J2....",
  ".....J3J3J3J3.....",
  "..........P1P1....",
  "....P1P1..P2P1....",
  ".....P1.....P1....",
  "....P2.....K1K2...",
  "..K1K2....K1K1K2..",
  ".K1K1K2...........",
];

// 6. POSE 6: RUN_4 (Push-off stance, akselerasi laju)
const DANI_RUN_4 = [
  ".....H1H1H1H1H1...",
  "....H1H2H2H2H2H1..",
  "...H1H2H2H2H2H2H3.",
  "...H2S1S1S1S1S1H3.",
  "...H2S1W1E1S1S1H3.",
  "...H2S1BLS1S1S1H3.",
  "...H3H2H2H2H2H3H3H3",
  "....H3H3H3H3H3H3H3",
  "...J1J1Z1Z1J1J1...",
  "...J1J2Z1Z1J2J2...",
  "....J2J2Z1Z1J2....",
  ".....J3J3J3J3.....",
  ".....P1P1P1.......",
  "....P1P2..P1......",
  "...P1......P2.....",
  "..K1K2.....K1K2...",
  ".K1K1K2...K1K1K2..",
  "..................",
];

// 7. POSE 7: JUMP_TAKEOFF (Tolakan melompat)
const DANI_JUMP_TAKEOFF = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1P1......",
  "...P1P1..P1P1.....",
  "...P2P2..P2P2.....",
  "..K1K2....K1K2....",
  ".K1K1K2..K1K1K2...",
  "..................",
];

// 8. POSE 8: JUMP_APEX (Puncak lompatan, melayang anti-gravitasi)
const DANI_JUMP_APEX = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3H3",
  "..H2S1S1S1S1S1H3H3",
  "..H2S1W1E1S1S1H3H3",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3....",
  "...H3H3H3H3H3.....",
  ".J1J1J1Z1Z1J1J1J1.",
  ".J1J2J2Z1Z1J2J2J1.",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1P1......",
  "...P1P1..P1P1.....",
  "..P2P2....P2P2....",
  "..K1K2....K1K2....",
  ".K1K1K2..K1K1K2...",
  "..................",
];

// 9. POSE 9: JUMP_FALL (Melayang turun, tangan melebar)
const DANI_JUMP_FALL = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3H3.",
  ".J1J1J1Z1Z1J1J1J1.",
  "..J1J2Z1Z1J2J2....",
  "...J2J2Z1Z1J2.....",
  "....J3J3J3J3......",
  ".....P1P1P1.......",
  ".....P1..P1.......",
  ".....P2..P2.......",
  "....P2....P2......",
  "...K1K2..K1K2.....",
  "..K1K1K2K1K1K2....",
];

// 10. POSE 10: LAND_IMPACT (Mendarat menyerap benturan)
const DANI_LAND_IMPACT = [
  "..................",
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "..J2J2Z1Z1J2J2....",
  "...P1P1P1P1P1.....",
  "..P1P2....P2P1....",
  ".P2P2......P2P2...",
  "K1K1K2....K1K1K2..",
  "..................",
  "..................",
];

// 11. POSE 11: STOMP (Manuver injak musuh dari atas)
const DANI_STOMP = [
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLS1S1S1H3..",
  "..H3H2H2H2H2H3H3H3",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1....",
  "..J1J2Z1Z1J2J2....",
  "...J2J2Z1Z1J2.....",
  "....J3J3J3J3......",
  ".....P1P1.........",
  "....P1P2..........",
  "...P2P2...P1P1....",
  "..K1K1K2...P2P2...",
  "...........K1K1K2.",
  "..................",
];

// 12. POSE 12: VICTORY_CHEER (Senyum riang, lambaian tangan kemenangan)
const DANI_VICTORY = [
  ".........S1S1.....", // Tangan kanan dadah di atas
  "....H1H1H1H1H1....",
  "...H1H2H2H2H2H1...",
  "..H1H2H2H2H2H2H3..",
  "..H2S1S1S1S1S1H3..",
  "..H2S1W1E1S1S1H3..",
  "..H2S1BLBLS1S1H3..", // Rona merah ceria
  "..H3H2H2H2H2H3H3..",
  "...H3H3H3H3H3H3...",
  "..J1J1Z1Z1J1J1S1S1", // Tangan kanan terangkat riang
  "..J1J2Z1Z1J2J2J1..",
  "..J2J2Z1Z1J2J2....",
  "...J3J3J3J3J3.....",
  "....P1P1P1P1......",
  "....P1P2P2P1......",
  "....P1....P1......",
  "....P2....P2......",
  "..K1K1K2K1K1K2....",
];

// -------------------------------------------------------------
// MALAYSIAN TRADITIONAL COLLECTIBLES & OBJECTS (10x10 / 8x8)
// -------------------------------------------------------------

// 1. Karipap Emas (Golden Curry Puff) - 10x8
const ITEM_KARIPAP = [
  "...KP_DARKKP_DARK...",
  "..KP_DARKKP_CRUSTKP_DARK..",
  ".KP_CRUSTKP_GOLDKP_GOLDKP_CRUST.",
  "KP_CRUSTKP_GOLDKP_GOLDKP_GOLDKP_CRUST",
  "KP_CRUSTKP_GOLDKP_GOLDKP_GOLDKP_CRUST",
  ".KP_CRUSTKP_CRUSTKP_CRUSTKP_CRUST.",
  "..KP_DARKKP_DARKKP_DARKKP_DARK..",
  "................",
];

// 2. Teh Tarik Kaw (Frothy pulled tea in glass mug) - 8x10
const ITEM_TEH_TARIK = [
  "..TT_FOAMTT_FOAM..",
  ".TT_FOAMTT_FOAMTT_FOAM.",
  ".TT_GLASSTT_TEATT_GLASS.",
  ".TT_GLASSTT_TEATT_GLASS.TT_GLASS",
  ".TT_GLASSTT_TEATT_GLASS.TT_GLASS",
  ".TT_GLASSTT_TEATT_GLASS.TT_GLASS",
  ".TT_GLASSTT_TEATT_GLASS.",
  ".TT_GLASSTT_GLASSTT_GLASS.",
  "..TT_GLASSTT_GLASS..",
  "................",
];

// 3. Bunga Raya (Hibiscus - Bunga Kebangsaan Malaysia) - 10x10
const ITEM_BUNGA_RAYA = [
  "....HIB_REDHIB_RED....",
  "..HIB_REDHIB_REDHIB_REDHIB_RED..",
  ".HIB_REDHIB_GOLDHIB_GOLDHIB_RED.",
  "HIB_REDHIB_GOLDHIB_GOLDHIB_GOLDHIB_RED",
  "HIB_REDHIB_REDHIB_GOLDHIB_REDHIB_RED",
  ".HIB_REDHIB_REDHIB_REDHIB_RED.",
  "..HIB_RED....HIB_RED..",
  "....HIB_REDHIB_RED....",
  "................",
  "................",
];

// Helper to draw Dani's matrix onto 2D canvas
export function drawDaniMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  x: number,
  y: number,
  pixelSize: number = 2,
  flipX: boolean = false
) {
  const height = matrix.length;
  ctx.save();

  // Find line length safely
  const width = matrix[0] ? matrix[0].length / 2 : 18;

  if (flipX) {
    ctx.translate(x + width * pixelSize, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }

  for (let r = 0; r < height; r++) {
    const row = matrix[r];
    if (!row) continue;
    // Iterate in 2-char tokens (H1, H2, S1, etc.)
    for (let c = 0; c < row.length; c += 2) {
      const token = row.slice(c, c + 2);
      if (token === ".." || token === "  ") continue;

      const color = (DANI_PALETTE as Record<string, string>)[token];
      if (color && color !== "transparent") {
        ctx.fillStyle = color;
        ctx.fillRect((c / 2) * pixelSize, r * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  ctx.restore();
}

// Draw 10x8 / 8x10 items
export function drawMalaysianItem(
  ctx: CanvasRenderingContext2D,
  matrix: string[],
  x: number,
  y: number,
  pixelSize: number = 2
) {
  const height = matrix.length;
  for (let r = 0; r < height; r++) {
    const row = matrix[r];
    if (!row) continue;
    // Token length for item can vary (KP_GOLD = 7 chars, TT_TEA = 6 chars, HIB_RED = 7 chars)
    // We can parse using regex tokens
    const tokens = row.match(/(KP_GOLD|KP_CRUST|KP_DARK|TT_TEA|TT_FOAM|TT_GLASS|HIB_RED|HIB_GOLD|\.\.)/g);
    if (!tokens) continue;

    for (let c = 0; c < tokens.length; c++) {
      const token = tokens[c];
      if (token === "..") continue;
      const color = (DANI_PALETTE as Record<string, string>)[token];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

// 12 Poses Export
export const DANI_POSES = {
  idle_1: DANI_IDLE_1,
  idle_2: DANI_IDLE_2,
  run_1: DANI_RUN_1,
  run_2: DANI_RUN_2,
  run_3: DANI_RUN_3,
  run_4: DANI_RUN_4,
  jump_takeoff: DANI_JUMP_TAKEOFF,
  jump_apex: DANI_JUMP_APEX,
  jump_fall: DANI_JUMP_FALL,
  land_impact: DANI_LAND_IMPACT,
  stomp: DANI_STOMP,
  victory: DANI_VICTORY,
};

export const MALAYSIAN_ITEMS = {
  karipap: ITEM_KARIPAP,
  tehTarik: ITEM_TEH_TARIK,
  bungaRaya: ITEM_BUNGA_RAYA,
};
