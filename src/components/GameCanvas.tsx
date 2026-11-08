"use client";

import React, { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { CharacterId, CharacterPose, InteractiveObject, CloudLayer, FlyingBird } from "@/lib/gameTypes";
import { DevActions } from "./DevHub";

const CANVAS_W = 960;
const CANVAS_H = 540;
const WORLD_W = 3000;
const GROUND_Y = 430;

// Helper: Animated Dimensional Portal with swirling galaxy vortex & runestone glow
function drawPortal(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  groundY: number,
  globalTimer: number,
  label: string
) {
  ctx.save();
  const portalY = groundY - 65;

  // 1. Swirling Outer Nebula Glow
  const pulse = 0.7 + Math.sin(globalTimer * 0.08) * 0.25;
  const glow = ctx.createRadialGradient(screenX, portalY, 12, screenX, portalY, 80);
  glow.addColorStop(0, `rgba(168, 85, 247, ${pulse * 0.85})`);
  glow.addColorStop(0.4, `rgba(59, 130, 246, ${pulse * 0.5})`);
  glow.addColorStop(0.8, `rgba(236, 72, 153, ${pulse * 0.25})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(screenX, portalY, 65, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Vertical Rift Light Beam
  const beam = ctx.createLinearGradient(screenX - 16, 0, screenX + 16, 0);
  beam.addColorStop(0, "rgba(56, 189, 248, 0)");
  beam.addColorStop(0.5, `rgba(255, 255, 255, ${0.45 + Math.sin(globalTimer * 0.12) * 0.2})`);
  beam.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = beam;
  ctx.fillRect(screenX - 16, portalY - 95, 32, 165);

  // 3. Rotating Dimensional Rings
  for (let r = 0; r < 3; r++) {
    const rot = globalTimer * (0.035 + r * 0.015) * (r % 2 === 0 ? 1 : -1);
    ctx.save();
    ctx.translate(screenX, portalY);
    ctx.rotate(rot);
    ctx.strokeStyle = r === 0 ? "#c084fc" : r === 1 ? "#38bdf8" : "#f472b6";
    ctx.lineWidth = 2.2 - r * 0.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, 28 + r * 12, 48 + r * 15, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Dark Celestial Core (Event Horizon)
  const coreGrad = ctx.createRadialGradient(screenX, portalY, 4, screenX, portalY, 30);
  coreGrad.addColorStop(0, "#030712");
  coreGrad.addColorStop(0.7, "#1e1b4b");
  coreGrad.addColorStop(1, "#6366f1");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.ellipse(screenX, portalY, 24, 44, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Floating Sparkle Runes
  for (let i = 0; i < 7; i++) {
    const orbitSpeed = globalTimer * 0.06 + (i * Math.PI) / 3.5;
    const orbitR = 34 + Math.sin(globalTimer * 0.12 + i) * 8;
    const px = screenX + Math.cos(orbitSpeed) * orbitR * 0.75;
    const py = portalY + Math.sin(orbitSpeed) * orbitR * 1.35;
    ctx.fillStyle = i % 2 === 0 ? "#fde047" : "#38bdf8";
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }

  // 6. Ground Energy Ripple
  ctx.fillStyle = "rgba(168, 85, 247, 0.45)";
  ctx.beginPath();
  ctx.ellipse(screenX, groundY + 14, 40, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Floating Portal Runestone Label Banner
  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fef08a";
  ctx.fillText(label, screenX, portalY - 72);

  ctx.restore();
}

// Helper: Animated High-Tech Metro Station Portal Gateway (Made with pure Canvas code)
function drawStationPortal(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  groundY: number,
  globalTimer: number,
  title: string,
  subtitle: string
) {
  ctx.save();
  const portalY = groundY - 70;

  // 1. Outer Electric / Holographic Cyan Glow
  const pulse = 0.75 + Math.sin(globalTimer * 0.08) * 0.22;
  const glow = ctx.createRadialGradient(screenX, portalY, 15, screenX, portalY, 85);
  glow.addColorStop(0, `rgba(56, 189, 248, ${pulse * 0.85})`);
  glow.addColorStop(0.4, `rgba(14, 165, 233, ${pulse * 0.5})`);
  glow.addColorStop(0.8, `rgba(3, 105, 161, ${pulse * 0.2})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(screenX, portalY, 70, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. High-Tech Cyber Portal Arch (Pillars & Canopy)
  // Left pillar
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(screenX - 44, groundY - 140, 12, 140);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(screenX - 44, groundY - 140, 12, 140);

  // Right pillar
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(screenX + 32, groundY - 140, 12, 140);
  ctx.strokeRect(screenX + 32, groundY - 140, 12, 140);

  // Overhead lintel / arch
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(screenX - 52, groundY - 152, 104, 15);
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(screenX - 52, groundY - 152, 104, 15);

  // 3. Holographic Station Gate / Event Horizon
  const vortexGrad = ctx.createLinearGradient(screenX - 32, 0, screenX + 32, 0);
  vortexGrad.addColorStop(0, "rgba(2, 132, 199, 0.4)");
  vortexGrad.addColorStop(0.5, `rgba(224, 242, 254, ${0.7 + Math.sin(globalTimer * 0.12) * 0.25})`);
  vortexGrad.addColorStop(1, "rgba(2, 132, 199, 0.4)");
  ctx.fillStyle = vortexGrad;
  ctx.fillRect(screenX - 32, groundY - 137, 64, 137);

  // Scanning laser beam sweeping vertically
  const scanY = groundY - 137 + ((globalTimer * 2.2) % 137);
  ctx.fillStyle = "#facc15";
  ctx.fillRect(screenX - 32, scanY, 64, 2);

  // 4. Rotating Energy Glyphs & Rings
  for (let r = 0; r < 2; r++) {
    const rot = globalTimer * (0.04 + r * 0.02) * (r === 0 ? 1 : -1);
    ctx.save();
    ctx.translate(screenX, portalY);
    ctx.rotate(rot);
    ctx.strokeStyle = r === 0 ? "#38bdf8" : "#facc15";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26 + r * 10, 44 + r * 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Holographic Station Signboard Badge
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.fillRect(screenX - 78, groundY - 180, 156, 24);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(screenX - 78, groundY - 180, 156, 24);

  ctx.font = "bold 8px 'Courier New', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(title, screenX, groundY - 169);
  ctx.font = "bold 7px 'Courier New', monospace";
  ctx.fillStyle = "#facc15";
  ctx.fillText(subtitle, screenX, groundY - 160);

  // Ground cyber contact pad
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(screenX - 36, groundY - 2, 72, 4);

  ctx.restore();
}

// Helper: Station Exit Gate Icon / Turnstile (Made with pure Canvas code)
function drawStationExitGate(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  groundY: number,
  globalTimer: number,
  label: string
) {
  ctx.save();
  const pulse = 0.8 + Math.sin(globalTimer * 0.1) * 0.2;

  // Turnstiles / Flap Barrier Gate
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(screenX - 35, groundY - 65, 70, 65);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.strokeRect(screenX - 35, groundY - 65, 70, 65);

  // Green LED exit arrow on turnstile
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.moveTo(screenX, groundY - 50);
  ctx.lineTo(screenX + 10, groundY - 40);
  ctx.lineTo(screenX + 4, groundY - 40);
  ctx.lineTo(screenX + 4, groundY - 25);
  ctx.lineTo(screenX - 4, groundY - 25);
  ctx.lineTo(screenX - 4, groundY - 40);
  ctx.lineTo(screenX - 10, groundY - 40);
  ctx.closePath();
  ctx.fill();

  // Illuminated Overhead Exit Sign
  ctx.fillStyle = "rgba(6, 78, 59, 0.95)";
  ctx.fillRect(screenX - 75, groundY - 120, 150, 32);
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 2;
  ctx.strokeRect(screenX - 75, groundY - 120, 150, 32);

  // Glowing green running man / exit text
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = "#a7f3d0";
  ctx.textAlign = "center";
  ctx.fillText("🚪 PINTU KELUAR / EXIT", screenX, groundY - 106);
  ctx.font = "bold 8px 'Courier New', monospace";
  ctx.fillStyle = "#facc15";
  ctx.fillText(label, screenX, groundY - 95);

  // Soft green downward light cone
  const cone = ctx.createLinearGradient(screenX, groundY - 88, screenX, groundY);
  cone.addColorStop(0, `rgba(52, 211, 153, ${pulse * 0.35})`);
  cone.addColorStop(1, "rgba(52, 211, 153, 0)");
  ctx.fillStyle = cone;
  ctx.fillRect(screenX - 40, groundY - 88, 80, 88);

  ctx.restore();
}

// Helper: Interconnected catenary sagging cable with traveling electric/signal pulse
function drawCatenaryCable(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sag: number,
  mainColor: string,
  glowColor: string,
  lineWidth: number,
  globalTimer: number,
  pulseSpeed: number,
  pulseOffset: number
) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + sag;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Animated traveling signal pulse (glowing data packet)
  const t = ((globalTimer * pulseSpeed + pulseOffset) % 100) / 100;
  const oneMinusT = 1 - t;
  const px = oneMinusT * oneMinusT * x1 + 2 * oneMinusT * t * midX + t * t * x2;
  const py = oneMinusT * oneMinusT * y1 + 2 * oneMinusT * t * midY + t * t * y2;

  const grad = ctx.createRadialGradient(px, py, 1, px, py, 6);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
  ctx.restore();
}

interface GameCanvasProps {
  activeCharacter: CharacterId;
  onSwitchCharacter: () => void;
  onTriggerDialogue: (dialogueId: string) => void;
  isDialogueOpen: boolean;
  currentDialogueId?: string | null;
  scanlines: boolean;
  virtualInput: { left: boolean; right: boolean; run: boolean; interact: boolean; attack: boolean };
  onRegisterDevActions?: (actions: DevActions) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  activeCharacter,
  onSwitchCharacter,
  onTriggerDialogue,
  isDialogueOpen,
  currentDialogueId,
  scanlines,
  virtualInput,
  onRegisterDevActions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard input state
  const keysRef = useRef<{ left: boolean; right: boolean; run: boolean; interact: boolean; attack: boolean }>({
    left: false,
    right: false,
    run: false,
    interact: false,
    attack: false,
  });

  // Combat Mode State & Training Dummies
  const attackStateRef = useRef<{
    isAttacking: boolean;
    frame: number;
    timer: number;
    hasHit: boolean;
    slashPlayed: boolean;
  }>({
    isAttacking: false,
    frame: 0,
    timer: 0,
    hasHit: false,
    slashPlayed: false,
  });

  const screenShakeRef = useRef(0);
  const comboRef = useRef({ count: 0, timer: 0 });

  const trainingDummiesRef = useRef<
    {
      id: string;
      x: number;
      y: number;
      shake: number;
      hitTimer: number;
      label: string;
    }[]
  >([
    { id: "dummy_losari", x: 620, y: GROUND_Y, shake: 0, hitTimer: 0, label: "Dummy Latihan Silat" },
    { id: "dummy_warkop", x: 1530, y: GROUND_Y, shake: 0, hitTimer: 0, label: "Sasaran Kayu Daeng Rauf" },
  ]);

  const combatParticlesRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
      maxLife: number;
    }[]
  >([]);

  const damageNumbersRef = useRef<
    {
      x: number;
      y: number;
      text: string;
      color: string;
      life: number;
      maxLife: number;
      vy: number;
      isCrit: boolean;
    }[]
  >([]);

  // Player positions & states
  const jihanPosRef = useRef({
    x: 320,
    y: GROUND_Y,
    vx: 0,
    facingLeft: false,
    pose: "idle_stand" as CharacterPose,
    animFrame: 0,
    animTimer: 0,
    walkTimer: 0,
    walk24Frame: 0,
  });

  const daniPosRef = useRef({
    x: 250,
    y: GROUND_Y,
    vx: 0,
    facingLeft: false,
    pose: "idle_stand" as CharacterPose,
    animFrame: 0,
    animTimer: 0,
    walkTimer: 0,
    walk24Frame: 0,
  });

  const cameraXRef = useRef(0);
  const globalTimerRef = useRef(0);

  // Ambient elements
  const cloudsRef = useRef<CloudLayer[]>([
    { x: 100, y: 40, speed: 0.18, scale: 0.8, variant: 0 },
    { x: 750, y: 70, speed: 0.12, scale: 0.7, variant: 1 },
    { x: 1400, y: 50, speed: 0.15, scale: 0.6, variant: 2 },
    { x: 1950, y: 65, speed: 0.14, scale: 0.75, variant: 0 },
  ]);

  const birdsRef = useRef<FlyingBird[]>([
    { x: 400, y: 120, vx: 1.4, vy: -0.1, frame: 0, timer: 0 },
    { x: 1100, y: 150, vx: 1.2, vy: 0.05, frame: 1, timer: 10 },
  ]);

  // Bekasi Scavenger Birds (Crows & White Egrets in Bantar Gebang)
  const bekasiBirdsRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "crow_flying" | "crow_pecking" | "egret_flying" | "egret_standing";
      frame: number;
      timer: number;
      isStartled?: boolean;
    }>
  >([
    // Flying Crows & Egrets in the sky
    { x: 300, y: 70, vx: 1.8, vy: 0.1, type: "crow_flying", frame: 0, timer: 0 },
    { x: 750, y: 95, vx: 1.5, vy: -0.15, type: "crow_flying", frame: 2, timer: 12 },
    { x: 1200, y: 60, vx: 1.7, vy: 0.08, type: "egret_flying", frame: 1, timer: 5 },
    { x: 1850, y: 85, vx: 1.4, vy: -0.1, type: "crow_flying", frame: 4, timer: 20 },
    { x: 2350, y: 110, vx: 1.6, vy: 0.12, type: "egret_flying", frame: 3, timer: 15 },
    // Ground / Perched Crows & Egrets
    { x: 620, y: GROUND_Y - 14, vx: 0, vy: 0, type: "crow_pecking", frame: 0, timer: 0 },
    { x: 980, y: GROUND_Y - 14, vx: 0, vy: 0, type: "crow_pecking", frame: 2, timer: 8 },
    { x: 1350, y: GROUND_Y - 24, vx: 0, vy: 0, type: "egret_standing", frame: 1, timer: 4 },
    { x: 1720, y: GROUND_Y - 14, vx: 0, vy: 0, type: "crow_pecking", frame: 3, timer: 14 },
    { x: 2050, y: GROUND_Y - 24, vx: 0, vy: 0, type: "egret_standing", frame: 4, timer: 18 },
  ]);

  const catAnimRef = useRef({ frame: 0, timer: 0 });

  // Loaded images cache
  const imagesRef = useRef<{
    bg: HTMLImageElement | null;
    props: HTMLImageElement | null;
    micro: HTMLImageElement | null;
    jihanSheet: HTMLImageElement | null;
    jihanMaster: HTMLImageElement | null;
    jihanCombat: HTMLImageElement | null;
    gerobak24: HTMLImageElement | null;
    daniSheet: HTMLImageElement | null;
    daniMaster: HTMLImageElement | null;
    daniCombat: HTMLImageElement | null;
    panciProp: HTMLImageElement | null;
    cauldronEmergence: HTMLImageElement | null;
    monsterMaster: HTMLImageElement | null;
    towerListrik: HTMLImageElement | null;
    adifMaster: HTMLImageElement | null;
    adifCombat: HTMLImageElement | null;
    hairiMaster: HTMLImageElement | null;
    hairiCombat: HTMLImageElement | null;
    hairiSuperMaster: HTMLImageElement | null;
    hairiSuperCombat: HTMLImageElement | null;
    hairiV3Master: HTMLImageElement | null;
    hairiV3Combat: HTMLImageElement | null;
    undergroundStation: HTMLImageElement | null;
    krlTrain: HTMLImageElement | null;
    stasiunBekasi: HTMLImageElement | null;
    envBekasi: HTMLImageElement | null;
    keyMaster: HTMLImageElement | null;
    keyCombat: HTMLImageElement | null;
    bekasiBirds: HTMLImageElement | null;
    bekasiTruckProps: HTMLImageElement | null;
  }>({
    bg: null,
    props: null,
    micro: null,
    jihanSheet: null,
    jihanMaster: null,
    jihanCombat: null,
    gerobak24: null,
    daniSheet: null,
    daniMaster: null,
    daniCombat: null,
    panciProp: null,
    cauldronEmergence: null,
    monsterMaster: null,
    towerListrik: null,
    adifMaster: null,
    adifCombat: null,
    hairiMaster: null,
    hairiCombat: null,
    hairiSuperMaster: null,
    hairiSuperCombat: null,
    hairiV3Master: null,
    hairiV3Combat: null,
    undergroundStation: null,
    krlTrain: null,
    stasiunBekasi: null,
    envBekasi: null,
    keyMaster: null,
    keyCombat: null,
    bekasiBirds: null,
    bekasiTruckProps: null,
  });

  // Zone & Map State (Losari vs Perkampungan Menara vs Stasiun Menara vs Stasiun Bekasi vs Bekasi TPST)
  const zoneRef = useRef<"losari" | "perkampungan" | "stasiun_menara" | "stasiun_bekasi" | "bekasi">("losari");
  const [, setCurrentZone] = useState<"losari" | "perkampungan" | "stasiun_menara" | "stasiun_bekasi" | "bekasi">("losari");
  const zoneBannerRef = useRef<{ title: string; subtitle: string; timer: number }>({
    title: "",
    subtitle: "",
    timer: 0,
  });
  const teleportFlashRef = useRef<number>(0);

  // Dev Hub / Cheats & Overrides
  const godModeRef = useRef<boolean>(false);
  const oneHitKillRef = useRef<boolean>(false);
  const speedMultRef = useRef<number>(1.0);

  // Adif (Brown Cowboy on Tower) State
  const adifRef = useRef<{
    onTower: boolean;
    isRappelling: boolean;
    x: number;
    y: number;
    vx: number;
    facingLeft: boolean;
    state: "climb" | "rappel" | "idle" | "walk" | "run" | "combat" | "defeated";
    combatType?: "stance" | "whip" | "punch";
    animFrame: number;
    animTimer: number;
    hp: number;
    maxHp: number;
    hitFlash: number;
    shake: number;
    attackCooldown: number;
    isAttacking: boolean;
    lassoActive: boolean;
    lassoTargetX: number;
    lassoTargetY: number;
    lassoTimer: number;
    evasionTimer: number;
    isFriend: boolean;
  }>({
    onTower: true,
    isRappelling: false,
    x: 1710,
    y: GROUND_Y - 240,
    vx: 0,
    facingLeft: true,
    state: "climb",
    combatType: "stance",
    animFrame: 0,
    animTimer: 0,
    hp: 300,
    maxHp: 300,
    hitFlash: 0,
    shake: 0,
    attackCooldown: 60,
    isAttacking: false,
    lassoActive: false,
    lassoTargetX: 0,
    lassoTargetY: 0,
    lassoTimer: 0,
    evasionTimer: 0,
    isFriend: false,
  });

  // Hairi (Angry Gray Shirt Guy / Super Cyber Hairi) State
  const hairiRef = useRef<{
    x: number;
    y: number;
    vx: number;
    facingLeft: boolean;
    state: "idle" | "walk" | "run" | "walk_angry" | "idle_angry" | "combat" | "hurt" | "defeated";
    animFrame: number;
    animTimer: number;
    hp: number;
    maxHp: number;
    phase: 1 | 2 | 3;
    isTransforming: boolean;
    transformTimer: number;
    hitFlash: number;
    shake: number;
    attackCooldown: number;
    isAttacking: boolean;
    isShieldBlocking: boolean;
    shieldBlockFlash: number;
    isEnraged: boolean;
    enragedTriggered: boolean;
    isFriend: boolean;
    bashShockwave: { active: boolean; x: number; y: number; dir: number; timer: number } | null;
  }>({
    x: 1620,
    y: GROUND_Y,
    vx: -1.0,
    facingLeft: true,
    state: "walk_angry",
    animFrame: 0,
    animTimer: 0,
    hp: 300,
    maxHp: 300,
    phase: 1,
    isTransforming: false,
    transformTimer: 0,
    hitFlash: 0,
    shake: 0,
    attackCooldown: 45,
    isAttacking: false,
    isShieldBlocking: false,
    shieldBlockFlash: 0,
    isEnraged: false,
    enragedTriggered: false,
    isFriend: false,
    bashShockwave: null,
  });

  // Dual Battle State (Dani & Jihan vs Adif & Hairi)
  const battleAdifHairiRef = useRef<{
    inCombat: boolean;
    isDefeated: boolean;
  }>({
    inCombat: false,
    isDefeated: false,
  });
  const pendingBattleRef = useRef(false);
  const pendingEvolutionBattleRef = useRef(false);
  const pendingPortalToMenaraStationRef = useRef(false);
  const pendingExitBekasiStationRef = useRef(false);
  const pendingEnterBekasiStationRef = useRef(false);
  const cyberProjectilesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      life: number;
      maxLife: number;
      damage: number;
      facingLeft: boolean;
    }>
  >([]);

  // Key (OP Bantar Gebang Mage from Bekasi) State
  const keyRef = useRef<{
    x: number;
    y: number;
    vx: number;
    facingLeft: boolean;
    state: "idle" | "walk" | "run" | "combat" | "hurt" | "defeated";
    animFrame: number;
    animTimer: number;
    hp: number;
    maxHp: number;
    hitFlash: number;
    shake: number;
    teleportTimer: number;
    teleportCooldown: number;
    attackCooldown: number;
    isAttacking: boolean;
    isFriend: boolean;
  }>({
    x: 1450,
    y: GROUND_Y,
    vx: 0,
    facingLeft: true,
    state: "idle",
    animFrame: 0,
    animTimer: 0,
    hp: 900,
    maxHp: 900,
    hitFlash: 0,
    shake: 0,
    teleportTimer: 0,
    teleportCooldown: 70,
    attackCooldown: 45,
    isAttacking: false,
    isFriend: false,
  });

  const battleKeyRef = useRef<{
    inCombat: boolean;
    isDefeated: boolean;
  }>({
    inCombat: false,
    isDefeated: false,
  });
  const pendingKeyBattleRef = useRef(false);

  // Bantar Gebang Flying Trash Projectiles
  const trashProjectilesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: "bag" | "bottle" | "box";
      rot: number;
      rotSpeed: number;
      life: number;
      maxLife: number;
      damage: number;
    }>
  >([]);

  // Boss Monster State (Summoned from Panci at Far Right)
  const monsterRef = useRef<{
    isActive: boolean;
    isEmerging: boolean;
    emergeFrame: number;
    emergeTimer: number;
    x: number;
    y: number;
    vx: number;
    hp: number;
    maxHp: number;
    facingLeft: boolean;
    state: "idle" | "move" | "attack" | "hurt" | "defeated";
    animFrame: number;
    animTimer: number;
    hitFlash: number;
    shake: number;
    attackCooldown: number;
    isAttacking: boolean;
    isDefeated: boolean;
    dissolveTimer: number;
  }>({
    isActive: false,
    isEmerging: false,
    emergeFrame: 0,
    emergeTimer: 0,
    x: 2060,
    y: GROUND_Y,
    vx: 0,
    hp: 500,
    maxHp: 500,
    facingLeft: true,
    state: "idle",
    animFrame: 0,
    animTimer: 0,
    hitFlash: 0,
    shake: 0,
    attackCooldown: 60,
    isAttacking: false,
    isDefeated: false,
    dissolveTimer: 0,
  });

  // 2D KRL Commuter Line Train Animated Entity State (8-frame doors & movement)
  const krlStateRef = useRef<{
    x: number;
    vx: number;
    state: "idle_open" | "arriving" | "departing" | "doors_closing" | "doors_opening";
    frame: number;
    animTimer: number;
    targetX: number;
    transitionTimer: number;
  }>({
    x: 2780,
    vx: 0,
    state: "idle_open",
    frame: 4, // Frame 4 = sliding doors fully open
    animTimer: 0,
    targetX: 2780,
    transitionTimer: 0,
  });

  // Dynamic Interactive Objects Filtered by Current Zone
  const getInteractiveObjects = (
    zone: "losari" | "perkampungan" | "stasiun_menara" | "stasiun_bekasi" | "bekasi",
    monsterDefeated: boolean,
    duelDefeated: boolean,
    hairiFriend: boolean
  ): InteractiveObject[] => {
    if (zone === "losari") {
      const objs: InteractiveObject[] = [
        {
          id: "pier_west",
          type: "pier_edge",
          x: 140,
          y: GROUND_Y - 40,
          width: 80,
          height: 80,
          prompt: "Amati Ombak & Cakrawala",
          interacted: false,
          dialogueId: "pier_1",
        },
        {
          id: "cat_oyen",
          type: "cat",
          x: 430,
          y: GROUND_Y - 20,
          width: 70,
          height: 50,
          prompt: "Elus Si Oyen",
          interacted: false,
          dialogueId: "cat_1",
        },
        {
          id: "bench_sunset",
          type: "bench",
          x: 770,
          y: GROUND_Y - 40,
          width: 100,
          height: 60,
          prompt: "Duduk Memandang Senja",
          interacted: false,
          dialogueId: "bench_1",
        },
        {
          id: "pisang_epe",
          type: "pisang_epe",
          x: 1180,
          y: GROUND_Y - 60,
          width: 120,
          height: 90,
          prompt: "Cicipi Pisang Epe & Saraba",
          interacted: false,
          dialogueId: "pisang_1",
        },
        {
          id: "warkop_losari",
          type: "warkop",
          x: 1680,
          y: GROUND_Y - 80,
          width: 140,
          height: 100,
          prompt: "Mengobrol di Warkop Daeng Rauf",
          interacted: false,
          dialogueId: "warkop_1",
        },
        {
          id: "panci_misterius",
          type: "pier_edge",
          x: 2150,
          y: GROUND_Y - 45,
          width: 90,
          height: 90,
          prompt: monsterDefeated ? "Panci Purba (Siluman Telah Tunduk)" : "Buka Tutup Panci Misterius",
          interacted: false,
          dialogueId: monsterDefeated ? "panci_defeat" : "panci_1",
        },
      ];
      if (monsterDefeated) {
        objs.push({
          id: "portal_to_kampung",
          type: "pier_edge",
          x: 2240,
          y: GROUND_Y - 50,
          width: 90,
          height: 120,
          prompt: "🌀 Masuk Portal Dimensi ke Perkampungan Menara Sinyal",
          interacted: false,
          dialogueId: "",
        });
      }
      return objs;
    } else if (zone === "perkampungan") {
      // Perkampungan zone
      const objs: InteractiveObject[] = [
        {
          id: "portal_to_losari",
          type: "pier_edge",
          x: 180,
          y: GROUND_Y - 50,
          width: 90,
          height: 120,
          prompt: "🌀 Kembali ke Pantai Losari melalui Portal Dimensi",
          interacted: false,
          dialogueId: "",
        },
        {
          id: "adif_tower",
          type: "pier_edge",
          x: 1710,
          y: GROUND_Y - 140,
          width: 120,
          height: 180,
          prompt: duelDefeated
            ? (hairiFriend ? "Mengobrol dengan Sahabat Adif & Hairi" : "Ajak Hairi Menjadi Sahabat & Rekan Bertarung")
            : "Panggil Adif di Atas Tower Menara Sinyal",
          interacted: false,
          dialogueId: duelDefeated ? "adif_hairi_defeat_2" : "adif_tower_1",
        },
      ];
      if (duelDefeated) {
        objs.push({
          id: "portal_stasiun_menara",
          type: "pier_edge",
          x: 2750,
          y: GROUND_Y - 80,
          width: 140,
          height: 180,
          prompt: "🌀 [E] Masuk Portal Stasiun KRL",
          interacted: false,
          dialogueId: "portal_stasiun_menara_1",
        });
      }
      return objs;
    } else if (zone === "stasiun_menara") {
      // Dedicated Zone 3: Stasiun Bawah Tanah Kampung Menara (Expansive Platform)
      const objs: InteractiveObject[] = [
        {
          id: "portal_to_kampung",
          type: "pier_edge",
          x: 180,
          y: GROUND_Y - 80,
          width: 140,
          height: 180,
          prompt: "🌀 [E] Masuk Portal Kembali ke Perkampungan Menara",
          interacted: false,
          dialogueId: "",
        },
        {
          id: "krl_menara_to_bekasi",
          type: "pier_edge",
          x: 2200,
          y: GROUND_Y - 80,
          width: 260,
          height: 180,
          prompt: "🚉 [E] Naik KRL Commuter Line Menuju Stasiun Bekasi",
          interacted: false,
          dialogueId: "krl_station_1",
        },
      ];
      return objs;
    } else if (zone === "stasiun_bekasi") {
      // Dedicated Zone 4: Stasiun Bekasi (BKS +19M) (Expansive Station)
      const objs: InteractiveObject[] = [
        {
          id: "krl_bekasi_to_menara",
          type: "pier_edge",
          x: 550,
          y: GROUND_Y - 80,
          width: 260,
          height: 180,
          prompt: "🚉 [E] Naik KRL Kembali ke Stasiun Kampung Menara",
          interacted: false,
          dialogueId: "krl_bekasi_to_menara_1",
        },
        {
          id: "exit_stasiun_bekasi",
          type: "pier_edge",
          x: 2500,
          y: GROUND_Y - 80,
          width: 140,
          height: 180,
          prompt: "🚪 [E] Pintu Keluar Stasiun Menuju Permukaan Kota Bekasi",
          interacted: false,
          dialogueId: "exit_stasiun_bekasi_1",
        },
      ];
      return objs;
    } else {
      // Zone 5: Kota Bekasi Bantar Gebang
      const objs: InteractiveObject[] = [
        {
          id: "masuk_stasiun_bekasi",
          type: "pier_edge",
          x: 140,
          y: GROUND_Y - 80,
          width: 140,
          height: 180,
          prompt: "🚇 [E] Masuk ke Gedung Stasiun Bekasi",
          interacted: false,
          dialogueId: "enter_stasiun_bekasi_1",
        },
        {
          id: "truk_sampah_dlh",
          type: "warkop",
          x: 750,
          y: GROUND_Y - 80,
          width: 180,
          height: 140,
          prompt: "🚛 Sapa Pak Bambang (Supir Truk Sampah DLH)",
          interacted: false,
          dialogueId: "supir_truk_1",
        },
        {
          id: "gundukan_sampah_harta",
          type: "pisang_epe",
          x: 1100,
          y: GROUND_Y - 60,
          width: 130,
          height: 90,
          prompt: "🗑️ Mengais Tumpukan Sampah Antik (Cari Harta Karun)",
          interacted: false,
          dialogueId: "gundukan_sampah_1",
        },
        {
          id: "kucing_garong",
          type: "cat",
          x: 1160,
          y: GROUND_Y - 30,
          width: 70,
          height: 50,
          prompt: "🐱 Elus Si Belang (Kucing Garong Bantar Gebang)",
          interacted: false,
          dialogueId: "kucing_garong_1",
        },
        {
          id: "key_encounter",
          type: "pier_edge",
          x: 1450,
          y: GROUND_Y - 80,
          width: 120,
          height: 140,
          prompt: keyRef.current.isFriend
            ? "Ngobrol dengan Key (Sahabat Bekasi)"
            : (battleKeyRef.current.isDefeated ? "Ajak Key Menjadi Sahabat Petualang" : "Tantang Key • Penguasa Sampah Bantar Gebang"),
          interacted: false,
          dialogueId: keyRef.current.isFriend
            ? "key_friend_chat"
            : (battleKeyRef.current.isDefeated ? "key_defeat" : "key_encounter_1"),
        },
        {
          id: "kawanan_burung",
          type: "bench",
          x: 1850,
          y: GROUND_Y - 70,
          width: 130,
          height: 90,
          prompt: "🦅 Amati Kawanan Burung Gagak & Bangau TPST",
          interacted: false,
          dialogueId: "burung_bantar_1",
        },
      ];
      return objs;
    }
  };

  // Preload Images
  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      });
    };

    const loadOptionalImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });
    };

    Promise.all([
      loadImage("/env_coastal_losari_golden_hour.png"),
      loadImage("/env_sulawesi_street_props_transparent.png"),
      loadImage("/env_micro_animations_cats_clouds_transparent.png"),
      loadImage("/jihan_spritesheet_10poses_transparent.png"),
      loadImage("/jihan_master_sheet_8frames.png"),
      loadImage("/jihan_combat_sheet.png"),
      loadImage("/gerobak_animated_24frames_transparent.png"),
      loadImage("/dani_spritesheet_10poses_transparent.png"),
      loadImage("/dani_master_sheet_8frames.png"),
      loadImage("/dani_combat_sheet.png"),
      loadImage("/panci_prop.png"),
      loadImage("/cauldron_emergence_sheet.png"),
      loadImage("/monster_master_sheet.png"),
      loadImage("/tower_listrik.png"),
      loadImage("/adif_master_sheet.png"),
      loadImage("/adif_combat_sheet.png"),
      loadImage("/hairi_master_sheet.png"),
      loadImage("/hairi_combat_sheet.png"),
      loadImage("/hairi_super_master_sheet.png"),
      loadImage("/hairi_super_combat_sheet.png"),
      loadImage("/hairi_v3_master_sheet.png"),
      loadImage("/hairi_v3_combat_sheet.png"),
      loadImage("/underground_station_pixelart.png"),
      loadImage("/krl_train_8frames_sheet.png"),
      loadImage("/stasiun_bekasi_pixelart.png"),
      loadImage("/env_bekasi_bantar_gebang.png"),
      loadImage("/key_master_sheet.png"),
      loadImage("/key_combat_sheet.png"),
      loadImage("/bekasi_scavenger_birds_sheet.png"),
      loadImage("/bekasi_truck_props_sheet.png"),
    ]).then(([bg, props, micro, jihanSheet, jihanMaster, jihanCombat, gerobak24, daniSheet, daniMaster, daniCombat, panciProp, cauldronEmergence, monsterMaster, towerListrik, adifMaster, adifCombat, hairiMaster, hairiCombat, hairiSuperMaster, hairiSuperCombat, hairiV3Master, hairiV3Combat, undergroundStation, krlTrain, stasiunBekasi, envBekasi, keyMaster, keyCombat, bekasiBirds, bekasiTruckProps]) => {
      imagesRef.current = { bg, props, micro, jihanSheet, jihanMaster, jihanCombat, gerobak24, daniSheet, daniMaster, daniCombat, panciProp, cauldronEmergence, monsterMaster, towerListrik, adifMaster, adifCombat, hairiMaster, hairiCombat, hairiSuperMaster, hairiSuperCombat, hairiV3Master, hairiV3Combat, undergroundStation, krlTrain, stasiunBekasi, envBekasi, keyMaster, keyCombat, bekasiBirds, bekasiTruckProps };
    });
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if (e.key === "Shift") {
        keysRef.current.run = true;
      }
      if (e.key === "e" || e.key === "E" || e.key === "Enter") {
        keysRef.current.interact = true;
      }
      if (e.key === " " || e.key === "j" || e.key === "J" || e.key === "f" || e.key === "F") {
        keysRef.current.attack = true;
      }
      if (e.key === "q" || e.key === "Q") {
        onSwitchCharacter();
        sound.playInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
      if (e.key === "Shift") {
        keysRef.current.run = false;
      }
      if (e.key === "e" || e.key === "E" || e.key === "Enter") {
        keysRef.current.interact = false;
      }
      if (e.key === " " || e.key === "j" || e.key === "J" || e.key === "f" || e.key === "F") {
        keysRef.current.attack = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onSwitchCharacter]);

  useEffect(() => {
    if (currentDialogueId === "adif_tower_2" && adifRef.current.onTower && !adifRef.current.isRappelling) {
      adifRef.current.isRappelling = true;
      adifRef.current.y = GROUND_Y - 225;
    }
    if (currentDialogueId === "adif_hairi_battle_start") {
      pendingBattleRef.current = true;
    }
    if (currentDialogueId === "hairi_evolution_1") {
      pendingEvolutionBattleRef.current = true;
      battleAdifHairiRef.current.inCombat = false;
    }
    if (currentDialogueId === "hairi_evolution_v3_1") {
      pendingEvolutionBattleRef.current = true;
      battleAdifHairiRef.current.inCombat = false;
      sound.startCyberBGM();
    }
    if (currentDialogueId === "adif_hairi_defeat" || currentDialogueId === "adif_hairi_defeat_2" || currentDialogueId === "adif_hairi_defeat_3") {
      sound.stopCyberBGM();
      adifRef.current.isFriend = true;
      adifRef.current.state = "idle";
      hairiRef.current.isFriend = true;
      hairiRef.current.phase = 1; // Kembali ke wujud manusia biasa saat menjadi teman
      hairiRef.current.y = GROUND_Y;
      hairiRef.current.state = "idle";
    }
    if (currentDialogueId === "portal_stasiun_menara_2") {
      pendingPortalToMenaraStationRef.current = true;
    }
    if (currentDialogueId === "krl_station_3") {
      // Start train doors closing animation and departure to Stasiun Bekasi
      krlStateRef.current.state = "doors_closing";
      krlStateRef.current.frame = 4;
      krlStateRef.current.animTimer = 0;
      sound.playTrainChime();
    }
    if (currentDialogueId === "krl_bekasi_to_menara_2") {
      // Start train doors closing animation and departure back to Stasiun Menara
      krlStateRef.current.state = "doors_closing";
      krlStateRef.current.frame = 4;
      krlStateRef.current.animTimer = 0;
      sound.playTrainChime();
    }
    if (currentDialogueId === "exit_stasiun_bekasi_2") {
      pendingExitBekasiStationRef.current = true;
    }
    if (currentDialogueId === "enter_stasiun_bekasi_1") {
      pendingEnterBekasiStationRef.current = true;
    }
    if (currentDialogueId === "key_encounter_3") {
      pendingKeyBattleRef.current = true;
    }
    if (currentDialogueId === "key_defeat" || currentDialogueId === "key_defeat_2" || currentDialogueId === "key_defeat_3" || currentDialogueId === "key_defeat_4") {
      battleKeyRef.current.inCombat = false;
      battleKeyRef.current.isDefeated = true;
      keyRef.current.state = "idle";
      keyRef.current.isFriend = true;
      sound.playWin();
    }
    if (!currentDialogueId && pendingPortalToMenaraStationRef.current) {
      pendingPortalToMenaraStationRef.current = false;
      sound.playPortal();
      screenShakeRef.current = 10;
      teleportFlashRef.current = 24;
      zoneRef.current = "stasiun_menara";
      setCurrentZone("stasiun_menara");
      daniPosRef.current.x = 220;
      daniPosRef.current.vx = 0;
      jihanPosRef.current.x = 180;
      jihanPosRef.current.vx = 0;
      hairiRef.current.x = 140;
      hairiRef.current.vx = 0;
      adifRef.current.x = 100;
      adifRef.current.vx = 0;
      cameraXRef.current = 0;
      krlStateRef.current.x = 2200;
      krlStateRef.current.targetX = 2200;
      krlStateRef.current.vx = 0;
      krlStateRef.current.state = "idle_open";
      krlStateRef.current.frame = 4;
      zoneBannerRef.current = {
        title: "STASIUN BAWAH TANAH KAMPUNG MENARA",
        subtitle: "PERON JALUR 1 • KRL COMMUTER LINE MENUJU BEKASI",
        timer: 180,
      };
      damageNumbersRef.current.push({
        x: 220,
        y: GROUND_Y - 100,
        text: "🌀 MASUK STASIUN KAMPUNG MENARA!",
        color: "#38bdf8",
        life: 50,
        maxLife: 50,
        vy: -1.2,
        isCrit: true,
      });
    }
    if (!currentDialogueId && pendingExitBekasiStationRef.current) {
      pendingExitBekasiStationRef.current = false;
      sound.playPortal();
      screenShakeRef.current = 8;
      teleportFlashRef.current = 20;
      zoneRef.current = "bekasi";
      setCurrentZone("bekasi");
      daniPosRef.current.x = 220;
      daniPosRef.current.vx = 0;
      jihanPosRef.current.x = 180;
      jihanPosRef.current.vx = 0;
      hairiRef.current.x = 140;
      hairiRef.current.vx = 0;
      adifRef.current.x = 100;
      adifRef.current.vx = 0;
      cameraXRef.current = 0;
      zoneBannerRef.current = {
        title: "KOTA BEKASI • TPST BANTAR GEBANG",
        subtitle: "PERMUKAAN KOTA PATRIOT & GUNUNG SAMPAH",
        timer: 180,
      };
      damageNumbersRef.current.push({
        x: 220,
        y: GROUND_Y - 100,
        text: "🚪 KELUAR KE PERMUKAAN BEKASI!",
        color: "#34d399",
        life: 50,
        maxLife: 50,
        vy: -1.2,
        isCrit: true,
      });
    }
    if (!currentDialogueId && pendingEnterBekasiStationRef.current) {
      pendingEnterBekasiStationRef.current = false;
      sound.playPortal();
      screenShakeRef.current = 8;
      teleportFlashRef.current = 20;
      zoneRef.current = "stasiun_bekasi";
      setCurrentZone("stasiun_bekasi");
      daniPosRef.current.x = 2420;
      daniPosRef.current.vx = 0;
      jihanPosRef.current.x = 2380;
      jihanPosRef.current.vx = 0;
      hairiRef.current.x = 2340;
      hairiRef.current.vx = 0;
      adifRef.current.x = 2300;
      adifRef.current.vx = 0;
      cameraXRef.current = Math.max(0, 2500 - CANVAS_W / 2);
      krlStateRef.current.x = 550;
      krlStateRef.current.targetX = 550;
      krlStateRef.current.vx = 0;
      krlStateRef.current.state = "idle_open";
      krlStateRef.current.frame = 4;
      zoneBannerRef.current = {
        title: "STASIUN BEKASI (BKS +19M)",
        subtitle: "JALUR 2 • KRL COMMUTER LINE",
        timer: 180,
      };
    }
    if (!currentDialogueId && pendingBattleRef.current) {
      pendingBattleRef.current = false;
      battleAdifHairiRef.current.inCombat = true;
      adifRef.current.state = "combat";
      hairiRef.current.state = "combat";
      sound.playHitImpact();
      screenShakeRef.current = 8;
    }
    if (!currentDialogueId && pendingKeyBattleRef.current) {
      pendingKeyBattleRef.current = false;
      battleKeyRef.current.inCombat = true;
      keyRef.current.state = "combat";
      keyRef.current.animFrame = 0;
      sound.playTrashThrow();
      sound.playHitImpact();
      screenShakeRef.current = 10;
    }
    if (!currentDialogueId && pendingEvolutionBattleRef.current) {
      pendingEvolutionBattleRef.current = false;
      battleAdifHairiRef.current.inCombat = true;
      hairiRef.current.state = "combat";
      hairiRef.current.animFrame = 0;
      sound.playHitImpact();
      sound.playWin();
      screenShakeRef.current = 12;
    }
  }, [currentDialogueId]);

  // Expose Dev Hub Actions to Parent Shell
  useEffect(() => {
    if (!onRegisterDevActions) return;

    const actions: DevActions = {
      warpZone: (zone, targetX) => {
        zoneRef.current = zone;
        setCurrentZone(zone);
        const posX = targetX ?? (zone === "stasiun_menara" ? 240 : zone === "stasiun_bekasi" ? 550 : zone === "bekasi" ? 250 : zone === "perkampungan" ? 280 : 300);
        const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
        const companion = activeCharacter === "jihan" ? daniPosRef.current : jihanPosRef.current;
        active.x = posX;
        active.vx = 0;
        companion.x = posX - 50;
        companion.vx = 0;
        if (hairiRef.current.isFriend) {
          hairiRef.current.x = posX - 100;
          hairiRef.current.y = GROUND_Y;
          hairiRef.current.vx = 0;
        }
        if (adifRef.current.isFriend) {
          adifRef.current.x = posX - 140;
          adifRef.current.y = GROUND_Y;
          adifRef.current.vx = 0;
        }
        if (keyRef.current.isFriend) {
          keyRef.current.x = posX - 180;
          keyRef.current.y = GROUND_Y;
          keyRef.current.vx = 0;
        }
        cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, posX - CANVAS_W / 2));
        teleportFlashRef.current = 24;
        sound.playPortal();
        if (zone === "stasiun_menara") {
          krlStateRef.current.x = 2200;
          krlStateRef.current.targetX = 2200;
          krlStateRef.current.vx = 0;
          krlStateRef.current.state = "idle_open";
          krlStateRef.current.frame = 4;
          zoneBannerRef.current = {
            title: "STASIUN BAWAH TANAH KAMPUNG MENARA",
            subtitle: "PERON JALUR 1 • KRL COMMUTER LINE MENUJU BEKASI",
            timer: 180,
          };
        } else if (zone === "stasiun_bekasi") {
          krlStateRef.current.x = 550;
          krlStateRef.current.targetX = 550;
          krlStateRef.current.vx = 0;
          krlStateRef.current.state = "idle_open";
          krlStateRef.current.frame = 4;
          zoneBannerRef.current = {
            title: "STASIUN BEKASI (BKS +19M)",
            subtitle: "JALUR 2 • KRL COMMUTER LINE JABODETABEK",
            timer: 180,
          };
        } else if (zone === "bekasi") {
          zoneBannerRef.current = {
            title: "KOTA BEKASI • TPST BANTAR GEBANG",
            subtitle: "HAWA PANAS MENYENGAT & GUNUNG SAMPAH BANTAR GEBANG",
            timer: 180,
          };
        } else if (zone === "perkampungan") {
          zoneBannerRef.current = {
            title: "PERKAMPUNGAN MENARA SINYAL",
            subtitle: "LEMBAH MENARA PEMANCAR & KABEL FIBER OPTIK",
            timer: 180,
          };
        } else if (zone === "losari") {
          zoneBannerRef.current = {
            title: "PANTAI LOSARI • MAKASSAR",
            subtitle: "ANJUNGAN PANTAI LOSARI & MASJID 99 KUBAH",
            timer: 180,
          };
        }
      },
      teleportPlayer: (x) => {
        const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
        const companion = activeCharacter === "jihan" ? daniPosRef.current : jihanPosRef.current;
        active.x = x;
        active.vx = 0;
        companion.x = x - 50;
        companion.vx = 0;
        cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, x - CANVAS_W / 2));
        teleportFlashRef.current = 15;
        sound.playWhoosh();
      },
      triggerBoss: (boss) => {
        if (boss === "monster") {
          zoneRef.current = "losari";
          setCurrentZone("losari");
          const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
          active.x = 1920;
          cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, 1920 - CANVAS_W / 2));
          monsterRef.current.isActive = true;
          monsterRef.current.isEmerging = false;
          monsterRef.current.isDefeated = false;
          monsterRef.current.hp = 500;
          monsterRef.current.state = "idle";
          teleportFlashRef.current = 20;
          sound.playMonsterGrowl();
        } else if (boss === "adif_hairi") {
          zoneRef.current = "perkampungan";
          setCurrentZone("perkampungan");
          const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
          active.x = 1500;
          cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, 1500 - CANVAS_W / 2));
          adifRef.current.onTower = false;
          adifRef.current.isRappelling = false;
          adifRef.current.y = GROUND_Y;
          adifRef.current.x = 1710;
          adifRef.current.hp = 300;
          adifRef.current.state = "combat";
          adifRef.current.isFriend = false;
          hairiRef.current.phase = 1;
          hairiRef.current.hp = 300;
          hairiRef.current.state = "combat";
          hairiRef.current.isFriend = false;
          hairiRef.current.x = 1620;
          hairiRef.current.y = GROUND_Y;
          battleAdifHairiRef.current.inCombat = true;
          battleAdifHairiRef.current.isDefeated = false;
          teleportFlashRef.current = 20;
          sound.playHitImpact();
        } else if (boss === "hairi_v2") {
          zoneRef.current = "perkampungan";
          setCurrentZone("perkampungan");
          const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
          active.x = 1500;
          cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, 1500 - CANVAS_W / 2));
          adifRef.current.hp = 0;
          adifRef.current.state = "defeated";
          hairiRef.current.phase = 2;
          hairiRef.current.hp = 600;
          hairiRef.current.maxHp = 600;
          hairiRef.current.state = "combat";
          hairiRef.current.isFriend = false;
          hairiRef.current.x = 1620;
          hairiRef.current.y = GROUND_Y;
          battleAdifHairiRef.current.inCombat = true;
          battleAdifHairiRef.current.isDefeated = false;
          teleportFlashRef.current = 20;
          sound.playWin();
        } else if (boss === "hairi_v3") {
          zoneRef.current = "perkampungan";
          setCurrentZone("perkampungan");
          const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
          active.x = 1500;
          cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, 1500 - CANVAS_W / 2));
          adifRef.current.hp = 0;
          adifRef.current.state = "defeated";
          hairiRef.current.phase = 3;
          hairiRef.current.hp = 900;
          hairiRef.current.maxHp = 900;
          hairiRef.current.state = "combat";
          hairiRef.current.isFriend = false;
          hairiRef.current.x = 1620;
          hairiRef.current.y = GROUND_Y - 45;
          battleAdifHairiRef.current.inCombat = true;
          battleAdifHairiRef.current.isDefeated = false;
          teleportFlashRef.current = 20;
          sound.startCyberBGM();
        } else if (boss === "key") {
          zoneRef.current = "bekasi";
          setCurrentZone("bekasi");
          const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
          active.x = 1350;
          cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, 1350 - CANVAS_W / 2));
          keyRef.current.x = 1550;
          keyRef.current.hp = 900;
          keyRef.current.maxHp = 900;
          keyRef.current.state = "combat";
          keyRef.current.isFriend = false;
          battleKeyRef.current.inCombat = true;
          battleKeyRef.current.isDefeated = false;
          teleportFlashRef.current = 20;
          sound.playTrashThrow();
        }
      },
      defeatBoss: (boss) => {
        if (boss === "monster") {
          monsterRef.current.hp = 0;
          monsterRef.current.isDefeated = true;
          monsterRef.current.state = "defeated";
          onTriggerDialogue("panci_defeat");
        } else if (boss === "adif_hairi") {
          adifRef.current.hp = 0;
          hairiRef.current.hp = 0;
          battleAdifHairiRef.current.inCombat = false;
          battleAdifHairiRef.current.isDefeated = true;
          adifRef.current.isFriend = true;
          hairiRef.current.isFriend = true;
          hairiRef.current.phase = 1;
          hairiRef.current.y = GROUND_Y;
          hairiRef.current.state = "idle";
          adifRef.current.state = "idle";
          sound.stopCyberBGM();
          sound.playWin();
          onTriggerDialogue("adif_hairi_defeat");
        } else if (boss === "key") {
          keyRef.current.hp = 0;
          battleKeyRef.current.inCombat = false;
          battleKeyRef.current.isDefeated = true;
          keyRef.current.isFriend = true;
          keyRef.current.state = "idle";
          sound.playWin();
          onTriggerDialogue("key_defeat_4");
        }
      },
      toggleFriend: (char, isFriend) => {
        const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
        if (char === "hairi") {
          const next = isFriend !== undefined ? isFriend : !hairiRef.current.isFriend;
          hairiRef.current.isFriend = next;
          if (next) {
            hairiRef.current.phase = 1;
            hairiRef.current.y = GROUND_Y;
            hairiRef.current.state = "idle";
            hairiRef.current.x = active.x - 100;
          }
        } else if (char === "adif") {
          const next = isFriend !== undefined ? isFriend : !adifRef.current.isFriend;
          adifRef.current.isFriend = next;
          if (next) {
            adifRef.current.onTower = false;
            adifRef.current.isRappelling = false;
            adifRef.current.y = GROUND_Y;
            adifRef.current.state = "idle";
            adifRef.current.x = active.x - 140;
          }
        } else if (char === "key") {
          const next = isFriend !== undefined ? isFriend : !keyRef.current.isFriend;
          keyRef.current.isFriend = next;
          if (next) {
            keyRef.current.state = "idle";
            keyRef.current.y = GROUND_Y;
            keyRef.current.x = active.x - 180;
          }
        }
      },
      unlockAllFriends: () => {
        const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
        hairiRef.current.isFriend = true;
        hairiRef.current.phase = 1;
        hairiRef.current.y = GROUND_Y;
        hairiRef.current.state = "idle";
        hairiRef.current.x = active.x - 100;

        adifRef.current.isFriend = true;
        adifRef.current.onTower = false;
        adifRef.current.isRappelling = false;
        adifRef.current.y = GROUND_Y;
        adifRef.current.state = "idle";
        adifRef.current.x = active.x - 140;

        keyRef.current.isFriend = true;
        keyRef.current.state = "idle";
        keyRef.current.y = GROUND_Y;
        keyRef.current.x = active.x - 180;
      },
      setGodMode: (enabled) => {
        godModeRef.current = enabled;
      },
      setOneHitKill: (enabled) => {
        oneHitKillRef.current = enabled;
      },
      setSpeedMult: (mult) => {
        speedMultRef.current = mult;
      },
      triggerDialogue: (dialogueId) => {
        onTriggerDialogue(dialogueId);
      },
      switchActiveChar: () => {
        onSwitchCharacter();
      },
      getDevState: () => {
        const active = activeCharacter === "jihan" ? jihanPosRef.current : daniPosRef.current;
        return {
          zone: zoneRef.current,
          playerX: Math.round(active.x),
          playerY: Math.round(active.y),
          activeChar: activeCharacter,
          isHairiFriend: hairiRef.current.isFriend,
          isAdifFriend: adifRef.current.isFriend,
          isKeyFriend: keyRef.current.isFriend,
          godMode: godModeRef.current,
          oneHitKill: oneHitKillRef.current,
          speedMult: speedMultRef.current,
          bossStatus: {
            monster: {
              active: monsterRef.current.isActive,
              hp: monsterRef.current.hp,
              maxHp: monsterRef.current.maxHp,
              defeated: monsterRef.current.isDefeated,
            },
            adif: {
              hp: adifRef.current.hp,
              maxHp: adifRef.current.maxHp,
              onTower: adifRef.current.onTower,
            },
            hairi: {
              hp: hairiRef.current.hp,
              maxHp: hairiRef.current.maxHp,
              phase: hairiRef.current.phase,
            },
            key: {
              inCombat: battleKeyRef.current.inCombat,
              hp: keyRef.current.hp,
              maxHp: keyRef.current.maxHp,
              defeated: battleKeyRef.current.isDefeated,
            },
          },
        };
      },
    };

    onRegisterDevActions(actions);
  }, [activeCharacter, onRegisterDevActions, onSwitchCharacter, onTriggerDialogue]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false;
      globalTimerRef.current++;
      const globalTimer = globalTimerRef.current;

      // 1. Combine inputs
      const isLeft = keysRef.current.left || virtualInput.left;
      const isRight = keysRef.current.right || virtualInput.right;
      const isRun = keysRef.current.run || virtualInput.run;
      const isInteract = keysRef.current.interact || virtualInput.interact;
      const isAttackInput = keysRef.current.attack || virtualInput.attack;
      const attack = attackStateRef.current;

      // 2. Active & Companion Reference
      const isJihanActive = activeCharacter === "jihan";
      const active = isJihanActive ? jihanPosRef.current : daniPosRef.current;
      const companion = isJihanActive ? daniPosRef.current : jihanPosRef.current;

      // 2.5 Combat State Machine
      if (isAttackInput && !attack.isAttacking && !isDialogueOpen) {
        attack.isAttacking = true;
        attack.frame = 0;
        attack.timer = 0;
        attack.hasHit = false;
        attack.slashPlayed = false;
      }

      if (attack.isAttacking) {
        attack.timer++;

        // Play sword slash whoosh sound at frame 2
        if (attack.frame === 2 && !attack.slashPlayed) {
          attack.slashPlayed = true;
          sound.playSwordSlash();
        }

        // Lunge forward slightly during crescent slash (frames 2 to 4)
        if (attack.frame >= 2 && attack.frame <= 4) {
          const lungeSpeed = isJihanActive ? 1.6 : 1.2;
          active.x += active.facingLeft ? -lungeSpeed : lungeSpeed;
          active.x = Math.max(100, Math.min(WORLD_W - 80, active.x));
        }

        // Hit detection on crescent slash (frames 3 & 4)
        if ((attack.frame === 3 || attack.frame === 4) && !attack.hasHit) {
          const monster = monsterRef.current;
          // 1. Check Monster hit if active, not emerging, and not defeated
          if (monster.isActive && !monster.isEmerging && !monster.isDefeated) {
            const facingMatches = active.facingLeft ? monster.x <= active.x : monster.x >= active.x;
            const dist = Math.abs(active.x - monster.x);
            if (dist < 105 && facingMatches) {
              attack.hasHit = true;
              sound.playHitImpact();
              screenShakeRef.current = 8;
              monster.hitFlash = 16;
              monster.shake = 14;
              monster.state = "hurt";
              monster.animTimer = 0;

              // Combo increment
              comboRef.current.count++;
              comboRef.current.timer = 120; // 2 seconds window

              // Damage calculation with critical strike chance
              const isCrit = Math.random() < 0.35;
              const baseDmg = oneHitKillRef.current
                ? 9999
                : isCrit
                ? Math.floor(85 + Math.random() * 45)
                : Math.floor(40 + Math.random() * 28);
              monster.hp = Math.max(0, monster.hp - baseDmg);

              const text = isCrit ? `CRIT! -${baseDmg}` : `-${baseDmg}`;
              const color = isCrit ? "#f59e0b" : "#c084fc";

              // Floating damage popup
              damageNumbersRef.current.push({
                x: monster.x + (Math.random() - 0.5) * 20,
                y: monster.y - 95,
                text,
                color,
                life: 35,
                maxLife: 35,
                vy: -1.8,
                isCrit,
              });

              // Hit spark burst particles (purple/gold/cyan)
              for (let p = 0; p < 16; p++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6;
                combatParticlesRef.current.push({
                  x: monster.x,
                  y: monster.y - 50 + (Math.random() - 0.5) * 30,
                  vx: Math.cos(angle) * speed + (active.facingLeft ? -2 : 2),
                  vy: Math.sin(angle) * speed - 1.5,
                  color: p % 3 === 0 ? "#a855f7" : p % 3 === 1 ? "#fbbf24" : "#ffffff",
                  size: 2.5 + Math.random() * 3,
                  life: 20 + Math.floor(Math.random() * 10),
                  maxLife: 30,
                });
              }

              // Check if monster defeated
              if (monster.hp <= 0) {
                monster.isDefeated = true;
                monster.dissolveTimer = 80;
                sound.playCoin();
                damageNumbersRef.current.push({
                  x: monster.x,
                  y: monster.y - 120,
                  text: "✨ SILUMAN DIKALAHKAN! ✨",
                  color: "#fbbf24",
                  life: 70,
                  maxLife: 70,
                  vy: -1.2,
                  isCrit: true,
                });
                onTriggerDialogue("panci_defeat");
              }
            }
          }

          // 1.5. Check Adif & Hairi if duel battle is active
          const duel = battleAdifHairiRef.current;
          const adifBoss = adifRef.current;
          const hairiBoss = hairiRef.current;
          if (duel.inCombat && !duel.isDefeated && !attack.hasHit) {
            // Check Adif hit
            if (adifBoss.hp > 0 && !adifBoss.onTower) {
              const facingMatches = active.facingLeft ? adifBoss.x <= active.x : adifBoss.x >= active.x;
              const dist = Math.abs(active.x - adifBoss.x);
              if (dist < 95 && facingMatches) {
                attack.hasHit = true;
                sound.playHitImpact();
                screenShakeRef.current = 6;
                adifBoss.hitFlash = 16;
                adifBoss.shake = 12;
                comboRef.current.count++;
                comboRef.current.timer = 120;
                const isCrit = Math.random() < 0.35;
                const baseDmg = oneHitKillRef.current
                  ? 9999
                  : isCrit
                  ? Math.floor(75 + Math.random() * 35)
                  : Math.floor(35 + Math.random() * 25);
                adifBoss.hp = Math.max(0, adifBoss.hp - baseDmg);

                // Adif nimble backstep evasion upon receiving hit
                adifBoss.vx = adifBoss.facingLeft ? 4.2 : -4.2;
                adifBoss.evasionTimer = 12;

                damageNumbersRef.current.push({
                  x: adifBoss.x,
                  y: adifBoss.y - 85,
                  text: isCrit ? `CRIT! ⭐ -${baseDmg}` : `-${baseDmg}`,
                  color: isCrit ? "#f59e0b" : "#fbbf24",
                  life: 35,
                  maxLife: 35,
                  vy: -1.8,
                  isCrit,
                });
                for (let p = 0; p < 14; p++) {
                  combatParticlesRef.current.push({
                    x: adifBoss.x + (Math.random() - 0.5) * 16,
                    y: adifBoss.y - 50 + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -1.5 - Math.random() * 3.5,
                    color: p % 2 === 0 ? "#f59e0b" : "#fef08a",
                    size: 3.5,
                    life: 22,
                    maxLife: 22,
                  });
                }
              }
            }

            // Check Hairi hit
            if (!attack.hasHit && hairiBoss.hp > 0) {
              const facingMatches = active.facingLeft ? hairiBoss.x <= active.x : hairiBoss.x >= active.x;
              const dist = Math.abs(active.x - hairiBoss.x);
              if (dist < 95 && facingMatches) {
                attack.hasHit = true;
                const isCrit = Math.random() < 0.35;
                const baseDmg = oneHitKillRef.current
                  ? 9999
                  : isCrit
                  ? Math.floor(80 + Math.random() * 40)
                  : Math.floor(40 + Math.random() * 25);
                comboRef.current.count++;
                comboRef.current.timer = 120;

                // XL Shield Block Stance Check
                const isHairiFacingPlayer = hairiBoss.facingLeft ? active.x <= hairiBoss.x : active.x >= hairiBoss.x;
                const isShieldStance = hairiBoss.state === "combat" && (hairiBoss.animFrame <= 2 || hairiBoss.animFrame === 7);

                if (isHairiFacingPlayer && isShieldStance && !oneHitKillRef.current) {
                  // SHIELD DEFLECTION & ABSORPTION!
                  sound.playStomp();
                  screenShakeRef.current = 4;
                  hairiBoss.shieldBlockFlash = 22;
                  hairiBoss.shake = 8;
                  const blockedDmg = Math.max(6, Math.floor(baseDmg * 0.25));
                  hairiBoss.hp = Math.max(0, hairiBoss.hp - blockedDmg);

                  // Recoil push back on active player
                  active.vx = active.facingLeft ? 4.2 : -4.2;

                  damageNumbersRef.current.push({
                    x: hairiBoss.x,
                    y: hairiBoss.y - 85,
                    text: `🛡️ BLOCKED! -${blockedDmg}`,
                    color: "#38bdf8",
                    life: 38,
                    maxLife: 38,
                    vy: -1.6,
                    isCrit: false,
                  });

                  // Electric Cyan / Blue Shield Barrier sparks
                  for (let p = 0; p < 16; p++) {
                    combatParticlesRef.current.push({
                      x: hairiBoss.x + (hairiBoss.facingLeft ? -15 : 15),
                      y: hairiBoss.y - 50 + (Math.random() - 0.5) * 28,
                      vx: (hairiBoss.facingLeft ? -1 : 1) * (1.5 + Math.random() * 4),
                      vy: (Math.random() - 0.5) * 5,
                      color: p % 2 === 0 ? "#38bdf8" : "#ffffff",
                      size: 3.5,
                      life: 20,
                      maxLife: 20,
                    });
                  }
                } else {
                  // DIRECT FULL DAMAGE HIT!
                  sound.playHitImpact();
                  screenShakeRef.current = 8;
                  hairiBoss.hitFlash = 16;
                  hairiBoss.shake = 14;
                  hairiBoss.state = "hurt";
                  hairiBoss.hp = Math.max(0, hairiBoss.hp - baseDmg);

                  damageNumbersRef.current.push({
                    x: hairiBoss.x,
                    y: hairiBoss.y - 85,
                    text: isCrit ? `CRIT! 💥 -${baseDmg}` : `-${baseDmg}`,
                    color: isCrit ? "#f59e0b" : "#ef4444",
                    life: 35,
                    maxLife: 35,
                    vy: -1.8,
                    isCrit,
                  });
                  for (let p = 0; p < 14; p++) {
                    combatParticlesRef.current.push({
                      x: hairiBoss.x,
                      y: hairiBoss.y - 50 + (Math.random() - 0.5) * 20,
                      vx: (Math.random() - 0.5) * 6,
                      vy: -1.5 - Math.random() * 3,
                      color: p % 2 === 0 ? "#ef4444" : "#f97316",
                      size: 3.5,
                      life: 22,
                      maxLife: 22,
                    });
                  }
                }
                // Check if Hairi HP depleted
                if (hairiBoss.hp <= 0) {
                  if (hairiBoss.phase === 1) {
                    // EVOLUTION 1: Transform to Level 2 Super Hairi!
                    hairiBoss.phase = 2;
                    hairiBoss.maxHp = 500; // Thicker & more HP
                    hairiBoss.hp = 500;
                    hairiBoss.state = "combat";
                    hairiBoss.animFrame = 0;
                    hairiBoss.hitFlash = 35;
                    hairiBoss.shake = 22;
                    screenShakeRef.current = 16;
                    sound.playHitImpact();
                    sound.playWin();

                    // Cyber Cyan Lightning Burst Particles
                    for (let p = 0; p < 36; p++) {
                      combatParticlesRef.current.push({
                        x: hairiBoss.x + (Math.random() - 0.5) * 35,
                        y: hairiBoss.y - 50 + (Math.random() - 0.5) * 45,
                        vx: (Math.random() - 0.5) * 8,
                        vy: -2 - Math.random() * 5,
                        color: p % 3 === 0 ? "#38bdf8" : p % 3 === 1 ? "#06b6d4" : "#ffffff",
                        size: 4 + Math.random() * 3,
                        life: 30,
                        maxLife: 30,
                      });
                    }

                    damageNumbersRef.current.push({
                      x: hairiBoss.x,
                      y: hairiBoss.y - 105,
                      text: "⚡ SYSTEM OVERCLOCK: LEVEL 2 EVOLUTION! ⚡",
                      color: "#38bdf8",
                      life: 65,
                      maxLife: 65,
                      vy: -1.2,
                      isCrit: true,
                    });

                    pendingEvolutionBattleRef.current = true;
                    duel.inCombat = false;
                    onTriggerDialogue("hairi_evolution_1");
                  } else if (hairiBoss.phase === 2) {
                    // EVOLUTION 2: Transform to Level 3 CYBER MAGE HAIRI! (Floating IT Wizard)
                    hairiBoss.phase = 3;
                    hairiBoss.maxHp = 750; // Final thickest HP pool
                    hairiBoss.hp = 750;
                    hairiBoss.y = GROUND_Y - 35; // Ascends and floats in mid-air
                    hairiBoss.state = "combat";
                    hairiBoss.animFrame = 0;
                    hairiBoss.hitFlash = 45;
                    hairiBoss.shake = 26;
                    screenShakeRef.current = 20;
                    sound.playCyberAscend();
                    sound.startCyberBGM();

                    // Massive Matrix Code & Cyber Starburst Particles
                    for (let p = 0; p < 48; p++) {
                      combatParticlesRef.current.push({
                        x: hairiBoss.x + (Math.random() - 0.5) * 45,
                        y: hairiBoss.y - 40 + (Math.random() - 0.5) * 55,
                        vx: (Math.random() - 0.5) * 10,
                        vy: -2.5 - Math.random() * 6,
                        color: p % 4 === 0 ? "#06b6d4" : p % 4 === 1 ? "#a855f7" : p % 4 === 2 ? "#38bdf8" : "#ffffff",
                        size: 4.5 + Math.random() * 3.5,
                        life: 38,
                        maxLife: 38,
                      });
                    }

                    damageNumbersRef.current.push({
                      x: hairiBoss.x,
                      y: hairiBoss.y - 115,
                      text: "🔮 ASCENDING TO LAYER 7: CYBER MAGE LV.3! 🔮",
                      color: "#c084fc",
                      life: 75,
                      maxLife: 75,
                      vy: -1.2,
                      isCrit: true,
                    });

                    pendingEvolutionBattleRef.current = true;
                    duel.inCombat = false;
                    onTriggerDialogue("hairi_evolution_v3_1");
                  } else {
                    hairiBoss.state = "defeated";
                  }
                }
              }
            }

            // Check if both Adif and Hairi defeated (Hairi must be in phase 3 and hp <= 0)
            if (adifBoss.hp <= 0 && hairiBoss.hp <= 0 && hairiBoss.phase === 3 && !duel.isDefeated) {
              duel.isDefeated = true;
              duel.inCombat = false;
              sound.stopCyberBGM();
              adifBoss.state = "defeated";
              adifBoss.isFriend = true;
              hairiBoss.state = "defeated";
              hairiBoss.phase = 1; // Revert to Human Form upon defeat as friend companion
              hairiBoss.y = GROUND_Y;
              hairiBoss.isFriend = true;
              sound.playWin();
              sound.playCoin();
              screenShakeRef.current = 10;
              damageNumbersRef.current.push({
                x: (adifBoss.x + hairiBoss.x) / 2,
                y: GROUND_Y - 110,
                text: "✨ DUEL SELESAI • PERSAHABATAN TERJALIN! ✨",
                color: "#fbbf24",
                life: 75,
                maxLife: 75,
                vy: -1.0,
                isCrit: true,
              });
              onTriggerDialogue("adif_hairi_defeat");
            }
          }

          // 1.8. Check Key Boss hit if in Bekasi battle
          const keyDuel = battleKeyRef.current;
          const keyBoss = keyRef.current;
          if (keyDuel.inCombat && !keyDuel.isDefeated && !attack.hasHit && keyBoss.hp > 0) {
            const facingMatches = active.facingLeft ? keyBoss.x <= active.x : keyBoss.x >= active.x;
            const dist = Math.abs(active.x - keyBoss.x);
            if (dist < 105 && facingMatches) {
              attack.hasHit = true;
              const isCrit = Math.random() < 0.35;
              const baseDmg = oneHitKillRef.current
                ? 9999
                : isCrit
                ? Math.floor(75 + Math.random() * 35)
                : Math.floor(40 + Math.random() * 25);
              comboRef.current.count++;
              comboRef.current.timer = 120;
              sound.playHitImpact();
              screenShakeRef.current = 7;
              keyBoss.hitFlash = 16;
              keyBoss.shake = 12;
              keyBoss.hp = Math.max(0, keyBoss.hp - baseDmg);

              // OP Teleport Evasion upon taking hit!
              if (Math.random() < 0.65 && keyBoss.hp > 0) {
                sound.playTeleportWhoosh();
                const teleportDir = active.facingLeft ? 1 : -1;
                keyBoss.x = Math.max(250, Math.min(2700, active.x + teleportDir * 240));
                keyBoss.facingLeft = active.x < keyBoss.x;
                keyBoss.teleportTimer = 18;
                for (let p = 0; p < 20; p++) {
                  combatParticlesRef.current.push({
                    x: keyBoss.x + (Math.random() - 0.5) * 24,
                    y: GROUND_Y - 45 + (Math.random() - 0.5) * 35,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: p % 3 === 0 ? "#9333ea" : p % 3 === 1 ? "#c084fc" : "#22c55e",
                    size: 4,
                    life: 20,
                    maxLife: 20,
                  });
                }
              }

              damageNumbersRef.current.push({
                x: keyBoss.x,
                y: keyBoss.y - 85,
                text: isCrit ? `CRIT! 💥 -${baseDmg}` : `-${baseDmg}`,
                color: isCrit ? "#f59e0b" : "#c084fc",
                life: 35,
                maxLife: 35,
                vy: -1.8,
                isCrit,
              });
              for (let p = 0; p < 16; p++) {
                combatParticlesRef.current.push({
                  x: keyBoss.x + (Math.random() - 0.5) * 20,
                  y: keyBoss.y - 50 + (Math.random() - 0.5) * 20,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -1.5 - Math.random() * 3.5,
                  color: p % 3 === 0 ? "#c084fc" : p % 3 === 1 ? "#9333ea" : "#fef08a",
                  size: 3.5,
                  life: 22,
                  maxLife: 22,
                });
              }

              if (keyBoss.hp <= 0) {
                keyDuel.isDefeated = true;
                keyDuel.inCombat = false;
                keyBoss.state = "defeated";
                keyBoss.isFriend = true;
                sound.playWin();
                sound.playCoin();
                screenShakeRef.current = 12;
                damageNumbersRef.current.push({
                  x: keyBoss.x,
                  y: GROUND_Y - 105,
                  text: "✨ KEY DIKALAHKAN • PERSAHABATAN TERBENTUK! ✨",
                  color: "#fbbf24",
                  life: 75,
                  maxLife: 75,
                  vy: -1.0,
                  isCrit: true,
                });
                onTriggerDialogue("key_defeat");
              }
            }
          }

          // 2. Check training dummies if monster and duel enemies not hit
          if (!attack.hasHit) {
            for (const dummy of trainingDummiesRef.current) {
              const facingMatches = active.facingLeft ? dummy.x <= active.x : dummy.x >= active.x;
              const dist = Math.abs(active.x - dummy.x);
              if (dist < 95 && facingMatches) {
                attack.hasHit = true;
                sound.playHitImpact();
                screenShakeRef.current = 6;
                dummy.shake = 16;
                dummy.hitTimer = 22;

                // Combo increment
                comboRef.current.count++;
                comboRef.current.timer = 120; // 2 seconds window

                // Damage calculation with critical strike chance
                const isCrit = Math.random() < 0.35;
                const baseDmg = isCrit ? Math.floor(85 + Math.random() * 45) : Math.floor(40 + Math.random() * 25);
                const text = isCrit ? `CRIT! -${baseDmg}` : `-${baseDmg}`;
                const color = isCrit ? "#f59e0b" : "#38bdf8";

                // Floating damage popup
                damageNumbersRef.current.push({
                  x: dummy.x + (Math.random() - 0.5) * 20,
                  y: dummy.y - 85,
                  text,
                  color,
                  life: 35,
                  maxLife: 35,
                  vy: -1.8,
                  isCrit,
                });

                // Hit spark burst particles
                for (let p = 0; p < 14; p++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = 2 + Math.random() * 5;
                  combatParticlesRef.current.push({
                    x: dummy.x,
                    y: dummy.y - 50 + (Math.random() - 0.5) * 20,
                    vx: Math.cos(angle) * speed + (active.facingLeft ? -2 : 2),
                    vy: Math.sin(angle) * speed - 1.5,
                    color: p % 3 === 0 ? "#38bdf8" : p % 3 === 1 ? "#fbbf24" : "#ffffff",
                    size: 2 + Math.random() * 3,
                    life: 18 + Math.floor(Math.random() * 10),
                    maxLife: 28,
                  });
                }
                break;
              }
            }
          }
        }

        // Advance frames every 3 ticks
        if (attack.timer % 3 === 0) {
          attack.frame++;
          if (attack.frame >= 8) {
            attack.isAttacking = false;
            attack.frame = 0;
            attack.timer = 0;
            attack.hasHit = false;
            attack.slashPlayed = false;
          }
        }
      }

      // Combo cooldown decay
      if (comboRef.current.timer > 0) {
        comboRef.current.timer--;
        if (comboRef.current.timer <= 0) {
          comboRef.current.count = 0;
        }
      }

      // 2.7 Monster AI & State Update
      const monster = monsterRef.current;
      if (monster.isActive) {
        if (monster.isEmerging) {
          monster.emergeTimer++;
          // 6 frames in cauldron_emergence_sheet.png, advance every 7 ticks (~42 ticks total = ~700ms)
          if (monster.emergeTimer % 7 === 0) {
            monster.emergeFrame++;
            if (monster.emergeFrame >= 6) {
              monster.isEmerging = false;
              monster.state = "idle";
              monster.x = 2050;
              screenShakeRef.current = 8;
              sound.playHitImpact();
            }
          }
          // Purple smoke particles during emergence
          if (Math.random() < 0.45) {
            combatParticlesRef.current.push({
              x: 2150 + (Math.random() - 0.5) * 35,
              y: GROUND_Y - 30 - Math.random() * 45,
              vx: (Math.random() - 0.5) * 2,
              vy: -1.6 - Math.random() * 2,
              color: Math.random() < 0.5 ? "#a855f7" : "#7c3aed",
              size: 3 + Math.random() * 4,
              life: 25,
              maxLife: 25,
            });
          }
        } else if (!monster.isDefeated) {
          monster.animTimer++;
          const distToPlayer = Math.abs(active.x - monster.x);
          monster.facingLeft = active.x < monster.x;

          if (monster.hitFlash > 0) monster.hitFlash--;
          if (monster.shake > 0) monster.shake *= 0.85;
          if (monster.attackCooldown > 0) monster.attackCooldown--;

          if (monster.state === "hurt") {
            if (monster.animTimer > 15) {
              monster.state = "idle";
              monster.animTimer = 0;
            }
          } else if (monster.isAttacking) {
            // Attack animation (Row 2 of monster_master_sheet)
            if (monster.animTimer % 4 === 0) {
              monster.animFrame++;
              if (monster.animFrame === 4 && distToPlayer < 85) {
                screenShakeRef.current = 5;
                sound.playStomp();
                active.vx = monster.facingLeft ? -4.5 : 4.5;
                active.x += active.vx;
                for (let k = 0; k < 8; k++) {
                  combatParticlesRef.current.push({
                    x: active.x,
                    y: GROUND_Y - 50,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: "#9333ea",
                    size: 3,
                    life: 15,
                    maxLife: 15,
                  });
                }
              }
              if (monster.animFrame >= 8) {
                monster.isAttacking = false;
                monster.state = "idle";
                monster.animFrame = 0;
                monster.animTimer = 0;
                monster.attackCooldown = 80;
              }
            }
          } else {
            // Move toward player if in range (dist between 80 and 800)
            if (distToPlayer > 80 && distToPlayer < 800) {
              monster.state = "move";
              const mSpeed = 1.3;
              monster.vx = monster.facingLeft ? -mSpeed : mSpeed;
              monster.x += monster.vx;
              if (monster.animTimer % 4 === 0) {
                monster.animFrame = (monster.animFrame + 1) % 8;
              }
            } else if (distToPlayer <= 80 && monster.attackCooldown <= 0) {
              monster.state = "attack";
              monster.isAttacking = true;
              monster.animFrame = 0;
              monster.animTimer = 0;
            } else {
              monster.state = "idle";
              monster.vx = 0;
              if (monster.animTimer % 5 === 0) {
                monster.animFrame = (monster.animFrame + 1) % 8;
              }
            }
          }
        } else {
          // Defeated dissolution
          if (monster.dissolveTimer > 0) {
            monster.dissolveTimer--;
            if (Math.random() < 0.6) {
              combatParticlesRef.current.push({
                x: monster.x + (Math.random() - 0.5) * 60,
                y: GROUND_Y - 40 - Math.random() * 50,
                vx: (Math.random() - 0.5) * 3,
                vy: -1.5 - Math.random() * 2,
                color: Math.random() < 0.5 ? "#fbbf24" : "#c084fc",
                size: 3 + Math.random() * 4,
                life: 30,
                maxLife: 30,
              });
            }
          }
        }
      }

      // 2.8 Adif & Hairi AI & State Updates
      const adifState = adifRef.current;
      const hairiState = hairiRef.current;
      const duelState = battleAdifHairiRef.current;

      // Adif Rappel & State logic
      if (adifState.isRappelling) {
        adifState.y += 3.2;
        adifState.animTimer++;
        if (adifState.animTimer % 4 === 0) {
          adifState.animFrame = Math.min(7, adifState.animFrame + 1);
        }
        if (adifState.y >= GROUND_Y) {
          adifState.y = GROUND_Y;
          adifState.onTower = false;
          adifState.isRappelling = false;
          adifState.state = "idle";
          adifState.animFrame = 0;
          sound.playStomp();
          screenShakeRef.current = 6;
          onTriggerDialogue("adif_tower_2");
        }
      } else if (!adifState.onTower) {
        adifState.animTimer++;
        if (adifState.hitFlash > 0) adifState.hitFlash--;
        if (adifState.shake > 0) adifState.shake *= 0.85;
        if (adifState.attackCooldown > 0) adifState.attackCooldown--;
        if (adifState.lassoTimer > 0) adifState.lassoTimer--;
        if (adifState.lassoTimer <= 0) adifState.lassoActive = false;

        // Evasion backward slide physics
        if (adifState.evasionTimer > 0) {
          adifState.evasionTimer--;
          adifState.x += adifState.vx;
          adifState.vx *= 0.88;
          if (adifState.animTimer % 2 === 0) {
            combatParticlesRef.current.push({
              x: adifState.x + (Math.random() - 0.5) * 10,
              y: GROUND_Y + 12,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -0.6,
              color: "#d97706",
              size: 2.5,
              life: 14,
              maxLife: 14,
            });
          }
        }

        if (duelState.inCombat && !duelState.isDefeated) {
          adifState.facingLeft = active.x < adifState.x;
          const dist = Math.abs(active.x - adifState.x);

          if (dist >= 75 && dist <= 180 && adifState.attackCooldown <= 0) {
            // Mid-Range Cowboy Lasso Whip Attack
            adifState.state = "combat";
            adifState.combatType = "whip";
            if (adifState.animTimer % 4 === 0) {
              adifState.animFrame++;
              if (adifState.animFrame === 4) {
                // Whip crack forward!
                adifState.lassoActive = true;
                adifState.lassoTargetX = active.x;
                adifState.lassoTargetY = active.y - 35;
                adifState.lassoTimer = 18;
                sound.playWhip();
                screenShakeRef.current = 5;

                // Pull player inward towards Adif
                active.x += (adifState.x - active.x) * 0.22;
                active.vx = (adifState.x - active.x) * 0.05;

                damageNumbersRef.current.push({
                  x: active.x,
                  y: active.y - 75,
                  text: "💥 LASSO HOOK!",
                  color: "#f59e0b",
                  life: 32,
                  maxLife: 32,
                  vy: -1.5,
                  isCrit: true,
                });

                for (let p = 0; p < 10; p++) {
                  combatParticlesRef.current.push({
                    x: active.x + (Math.random() - 0.5) * 16,
                    y: active.y - 40 + (Math.random() - 0.5) * 16,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: p % 2 === 0 ? "#fbbf24" : "#ffffff",
                    size: 3,
                    life: 18,
                    maxLife: 18,
                  });
                }
              }
              if (adifState.animFrame >= 8) {
                adifState.animFrame = 0;
                adifState.combatType = "stance";
                adifState.attackCooldown = 75;
              }
            }
          } else if (dist < 75 && adifState.attackCooldown <= 0) {
            // Close-Range Knuckle Rush Combo
            adifState.state = "combat";
            adifState.combatType = "punch";
            if (adifState.animTimer % 4 === 0) {
              adifState.animFrame++;
              if (adifState.animFrame === 5) {
                sound.playStomp();
                screenShakeRef.current = 6;
                active.vx = adifState.facingLeft ? -4.5 : 4.5;
                active.x += active.vx;

                damageNumbersRef.current.push({
                  x: active.x,
                  y: active.y - 75,
                  text: "⭐ KNUCKLE RUSH!",
                  color: "#fbbf24",
                  life: 30,
                  maxLife: 30,
                  vy: -1.4,
                  isCrit: true,
                });

                for (let p = 0; p < 12; p++) {
                  combatParticlesRef.current.push({
                    x: active.x + (Math.random() - 0.5) * 16,
                    y: active.y - 45 + (Math.random() - 0.5) * 16,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -1.2 - Math.random() * 3,
                    color: p % 2 === 0 ? "#f59e0b" : "#fde68a",
                    size: 3.5,
                    life: 20,
                    maxLife: 20,
                  });
                }
              }
              if (adifState.animFrame >= 8) {
                // Nimble back-flip / back-step leap
                adifState.vx = adifState.facingLeft ? 4.2 : -4.2;
                adifState.evasionTimer = 10;
                adifState.animFrame = 0;
                adifState.combatType = "stance";
                adifState.attackCooldown = 65;
              }
            }
          } else if (dist > 180 && dist <= 330) {
            adifState.state = "walk";
            adifState.combatType = "stance";
            adifState.vx = adifState.facingLeft ? -1.3 : 1.3;
            adifState.x += adifState.vx;
            if (adifState.animTimer % 5 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
          } else if (dist > 330 && dist < 650) {
            adifState.state = "run";
            adifState.combatType = "stance";
            adifState.vx = adifState.facingLeft ? -2.2 : 2.2;
            adifState.x += adifState.vx;
            if (adifState.animTimer % 4 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
          } else {
            adifState.state = "idle";
            adifState.combatType = "stance";
            if (adifState.animTimer % 6 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
          }

          adifState.x = Math.max(300, Math.min(2700, adifState.x));
        } else if (adifState.isFriend) {
          // COMPANION / BEFRIENDED MODE: Adif joins squad, fights alongside Dani, Jihan & Hairi!
          const monster = monsterRef.current;
          const keyBoss = keyRef.current;
          const keyDuel = battleKeyRef.current;

          if (keyDuel.inCombat && !keyDuel.isDefeated && keyBoss.hp > 0) {
            // Priority 1: Charge and attack Key (Mage Bantar Gebang)
            const kDist = Math.abs(keyBoss.x - adifState.x);
            adifState.facingLeft = keyBoss.x < adifState.x;

            if (kDist >= 75 && kDist <= 190 && adifState.attackCooldown <= 0) {
              // Mid-Range Cowboy Lasso Whip Attack on Key
              adifState.state = "combat";
              adifState.combatType = "whip";
              if (adifState.animTimer % 4 === 0) {
                adifState.animFrame++;
                if (adifState.animFrame === 4) {
                  adifState.lassoActive = true;
                  adifState.lassoTargetX = keyBoss.x;
                  adifState.lassoTargetY = keyBoss.y - 35;
                  adifState.lassoTimer = 18;
                  sound.playWhip();
                  screenShakeRef.current = 5;

                  keyBoss.hp = Math.max(0, keyBoss.hp - 35);
                  keyBoss.hitFlash = 16;
                  keyBoss.shake = 12;

                  damageNumbersRef.current.push({
                    x: keyBoss.x,
                    y: keyBoss.y - 80,
                    text: "💥 ADIF LASSO STRIKE! -35",
                    color: "#f59e0b",
                    life: 36,
                    maxLife: 36,
                    vy: -1.6,
                    isCrit: true,
                  });

                  for (let p = 0; p < 12; p++) {
                    combatParticlesRef.current.push({
                      x: keyBoss.x + (Math.random() - 0.5) * 16,
                      y: keyBoss.y - 45 + (Math.random() - 0.5) * 16,
                      vx: (Math.random() - 0.5) * 5,
                      vy: (Math.random() - 0.5) * 5,
                      color: p % 2 === 0 ? "#fbbf24" : "#ffffff",
                      size: 3,
                      life: 18,
                      maxLife: 18,
                    });
                  }
                  adifState.attackCooldown = 70;
                }
                if (adifState.animFrame >= 8) {
                  adifState.animFrame = 0;
                  adifState.combatType = "stance";
                }
              }
            } else if (kDist < 75 && adifState.attackCooldown <= 0) {
              // Close-Range Knuckle Rush Combo on Key
              adifState.state = "combat";
              adifState.combatType = "punch";
              if (adifState.animTimer % 4 === 0) {
                adifState.animFrame++;
                if (adifState.animFrame === 5) {
                  sound.playStomp();
                  screenShakeRef.current = 6;
                  keyBoss.hp = Math.max(0, keyBoss.hp - 40);
                  keyBoss.hitFlash = 16;
                  keyBoss.shake = 12;

                  damageNumbersRef.current.push({
                    x: keyBoss.x,
                    y: keyBoss.y - 85,
                    text: "⭐ ADIF KNUCKLE RUSH! -40",
                    color: "#fbbf24",
                    life: 34,
                    maxLife: 34,
                    vy: -1.5,
                    isCrit: true,
                  });

                  for (let p = 0; p < 14; p++) {
                    combatParticlesRef.current.push({
                      x: keyBoss.x + (Math.random() - 0.5) * 16,
                      y: keyBoss.y - 45 + (Math.random() - 0.5) * 16,
                      vx: (Math.random() - 0.5) * 6,
                      vy: -1.2 - Math.random() * 3,
                      color: p % 2 === 0 ? "#f59e0b" : "#fde68a",
                      size: 3.5,
                      life: 20,
                      maxLife: 20,
                    });
                  }
                  adifState.attackCooldown = 65;
                }
                if (adifState.animFrame >= 8) {
                  adifState.animFrame = 0;
                  adifState.combatType = "stance";
                }
              }
            } else if (kDist > 190) {
              adifState.state = "run";
              adifState.combatType = "stance";
              adifState.vx = adifState.facingLeft ? -3.2 : 3.2;
              adifState.x += adifState.vx;
              if (adifState.animTimer % 4 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            } else {
              adifState.state = "walk";
              adifState.combatType = "stance";
              adifState.vx = adifState.facingLeft ? -1.6 : 1.6;
              adifState.x += adifState.vx;
              if (adifState.animTimer % 5 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            }
          } else if (monster.isActive && !monster.isDefeated && monster.hp > 0) {
            // Priority 2: Charge and attack Batara Panci Siluman
            const mDist = Math.abs(monster.x - adifState.x);
            adifState.facingLeft = monster.x < adifState.x;

            if (mDist > 75) {
              adifState.state = "run";
              adifState.vx = monster.x < adifState.x ? -3.2 : 3.2;
              adifState.x += adifState.vx;
              if (adifState.animTimer % 4 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            } else {
              adifState.state = "combat";
              adifState.vx = 0;
              if (adifState.animTimer % 4 === 0) {
                adifState.animFrame++;
                if (adifState.animFrame === 4 && adifState.attackCooldown <= 0) {
                  monster.hp = Math.max(0, monster.hp - 35);
                  monster.hitFlash = 16;
                  monster.shake = 12;
                  sound.playHitImpact();
                  screenShakeRef.current = 6;
                  damageNumbersRef.current.push({
                    x: monster.x,
                    y: monster.y - 110,
                    text: "💥 ADIF ALLY STRIKE! -35",
                    color: "#f59e0b",
                    life: 38,
                    maxLife: 38,
                    vy: -1.6,
                    isCrit: true,
                  });
                  adifState.attackCooldown = 50;
                }
                if (adifState.animFrame >= 8) adifState.animFrame = 0;
              }
            }
          } else {
            // Priority 3: Peacefully follow Dani & Jihan squad (Comfortable distance ~125px)
            const targetDist = active.facingLeft ? 125 : -125;
            const targetX = active.x + targetDist;
            const compDiff = targetX - adifState.x;
            adifState.facingLeft = compDiff < 0;

            if (Math.abs(compDiff) > 190) {
              adifState.state = "run";
              adifState.vx = Math.sign(compDiff) * 3.3;
              adifState.x += adifState.vx;
              if (adifState.animTimer % 4 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            } else if (Math.abs(compDiff) > 35) {
              adifState.state = "walk";
              adifState.vx = Math.sign(compDiff) * 1.8;
              adifState.x += adifState.vx;
              if (adifState.animTimer % 5 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            } else {
              adifState.state = "idle";
              adifState.vx = 0;
              adifState.facingLeft = active.facingLeft;
              if (adifState.animTimer % 7 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
            }
          }
          adifState.x = Math.max(100, Math.min(2900, adifState.x));
        } else {
          // Calm idle
          adifState.state = "idle";
          adifState.vx = 0;
          if (adifState.animTimer % 7 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
        }
      }

      // Hairi AI, Revamped Animations & Companion Logic
      hairiState.animTimer++;
      if (hairiState.hitFlash > 0) hairiState.hitFlash--;
      if (hairiState.shake > 0) hairiState.shake *= 0.85;
      if (hairiState.attackCooldown > 0) hairiState.attackCooldown--;
      if (hairiState.shieldBlockFlash > 0) hairiState.shieldBlockFlash--;

      // Rage Mode Activation at HP <= 150 (Visual combat state without artificial particles)
      if (duelState.inCombat && hairiState.hp <= 150 && !hairiState.enragedTriggered) {
        hairiState.isEnraged = true;
        hairiState.enragedTriggered = true;
        screenShakeRef.current = 10;
        sound.playHitImpact();
        damageNumbersRef.current.push({
          x: hairiState.x,
          y: hairiState.y - 95,
          text: "🔥 HAIRI ENRAGED! 🔥",
          color: "#ef4444",
          life: 55,
          maxLife: 55,
          vy: -1.2,
          isCrit: true,
        });
      }

      const hairiSpeedMult = hairiState.isEnraged ? 1.35 : 1.0;
      const hairiCdMult = hairiState.isEnraged ? 0.65 : 1.0;

      // COMPANION / BEFRIENDED MODE: Hairi follows player and attacks any active monster or boss!
      if (hairiState.isFriend) {
        const monster = monsterRef.current;
        const keyBoss = keyRef.current;
        const keyDuel = battleKeyRef.current;

        if (keyDuel.inCombat && !keyDuel.isDefeated && keyBoss.hp > 0) {
          // Priority 1: Charge and attack Key (Mage Bantar Gebang)
          const kDist = Math.abs(keyBoss.x - hairiState.x);
          hairiState.facingLeft = keyBoss.x < hairiState.x;

          if (kDist > 75) {
            hairiState.state = "run";
            hairiState.vx = keyBoss.x < hairiState.x ? -3.4 : 3.4;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else {
            hairiState.state = "combat";
            hairiState.vx = 0;
            if (hairiState.animTimer % 4 === 0) {
              hairiState.animFrame++;
              if (hairiState.animFrame === 4 && hairiState.attackCooldown <= 0) {
                // Hairi strikes Key!
                keyBoss.hp = Math.max(0, keyBoss.hp - 35);
                keyBoss.hitFlash = 16;
                keyBoss.shake = 12;
                sound.playHitImpact();
                screenShakeRef.current = 6;
                damageNumbersRef.current.push({
                  x: keyBoss.x,
                  y: keyBoss.y - 110,
                  text: "💥 HAIRI ALLY STRIKE! -35",
                  color: "#38bdf8",
                  life: 38,
                  maxLife: 38,
                  vy: -1.6,
                  isCrit: true,
                });
                for (let p = 0; p < 12; p++) {
                  combatParticlesRef.current.push({
                    x: keyBoss.x + (Math.random() - 0.5) * 20,
                    y: keyBoss.y - 45 + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: p % 2 === 0 ? "#38bdf8" : "#fbbf24",
                    size: 3.5,
                    life: 20,
                    maxLife: 20,
                  });
                }
                hairiState.attackCooldown = 50;
              }
              if (hairiState.animFrame >= 8) hairiState.animFrame = 0;
            }
          }
        } else if (monster.isActive && !monster.isDefeated && monster.hp > 0) {
          // Priority 2: Charge and attack monster!
          const mDist = Math.abs(monster.x - hairiState.x);
          hairiState.facingLeft = monster.x < hairiState.x;

          if (mDist > 75) {
            hairiState.state = "run";
            hairiState.vx = (monster.x < hairiState.x ? -3.4 : 3.4);
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else {
            hairiState.state = "combat";
            hairiState.vx = 0;
            if (hairiState.animTimer % 4 === 0) {
              hairiState.animFrame++;
              if (hairiState.animFrame === 4 && hairiState.attackCooldown <= 0) {
                // Hairi strikes the monster!
                monster.hp = Math.max(0, monster.hp - 35);
                monster.hitFlash = 16;
                monster.shake = 12;
                sound.playHitImpact();
                screenShakeRef.current = 6;
                damageNumbersRef.current.push({
                  x: monster.x,
                  y: monster.y - 120,
                  text: "💥 HAIRI ALLY STRIKE! -35",
                  color: "#38bdf8",
                  life: 38,
                  maxLife: 38,
                  vy: -1.6,
                  isCrit: true,
                });
                for (let p = 0; p < 12; p++) {
                  combatParticlesRef.current.push({
                    x: monster.x + (Math.random() - 0.5) * 20,
                    y: monster.y - 80 + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: p % 2 === 0 ? "#38bdf8" : "#fbbf24",
                    size: 3.5,
                    life: 20,
                    maxLife: 20,
                  });
                }
                hairiState.attackCooldown = 50;
              }
              if (hairiState.animFrame >= 8) hairiState.animFrame = 0;
            }
          }
        } else {
          // Priority 3: Follow Dani & Jihan peacefully (Comfortable distance ~65px)
          const targetDist = active.facingLeft ? 65 : -65;
          const targetX = active.x + targetDist;
          const compDiff = targetX - hairiState.x;
          hairiState.facingLeft = compDiff < 0;

          if (Math.abs(compDiff) > 180) {
            hairiState.state = "run";
            hairiState.vx = Math.sign(compDiff) * 3.2;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else if (Math.abs(compDiff) > 30) {
            hairiState.state = "walk";
            hairiState.vx = Math.sign(compDiff) * 1.6;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 5 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else {
            hairiState.state = "idle";
            hairiState.vx = 0;
            hairiState.facingLeft = active.facingLeft;
            if (hairiState.animTimer % 7 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          }
        }
      } else if (duelState.inCombat && !duelState.isDefeated) {
        // COMBAT DUEL MODE: Pursues, attacks, flinches on hit
        hairiState.facingLeft = active.x < hairiState.x;
        const dist = Math.abs(active.x - hairiState.x);

        if (hairiState.phase === 3) {
          // LEVEL 3: CYBER MAGE HAIRI (Floating IT Wizard & Long-Range Spellcaster)
          hairiState.y = GROUND_Y - 35 + Math.sin(hairiState.animTimer * 0.08) * 8;
          const cyberSpeedMult = 1.45;

          if (hairiState.state === "hurt") {
            if (hairiState.animTimer % 3 === 0) {
              hairiState.animFrame = Math.min(7, hairiState.animFrame + 1);
            }
            if (hairiState.animTimer > 15) {
              hairiState.state = "combat";
              hairiState.animFrame = 0;
              hairiState.animTimer = 0;
            }
          } else if (dist > 280) {
            // Super Flying Sprint - Horizontal Dash in Sky
            hairiState.state = "run";
            hairiState.vx = (hairiState.facingLeft ? -5.2 : 5.2) * cyberSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 3 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
            // High-speed cyber thruster wake
            if (hairiState.animTimer % 2 === 0) {
              combatParticlesRef.current.push({
                x: hairiState.x + (Math.random() - 0.5) * 16,
                y: hairiState.y - 10 + (Math.random() - 0.5) * 12,
                vx: (hairiState.facingLeft ? 1 : -1) * (2 + Math.random() * 4),
                vy: (Math.random() - 0.5) * 1.5,
                color: Math.random() < 0.5 ? "#06b6d4" : "#c084fc",
                size: 3.5,
                life: 14,
                maxLife: 14,
              });
            }
          } else if (dist > 150) {
            // Cyber Platform Walk atop glowing holographic blue platform tiles
            hairiState.state = "walk";
            hairiState.vx = (hairiState.facingLeft ? -2.5 : 2.5) * cyberSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
            // Platform digital cube sparkles
            if (hairiState.animTimer % 3 === 0) {
              combatParticlesRef.current.push({
                x: hairiState.x + (hairiState.facingLeft ? -8 : 8),
                y: hairiState.y + 18,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -0.6,
                color: "#38bdf8",
                size: 3,
                life: 12,
                maxLife: 12,
              });
            }
          } else {
            // Semi-Mage Long-Range Combat: Cyber Rune Summon & Laser Beam Projectile
            hairiState.state = "combat";
            hairiState.vx = 0;
            if (hairiState.animTimer % 4 === 0) {
              hairiState.animFrame++;

              // Frame 0-2: Orbiting digital rune cube particles
              if (hairiState.animFrame <= 2) {
                for (let i = 0; i < 3; i++) {
                  combatParticlesRef.current.push({
                    x: hairiState.x + (hairiState.facingLeft ? -22 : 22) + (Math.random() - 0.5) * 20,
                    y: hairiState.y - 25 + (Math.random() - 0.5) * 25,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    color: i === 0 ? "#06b6d4" : i === 1 ? "#a855f7" : "#ffffff",
                    size: 3.5,
                    life: 16,
                    maxLife: 16,
                  });
                }
              }

              // Frame 3: FIRE CYBER MAGIC BEAM PROJECTILE!
              if (hairiState.animFrame === 3 && hairiState.attackCooldown <= 0) {
                sound.playCyberSpellCast();
                screenShakeRef.current = 10;
                const projDir = hairiState.facingLeft ? -1 : 1;
                cyberProjectilesRef.current.push({
                  x: hairiState.x + projDir * 28,
                  y: hairiState.y - 25,
                  vx: projDir * 10.5,
                  life: 65,
                  maxLife: 65,
                  damage: 55,
                  facingLeft: hairiState.facingLeft,
                });

                // Laser burst muzzle particles
                for (let p = 0; p < 22; p++) {
                  combatParticlesRef.current.push({
                    x: hairiState.x + projDir * 28,
                    y: hairiState.y - 25 + (Math.random() - 0.5) * 20,
                    vx: projDir * (3 + Math.random() * 7),
                    vy: (Math.random() - 0.5) * 5,
                    color: p % 3 === 0 ? "#38bdf8" : p % 3 === 1 ? "#c084fc" : "#ffffff",
                    size: 4,
                    life: 20,
                    maxLife: 20,
                  });
                }
                hairiState.attackCooldown = 48;
              }

              if (hairiState.animFrame >= 8) {
                hairiState.animFrame = 0;
              }
            }
          }
        } else if (hairiState.phase === 2) {
          // LEVEL 2: SUPER HAIRI OVERCLOCK COMBAT
          const superSpeedMult = 1.4;
          if (hairiState.state === "hurt") {
            if (hairiState.animTimer % 3 === 0) {
              hairiState.animFrame = Math.min(7, hairiState.animFrame + 1);
            }
            if (hairiState.animTimer > 15) {
              hairiState.state = "combat";
              hairiState.animFrame = 0;
              hairiState.animTimer = 0;
            }
          } else if (dist > 220) {
            // Super Sprint Dash with cyan blur
            hairiState.state = "run";
            hairiState.vx = (hairiState.facingLeft ? -4.5 : 4.5) * superSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 3 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
            if (hairiState.animTimer % 2 === 0) {
              combatParticlesRef.current.push({
                x: hairiState.x + (Math.random() - 0.5) * 14,
                y: hairiState.y + 14,
                vx: (hairiState.facingLeft ? 1 : -1) * (1.5 + Math.random() * 3),
                vy: -0.5,
                color: "#38bdf8",
                size: 2.8,
                life: 12,
                maxLife: 12,
              });
            }
          } else if (dist > 85) {
            // Super Walk with foot sparks
            hairiState.state = "walk";
            hairiState.vx = (hairiState.facingLeft ? -2.2 : 2.2) * superSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
            if (hairiState.animTimer % 3 === 0) {
              combatParticlesRef.current.push({
                x: hairiState.x + (Math.random() - 0.5) * 10,
                y: hairiState.y + 16,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -0.4,
                color: "#67e8f9",
                size: 2.2,
                life: 10,
                maxLife: 10,
              });
            }
          } else {
            // Close Combat Range: Overpowered Tech Blast & Quantum Kick combo
            hairiState.state = "combat";
            hairiState.vx = 0;
            if (hairiState.animTimer % 4 === 0) {
              hairiState.animFrame++;
              if (hairiState.animFrame === 3 && hairiState.attackCooldown <= 0) {
                // OVERPOWERED TECH BLAST IMPACT!
                sound.playWhip();
                screenShakeRef.current = 10;
                active.vx = (hairiState.facingLeft ? -6.5 : 6.5);
                active.x += active.vx;

                damageNumbersRef.current.push({
                  x: active.x,
                  y: active.y - 85,
                  text: "⚡ OVERPOWERED TECH BLAST! 💥",
                  color: "#38bdf8",
                  life: 38,
                  maxLife: 38,
                  vy: -1.8,
                  isCrit: true,
                });

                for (let p = 0; p < 20; p++) {
                  combatParticlesRef.current.push({
                    x: active.x + (Math.random() - 0.5) * 24,
                    y: active.y - 45 + (Math.random() - 0.5) * 24,
                    vx: (hairiState.facingLeft ? -1 : 1) * (2 + Math.random() * 6),
                    vy: (Math.random() - 0.5) * 6,
                    color: p % 2 === 0 ? "#38bdf8" : "#ffffff",
                    size: 4,
                    life: 24,
                    maxLife: 24,
                  });
                }
                hairiState.attackCooldown = 38;
              } else if (hairiState.animFrame === 5 && hairiState.attackCooldown <= 0) {
                // QUANTUM TECH KICK!
                sound.playHitImpact();
                screenShakeRef.current = 8;
                active.vx = (hairiState.facingLeft ? -4.5 : 4.5);
                active.x += active.vx;

                damageNumbersRef.current.push({
                  x: active.x,
                  y: active.y - 75,
                  text: "⭐ QUANTUM TECH KICK!",
                  color: "#67e8f9",
                  life: 30,
                  maxLife: 30,
                  vy: -1.5,
                  isCrit: true,
                });
              }
              if (hairiState.animFrame >= 8) {
                hairiState.animFrame = 0;
              }
            }
          }
        } else {
          // LEVEL 1: NORMAL HAIRI COMBAT
          if (hairiState.state === "hurt") {
            // Di Serang / Damage Recoil animation
            if (hairiState.animTimer % 3 === 0) {
              hairiState.animFrame = Math.min(7, hairiState.animFrame + 1);
            }
            if (hairiState.animTimer > 18) {
              hairiState.state = "combat";
              hairiState.animFrame = 0;
              hairiState.animTimer = 0;
            }
          } else if (dist > 200) {
            // Dani & Jihan are running away / fleeing: HAIRI RUNS CHASING THEM!
            hairiState.state = "run";
            hairiState.vx = (hairiState.facingLeft ? -3.4 : 3.4) * hairiSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else if (dist > 70) {
            // Mid-range approach: Stomping Walk cycle
            hairiState.state = "walk";
            hairiState.vx = (hairiState.facingLeft ? -1.8 : 1.8) * hairiSpeedMult;
            hairiState.x += hairiState.vx;
            if (hairiState.animTimer % 5 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
          } else {
            // Close Combat Attack range: Unleash Combat Strike!
            hairiState.state = "combat";
            hairiState.vx = 0;
            if (hairiState.animTimer % 4 === 0) {
              hairiState.animFrame++;
              if (hairiState.animFrame === 4 && hairiState.attackCooldown <= 0) {
                sound.playHitImpact();
                screenShakeRef.current = 7;
                active.vx = (hairiState.facingLeft ? -4.5 : 4.5) * hairiSpeedMult;
                active.x += active.vx;

                damageNumbersRef.current.push({
                  x: active.x,
                  y: active.y - 75,
                  text: "⚔️ HAIRI FURY STRIKE!",
                  color: "#dc2626",
                  life: 32,
                  maxLife: 32,
                  vy: -1.6,
                  isCrit: true,
                });

                for (let p = 0; p < 12; p++) {
                  combatParticlesRef.current.push({
                    x: active.x + (Math.random() - 0.5) * 16,
                    y: active.y - 45 + (Math.random() - 0.5) * 18,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -1.5 - Math.random() * 3,
                    color: p % 2 === 0 ? "#dc2626" : "#f97316",
                    size: 3.5,
                    life: 22,
                    maxLife: 22,
                  });
                }
                hairiState.attackCooldown = Math.floor(55 * hairiCdMult);
              }
              if (hairiState.animFrame >= 8) {
                hairiState.animFrame = 0;
              }
            }
          }
        }

        hairiState.x = Math.max(300, Math.min(2700, hairiState.x));
      } else if (!duelState.isDefeated) {
        // Pre-combat pacing between Tower 2 (1080) and Tower 3 (1710)
        hairiState.state = "walk_angry";
        hairiState.x += hairiState.vx;
        if (hairiState.x > 1850) {
          hairiState.vx = -1.1;
          hairiState.facingLeft = true;
        } else if (hairiState.x < 1450) {
          hairiState.vx = 1.1;
          hairiState.facingLeft = false;
        }
        if (hairiState.animTimer % 4 === 0) {
          hairiState.animFrame = (hairiState.animFrame + 1) % 8;
        }
      } else {
        // Defeated: Collapse & Lie down on the ground
        hairiState.state = "defeated";
        hairiState.vx = 0;
        if (hairiState.animTimer % 5 === 0 && hairiState.animFrame < 7) {
          hairiState.animFrame++;
        }
      }

      // 2.9 Update Cyber Magic Projectiles (Hairi Level 3 Mage Projectiles)
      cyberProjectilesRef.current.forEach((proj) => {
        proj.x += proj.vx;
        proj.life--;

        // Trailing square pixel particles (binary data trail)
        if (proj.life % 2 === 0) {
          combatParticlesRef.current.push({
            x: proj.x + (Math.random() - 0.5) * 8,
            y: proj.y + (Math.random() - 0.5) * 8,
            vx: -proj.vx * 0.15,
            vy: (Math.random() - 0.5) * 1.5,
            color: Math.random() < 0.5 ? "#06b6d4" : "#c084fc",
            size: 3.5,
            life: 14,
            maxLife: 14,
          });
        }

        // Collision with Active Player
        if (Math.abs(proj.x - active.x) < 38 && Math.abs(proj.y - (active.y - 40)) < 48 && proj.life > 0) {
          proj.life = 0;
          if (godModeRef.current) {
            sound.playWhoosh();
            damageNumbersRef.current.push({
              x: active.x,
              y: active.y - 85,
              text: "🛡️ GOD MODE IMMUNE!",
              color: "#38bdf8",
              life: 30,
              maxLife: 30,
              vy: -1.8,
              isCrit: true,
            });
          } else {
            sound.playCyberBeamImpact();
            screenShakeRef.current = 10;
            active.vx = proj.vx > 0 ? 5.5 : -5.5;
            active.x += active.vx;

            damageNumbersRef.current.push({
              x: active.x,
              y: active.y - 85,
              text: `🔮 CYBER BEAM! -${proj.damage}`,
              color: "#c084fc",
              life: 38,
              maxLife: 38,
              vy: -1.8,
              isCrit: true,
            });

            for (let p = 0; p < 26; p++) {
              combatParticlesRef.current.push({
                x: active.x + (Math.random() - 0.5) * 20,
                y: active.y - 45 + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: p % 4 === 0 ? "#06b6d4" : p % 4 === 1 ? "#c084fc" : p % 4 === 2 ? "#38bdf8" : "#ffffff",
                size: 4 + Math.random() * 2.5,
                life: 24,
                maxLife: 24,
              });
            }
          }
        }
      });
      cyberProjectilesRef.current = cyberProjectilesRef.current.filter((p) => p.life > 0 && p.x > 0 && p.x < 3000);

      // 2.95 Key AI & Flying Trash Projectiles (Bekasi Bantar Gebang Boss)
      const keyState = keyRef.current;
      const keyCombatState = battleKeyRef.current;

      keyState.animTimer++;
      if (keyState.hitFlash > 0) keyState.hitFlash--;
      if (keyState.shake > 0) keyState.shake *= 0.85;
      if (keyState.teleportTimer > 0) keyState.teleportTimer--;
      if (keyState.teleportCooldown > 0) keyState.teleportCooldown--;
      if (keyState.attackCooldown > 0) keyState.attackCooldown--;

      if (keyCombatState.inCombat && !keyCombatState.isDefeated && keyState.hp > 0) {
        keyState.facingLeft = active.x < keyState.x;
        const dist = Math.abs(active.x - keyState.x);

        // OP Teleport Mechanic: If player or companion gets too close (< 120px) and teleport is ready
        if (dist < 120 && keyState.teleportCooldown <= 0) {
          keyState.teleportCooldown = 90;
          keyState.teleportTimer = 16;
          sound.playTeleportWhoosh();
          screenShakeRef.current = 6;

          // Vanish particles at old spot
          for (let p = 0; p < 16; p++) {
            combatParticlesRef.current.push({
              x: keyState.x + (Math.random() - 0.5) * 20,
              y: GROUND_Y - 40 + (Math.random() - 0.5) * 35,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              color: p % 2 === 0 ? "#a855f7" : "#10b981",
              size: 3.5,
              life: 18,
              maxLife: 18,
            });
          }

          // Teleport to opposite side or far distance
          const teleportSide = active.facingLeft ? -1 : 1;
          const jumpDist = 260 + Math.random() * 100;
          keyState.x = Math.max(250, Math.min(2750, active.x + teleportSide * jumpDist));
          keyState.facingLeft = active.x < keyState.x;

          // Arrival particles
          for (let p = 0; p < 16; p++) {
            combatParticlesRef.current.push({
              x: keyState.x + (Math.random() - 0.5) * 20,
              y: GROUND_Y - 40 + (Math.random() - 0.5) * 35,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              color: p % 2 === 0 ? "#c084fc" : "#34d399",
              size: 4,
              life: 18,
              maxLife: 18,
            });
          }

          damageNumbersRef.current.push({
            x: keyState.x,
            y: keyState.y - 85,
            text: "🌀 TELEPORT EVASION!",
            color: "#c084fc",
            life: 35,
            maxLife: 35,
            vy: -1.4,
            isCrit: true,
          });
        }

        // Long-Range Trash Magic Barrage
        if (keyState.attackCooldown <= 0) {
          keyState.state = "combat";
          if (keyState.animTimer % 4 === 0) {
            keyState.animFrame++;
            if (keyState.animFrame === 4) {
              // FIRE TRASH BARRAGE!
              sound.playTrashThrow();
              screenShakeRef.current = 5;

              // Fire 3 flying trash items: plastic bag, bottle, cardboard box
              const trashTypes: Array<"bag" | "bottle" | "box"> = ["bag", "bottle", "box"];
              trashTypes.forEach((type, idx) => {
                const speed = (keyState.facingLeft ? -5.5 : 5.5) * (0.85 + idx * 0.18);
                trashProjectilesRef.current.push({
                  x: keyState.x + (keyState.facingLeft ? -25 : 25),
                  y: GROUND_Y - 45 - idx * 8,
                  vx: speed,
                  vy: -1.8 + idx * 1.0,
                  type,
                  rot: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.35,
                  life: 75,
                  maxLife: 75,
                  damage: 30 + idx * 8,
                });
              });

              for (let p = 0; p < 12; p++) {
                combatParticlesRef.current.push({
                  x: keyState.x + (keyState.facingLeft ? -20 : 20),
                  y: GROUND_Y - 45,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -Math.random() * 3,
                  color: p % 2 === 0 ? "#10b981" : "#a855f7",
                  size: 3,
                  life: 16,
                  maxLife: 16,
                });
              }
            }
            if (keyState.animFrame >= 8) {
              keyState.animFrame = 0;
              keyState.attackCooldown = 75;
              keyState.state = "idle";
            }
          }
        } else {
          // Tactical Pacing & Spacing (stays at 200..350px distance)
          if (dist < 180) {
            // Back away / evade
            keyState.state = "run";
            keyState.vx = keyState.facingLeft ? 2.5 : -2.5;
            keyState.x += keyState.vx;
            if (keyState.animTimer % 4 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          } else if (dist > 450) {
            // Approach to attack range
            keyState.state = "walk";
            keyState.vx = keyState.facingLeft ? -1.8 : 1.8;
            keyState.x += keyState.vx;
            if (keyState.animTimer % 5 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          } else {
            keyState.state = "idle";
            keyState.vx = 0;
            if (keyState.animTimer % 6 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          }
        }
        keyState.x = Math.max(200, Math.min(2800, keyState.x));
      } else if (keyState.isFriend) {
        // Friendly companion state in Bekasi or wherever squad travels
        const monster = monsterRef.current;
        if (monster.isActive && !monster.isDefeated && monster.hp > 0) {
          // Key attacks monster from long-range with magic!
          const mDist = Math.abs(monster.x - keyState.x);
          keyState.facingLeft = monster.x < keyState.x;

          if (mDist > 240) {
            keyState.state = "run";
            keyState.vx = (monster.x < keyState.x ? -3.4 : 3.4);
            keyState.x += keyState.vx;
            if (keyState.animTimer % 4 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          } else {
            keyState.state = "combat";
            keyState.vx = 0;
            if (keyState.animTimer % 4 === 0) {
              keyState.animFrame++;
              if (keyState.animFrame === 4 && keyState.attackCooldown <= 0) {
                sound.playTrashThrow();
                screenShakeRef.current = 5;
                monster.hp = Math.max(0, monster.hp - 45);
                monster.hitFlash = 16;
                monster.shake = 12;

                damageNumbersRef.current.push({
                  x: monster.x,
                  y: monster.y - 120,
                  text: "🔮 KEY MAGE BLAST! -45",
                  color: "#c084fc",
                  life: 38,
                  maxLife: 38,
                  vy: -1.6,
                  isCrit: true,
                });

                for (let p = 0; p < 16; p++) {
                  combatParticlesRef.current.push({
                    x: monster.x + (Math.random() - 0.5) * 20,
                    y: monster.y - 80 + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: p % 2 === 0 ? "#c084fc" : "#10b981",
                    size: 3.5,
                    life: 20,
                    maxLife: 20,
                  });
                }
                keyState.attackCooldown = 55;
              }
              if (keyState.animFrame >= 8) keyState.animFrame = 0;
            }
          }
        } else {
          // Peacefully follow the party at offset ~220px (Dani, Jihan, Hairi, Adif, Key)
          const targetDist = active.facingLeft ? 220 : -220;
          const targetX = active.x + targetDist;
          const compDiff = targetX - keyState.x;
          keyState.facingLeft = compDiff < 0;

          if (Math.abs(compDiff) > 260) {
            keyState.state = "run";
            keyState.vx = Math.sign(compDiff) * 3.4;
            keyState.x += keyState.vx;
            if (keyState.animTimer % 4 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          } else if (Math.abs(compDiff) > 40) {
            keyState.state = "walk";
            keyState.vx = Math.sign(compDiff) * 1.8;
            keyState.x += keyState.vx;
            if (keyState.animTimer % 5 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          } else {
            keyState.state = "idle";
            keyState.vx = 0;
            keyState.facingLeft = active.facingLeft;
            if (keyState.animTimer % 7 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
          }

          // Purple staff sparkle trail while traveling
          if (keyState.animTimer % 4 === 0) {
            combatParticlesRef.current.push({
              x: keyState.x + (keyState.facingLeft ? -15 : 15),
              y: keyState.y - 45 + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -0.8 - Math.random() * 1.2,
              color: Math.random() < 0.5 ? "#c084fc" : "#a855f7",
              size: 3,
              life: 16,
              maxLife: 16,
            });
          }
        }
        keyState.x = Math.max(100, Math.min(2900, keyState.x));
      } else {
        // Idle waiting for challenge
        keyState.state = "idle";
        keyState.vx = 0;
        if (keyState.animTimer % 7 === 0) keyState.animFrame = (keyState.animFrame + 1) % 8;
      }

      // Update Flying Trash Projectiles
      trashProjectilesRef.current.forEach((proj) => {
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.vy += 0.06; // slight gravity arc
        proj.rot += proj.rotSpeed;
        proj.life--;

        // Toxic smelly debris trail
        if (proj.life % 2 === 0) {
          combatParticlesRef.current.push({
            x: proj.x,
            y: proj.y,
            vx: -proj.vx * 0.1,
            vy: (Math.random() - 0.5) * 1.2,
            color: Math.random() < 0.5 ? "#10b981" : "#a855f7",
            size: 2.8,
            life: 14,
            maxLife: 14,
          });
        }

        // Collision with Active Player
        if (Math.abs(proj.x - active.x) < 32 && Math.abs(proj.y - (active.y - 35)) < 42 && proj.life > 0) {
          proj.life = 0;
          if (godModeRef.current) {
            sound.playWhoosh();
            damageNumbersRef.current.push({
              x: active.x,
              y: active.y - 80,
              text: "🛡️ GOD MODE IMMUNE!",
              color: "#38bdf8",
              life: 30,
              maxLife: 30,
              vy: -1.6,
              isCrit: true,
            });
          } else {
            sound.playHitImpact();
            screenShakeRef.current = 7;
            active.vx = proj.vx > 0 ? 4.5 : -4.5;
            active.x += active.vx;

            damageNumbersRef.current.push({
              x: active.x,
              y: active.y - 80,
              text: `🗑️ SAMPAH BANTAR GEBANG! -${proj.damage}`,
              color: "#10b981",
              life: 36,
              maxLife: 36,
              vy: -1.6,
              isCrit: true,
            });

            for (let p = 0; p < 18; p++) {
              combatParticlesRef.current.push({
                x: active.x + (Math.random() - 0.5) * 20,
                y: active.y - 40 + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: p % 3 === 0 ? "#10b981" : p % 3 === 1 ? "#a855f7" : "#78716c",
                size: 3.5,
                life: 20,
                maxLife: 20,
              });
            }
          }
        }
      });
      trashProjectilesRef.current = trashProjectilesRef.current.filter((p) => p.life > 0 && p.y < GROUND_Y + 20 && p.x > 0 && p.x < 3000);

      // 3. Update Active Character Physics
      if (!isDialogueOpen && !attack.isAttacking) {
        const speed = (isRun ? 4.8 : 2.6) * speedMultRef.current;
        if (isLeft && !isRight) {
          active.vx = -speed;
          active.facingLeft = true;
        } else if (isRight && !isLeft) {
          active.vx = speed;
          active.facingLeft = false;
        } else {
          active.vx = 0;
        }

        active.x += active.vx;
        active.x = Math.max(100, Math.min(WORLD_W - 80, active.x));

        // Companion follow logic (gently follows active player)
        const targetDist = active.facingLeft ? 70 : -70;
        const targetX = active.x + targetDist;
        const compDiff = targetX - companion.x;

        if (Math.abs(compDiff) > 15) {
          const compSpeed = Math.min(Math.abs(compDiff) * 0.08, (isRun ? 4.6 : 2.5) * speedMultRef.current);
          companion.vx = Math.sign(compDiff) * compSpeed;
          companion.x += companion.vx;
          companion.facingLeft = companion.vx < 0;
        } else {
          companion.vx = 0;
          companion.facingLeft = active.facingLeft;
        }
      } else {
        active.vx = 0;
        companion.vx = 0;
      }

      // 4. Update Animations (24-Frame Walk Cycles with Strict Integer Pacing)
      // Active anim
      active.animTimer++;
      const isActiveMoving = Math.abs(active.vx) > 0.1;
      if (isActiveMoving) {
        // Integer-locked cadence: walk advances every 2 ticks (30fps), run advances every 1 tick (60fps)
        const walkStep = isRun ? 1 : 2;
        if (active.animTimer % walkStep === 0) {
          active.walk24Frame = (active.walk24Frame + 1) % 24;
        }
        active.walkTimer++;
        active.pose = isRun ? (Math.floor(active.walkTimer / 6) % 2 === 0 ? "run_1" : "run_2") : "walk_1";
      } else {
        active.walkTimer = 0;
        if (isDialogueOpen) {
          active.pose = "talk";
        } else {
          active.pose = Math.sin(active.animTimer * 0.03) > 0.6 ? "idle_look" : "idle_stand";
        }
      }

      // Companion anim
      companion.animTimer++;
      const isCompanionMoving = Math.abs(companion.vx) > 0.1;
      if (isCompanionMoving) {
        const compStep = isRun ? 1 : 2;
        if (companion.animTimer % compStep === 0) {
          companion.walk24Frame = (companion.walk24Frame + 1) % 24;
        }
        companion.walkTimer++;
        companion.pose = isRun ? (Math.floor(companion.walkTimer / 6) % 2 === 0 ? "run_1" : "run_2") : "walk_1";
      } else {
        companion.walkTimer = 0;
        companion.pose = "idle_stand";
      }

      // 5. Update Ambient Animations
      catAnimRef.current.timer++;
      if (catAnimRef.current.timer % 24 === 0) {
        catAnimRef.current.frame = (catAnimRef.current.frame + 1) % 6;
      }

      // Update birds
      birdsRef.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.timer++;
        if (b.timer % 10 === 0) {
          b.frame = (b.frame + 1) % 3;
        }
        if (b.x > WORLD_W + 100) b.x = -100;
      });

      // Update Bekasi Scavenger Birds (Crows & White Egrets in Bantar Gebang)
      if (zoneRef.current === "bekasi") {
        bekasiBirdsRef.current.forEach((b) => {
          b.timer++;

          if (b.type === "crow_flying" || b.type === "egret_flying") {
            // Flying birds move horizontally with gentle wave
            b.x += b.vx;
            b.y += Math.sin(b.timer * 0.05) * 0.35;
            // Cycle 6-frame flapping animation
            if (b.timer % 6 === 0) {
              b.frame = (b.frame + 1) % 6;
            }
            // Loop across world
            if (b.x > WORLD_W + 150) {
              b.x = -100;
              b.y = 50 + Math.random() * 80;
            }
          } else {
            // Perched / standing birds
            // Cycle 6-frame pecking/looking animation
            if (b.timer % 8 === 0) {
              b.frame = (b.frame + 1) % 6;
            }

            // Startle check: If active player gets within 85px, bird takes off!
            const distToPlayer = Math.abs(active.x - b.x);
            if (distToPlayer < 85 && !b.isStartled) {
              b.isStartled = true;
              b.type = b.type === "crow_pecking" ? "crow_flying" : "egret_flying";
              b.vx = active.facingLeft ? -2.8 : 2.8;
              b.vy = -2.2;
              sound.playWhoosh();
            }

            // If startled, ascend into sky
            if (b.isStartled) {
              b.x += b.vx;
              b.y += b.vy;
              b.vy += 0.02; // gradual level off
              if (b.y < 80) {
                b.vy = 0;
                b.isStartled = false;
              }
            }
          }
        });
      }

      // Update clouds
      cloudsRef.current.forEach((c) => {
        c.x += c.speed;
        if (c.x > WORLD_W + 200) c.x = -300;
      });

      // 6. Camera Follow
      const targetCamX = active.x - CANVAS_W / 2;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
      const maxCamX = WORLD_W - CANVAS_W;
      cameraXRef.current = Math.max(0, Math.min(maxCamX, cameraXRef.current));
      const camX = cameraXRef.current;

      // 7. DRAW SCENE
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const {
        bg: bgImg,
        props: propsImg,
        micro: microImg,
        jihanSheet: jihanImg,
        jihanMaster: jihanMasterImg,
        jihanCombat: jihanCombatImg,
        gerobak24: gerobakImg,
        daniSheet: daniImg,
        daniMaster: daniMasterImg,
        daniCombat: daniCombatImg,
        panciProp: panciPropImg,
        cauldronEmergence: cauldronEmergenceImg,
        monsterMaster: monsterMasterImg,
        towerListrik: towerListrikImg,
        adifMaster: adifMasterImg,
        adifCombat: adifCombatImg,
        hairiMaster: hairiMasterImg,
        hairiCombat: hairiCombatImg,
        hairiSuperMaster: hairiSuperMasterImg,
        hairiSuperCombat: hairiSuperCombatImg,
        hairiV3Master: hairiV3MasterImg,
        hairiV3Combat: hairiV3CombatImg,
        undergroundStation: undergroundStationImg,
        krlTrain: krlTrainImg,
        stasiunBekasi: stasiunBekasiImg,
        envBekasi: envBekasiImg,
        keyMaster: keyMasterImg,
        keyCombat: keyCombatImg,
        bekasiBirds: bekasiBirdsImg,
        bekasiTruckProps: bekasiTruckPropsImg,
      } = imagesRef.current;

      // Screen shake calculation
      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.86;
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0;
      }
      const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
      const shakeY = (Math.random() - 0.5) * screenShakeRef.current;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      const currentZone = zoneRef.current;

      // Update KRL Train Animation and Movement State (2D 8-Frame State Machine)
      const krl = krlStateRef.current;
      krl.animTimer++;

      if (krl.state === "doors_closing") {
        if (krl.animTimer % 5 === 0) {
          if (krl.frame < 7) {
            krl.frame++;
          } else {
            krl.frame = 0; // Doors fully shut and locked
            krl.state = "departing";
            krl.vx = currentZone === "stasiun_menara" ? 2.5 : -2.5;
            sound.playWhoosh();
          }
        }
      } else if (krl.state === "departing") {
        const accel = currentZone === "stasiun_menara" ? 0.45 : -0.45;
        krl.vx += accel;
        krl.x += krl.vx;

        // Camera smoothly follows the speeding train!
        cameraXRef.current += (krl.x - CANVAS_W / 2 - cameraXRef.current) * 0.15;

        // Wheel sparks during electric acceleration
        if (Math.random() < 0.6) {
          combatParticlesRef.current.push({
            x: krl.x + (Math.random() - 0.5) * 80,
            y: GROUND_Y + 14,
            vx: -krl.vx * 0.2 + (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3.5,
            color: Math.random() < 0.5 ? "#38bdf8" : "#facc15",
            size: 2.8,
            life: 16,
            maxLife: 16,
          });
        }
        krl.transitionTimer++;
        if (krl.transitionTimer > 50) {
          krl.transitionTimer = 0;
          teleportFlashRef.current = 32;
          if (currentZone === "stasiun_menara") {
            // Arrive at Stasiun Bekasi!
            zoneRef.current = "stasiun_bekasi";
            setCurrentZone("stasiun_bekasi");
            sound.playTrainChime();
            sound.playPortal();
            zoneBannerRef.current = {
              title: "STASIUN BEKASI (BKS +19M)",
              subtitle: "TIBA DI JALUR 2 • KRL COMMUTER LINE JABODETABEK",
              timer: 180,
            };
            daniPosRef.current.x = 550;
            daniPosRef.current.vx = 0;
            jihanPosRef.current.x = 500;
            jihanPosRef.current.vx = 0;
            hairiRef.current.x = 450;
            hairiRef.current.vx = 0;
            adifRef.current.x = 400;
            adifRef.current.vx = 0;
            if (keyRef.current.isFriend) {
              keyRef.current.x = 350;
              keyRef.current.vx = 0;
            }
            krl.x = -250;
            krl.targetX = 550;
            krl.vx = 8.0;
            krl.state = "arriving";
            krl.frame = 1;
            cameraXRef.current = 0;
          } else {
            // Arrive back at Stasiun Menara!
            zoneRef.current = "stasiun_menara";
            setCurrentZone("stasiun_menara");
            sound.playTrainChime();
            sound.playPortal();
            zoneBannerRef.current = {
              title: "STASIUN BAWAH TANAH KAMPUNG MENARA",
              subtitle: "TIBA KEMBALI DI PERON JALUR 1",
              timer: 180,
            };
            daniPosRef.current.x = 2200;
            daniPosRef.current.vx = 0;
            jihanPosRef.current.x = 2160;
            jihanPosRef.current.vx = 0;
            hairiRef.current.x = 2120;
            hairiRef.current.vx = 0;
            adifRef.current.x = 2080;
            adifRef.current.vx = 0;
            if (keyRef.current.isFriend) {
              keyRef.current.x = 2040;
              keyRef.current.vx = 0;
            }
            krl.x = 3300;
            krl.targetX = 2200;
            krl.vx = -8.0;
            krl.state = "arriving";
            krl.frame = 1;
            cameraXRef.current = Math.max(0, 2200 - CANVAS_W / 2);
          }
        }
      } else if (krl.state === "arriving") {
        const diff = krl.targetX - krl.x;
        krl.vx = diff * 0.08;
        krl.x += krl.vx;
        cameraXRef.current += (krl.x - CANVAS_W / 2 - cameraXRef.current) * 0.12;
        if (krl.animTimer % 4 === 0) {
          krl.frame = krl.frame === 0 ? 1 : krl.frame === 1 ? 7 : 0;
        }
        if (Math.abs(diff) < 3.5) {
          krl.x = krl.targetX;
          krl.vx = 0;
          krl.state = "doors_opening";
          krl.frame = 0;
          krl.animTimer = 0;
          sound.playTrainChime();
          if (zoneRef.current === "stasiun_bekasi") {
            onTriggerDialogue("stasiun_bekasi_arrive_1");
          }
        }
      } else if (krl.state === "doors_opening") {
        if (krl.animTimer % 6 === 0) {
          if (krl.frame < 4) {
            krl.frame++;
          } else {
            krl.state = "idle_open";
          }
        }
      } else if (krl.state === "idle_open") {
        krl.frame = 4; // Doors fully wide open for boarding
      }

      if (currentZone === "losari") {
        // ==========================================
        // ZONE 1: PANTAI LOSARI (PESISIR & DERMAGA)
        // ==========================================

        // Layer 1: Background Panorama with Parallax
        if (bgImg) {
          const bgParallaxX = -camX * 0.45;
          ctx.drawImage(bgImg, bgParallaxX, 0, WORLD_W * 0.85, CANVAS_H);
        } else {
          // Fallback Sunset Gradient
          const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
          grad.addColorStop(0, "#3b1e54");
          grad.addColorStop(0.4, "#9b4444");
          grad.addColorStop(0.7, "#e58934");
          grad.addColorStop(1, "#f7d070");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // Layer 2: Drifting Clouds (Micro sheet)
        if (microImg) {
          cloudsRef.current.forEach((c) => {
            const cloudScreenX = c.x - camX * 0.3;
            let sx = 40,
              sy = 280,
              sw = 600,
              sh = 200;
            if (c.variant === 1) {
              sx = 670;
              sy = 330;
              sw = 390;
              sh = 130;
            } else if (c.variant === 2) {
              sx = 1100;
              sy = 350;
              sw = 240;
              sh = 100;
            }
            ctx.drawImage(microImg, sx, sy, sw, sh, cloudScreenX, c.y, sw * 0.35 * c.scale, sh * 0.35 * c.scale);
          });
        }

        // Layer 3: Flying Swallows
        if (microImg) {
          birdsRef.current.forEach((b) => {
            const birdScreenX = b.x - camX * 0.85;
            const sx = 40 + b.frame * 200;
            ctx.drawImage(microImg, sx, 560, 180, 180, birdScreenX, b.y, 36, 36);
          });
        }

        // Layer 4: Street Props & Buildings (Behind Characters)
        if (propsImg) {
          // Warkop Losari facade
          const warkopX = 1600 - camX;
          ctx.drawImage(propsImg, 680, 20, 340, 300, warkopX, GROUND_Y - 145, 180, 160);

          // Rustic Wooden Bench
          const benchX = 750 - camX;
          ctx.drawImage(propsImg, 350, 350, 280, 170, benchX, GROUND_Y - 65, 120, 75);

          // Vintage Bicycle
          const bikeX = 890 - camX;
          ctx.drawImage(propsImg, 720, 350, 280, 170, bikeX, GROUND_Y - 60, 110, 70);

          // Classic Vintage Wooden Pole at Warkop district (x = 1420)
          const poleX = 1420 - camX;
          ctx.drawImage(propsImg, 20, 300, 280, 450, poleX - 60, GROUND_Y - 220, 120, 230);

          // Coconut Palms along Pantai Losari
          const palm1X = 100 - camX;
          ctx.drawImage(propsImg, 1020, 150, 335, 600, palm1X, GROUND_Y - 260, 140, 270);
          const palm2X = 2050 - camX;
          ctx.drawImage(propsImg, 1020, 150, 335, 600, palm2X, GROUND_Y - 260, 140, 270);
          const palm3X = 2850 - camX;
          ctx.drawImage(propsImg, 1020, 150, 335, 600, palm3X, GROUND_Y - 260, 140, 270);

          // Potted Plants
          const plant1X = 680 - camX;
          ctx.drawImage(propsImg, 330, 530, 160, 220, plant1X, GROUND_Y - 55, 45, 60);
          const plant2X = 1350 - camX;
          ctx.drawImage(propsImg, 550, 530, 160, 220, plant2X, GROUND_Y - 55, 45, 60);
        }

        // Layer 4.5: Gerobak Pisang Epe & Saraba (24-Frame Micro-Animation Sheet)
        const gerobakX = 1120 - camX;
        if (gerobakImg) {
          const gFrame = Math.floor(globalTimer / 3) % 24;
          const gCol = gFrame % 6;
          const gRow = Math.floor(gFrame / 6);
          const gFrameW = 210;
          const gFrameH = 212;
          const gSx = gCol * gFrameW;
          const gSy = gRow * gFrameH;
          ctx.drawImage(gerobakImg, gSx, gSy, gFrameW, gFrameH, gerobakX, GROUND_Y - 138, 225, 150);

          ctx.save();
          const lanternGlow = ctx.createRadialGradient(
            gerobakX + 45,
            GROUND_Y - 85,
            10,
            gerobakX + 45,
            GROUND_Y - 85,
            45
          );
          lanternGlow.addColorStop(0, "rgba(251, 191, 36, 0.25)");
          lanternGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
          ctx.fillStyle = lanternGlow;
          ctx.fillRect(gerobakX, GROUND_Y - 130, 90, 90);
          ctx.restore();
        } else if (propsImg) {
          ctx.drawImage(propsImg, 140, 50, 480, 270, gerobakX, GROUND_Y - 120, 210, 130);
        }

        // Layer 5: Kucing Oyen (Interactive Cat)
        if (microImg) {
          const catX = 430 - camX;
          const catFrame = catAnimRef.current.frame;
          const sx = 40 + catFrame * 220;
          ctx.drawImage(microImg, sx, 30, 200, 200, catX, GROUND_Y - 45, 52, 52);
        }

        // Layer 5.5: Training Dummies / Targets (Sparring Posts at Pantai Losari)
        trainingDummiesRef.current.forEach((dummy) => {
          const dummyScreenX = dummy.x - camX;
          if (dummyScreenX < -100 || dummyScreenX > CANVAS_W + 100) return;

          if (dummy.hitTimer > 0) {
            dummy.hitTimer--;
            dummy.shake *= 0.88;
          } else {
            dummy.shake = 0;
          }
          const wobbleAngle = (Math.sin(globalTimer * 0.9) * dummy.shake * Math.PI) / 180;

          ctx.save();
          ctx.translate(dummyScreenX, dummy.y);
          ctx.rotate(wobbleAngle);

          // Ground shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
          ctx.beginPath();
          ctx.ellipse(0, 10, 24, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wooden cross-base
          ctx.fillStyle = "#3e2723";
          ctx.fillRect(-22, 2, 44, 8);
          ctx.fillStyle = "#5d4037";
          ctx.fillRect(-18, 0, 36, 4);

          // Main trunk (wooden pillar / pole)
          const isHitFlash = dummy.hitTimer > 14;
          ctx.fillStyle = isHitFlash ? "#fef08a" : "#795548";
          ctx.fillRect(-8, -85, 16, 90);
          ctx.fillStyle = isHitFlash ? "#ffffff" : "#8d6e63";
          ctx.fillRect(-6, -85, 5, 90);

          // Straw rope bindings around chest & waist
          ctx.fillStyle = isHitFlash ? "#ffffff" : "#d97706";
          ctx.fillRect(-10, -68, 20, 14);
          ctx.fillRect(-10, -42, 20, 10);
          ctx.fillStyle = "#fef3c7";
          ctx.fillRect(-9, -65, 18, 2);
          ctx.fillRect(-9, -60, 18, 2);
          ctx.fillRect(-9, -39, 18, 2);

          // Wooden sparring cross-arms
          ctx.fillStyle = isHitFlash ? "#fef08a" : "#5d4037";
          ctx.fillRect(-32, -62, 64, 8);
          ctx.fillStyle = "#8d6e63";
          ctx.fillRect(-30, -62, 60, 3);
          // Red cloth wraps on arm tips
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(-32, -62, 7, 8);
          ctx.fillRect(25, -62, 7, 8);

          // Head target (straw helmet)
          ctx.fillStyle = isHitFlash ? "#ffffff" : "#b45309";
          ctx.beginPath();
          ctx.arc(0, -96, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(-2, -98, 10, 0, Math.PI * 2);
          ctx.fill();

          // Bullseye Emblem
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.arc(0, -55, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, -55, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Label above dummy
          ctx.save();
          ctx.font = "bold 10px 'Courier New', monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fillText(dummy.label, dummyScreenX, dummy.y - 120);
          ctx.restore();
        });

        // Layer 5.6: Ancient Cauldron ("Panci Misterius") & Emergence Sequence
        const panciScreenX = 2150 - camX;
        const panciScreenY = GROUND_Y - 45;

        if (monster.isActive && monster.isEmerging && cauldronEmergenceImg) {
          const eFrame = Math.min(5, Math.max(0, monster.emergeFrame));
          const frameW = 200;
          const frameH = 200;
          const sx = eFrame * frameW;
          const sy = 0;
          const destW = 140;
          const destH = 140;
          const drawY = panciScreenY - 65;

          ctx.save();
          const shock = ctx.createRadialGradient(
            panciScreenX,
            drawY + 70,
            10,
            panciScreenX,
            drawY + 70,
            75
          );
          shock.addColorStop(0, "rgba(168, 85, 247, 0.65)");
          shock.addColorStop(0.5, "rgba(147, 51, 234, 0.35)");
          shock.addColorStop(1, "rgba(88, 28, 135, 0)");
          ctx.fillStyle = shock;
          ctx.beginPath();
          ctx.arc(panciScreenX, drawY + 70, 75, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(cauldronEmergenceImg, sx, sy, frameW, frameH, panciScreenX - destW / 2, drawY, destW, destH);
          ctx.restore();
        } else if (panciPropImg) {
          const destW = 75;
          const destH = 75;
          const drawX = panciScreenX - destW / 2;
          const drawY = panciScreenY - 20;

          ctx.save();
          const steamPulse = 0.5 + Math.sin(globalTimer * 0.1) * 0.25;
          const halo = ctx.createRadialGradient(
            panciScreenX,
            drawY + 38,
            8,
            panciScreenX,
            drawY + 38,
            45
          );
          halo.addColorStop(0, `rgba(168, 85, 247, ${steamPulse * 0.7})`);
          halo.addColorStop(0.7, `rgba(126, 34, 206, ${steamPulse * 0.25})`);
          halo.addColorStop(1, "rgba(88, 28, 135, 0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(panciScreenX, drawY + 38, 45, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(panciPropImg, 0, 0, 200, 200, drawX, drawY, destW, destH);
          ctx.restore();
        }

        // Dimensional Portal Emergence (Spawns after defeating Batara Siluman Panci)
        if (monster.isDefeated) {
          drawPortal(ctx, 2240 - camX, GROUND_Y, globalTimer, "🌀 PORTAL PERKAMPUNGAN");
        }
      } else if (currentZone === "perkampungan") {
        // ==============================================================
        // ZONE 2: PERKAMPUNGAN MENARA SINYAL (JARINGAN TRANSMISI KABEL)
        // ==============================================================

        // Layer 1: Atmospheric Twilight Sky Gradient
        const duskSky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        duskSky.addColorStop(0, "#080c16");
        duskSky.addColorStop(0.28, "#1e1338");
        duskSky.addColorStop(0.55, "#4c1d95");
        duskSky.addColorStop(0.78, "#b45309");
        duskSky.addColorStop(0.92, "#f59e0b");
        duskSky.addColorStop(1, "#fef08a");
        ctx.fillStyle = duskSky;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Layer 1.5: Twinkling Evening Stars & Satellites
        for (let s = 0; s < 22; s++) {
          const sx = ((s * 157 + 35) - camX * 0.08 + WORLD_W) % CANVAS_W;
          const sy = 20 + (s * 43) % 115;
          const starBlink = (Math.sin(globalTimer * 0.09 + s) + 1) * 0.5;
          ctx.fillStyle = `rgba(254, 240, 138, ${0.35 + starBlink * 0.6})`;
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Layer 2: Distant Silhouettes of Perkampungan Houses & Gable Roofs (Parallax 0.35)
        const bgHouseParallax = -camX * 0.35;
        ctx.save();
        ctx.translate(bgHouseParallax, 0);
        for (let h = 0; h < 24; h++) {
          const hX = h * 135 - 50;
          const hW = 120 + ((h * 31) % 40);
          const hH = 85 + ((h * 47) % 60);
          const hY = GROUND_Y - hH + 16;

          // Sloping kampung zinc/tile roof silhouette
          ctx.fillStyle = "#1e1338";
          ctx.beginPath();
          ctx.moveTo(hX, hY + 35);
          ctx.lineTo(hX + hW / 2, hY);
          ctx.lineTo(hX + hW, hY + 35);
          ctx.lineTo(hX + hW, GROUND_Y + 16);
          ctx.lineTo(hX, GROUND_Y + 16);
          ctx.closePath();
          ctx.fill();

          // Wooden walls of kampung house
          ctx.fillStyle = "#140c26";
          ctx.fillRect(hX + 10, hY + 35, hW - 20, hH - 35);

          // Warm evening window glow
          if (h % 2 === 0) {
            const winX = hX + hW / 2 - 10;
            const winY = hY + 44;
            ctx.fillStyle = ((globalTimer + h * 20) % 120 < 110) ? "#fde047" : "#eab308";
            ctx.fillRect(winX, winY, 14, 16);
            ctx.fillStyle = "#1e1338";
            ctx.fillRect(winX + 6, winY, 2, 16);
            ctx.fillRect(winX, winY + 7, 14, 2);
          }

          // Rooftop TV antenna & bamboo flagpoles
          if (h % 3 === 0) {
            ctx.strokeStyle = "#312e81";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(hX + hW / 2, hY);
            ctx.lineTo(hX + hW / 2, hY - 26);
            ctx.moveTo(hX + hW / 2 - 10, hY - 18);
            ctx.lineTo(hX + hW / 2 + 10, hY - 18);
            ctx.moveTo(hX + hW / 2 - 6, hY - 10);
            ctx.lineTo(hX + hW / 2 + 6, hY - 10);
            ctx.stroke();
          }
        }
        ctx.restore();

        // Layer 3: Midground Perkampungan Elements (Pos Ronda, Street Lamps, Bamboos)
        // Pos Ronda / Gardu Siskamling at x = 880
        const posRondaX = 880 - camX;
        ctx.save();
        // Roof
        ctx.fillStyle = "#7c2d12";
        ctx.beginPath();
        ctx.moveTo(posRondaX - 60, GROUND_Y - 95);
        ctx.lineTo(posRondaX, GROUND_Y - 135);
        ctx.lineTo(posRondaX + 60, GROUND_Y - 95);
        ctx.closePath();
        ctx.fill();
        // Pillars & Platform
        ctx.fillStyle = "#451a03";
        ctx.fillRect(posRondaX - 50, GROUND_Y - 95, 8, 95);
        ctx.fillRect(posRondaX + 42, GROUND_Y - 95, 8, 95);
        ctx.fillRect(posRondaX - 52, GROUND_Y - 30, 104, 32);
        // Kentongan Bamboo Chime
        ctx.fillStyle = "#d97706";
        ctx.fillRect(posRondaX - 6, GROUND_Y - 80, 12, 36);
        ctx.fillStyle = "#78350f";
        ctx.fillRect(posRondaX - 2, GROUND_Y - 74, 4, 24);
        // Pos Ronda Banner
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(posRondaX - 35, GROUND_Y - 88, 70, 7);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(posRondaX - 35, GROUND_Y - 81, 70, 7);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fef08a";
        ctx.fillText("POS RONDA RW 03", posRondaX, GROUND_Y - 98);
        ctx.restore();

        // Vintage Kampung Street Lamps (x = 1380, x = 2050)
        [1380, 2050].forEach((lx) => {
          const lampScreenX = lx - camX;
          ctx.save();
          // Pole
          ctx.fillStyle = "#334155";
          ctx.fillRect(lampScreenX - 4, GROUND_Y - 180, 8, 180);
          // Lamp arm
          ctx.fillRect(lampScreenX - 4, GROUND_Y - 185, 28, 6);
          // Lamp shade
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(lampScreenX + 16, GROUND_Y - 188, 18, 5);
          // Bulb
          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(lampScreenX + 25, GROUND_Y - 180, 5, 0, Math.PI * 2);
          ctx.fill();
          // Cone of street light
          const cone = ctx.createRadialGradient(
            lampScreenX + 25,
            GROUND_Y - 170,
            10,
            lampScreenX + 25,
            GROUND_Y,
            120
          );
          cone.addColorStop(0, "rgba(254, 240, 138, 0.28)");
          cone.addColorStop(0.7, "rgba(251, 191, 36, 0.08)");
          cone.addColorStop(1, "rgba(251, 191, 36, 0)");
          ctx.fillStyle = cone;
          ctx.beginPath();
          ctx.moveTo(lampScreenX + 25, GROUND_Y - 180);
          ctx.lineTo(lampScreenX - 60, GROUND_Y + 16);
          ctx.lineTo(lampScreenX + 110, GROUND_Y + 16);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        // Layer 4: Interconnected Catenary Cables Across the Sky
        const TOWER_COORDS = [450, 1080, 1710, 2340];
        const tW = 165;
        const tH = 285;
        const topY = GROUND_Y + 16 - tH;

        // Draw Cables spanning between towers and offscreen margins
        const allPoles = [-180, ...TOWER_COORDS, 2980];
        for (let s = 0; s < allPoles.length - 1; s++) {
          const x1 = allPoles[s] - camX;
          const x2 = allPoles[s + 1] - camX;
          if (Math.max(x1, x2) < -120 || Math.min(x1, x2) > CANVAS_W + 120) continue;

          // Cable 1: Top lightning/shield wire (sag: 38)
          drawCatenaryCable(ctx, x1, topY + 32, x2, topY + 32, 38, "#1e293b", "#38bdf8", 1.8, globalTimer, 0.007, s * 22);

          // Cable 2: Upper Left transmission arm (sag: 48)
          drawCatenaryCable(ctx, x1 - 44, topY + 82, x2 - 44, topY + 82, 48, "#0f172a", "#facc15", 2.0, globalTimer, 0.009, s * 31 + 10);

          // Cable 3: Upper Right transmission arm (sag: 52)
          drawCatenaryCable(ctx, x1 + 44, topY + 82, x2 + 44, topY + 82, 52, "#0f172a", "#38bdf8", 2.0, globalTimer, 0.008, s * 17 + 25);

          // Cable 4: Lower optical ground & distribution line (sag: 60)
          drawCatenaryCable(ctx, x1, topY + 130, x2, topY + 130, 60, "#334155", "#4ade80", 1.8, globalTimer, 0.006, s * 28 + 40);
        }

        // Layer 4.5: Duplicated Signal Transmission Towers
        if (towerListrikImg) {
          TOWER_COORDS.forEach((tx, idx) => {
            const tScreenX = tx - camX;
            if (tScreenX < -150 || tScreenX > CANVAS_W + 150) return;

            // Draw duplicated tower sprite
            ctx.drawImage(towerListrikImg, tScreenX - tW / 2, topY, tW, tH);

            // Aviation red warning beacon blinking on pinnacle
            const beaconOn = (globalTimer + tx) % 50 < 25;
            ctx.save();
            if (beaconOn) {
              const bGlow = ctx.createRadialGradient(tScreenX, topY + 8, 1, tScreenX, topY + 8, 14);
              bGlow.addColorStop(0, "rgba(239, 68, 68, 0.95)");
              bGlow.addColorStop(0.5, "rgba(220, 38, 38, 0.35)");
              bGlow.addColorStop(1, "rgba(220, 38, 38, 0)");
              ctx.fillStyle = bGlow;
              ctx.beginPath();
              ctx.arc(tScreenX, topY + 8, 14, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = beaconOn ? "#fecaca" : "#7f1d1d";
            ctx.beginPath();
            ctx.arc(tScreenX, topY + 8, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Tower designation label badge
            ctx.font = "bold 9px 'Courier New', monospace";
            ctx.fillStyle = "rgba(254, 240, 138, 0.85)";
            ctx.textAlign = "center";
            ctx.fillText(idx === 2 ? "TOWER 03 • POS ADIF" : `TOWER 0${idx + 1} • TRANSMISI`, tScreenX, GROUND_Y + 12);
            ctx.restore();
          });
        }

        // Layer 5: Paving Block Ground of Perkampungan Gang
        ctx.save();
        ctx.fillStyle = "#27272a";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, CANVAS_H - (GROUND_Y + 16));

        // Interlocking paving grid
        const paveOffX = -(camX % 32);
        ctx.strokeStyle = "#3f3f46";
        ctx.lineWidth = 1;
        for (let px = paveOffX - 32; px < CANVAS_W + 32; px += 32) {
          ctx.beginPath();
          ctx.moveTo(px, GROUND_Y + 16);
          ctx.lineTo(px, CANVAS_H);
          ctx.stroke();
        }
        for (let py = GROUND_Y + 16; py < CANVAS_H; py += 16) {
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(CANVAS_W, py);
          ctx.stroke();
        }
        // Curb stone edge line
        ctx.fillStyle = "#52525b";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, 3);
        ctx.fillStyle = "#71717a";
        ctx.fillRect(0, GROUND_Y + 19, CANVAS_W, 1);
        ctx.restore();

        // Return Portal to Pantai Losari at x = 180
        drawPortal(ctx, 180 - camX, GROUND_Y, globalTimer, "🌀 PORTAL PANTAI LOSARI");

        // Station Dimensional Portal at x = 2750 (Pure code-generated portal, no stairs)
        drawStationPortal(
          ctx,
          2750 - camX,
          GROUND_Y + 16,
          globalTimer,
          "PORTAL STASIUN KRL",
          "MENUJU STASIUN KAMPUNG MENARA"
        );
      } else if (currentZone === "stasiun_menara") {
        // ==============================================================
        // ZONE 3: STASIUN BAWAH TANAH KRL (EXPANSIVE METRO PLATFORM ZONE)
        // ==============================================================

        // 1. Dark Subterranean Atmosphere Background
        const metroSky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        metroSky.addColorStop(0, "#020617");
        metroSky.addColorStop(0.5, "#0b0f19");
        metroSky.addColorStop(1, "#0f172a");
        ctx.fillStyle = metroSky;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // 2. Full 2D Underground Station Background (Repeated / Tiled across wide station)
        if (undergroundStationImg) {
          const stW = 1200;
          const stH = 540;
          for (let bgX = 0; bgX < WORLD_W + 600; bgX += stW) {
            const stOffX = bgX - camX * 0.35;
            if (stOffX + stW > -50 && stOffX < CANVAS_W + 50) {
              ctx.drawImage(undergroundStationImg, 0, 0, 1376, 768, stOffX, 0, stW, stH);
            }
          }
        }

        // 3. Platform Ceiling Neon Strip Lights spanning the entire station
        for (let lx = 0; lx < 22; lx++) {
          const lightX = lx * 150 + 50 - camX;
          if (lightX < -60 || lightX > CANVAS_W + 60) continue;
          ctx.save();
          // Fixture
          ctx.fillStyle = "#334155";
          ctx.fillRect(lightX - 35, 18, 70, 7);
          // Neon glow
          const neonGlow = ctx.createRadialGradient(lightX, 26, 4, lightX, 100, 90);
          neonGlow.addColorStop(0, "rgba(56, 189, 248, 0.4)");
          neonGlow.addColorStop(0.7, "rgba(56, 189, 248, 0.08)");
          neonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = neonGlow;
          ctx.fillRect(lightX - 70, 22, 140, 180);
          // White-cyan neon tube
          ctx.fillStyle = "#e0f2fe";
          ctx.fillRect(lightX - 30, 22, 60, 4);
          ctx.restore();
        }

        // 4. Subterranean Structural Columns / Support Pillars
        for (let px = 400; px <= 1800; px += 350) {
          const pillarX = px - camX;
          if (pillarX < -50 || pillarX > CANVAS_W + 50) continue;
          ctx.save();
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(pillarX - 16, 0, 32, GROUND_Y + 16);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(pillarX - 16, 0, 32, GROUND_Y + 16);
          // Hazard warning stripes
          ctx.fillStyle = "#eab308";
          for (let hy = GROUND_Y - 50; hy < GROUND_Y; hy += 12) {
            ctx.fillRect(pillarX - 14, hy, 28, 4);
          }
          ctx.restore();
        }

        // 5. Platform Floor & Yellow Safety Tactile Strip
        ctx.save();
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, CANVAS_H - (GROUND_Y + 16));

        // Tactile yellow safety line
        ctx.fillStyle = "#facc15";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, 6);
        ctx.fillStyle = "#ca8a04";
        for (let tx = -(camX % 16); tx < CANVAS_W; tx += 16) {
          ctx.fillRect(tx, GROUND_Y + 17, 8, 4);
        }

        // Sunken Track Bed below platform (at boarding track side towards x > 2050)
        const trackStartX = 2050 - camX;
        if (trackStartX < CANVAS_W) {
          const trackDrawStart = Math.max(0, trackStartX);
          const trackDrawWidth = CANVAS_W - trackDrawStart;
          ctx.fillStyle = "#020617";
          ctx.fillRect(trackDrawStart, GROUND_Y + 26, trackDrawWidth, CANVAS_H - (GROUND_Y + 26));

          // Steel Rails & Sleepers on Tracks
          ctx.fillStyle = "#451a03";
          for (let rx = trackDrawStart; rx < CANVAS_W; rx += 24) {
            ctx.fillRect(rx, GROUND_Y + 34, 16, 8);
          }
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(trackDrawStart, GROUND_Y + 32, trackDrawWidth, 3);
          ctx.fillRect(trackDrawStart, GROUND_Y + 40, trackDrawWidth, 3);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(trackDrawStart, GROUND_Y + 32, trackDrawWidth, 1);
        }
        ctx.restore();

        // 6. Station Exploration Amenities (Waiting Benches & Cyber Vending Machines)
        [650, 1150, 1650].forEach((bx) => {
          const sx = bx - camX;
          if (sx > -60 && sx < CANVAS_W + 60) {
            ctx.save();
            ctx.fillStyle = "#334155";
            ctx.fillRect(sx - 24, GROUND_Y - 14, 48, 14);
            ctx.fillStyle = "#64748b";
            ctx.fillRect(sx - 26, GROUND_Y - 26, 52, 12);
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - 26, GROUND_Y - 26, 52, 26);
            ctx.restore();
          }
        });
        [900, 1400].forEach((vx) => {
          const sx = vx - camX;
          if (sx > -60 && sx < CANVAS_W + 60) {
            ctx.save();
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(sx - 20, GROUND_Y - 65, 40, 65);
            ctx.strokeStyle = "#0ea5e9";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx - 20, GROUND_Y - 65, 40, 65);
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(sx - 16, GROUND_Y - 55, 32, 24);
            ctx.font = "bold 7px monospace";
            ctx.fillStyle = "#facc15";
            ctx.textAlign = "center";
            ctx.fillText("DRINKS", sx, GROUND_Y - 20);
            ctx.restore();
          }
        });

        // 7. Portal Kembali ke Perkampungan Menara at x = 180
        drawStationPortal(
          ctx,
          180 - camX,
          GROUND_Y + 16,
          globalTimer,
          "PORTAL KELUAR",
          "KEMBALI KE PERKAMPUNGAN"
        );

        // 8. Central Concourse Overhead Signboard at x = 1100
        const concourseSignX = 1100 - camX;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(concourseSignX - 130, 52, 260, 32);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(concourseSignX - 130, 52, 260, 32);
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("🚉 STASIUN BAWAH TANAH KAMPUNG MENARA", concourseSignX, 66);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#facc15";
        ctx.fillText("AULA TRANSIT UTAMA • MENUJU PERON 1 ➡️", concourseSignX, 78);
        ctx.restore();

        // 9. Station Platform Overhead Signboard at x = 2200
        const signX = 2200 - camX;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(signX - 115, 55, 230, 32);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(signX - 115, 55, 230, 32);
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("🚉 PERON 1 • KRL COMMUTER LINE", signX, 70);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#facc15";
        ctx.fillText("COMMUTER LINE TUJUAN BEKASI (BKS)", signX, 81);
        ctx.restore();

        // 10. Separate 2D 8-Frame Animated KRL Train Carriage on Tracks
        if (krlTrainImg) {
          const trainDrawX = krl.x - camX - 145;
          const trainDrawY = GROUND_Y + 16 - 198;
          const trainW = 290;
          const trainH = 198;
          const fw = 168;
          const fh = 232;
          const sx = krl.frame * fw;

          ctx.save();
          if (krl.frame >= 2 && krl.frame <= 5) {
            const glow = ctx.createRadialGradient(trainDrawX + 145, trainDrawY + 95, 10, trainDrawX + 145, trainDrawY + 95, 80);
            glow.addColorStop(0, "rgba(254, 240, 138, 0.35)");
            glow.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = glow;
            ctx.fillRect(trainDrawX + 65, trainDrawY + 40, 160, 110);
          }

          ctx.drawImage(krlTrainImg, sx, 0, fw, fh, trainDrawX, trainDrawY, trainW, trainH);

          // LED Destination Board
          ctx.fillStyle = "#1e3a8a";
          ctx.fillRect(trainDrawX + 85, trainDrawY + 18, 120, 14);
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 1;
          ctx.strokeRect(trainDrawX + 85, trainDrawY + 18, 120, 14);
          ctx.font = "bold 8px 'Courier New', monospace";
          ctx.fillStyle = "#facc15";
          ctx.textAlign = "center";
          ctx.fillText("KRL • BEKASI SPECIAL", trainDrawX + 145, trainDrawY + 28);
          ctx.restore();
        }

        // 11. Dark Subway Tunnel Arch to the right (Tracks heading into darkness)
        const darkTunnelX = 2650 - camX;
        ctx.save();
        const tunnelGrad = ctx.createLinearGradient(darkTunnelX, 0, darkTunnelX + 220, 0);
        tunnelGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        tunnelGrad.addColorStop(0.7, "rgba(2, 6, 23, 0.95)");
        tunnelGrad.addColorStop(1, "rgba(2, 6, 23, 1)");
        ctx.fillStyle = tunnelGrad;
        ctx.fillRect(darkTunnelX, 0, 350, CANVAS_H);
        ctx.restore();
      } else if (currentZone === "stasiun_bekasi") {
        // ==============================================================
        // ZONE 4: STASIUN BEKASI (BKS +19M) - EXPANSIVE BEKASI STATION
        // ==============================================================

        // 1. Bekasi Station Sky / Background Lighting
        const bksSky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        bksSky.addColorStop(0, "#1e293b");
        bksSky.addColorStop(0.4, "#334155");
        bksSky.addColorStop(1, "#475569");
        ctx.fillStyle = bksSky;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // 2. Full 2D Stasiun Bekasi Pixel Art Background (Tiled across wide station)
        if (stasiunBekasiImg) {
          const stW = 1280;
          const stH = 540;
          for (let bgX = 0; bgX < WORLD_W + 600; bgX += stW) {
            const stOffX = bgX - camX * 0.35;
            if (stOffX + stW > -50 && stOffX < CANVAS_W + 50) {
              ctx.drawImage(stasiunBekasiImg, 0, 0, 1376, 768, stOffX, 0, stW, stH);
            }
          }
        }

        // 3. Platform Ceiling Steel Trusses & Hanging Digital Departure Displays
        for (let bx = 0; bx < 18; bx++) {
          const trussX = bx * 180 + 90 - camX;
          if (trussX < -100 || trussX > CANVAS_W + 100) continue;
          ctx.save();
          // Truss columns / supports
          ctx.fillStyle = "rgba(71, 85, 105, 0.4)";
          ctx.fillRect(trussX - 4, 0, 8, GROUND_Y + 16);
          // Digital departure display every few trusses
          if (bx === 1 || bx === 5 || bx === 9 || bx === 14) {
            ctx.fillStyle = "#020617";
            ctx.fillRect(trussX - 50, 24, 100, 28);
            ctx.strokeStyle = "#eab308";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(trussX - 50, 24, 100, 28);
            ctx.font = "bold 8px 'Courier New', monospace";
            ctx.fillStyle = "#facc15";
            ctx.textAlign = "center";
            ctx.fillText(bx <= 5 ? "JALUR 2 • KRL" : "PINTU KELUAR ➡️", trussX, 36);
            ctx.font = "bold 7px 'Courier New', monospace";
            ctx.fillStyle = "#4ade80";
            ctx.fillText(bx <= 5 ? "BEKASI - MENARA" : "TPST BANTAR GEBANG", trussX, 47);
          }
          ctx.restore();
        }

        // 4. Platform Floor & Yellow Tactile Braille Strip
        ctx.save();
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, CANVAS_H - (GROUND_Y + 16));

        // Tactile yellow safety line
        ctx.fillStyle = "#facc15";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, 6);
        ctx.fillStyle = "#ca8a04";
        for (let tx = -(camX % 16); tx < CANVAS_W; tx += 16) {
          ctx.fillRect(tx, GROUND_Y + 17, 8, 4);
        }

        // Sunken Track Bed below platform (at track side towards x < 750)
        const trackBedW = 750 - camX;
        if (trackBedW > 0) {
          const drawW = Math.min(trackBedW, CANVAS_W);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, GROUND_Y + 26, drawW, CANVAS_H - (GROUND_Y + 26));

          // Sleepers & Rails
          ctx.fillStyle = "#451a03";
          for (let rx = 0; rx < drawW; rx += 24) {
            ctx.fillRect(rx, GROUND_Y + 34, 16, 8);
          }
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(0, GROUND_Y + 32, drawW, 3);
          ctx.fillRect(0, GROUND_Y + 40, drawW, 3);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(0, GROUND_Y + 32, drawW, 1);
        }
        ctx.restore();

        // 5. Separate 2D 8-Frame Animated KRL Train Carriage on Bekasi Tracks (at x = 550)
        if (krlTrainImg) {
          const trainDrawX = krl.x - camX - 145;
          const trainDrawY = GROUND_Y + 16 - 198;
          const trainW = 290;
          const trainH = 198;
          const fw = 168;
          const fh = 232;
          const sx = krl.frame * fw;

          ctx.save();
          if (krl.frame >= 2 && krl.frame <= 5) {
            const glow = ctx.createRadialGradient(trainDrawX + 145, trainDrawY + 95, 10, trainDrawX + 145, trainDrawY + 95, 80);
            glow.addColorStop(0, "rgba(254, 240, 138, 0.35)");
            glow.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = glow;
            ctx.fillRect(trainDrawX + 65, trainDrawY + 40, 160, 110);
          }

          ctx.drawImage(krlTrainImg, sx, 0, fw, fh, trainDrawX, trainDrawY, trainW, trainH);

          // LED Destination Board
          ctx.fillStyle = "#1e3a8a";
          ctx.fillRect(trainDrawX + 85, trainDrawY + 18, 120, 14);
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 1;
          ctx.strokeRect(trainDrawX + 85, trainDrawY + 18, 120, 14);
          ctx.font = "bold 8px 'Courier New', monospace";
          ctx.fillStyle = "#facc15";
          ctx.textAlign = "center";
          ctx.fillText("KRL • KAMPUNG MENARA", trainDrawX + 145, trainDrawY + 28);
          ctx.restore();
        }

        // 6. Arrival Platform Overhead Signboard at x = 550
        const arrivalSignX = 550 - camX;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(arrivalSignX - 110, 50, 220, 32);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(arrivalSignX - 110, 50, 220, 32);
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("🚉 STASIUN BEKASI (BKS +19M)", arrivalSignX, 65);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#facc15";
        ctx.fillText("JALUR 2 • COMMUTER LINE MENUJU MENARA", arrivalSignX, 76);
        ctx.restore();

        // 7. Exploration Amenities in Central Station Hall (Waiting Seats & Vending/Warung)
        [950, 1350, 1850].forEach((bx) => {
          const sx = bx - camX;
          if (sx > -60 && sx < CANVAS_W + 60) {
            ctx.save();
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(sx - 24, GROUND_Y - 14, 48, 14);
            ctx.fillStyle = "#475569";
            ctx.fillRect(sx - 26, GROUND_Y - 26, 52, 12);
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - 26, GROUND_Y - 26, 52, 26);
            ctx.restore();
          }
        });
        const warungX = 1600 - camX;
        if (warungX > -80 && warungX < CANVAS_W + 80) {
          ctx.save();
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(warungX - 35, GROUND_Y - 70, 70, 70);
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(warungX - 35, GROUND_Y - 70, 70, 70);
          ctx.fillStyle = "#facc15";
          ctx.fillRect(warungX - 30, GROUND_Y - 62, 60, 16);
          ctx.font = "bold 8px monospace";
          ctx.fillStyle = "#0f172a";
          ctx.textAlign = "center";
          ctx.fillText("KIOSK BKS", warungX, GROUND_Y - 51);
          ctx.restore();
        }

        // 8. Grand Station Overhead Signboard at x = 1450
        const grandSignX = 1450 - camX;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(grandSignX - 135, 52, 270, 32);
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 2;
        ctx.strokeRect(grandSignX - 135, 52, 270, 32);
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("🚉 STASIUN BEKASI (BKS +19M)", grandSignX, 66);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#facc15";
        ctx.fillText("AULA SENTRAL PENUMPANG • KOTA PATRIOT", grandSignX, 78);
        ctx.restore();

        // 9. Wayfinding Signboard to Exit Gate at x = 2150
        const waySignX = 2150 - camX;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(waySignX - 110, 52, 220, 28);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(waySignX - 110, 52, 220, 28);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#a7f3d0";
        ctx.textAlign = "center";
        ctx.fillText("➡️ PINTU KELUAR STASIUN", waySignX, 65);
        ctx.font = "bold 7px 'Courier New', monospace";
        ctx.fillStyle = "#facc15";
        ctx.fillText("MENUJU PERMUKAAN TPST BANTAR GEBANG", waySignX, 75);
        ctx.restore();

        // 10. Icon Pintu Keluar Stasiun Bekasi at x = 2500 (Turnstile / Exit Gate)
        drawStationExitGate(
          ctx,
          2500 - camX,
          GROUND_Y + 16,
          globalTimer,
          "PERMUKAAN TPST BANTAR GEBANG"
        );
      } else if (currentZone === "bekasi") {
        // ==============================================================
        // ZONE 3: KOTA BEKASI & TPST BANTAR GEBANG (GUNUNG SAMPAH OP)
        // ==============================================================

        // Layer 1: Scorching Tropical Sky Gradient (Hot haze & smog)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        skyGrad.addColorStop(0, "#ea580c"); // deep fiery amber
        skyGrad.addColorStop(0.35, "#f97316"); // blazing orange
        skyGrad.addColorStop(0.65, "#fdba74"); // hot pale dust
        skyGrad.addColorStop(1, "#fef3c7"); // desert heat haze
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Layer 1.5: Blazing Scorching Sun with Radial Glare
        const sunX = 640 - (camX * 0.05);
        const sunY = 75;
        ctx.save();
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 110);
        sunGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
        sunGlow.addColorStop(0.2, "rgba(254, 240, 138, 0.95)");
        sunGlow.addColorStop(0.5, "rgba(251, 146, 60, 0.4)");
        sunGlow.addColorStop(1, "rgba(234, 88, 12, 0)");
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Layer 2: Parallax Mountain of Trash & Landfill Backdrop (envBekasiImg)
        if (envBekasiImg) {
          const bgW = 1376;
          const bgH = 540;
          const bgOffX = -(camX * 0.45) % bgW;
          ctx.drawImage(envBekasiImg, bgOffX - bgW, 0, bgW, bgH);
          ctx.drawImage(envBekasiImg, bgOffX, 0, bgW, bgH);
          ctx.drawImage(envBekasiImg, bgOffX + bgW, 0, bgW, bgH);
          ctx.drawImage(envBekasiImg, bgOffX + bgW * 2, 0, bgW, bgH);
        }

        // Layer 3: Atmospheric Heatwave Shimmer Overlay & Rising Mirage Waves
        ctx.save();
        ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Rising Heat Mirage Waves
        ctx.strokeStyle = "rgba(254, 215, 170, 0.22)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          const waveY = GROUND_Y - 15 - i * 16;
          ctx.beginPath();
          for (let wx = 0; wx < CANVAS_W; wx += 25) {
            const wy = waveY + Math.sin((wx + globalTimer * 2.5 + i * 35) * 0.035) * 3.5;
            if (wx === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Layer 4: Asphalt Road & Landfill Ground
        ctx.save();
        ctx.fillStyle = "#3f3f46"; // dark hot asphalt
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, CANVAS_H - (GROUND_Y + 16));

        // Yellow Road Markings
        const roadOffX = -(camX % 60);
        ctx.fillStyle = "#eab308";
        for (let rx = roadOffX - 60; rx < CANVAS_W + 60; rx += 60) {
          ctx.fillRect(rx, GROUND_Y + 45, 35, 4);
        }

        // Curb Stone Edge
        ctx.fillStyle = "#71717a";
        ctx.fillRect(0, GROUND_Y + 16, CANVAS_W, 3);
        ctx.fillStyle = "#a1a1aa";
        ctx.fillRect(0, GROUND_Y + 19, CANVAS_W, 1);
        ctx.restore();

        // Layer 4.5: Station Entrance Portal at x = 140 (Heading back into Stasiun Bekasi)
        drawStationPortal(
          ctx,
          140 - camX,
          GROUND_Y + 16,
          globalTimer,
          "STASIUN BEKASI",
          "PINTU MASUK KE PERON KRL"
        );

        // Layer 4.6: Landfill Props & Scavenger World Elements (Truk Sampah DLH, Gerobak, Gundukan)
        if (bekasiTruckPropsImg) {
          // 1. Truk Sampah Oranye DKI / DLH Bantar Gebang (4-frame animated at x = 750)
          const truckX = 750;
          const truckScreenX = truckX - camX;
          if (truckScreenX > -250 && truckScreenX < CANVAS_W + 250) {
            const truckFrames = [
              { sx: 42, sy: 55, w: 312, h: 188 },
              { sx: 376, sy: 55, w: 308, h: 188 },
              { sx: 698, sy: 55, w: 323, h: 188 },
              { sx: 1038, sy: 55, w: 308, h: 188 },
            ];
            const tf = truckFrames[Math.floor(globalTimer / 10) % 4];
            const tDestW = 210;
            const tDestH = 126;
            const tDrawX = truckScreenX - tDestW / 2;
            const tDrawY = GROUND_Y + 16 - tDestH;

            ctx.save();
            // Truck Ground Shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.ellipse(truckScreenX, GROUND_Y + 14, 95, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Headlight beam glow on hot asphalt
            const lightGlow = ctx.createRadialGradient(tDrawX + tDestW, GROUND_Y, 5, tDrawX + tDestW + 65, GROUND_Y, 80);
            lightGlow.addColorStop(0, "rgba(254, 240, 138, 0.45)");
            lightGlow.addColorStop(1, "rgba(254, 240, 138, 0)");
            ctx.fillStyle = lightGlow;
            ctx.beginPath();
            ctx.ellipse(tDrawX + tDestW + 35, GROUND_Y + 4, 60, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw Truck Sprite
            ctx.drawImage(bekasiTruckPropsImg, tf.sx, tf.sy, tf.w, tf.h, tDrawX, tDrawY, tDestW, tDestH);

            // Blinking Amber Emergency Warning Light on Truck Cab
            const beaconOn = Math.floor(globalTimer / 12) % 2 === 0;
            if (beaconOn) {
              ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
              ctx.beginPath();
              ctx.arc(tDrawX + tDestW * 0.72, tDrawY + 16, 7, 0, Math.PI * 2);
              ctx.fill();
            }

            // Exhaust Smoke Puff
            if (globalTimer % 8 === 0) {
              combatParticlesRef.current.push({
                x: truckX - tDestW / 2 + 15,
                y: GROUND_Y - 20,
                vx: -1.2 - Math.random() * 0.8,
                vy: -0.6 - Math.random() * 0.5,
                color: Math.random() < 0.5 ? "rgba(100, 116, 139, 0.5)" : "rgba(148, 163, 184, 0.4)",
                size: 3.5 + Math.random() * 2,
                life: 20,
                maxLife: 20,
              });
            }

            // Truck Signboard Badge
            ctx.font = "bold 8px 'Courier New', monospace";
            ctx.fillStyle = "#fef08a";
            ctx.textAlign = "center";
            ctx.fillText("🚛 TRUK SAMPAH DLH • ARMADA 07", truckScreenX, tDrawY - 6);
            ctx.restore();
          }

          // 2. Traditional Scavenger Cart (Gerobak Pemulung at x = 1050)
          const cartScreenX = 1050 - camX;
          if (cartScreenX > -150 && cartScreenX < CANVAS_W + 150) {
            const cDestW = 92;
            const cDestH = 72;
            const cDrawX = cartScreenX - cDestW / 2;
            const cDrawY = GROUND_Y + 16 - cDestH;

            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            ctx.beginPath();
            ctx.ellipse(cartScreenX, GROUND_Y + 14, 40, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(bekasiTruckPropsImg, 45, 280, 281, 216, cDrawX, cDrawY, cDestW, cDestH);
            ctx.restore();
          }

          // 3. Landfill Treasure Mounds (Gundukan Sampah Berharta at x = 1100 and x = 1880)
          [
            { x: 1100, sx: 206, sy: 513, w: 202, h: 124, dw: 85, dh: 55 },
            { x: 1880, sx: 870, sy: 513, w: 185, h: 124, dw: 90, dh: 60 },
          ].forEach((mound) => {
            const mScreenX = mound.x - camX;
            if (mScreenX < -150 || mScreenX > CANVAS_W + 150) return;
            const mDrawX = mScreenX - mound.dw / 2;
            const mDrawY = GROUND_Y + 16 - mound.dh;

            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.beginPath();
            ctx.ellipse(mScreenX, GROUND_Y + 14, mound.dw * 0.45, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(bekasiTruckPropsImg, mound.sx, mound.sy, mound.w, mound.h, mDrawX, mDrawY, mound.dw, mound.dh);

            // Shimmering treasure sparkle Cling! ✨
            if ((globalTimer + mound.x) % 40 < 10) {
              const spX = mDrawX + 25 + ((globalTimer * 7) % (mound.dw - 40));
              const spY = mDrawY + 15 + ((globalTimer * 5) % (mound.dh - 25));
              ctx.fillStyle = "#fef08a";
              ctx.beginPath();
              ctx.arc(spX, spY, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          });

          // 4. Scavenger Landfill Stray Animals (Kucing Garong & Tikus Got)
          // Kucing Garong Belang at x = 1160
          const catScreenX = 1160 - camX;
          if (catScreenX > -80 && catScreenX < CANVAS_W + 80) {
            const catW = 52;
            const catH = 28;
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.beginPath();
            ctx.ellipse(catScreenX, GROUND_Y + 14, 20, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(bekasiTruckPropsImg, 45, 661, 163, 85, catScreenX - catW / 2, GROUND_Y + 16 - catH, catW, catH);
            ctx.restore();
          }

          // Tikus Got Gemuk at x = 2200
          const ratScreenX = 2200 - camX;
          if (ratScreenX > -80 && ratScreenX < CANVAS_W + 80) {
            const ratW = 42;
            const ratH = 22;
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.beginPath();
            ctx.ellipse(ratScreenX, GROUND_Y + 14, 16, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.drawImage(bekasiTruckPropsImg, 715, 661, 164, 85, ratScreenX - ratW / 2, GROUND_Y + 16 - ratH, ratW, ratH);
            ctx.restore();
          }
        }

        // Layer 4.7: Swarm of Tiny Buzzing Flies near Trash Piles
        [750, 1100, 1880].forEach((pileX, pIdx) => {
          const swarmScreenX = pileX - camX;
          if (swarmScreenX < -60 || swarmScreenX > CANVAS_W + 60) return;
          for (let f = 0; f < 6; f++) {
            const flyOffX = Math.sin(globalTimer * 0.16 + f * 1.4 + pIdx) * 26;
            const flyOffY = Math.cos(globalTimer * 0.22 + f * 2.2) * 15;
            ctx.fillStyle = f % 2 === 0 ? "#1e293b" : "#10b981";
            ctx.fillRect(swarmScreenX + flyOffX, GROUND_Y - 32 + flyOffY, 2, 2);
          }
        });

        // Layer 4.8: Scavenger Birds of Bantar Gebang (Flying Crows & Egrets)
        if (bekasiBirdsImg) {
          bekasiBirdsRef.current.forEach((b) => {
            const bScreenX = b.x - camX;
            if (bScreenX < -80 || bScreenX > CANVAS_W + 80) return;

            let row = 0;
            let destW = 46;
            let destH = 46;

            if (b.type === "crow_flying") {
              row = 0;
              destW = 46;
              destH = 46;
            } else if (b.type === "crow_pecking") {
              row = 1;
              destW = 42;
              destH = 42;
            } else if (b.type === "egret_flying") {
              row = 2;
              destW = 54;
              destH = 54;
            } else {
              row = 3;
              destW = 48;
              destH = 48;
            }

            const frameW = 210;
            const frameH = 212;
            const sx = (b.frame % 6) * frameW;
            const sy = row * frameH;

            ctx.save();
            // Facing direction
            if (b.vx < 0) {
              ctx.translate(bScreenX + destW / 2, b.y);
              ctx.scale(-1, 1);
              ctx.drawImage(bekasiBirdsImg, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
            } else {
              ctx.drawImage(bekasiBirdsImg, sx, sy, frameW, frameH, bScreenX - destW / 2, b.y, destW, destH);
            }
            ctx.restore();
          });
        }
      }

      // Layer 5.62: Adif (Sang Koboi Menara) - Perkampungan Zone or Befriended Companion
      if (adifMasterImg && (currentZone === "perkampungan" || adifState.isFriend)) {
        const destW = 104;
        const destH = 138;
        const frameW = 180;
        const frameH = 240;

        if (adifState.onTower) {
          const towerScreenX = 1710 - camX;
          if (adifState.isRappelling) {
            // Draw cowboy rope from tower top to Adif
            ctx.save();
            ctx.strokeStyle = "#92400e";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(towerScreenX - 5, GROUND_Y - 240);
            ctx.lineTo(towerScreenX - 5, adifState.y - 40);
            ctx.stroke();
            ctx.restore();

            // Adif rappelling down on rope (Row 1 of adifCombatImg, 8 frames)
            const rappelFrame = adifState.animFrame % 8;
            const sx = rappelFrame * frameW;
            const sy = 1 * frameH;
            const drawX = towerScreenX - destW / 2 - 5;
            const drawY = adifState.y + 18 - destH * (230 / 240);
            const activeRappelSheet = adifCombatImg || adifMasterImg;
            ctx.drawImage(activeRappelSheet, sx, sy, frameW, frameH, drawX, drawY, destW, destH);
          } else {
            // Adif perched on top of Tower 03 crossarm platform (Row 3, animated 8-frame Tower Idle)
            const towerIdleFrame = Math.floor(globalTimer / 8) % 8;
            const sx = towerIdleFrame * frameW;
            const sy = 3 * frameH;
            const drawX = towerScreenX - destW / 2 + 5;
            const drawY = GROUND_Y - 240 + 18 - destH * (230 / 240);
            ctx.drawImage(adifMasterImg, sx, sy, frameW, frameH, drawX, drawY, destW, destH);
          }
        } else {
          // Adif on Ground
          let activeSheet = adifMasterImg;
          let aRow = 0;
          let aCol = adifState.animFrame % 8;

          if (duelState.inCombat && !duelState.isDefeated) {
            if (adifState.state === "combat") {
              activeSheet = adifCombatImg || adifMasterImg;
              aRow = 0; // Combat 8-frame lasso combo attack
            } else if (adifState.state === "run") {
              activeSheet = adifMasterImg;
              aRow = 2; // Run
            } else if (adifState.state === "walk") {
              activeSheet = adifMasterImg;
              aRow = 1; // Walk
            } else {
              activeSheet = adifCombatImg || adifMasterImg;
              aRow = 2; // Combat windup & ready stance
            }
          } else if (adifState.state === "run") {
            activeSheet = adifMasterImg;
            aRow = 2; // Run
          } else if (adifState.state === "walk") {
            activeSheet = adifMasterImg;
            aRow = 1; // Walk
          } else if (adifState.state === "defeated") {
            activeSheet = adifCombatImg || adifMasterImg;
            aRow = 3; // Friendly stance / defeated
          } else {
            activeSheet = adifMasterImg;
            aRow = 0; // Ground Idle
          }

          const sx = aCol * frameW;
          const sy = aRow * frameH;
          const drawY = adifState.y + 18 - destH * (230 / 240);
          const aScreenX = adifState.x - camX + (adifState.shake > 0 ? (Math.random() - 0.5) * adifState.shake : 0);

          ctx.save();
          // Ground shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
          ctx.beginPath();
          ctx.ellipse(aScreenX, adifState.y + 16, 24, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          if (adifState.hitFlash > 0 && Math.floor(adifState.hitFlash / 2) % 2 === 0) {
            ctx.filter = "brightness(2.2)";
          }

          // Overhead Spinning Lasso Loop (in combat stance)
          if (duelState.inCombat && !duelState.isDefeated && aRow === 0 && activeSheet === adifCombatImg) {
            ctx.save();
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 2.5;
            const lassoPivotX = aScreenX + (adifState.facingLeft ? -12 : 12);
            const lassoPivotY = drawY + 15;
            ctx.beginPath();
            ctx.ellipse(lassoPivotX, lassoPivotY, 20, 7, globalTimer * 0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          if (adifState.facingLeft) {
            ctx.translate(aScreenX, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(activeSheet, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
          } else {
            ctx.drawImage(activeSheet, sx, sy, frameW, frameH, aScreenX - destW / 2, drawY, destW, destH);
          }
          ctx.restore();

          // Lasso Whip Crack Visual Beam / Arc
          if (adifState.lassoActive && adifState.lassoTimer > 0) {
            ctx.save();
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 3;
            const startX = aScreenX + (adifState.facingLeft ? -20 : 20);
            const startY = drawY + 45;
            const endX = adifState.lassoTargetX - camX;
            const endY = adifState.lassoTargetY;
            const midX = (startX + endX) / 2;
            const midY = Math.min(startY, endY) - 35;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(midX, midY, endX, endY);
            ctx.stroke();

            // Star spark tip
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(endX, endY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // In-Combat Mini HP Bar over Adif
          if (duelState.inCombat && !duelState.isDefeated && adifState.hp > 0) {
            const barW = 60;
            const barH = 5;
            const hpRatio = Math.max(0, adifState.hp / adifState.maxHp);
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(aScreenX - barW / 2 - 1, drawY - 14, barW + 2, barH + 2);
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(aScreenX - barW / 2, drawY - 13, barW * hpRatio, barH);
            ctx.font = "bold 8px 'Courier New', monospace";
            ctx.fillStyle = "#fef3c7";
            ctx.textAlign = "center";
            ctx.fillText("ADIF", aScreenX, drawY - 16);
            ctx.restore();
          } else if (adifState.isFriend) {
            ctx.save();
            ctx.font = "bold 9px 'Courier New', monospace";
            ctx.fillStyle = "#fbbf24";
            ctx.textAlign = "center";
            ctx.fillText("ADIF 🤠 REKAN", aScreenX, drawY - 14);
            ctx.restore();
          }
        }
      }

      // Layer 5.63: Hairi (Pemuda Kaos Abu-abu / Super Cyber Hairi)
      if (hairiMasterImg && (currentZone === "perkampungan" || hairiState.isFriend)) {
        const destW = 108;
        const destH = 144;
        const frameW = 180;
        const frameH = 240;

        let activeSheet = hairiMasterImg;
        let hRow = 0;
        let hCol = hairiState.animFrame % 8;

        if (hairiState.phase === 3 && !hairiState.isFriend) {
          // LEVEL 3: CYBER MAGE HAIRI (Floating IT Wizard & Magic Ranged Combat)
          if (hairiState.state === "defeated") {
            activeSheet = hairiV3CombatImg || hairiV3MasterImg || hairiSuperMasterImg || hairiMasterImg;
            hRow = 3; // Descending Sequence (7..0)
            hCol = Math.min(7, hairiState.animFrame);
          } else if (hairiState.state === "hurt") {
            activeSheet = hairiV3CombatImg || hairiV3MasterImg || hairiMasterImg;
            hRow = 2; // Levitation Hurt
          } else if (hairiState.state === "combat") {
            activeSheet = hairiV3CombatImg || hairiV3MasterImg || hairiMasterImg;
            hRow = 0; // Semi-Mage Long-Range Combat (laser beam & rune casting)
          } else if (hairiState.state === "run") {
            activeSheet = hairiV3MasterImg || hairiV3CombatImg || hairiMasterImg;
            hRow = 2; // Super Flying Sprint (horizontal superman dash)
          } else if (hairiState.state === "walk" || hairiState.state === "walk_angry") {
            activeSheet = hairiV3MasterImg || hairiMasterImg;
            hRow = 1; // Cyber Platform Walk (walking atop glowing blue platform tiles)
          } else {
            activeSheet = hairiV3MasterImg || hairiMasterImg;
            hRow = 0; // Levitation Idle (floating in mid-air)
          }
        } else if (hairiState.phase === 2 && !hairiState.isFriend) {
          // LEVEL 2: SUPER HAIRI OVERCLOCK SPRITESHEET (Hanya saat bertarung fase 2)
          if (hairiState.state === "defeated") {
            activeSheet = hairiSuperCombatImg || hairiSuperMasterImg || hairiCombatImg || hairiMasterImg;
            hRow = 3;
            hCol = Math.min(7, hairiState.animFrame);
          } else if (hairiState.state === "hurt") {
            activeSheet = hairiSuperCombatImg || hairiCombatImg || hairiMasterImg;
            hRow = 2; // Hurt
          } else if (hairiState.state === "combat") {
            activeSheet = hairiSuperCombatImg || hairiCombatImg || hairiMasterImg;
            hRow = 0; // Overpowered Tech Blast Combo
          } else if (hairiState.isFriend && hairiState.state === "idle") {
            activeSheet = hairiSuperCombatImg || hairiSuperMasterImg || hairiMasterImg;
            hRow = 3; // Friendly Stance
          } else if (hairiState.state === "run") {
            activeSheet = hairiSuperMasterImg || hairiMasterImg;
            hRow = 2; // Super Sprint & Dash
          } else if (hairiState.state === "walk" || hairiState.state === "walk_angry") {
            activeSheet = hairiSuperMasterImg || hairiMasterImg;
            hRow = 1; // Super Walk with sparks
          } else {
            activeSheet = hairiSuperMasterImg || hairiMasterImg;
            hRow = 0; // Super Idle (Cyber visor & circuit shirt)
          }
        } else {
          // LEVEL 1: NORMAL HAIRI SPRITESHEET
          if (hairiState.state === "defeated") {
            activeSheet = hairiCombatImg || hairiMasterImg;
            hRow = hairiCombatImg ? 2 : 3;
            hCol = Math.min(7, hairiState.animFrame);
          } else if (hairiState.state === "hurt") {
            activeSheet = hairiCombatImg || hairiMasterImg;
            hRow = 1; // Di Serang / Hurt
          } else if (hairiState.state === "combat") {
            activeSheet = hairiCombatImg || hairiMasterImg;
            hRow = 0; // Combat Fury Slash
          } else if (hairiState.isFriend && hairiState.state === "idle") {
            activeSheet = hairiCombatImg || hairiMasterImg;
            hRow = 3; // Friendly Stance
          } else if (hairiState.state === "run") {
            activeSheet = hairiMasterImg;
            hRow = 2; // Run
          } else if (hairiState.state === "walk" || hairiState.state === "walk_angry") {
            activeSheet = hairiMasterImg;
            hRow = 1; // Walk
          } else {
            activeSheet = hairiMasterImg;
            hRow = 0; // Idle
          }
        }

        const sx = hCol * frameW;
        const sy = hRow * frameH;
        const drawY = hairiState.y + 18 - destH * (230 / 240);
        const hScreenX = hairiState.x - camX + (hairiState.shake > 0 ? (Math.random() - 0.5) * hairiState.shake : 0);

        ctx.save();

        // Ground shadow (adapts for mid-air levitation)
        const shadowY = GROUND_Y + 16;
        const shadowRadius = hairiState.phase === 3 ? 18 + Math.sin(hairiState.animTimer * 0.08) * 4 : 24;
        const shadowAlpha = hairiState.phase === 3 ? 0.22 : 0.35;
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.beginPath();
        ctx.ellipse(hScreenX, shadowY, shadowRadius, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        if (hairiState.hitFlash > 0 && Math.floor(hairiState.hitFlash / 2) % 2 === 0) {
          ctx.filter = "brightness(2.2)";
        }

        if (hairiState.facingLeft) {
          ctx.translate(hScreenX, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(activeSheet, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
        } else {
          ctx.drawImage(activeSheet, sx, sy, frameW, frameH, hScreenX - destW / 2, drawY, destW, destH);
        }
        ctx.restore();

        // Companion Tag overhead if befriended
        if (hairiState.isFriend) {
          ctx.save();
          ctx.font = "bold 9px 'Courier New', monospace";
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("HAIRI 🤝 REKAN", hScreenX, drawY - 14);
          ctx.restore();
        }

        // Electric Cyan Hexagonal Shield Force-Field Barrier FX
        if (hairiState.shieldBlockFlash > 0) {
          const shieldBarrierX = hairiState.facingLeft ? hScreenX - 35 : hScreenX + 35;
          const shieldBarrierY = drawY + 58;
          ctx.save();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
          ctx.fillStyle = "rgba(14, 165, 233, 0.28)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          const hexR = 34;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = shieldBarrierX + hexR * Math.cos(angle);
            const hy = shieldBarrierY + hexR * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner hexagon core
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = shieldBarrierX + (hexR * 0.55) * Math.cos(angle);
            const hy = shieldBarrierY + (hexR * 0.55) * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }

        // Shield Bash Shockwave FX
        if (hairiState.bashShockwave && hairiState.bashShockwave.active) {
          const sw = hairiState.bashShockwave;
          const swScreenX = sw.x - camX;
          ctx.save();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          if (sw.dir < 0) {
            ctx.arc(swScreenX + 15, sw.y, 28, Math.PI * 0.6, Math.PI * 1.4);
          } else {
            ctx.arc(swScreenX - 15, sw.y, 28, -Math.PI * 0.4, Math.PI * 0.4);
          }
          ctx.stroke();
          ctx.restore();
        }

        // In-Combat Mini HP Bar over Hairi
        if (duelState.inCombat && !duelState.isDefeated && hairiState.hp > 0) {
          const barW = 60;
          const barH = 5;
          const hpRatio = Math.max(0, hairiState.hp / hairiState.maxHp);
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(hScreenX - barW / 2 - 1, drawY - 14, barW + 2, barH + 2);
          ctx.fillStyle = hairiState.phase === 2 ? "#06b6d4" : (hairiState.isEnraged ? "#ef4444" : "#f87171");
          ctx.fillRect(hScreenX - barW / 2, drawY - 13, barW * hpRatio, barH);
          ctx.font = "bold 8px 'Courier New', monospace";
          ctx.fillStyle = hairiState.phase === 2 ? "#e0f2fe" : "#fef2f2";
          ctx.textAlign = "center";
          const tag = hairiState.phase === 2 ? "⚡ SUPER HAIRI" : (hairiState.isEnraged ? "HAIRI 🔥" : "HAIRI");
          ctx.fillText(tag, hScreenX, drawY - 16);
          ctx.restore();
        }
      }

      // Layer 5.65: Key (Sang Mage Penguasa Sampah Bantar Gebang)
      if (keyMasterImg && (currentZone === "bekasi" || keyState.isFriend)) {
        const destW = 104;
        const destH = 138;
        const frameW = 180;
        const frameH = 240;

        let activeSheet = keyMasterImg;
        let kRow = 0;
        let kCol = keyState.animFrame % 8;

        if (keyCombatState.inCombat && !keyCombatState.isDefeated) {
          if (keyState.hitFlash > 6) {
            activeSheet = keyCombatImg || keyMasterImg;
            kRow = 2; // Hurt Stagger
          } else if (keyState.state === "combat") {
            activeSheet = keyCombatImg || keyMasterImg;
            kRow = 0; // Combat Trash Barrage
          } else if (keyState.state === "run") {
            activeSheet = keyMasterImg;
            kRow = 2; // Run
          } else if (keyState.state === "walk") {
            activeSheet = keyMasterImg;
            kRow = 1; // Walk
          } else {
            activeSheet = keyMasterImg;
            kRow = 0; // Idle
          }
        } else if (keyState.isFriend) {
          if (keyState.state === "run") {
            activeSheet = keyMasterImg;
            kRow = 2;
          } else if (keyState.state === "walk") {
            activeSheet = keyMasterImg;
            kRow = 1;
          } else {
            activeSheet = keyMasterImg;
            kRow = 0;
          }
        } else if (keyCombatState.isDefeated) {
          activeSheet = keyCombatImg || keyMasterImg;
          kRow = 3; // Friendly / Defeated Stance
        } else {
          activeSheet = keyMasterImg;
          kRow = 0;
        }

        const sx = kCol * frameW;
        const sy = kRow * frameH;
        const drawY = keyState.y + 18 - destH * (230 / 240);
        const kScreenX = keyState.x - camX + (keyState.shake > 0 ? (Math.random() - 0.5) * keyState.shake : 0);

        ctx.save();
        // Teleport ghosting aura when teleports
        if (keyState.teleportTimer > 0) {
          ctx.globalAlpha = 0.4 + 0.6 * (1 - keyState.teleportTimer / 16);
          ctx.shadowColor = "#c084fc";
          ctx.shadowBlur = 18;
        }

        // Ground shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.ellipse(kScreenX, keyState.y + 16, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        if (keyState.hitFlash > 0 && Math.floor(keyState.hitFlash / 2) % 2 === 0) {
          ctx.filter = "brightness(2.2)";
        }

        if (keyState.facingLeft) {
          ctx.translate(kScreenX, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(activeSheet, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
        } else {
          ctx.drawImage(activeSheet, sx, sy, frameW, frameH, kScreenX - destW / 2, drawY, destW, destH);
        }
        ctx.restore();

        // Mini HP Bar in Combat
        if (keyCombatState.inCombat && !keyCombatState.isDefeated && keyState.hp > 0) {
          const barW = 64;
          const barH = 5;
          const hpRatio = Math.max(0, keyState.hp / keyState.maxHp);
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(kScreenX - barW / 2 - 1, drawY - 14, barW + 2, barH + 2);
          ctx.fillStyle = "#a855f7";
          ctx.fillRect(kScreenX - barW / 2, drawY - 13, barW * hpRatio, barH);
          ctx.font = "bold 8px 'Courier New', monospace";
          ctx.fillStyle = "#f3e8ff";
          ctx.textAlign = "center";
          ctx.fillText("KEY • MAGE", kScreenX, drawY - 16);
          ctx.restore();
        } else if (keyState.isFriend) {
          ctx.save();
          ctx.font = "bold 9px 'Courier New', monospace";
          ctx.fillStyle = "#c084fc";
          ctx.textAlign = "center";
          ctx.fillText("KEY 💜 SAHABAT BEKASI", kScreenX, drawY - 14);
          ctx.restore();
        }
      }

      // Layer 5.66: Flying Trash Projectiles (Bantar Gebang Projectiles)
      trashProjectilesRef.current.forEach((proj) => {
        const pScreenX = proj.x - camX;
        ctx.save();
        ctx.translate(pScreenX, proj.y);
        ctx.rotate(proj.rot);

        if (proj.type === "bag") {
          // Crumpled black & toxic green garbage bag
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(-4, -6, 8, 4);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(-2, -9, 4, 3);
        } else if (proj.type === "bottle") {
          // Plastic soda bottle with blue cap
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(-4, -9, 8, 16);
          ctx.fillStyle = "#0284c7";
          ctx.fillRect(-3, -12, 6, 3);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(-4, -3, 8, 5); // label
        } else {
          // Cardboard delivery box
          ctx.fillStyle = "#b45309";
          ctx.fillRect(-10, -8, 20, 16);
          ctx.fillStyle = "#d97706";
          ctx.fillRect(-8, -6, 16, 12);
          ctx.fillStyle = "#78350f";
          ctx.fillRect(-10, -1, 20, 2); // tape
        }
        ctx.restore();
      });

      // Layer 5.7: Boss Monster (Batara Siluman Panci Purba) - Losari Zone Only
      if (currentZone === "losari" && monster.isActive && (!monster.isEmerging || monster.isDefeated) && monsterMasterImg) {
        let mRow = 0;
        if (monster.isDefeated || monster.state === "hurt") {
          mRow = 3; // HURT
        } else if (monster.state === "attack") {
          mRow = 2; // ATTACK
        } else if (monster.state === "move") {
          mRow = 1; // MOVE
        } else {
          mRow = 0; // IDLE
        }

        const mCol = monster.animFrame % 8;
        const frameW = 128;
        const frameH = 128;
        const sx = mCol * frameW;
        const sy = mRow * frameH;
        const destW = 120;
        const destH = 120;

        // Ground contact alignment (foot baseline at bot_y = 120px)
        const drawY = monster.y + 18 - destH * (120 / 128);
        const mScreenX = monster.x - camX + (monster.shake > 0 ? (Math.random() - 0.5) * monster.shake : 0);

        ctx.save();
        if (monster.isDefeated) {
          ctx.globalAlpha = Math.max(0, monster.dissolveTimer / 80);
        }

        // Shadow under monster
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(mScreenX, monster.y + 16, 36, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // White flash on hit
        if (monster.hitFlash > 0 && Math.floor(monster.hitFlash / 2) % 2 === 0) {
          ctx.filter = "brightness(2.2) contrast(1.5)";
        }

        if (monster.facingLeft) {
          ctx.translate(mScreenX, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(monsterMasterImg, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
        } else {
          ctx.drawImage(monsterMasterImg, sx, sy, frameW, frameH, mScreenX - destW / 2, drawY, destW, destH);
        }
        ctx.restore();

        // Monster Floating Mini HP Bar
        if (!monster.isDefeated) {
          const miniBarW = 80;
          const miniBarH = 6;
          const hpRatio = Math.max(0, monster.hp / monster.maxHp);
          const barX = mScreenX - miniBarW / 2;
          const barY = drawY - 14;

          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
          ctx.fillRect(barX - 2, barY - 2, miniBarW + 4, miniBarH + 4);
          ctx.strokeStyle = "#9333ea";
          ctx.lineWidth = 1;
          ctx.strokeRect(barX - 2, barY - 2, miniBarW + 4, miniBarH + 4);

          // Health gradient
          const hpGrad = ctx.createLinearGradient(barX, barY, barX + miniBarW, barY);
          hpGrad.addColorStop(0, "#c084fc");
          hpGrad.addColorStop(1, "#7c3aed");
          ctx.fillStyle = hpGrad;
          ctx.fillRect(barX, barY, miniBarW * hpRatio, miniBarH);

          // Name tag
          ctx.font = "bold 9px 'Courier New', monospace";
          ctx.fillStyle = "#f3e8ff";
          ctx.textAlign = "center";
          ctx.fillText("SILUMAN PANCI", mScreenX, barY - 5);
          ctx.restore();
        }
      }

      // Layer 6: Draw Characters with 24-Frame Walk Engine & Combat Mode
      const renderCharacter = (
        charId: CharacterId,
        pos: { x: number; y: number; vx: number; facingLeft: boolean; pose: CharacterPose; walkTimer: number; walk24Frame: number; animTimer: number },
        isCurrentActive: boolean
      ) => {
        const isMoving = Math.abs(pos.vx) > 0.1;
        const screenX = pos.x - camX;
        const screenY = pos.y - 100;
        const isAttacking = isCurrentActive && attackStateRef.current.isAttacking;

        // Special emote check (dialogue talk, inspect, happy) -> use 10-pose sheet
        const isSpecialEmote = pos.pose === "talk" || pos.pose === "inspect" || pos.pose === "happy";

        // 0. Dedicated Combat Mode Animation
        if (isAttacking && charId === "jihan" && jihanCombatImg) {
          const col = Math.min(7, Math.max(0, attackStateRef.current.frame));
          const frameW = 240;
          const frameH = 240;
          const sx = col * 240;
          const sy = 0;
          const destW = 135;
          const destH = 135;

          // Align foot precisely to pos.y + 18 (ground level)
          const footYOffset = destH * (229 / 240);
          const drawY = pos.y + 18 - footYOffset;

          ctx.save();
          if (pos.facingLeft) {
            ctx.translate(screenX, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(jihanCombatImg, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
          } else {
            ctx.drawImage(jihanCombatImg, sx, sy, frameW, frameH, screenX - destW / 2, drawY, destW, destH);
          }
          ctx.restore();
        } else if (isAttacking && charId === "dani" && daniCombatImg) {
          const col = Math.min(7, Math.max(0, attackStateRef.current.frame));
          const frameW = 240;
          const frameH = 240;
          const sx = col * 240;
          const sy = 0;
          const destW = 135;
          const destH = 135;

          // Align foot precisely to pos.y + 18 (ground level)
          // foot_y in 240 frame is 225px
          const footYOffset = destH * (225 / 240);
          const drawY = pos.y + 18 - footYOffset;

          ctx.save();
          if (pos.facingLeft) {
            ctx.translate(screenX, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(daniCombatImg, sx, sy, frameW, frameH, -destW / 2, drawY, destW, destH);
          } else {
            ctx.drawImage(daniCombatImg, sx, sy, frameW, frameH, screenX - destW / 2, drawY, destW, destH);
          }
          ctx.restore();
        } else if (isAttacking && charId === "dani") {
          // Fallback if combat image still loading
          const masterImg = daniMasterImg || daniImg;
          if (masterImg) {
            const col = (attackStateRef.current.frame * 2) % 8;
            const row = 2; // Leap / strike row
            const frameW = 210;
            const frameH = 212;
            const sx = col * frameW;
            const sy = row * frameH;
            const destW = 86;
            const destH = 118;

            ctx.save();
            if (pos.facingLeft) {
              ctx.translate(screenX + destW / 2, screenY);
              ctx.scale(-1, 1);
              ctx.drawImage(masterImg, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
            } else {
              ctx.drawImage(masterImg, sx, sy, frameW, frameH, screenX - destW / 2, screenY, destW, destH);
            }
            ctx.restore();
          }
        } else {
          // 1. Unified Master 8-frame sheet rendering for Jihan & Dani (IDLE, WALK, RUN)
          const masterImg = charId === "dani" ? daniMasterImg : jihanMasterImg;
          if (masterImg && !isSpecialEmote) {
            let col = 0;
            let row = 0;
            if (isMoving) {
              if (isRun) {
                row = 2; // RUN (8 frames)
                col = Math.floor(pos.walkTimer / 3) % 8;
              } else {
                row = 1; // WALK (8 frames)
                col = Math.floor(pos.walkTimer / 6) % 8;
              }
            } else {
              row = 0; // IDLE (8 frames breathing & blink)
              col = Math.floor(pos.animTimer / 8) % 8;
            }

            const frameW = 210;
            const frameH = 212;
            const sx = col * frameW;
            const sy = row * frameH;
            const destW = 86;
            const destH = 118;

            ctx.save();
            if (pos.facingLeft) {
              ctx.translate(screenX + destW / 2, screenY);
              ctx.scale(-1, 1);
              ctx.drawImage(masterImg, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
            } else {
              ctx.drawImage(masterImg, sx, sy, frameW, frameH, screenX - destW / 2, screenY, destW, destH);
            }
            ctx.restore();
          } else {
            // Standard 10-pose sheet rendering
            const sheet = charId === "jihan" ? jihanImg : daniImg;
            if (!sheet) return;

            const frameW = 275.2;
            const frameH = 384;
            let col = 0;
            let row = 0;

            if (isMoving) {
              // Smooth 3-frame stepping cadence for 10-pose fallback
              const stepPhase = Math.floor(pos.walkTimer / 6) % 3;
              col = stepPhase === 0 ? 2 : stepPhase === 1 ? 3 : 4;
              row = 0;
            } else {
              switch (pos.pose) {
                case "idle_stand":
                  col = 0;
                  row = 0;
                  break;
                case "idle_look":
                  col = 1;
                  row = 0;
                  break;
                case "run_1":
                  col = 0;
                  row = 1;
                  break;
                case "run_2":
                  col = 1;
                  row = 1;
                  break;
                case "inspect":
                  col = 2;
                  row = 1;
                  break;
                case "talk":
                  col = 3;
                  row = 1;
                  break;
                case "happy":
                  col = 4;
                  row = 1;
                  break;
              }
            }

            const sx = col * frameW;
            const sy = row * frameH;
            const destW = 86;
            const destH = 118;

            ctx.save();
            if (pos.facingLeft) {
              ctx.translate(screenX + destW / 2, screenY);
              ctx.scale(-1, 1);
              ctx.drawImage(sheet, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
            } else {
              ctx.drawImage(sheet, sx, sy, frameW, frameH, screenX - destW / 2, screenY, destW, destH);
            }
            ctx.restore();
          }
        }

        // Active Player Glow Indicator
        if (isCurrentActive) {
          ctx.save();
          ctx.fillStyle = charId === "jihan" ? "rgba(251, 191, 36, 0.9)" : "rgba(244, 63, 94, 0.9)";
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - 14);
          ctx.lineTo(screenX - 6, screenY - 24);
          ctx.lineTo(screenX + 6, screenY - 24);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      };

      // Draw companion first, then active on top
      if (isJihanActive) {
        renderCharacter("dani", daniPosRef.current, false);
        renderCharacter("jihan", jihanPosRef.current, true);
      } else {
        renderCharacter("jihan", jihanPosRef.current, false);
        renderCharacter("dani", daniPosRef.current, true);
      }

      // Layer 6.5: Combat Hit Spark Particles
      for (let i = combatParticlesRef.current.length - 1; i >= 0; i--) {
        const p = combatParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // subtle gravity
        p.vx *= 0.94;
        p.life--;

        if (p.life <= 0) {
          combatParticlesRef.current.splice(i, 1);
          continue;
        }

        const pScreenX = p.x - camX;
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(pScreenX - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
      }

      // Layer 6.6: Cyber Magic Projectiles (Hairi Level 3 Mage Projectile Beams)
      cyberProjectilesRef.current.forEach((proj) => {
        const projScreenX = proj.x - camX;
        const projDir = proj.facingLeft ? -1 : 1;
        ctx.save();
        // Cyan & Purple Digital Rune Glow
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;

        // Outer Cyber Laser Beam (32x12 rounded block with pixel spikes)
        ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
        ctx.fillRect(projScreenX - 16, proj.y - 6, 32, 12);

        // Inner Core Electric Violet
        ctx.fillStyle = "rgba(192, 132, 252, 0.95)";
        ctx.fillRect(projScreenX - 12, proj.y - 4, 24, 8);

        // Core White Hot Pixel Ray
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(projScreenX - 8, proj.y - 2, 16, 4);

        // Pixel arrow tip
        ctx.fillStyle = "#67e8f9";
        ctx.fillRect(projScreenX + projDir * 16, proj.y - 3, projDir * 6, 6);

        ctx.restore();
      });

      // Layer 6.7: Floating Damage Popups
      for (let i = damageNumbersRef.current.length - 1; i >= 0; i--) {
        const d = damageNumbersRef.current[i];
        d.y += d.vy;
        d.vy *= 0.95;
        d.life--;

        if (d.life <= 0) {
          damageNumbersRef.current.splice(i, 1);
          continue;
        }

        const dScreenX = d.x - camX;
        const alpha = Math.min(1, d.life / 10);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = d.isCrit ? "bold 16px 'Courier New', monospace" : "bold 13px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.strokeText(d.text, dScreenX, d.y);
        ctx.fillStyle = d.color;
        ctx.fillText(d.text, dScreenX, d.y);
        ctx.restore();
      }

      // Layer 7: Interactive Balloon Prompts
      const currentInteractiveObjects = getInteractiveObjects(
        currentZone,
        monsterRef.current.isDefeated,
        duelState.isDefeated,
        hairiState.isFriend
      );

      let nearestPromptObj: InteractiveObject | null = null;
      for (const obj of currentInteractiveObjects) {
        const dist = Math.abs(active.x - obj.x);
        if (dist < 75) {
          nearestPromptObj = obj;
          break;
        }
      }

      if (nearestPromptObj && !isDialogueOpen) {
        const isMonsterFighting =
          nearestPromptObj.id === "panci_misterius" &&
          monsterRef.current.isActive &&
          !monsterRef.current.isDefeated;
        const isDuelFighting =
          nearestPromptObj.id === "adif_tower" &&
          duelState.inCombat &&
          !duelState.isDefeated;

        if (!isMonsterFighting && !isDuelFighting) {
          const promptX = nearestPromptObj.x - camX;
          const promptY = GROUND_Y - 120;

          ctx.save();
          ctx.fillStyle = "rgba(9, 11, 16, 0.9)";
          ctx.strokeStyle = "rgba(245, 158, 11, 0.8)";
          ctx.lineWidth = 2;
          let promptText = nearestPromptObj.prompt;
          if (nearestPromptObj.id === "panci_misterius" && monsterRef.current.isDefeated) {
            promptText = "Panci Purba (Siluman Telah Tunduk)";
          } else if (nearestPromptObj.id === "adif_tower") {
            if (adifState.isRappelling) {
              promptText = "Adif Sedang Meluncur Turun...";
            } else if (duelState.isDefeated) {
              promptText = hairiState.isFriend ? "Mengobrol dengan Sahabat Adif & Hairi" : "Ajak Hairi Menjadi Sahabat & Rekan Bertarung";
            }
          }
          const text = `[E] ${promptText}`;
          ctx.font = "bold 13px 'Courier New', monospace";
          const textWidth = ctx.measureText(text).width;
          const padX = 14;
          const padY = 7;
          const bubbleW = textWidth + padX * 2;
          const bubbleH = 28;

          // Rounded bubble
          ctx.beginPath();
          ctx.roundRect(promptX - bubbleW / 2, promptY - bubbleH / 2, bubbleW, bubbleH, 12);
          ctx.fill();
          ctx.stroke();

          // Small indicator triangle
          ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
          ctx.beginPath();
          ctx.moveTo(promptX - 5, promptY + bubbleH / 2);
          ctx.lineTo(promptX + 5, promptY + bubbleH / 2);
          ctx.lineTo(promptX, promptY + bubbleH / 2 + 6);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#fef3c7";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(text, promptX, promptY);
          ctx.restore();

          // Handle trigger
          if (isInteract) {
            keysRef.current.interact = false;
            sound.playInteract();

            if (nearestPromptObj.id === "portal_to_kampung") {
              sound.playPortal();
              screenShakeRef.current = 10;
              teleportFlashRef.current = 24;
              zoneRef.current = "perkampungan";
              setCurrentZone("perkampungan");
              active.x = 280;
              active.vx = 0;
              companion.x = 210;
              companion.vx = 0;
              if (hairiState.isFriend) {
                hairiState.x = 240;
                hairiState.vx = 0;
                hairiState.facingLeft = false;
              }
              if (adifState.isFriend) {
                adifState.x = 200;
                adifState.vx = 0;
                adifState.facingLeft = false;
                adifState.y = GROUND_Y;
              }
              if (keyState.isFriend) {
                keyState.x = 160;
                keyState.vx = 0;
                keyState.facingLeft = false;
                keyState.y = GROUND_Y;
              }
              cameraXRef.current = 0;
              zoneBannerRef.current = {
                title: "PERKAMPUNGAN MENARA SINYAL",
                subtitle: "JARINGAN KABEL TRANSMISI & DUA PENDEKAR",
                timer: 180,
              };
              damageNumbersRef.current.push({
                x: 280,
                y: GROUND_Y - 100,
                text: "🌀 MENEMBUS DIMENSI MENARA!",
                color: "#38bdf8",
                life: 50,
                maxLife: 50,
                vy: -1.2,
                isCrit: true,
              });
              return;
            }

            if (nearestPromptObj.id === "portal_to_losari") {
              sound.playPortal();
              screenShakeRef.current = 10;
              teleportFlashRef.current = 24;
              zoneRef.current = "losari";
              setCurrentZone("losari");
              active.x = 2200;
              active.vx = 0;
              companion.x = 2130;
              companion.vx = 0;
              if (hairiState.isFriend) {
                hairiState.x = 2160;
                hairiState.vx = 0;
                hairiState.facingLeft = true;
              }
              if (adifState.isFriend) {
                adifState.x = 2100;
                adifState.vx = 0;
                adifState.facingLeft = true;
                adifState.y = GROUND_Y;
              }
              if (keyState.isFriend) {
                keyState.x = 2050;
                keyState.vx = 0;
                keyState.facingLeft = true;
                keyState.y = GROUND_Y;
              }
              cameraXRef.current = 1500;
              zoneBannerRef.current = {
                title: "PANTAI LOSARI, MAKASSAR",
                subtitle: "ANJUNGAN SENJA & PESISIR SELAT MAKASSAR",
                timer: 180,
              };
              damageNumbersRef.current.push({
                x: 2200,
                y: GROUND_Y - 100,
                text: "🌀 KEMBALI KE DERMAGA LOSARI!",
                color: "#facc15",
                life: 50,
                maxLife: 50,
                vy: -1.2,
                isCrit: true,
              });
              return;
            }

            if (nearestPromptObj.id === "portal_stasiun_menara") {
              sound.playWhoosh();
              onTriggerDialogue("portal_stasiun_menara_1");
              return;
            }

            if (nearestPromptObj.id === "portal_to_kampung") {
              sound.playPortal();
              screenShakeRef.current = 8;
              teleportFlashRef.current = 20;
              zoneRef.current = "perkampungan";
              setCurrentZone("perkampungan");
              active.x = 2700;
              active.vx = 0;
              companion.x = 2650;
              companion.vx = 0;
              if (hairiState.isFriend) {
                hairiState.x = 2600;
                hairiState.vx = 0;
                hairiState.facingLeft = true;
              }
              if (adifState.isFriend) {
                adifState.x = 2550;
                adifState.vx = 0;
                adifState.facingLeft = true;
                adifState.y = GROUND_Y;
              }
              if (keyState.isFriend) {
                keyState.x = 2500;
                keyState.vx = 0;
                keyState.facingLeft = true;
                keyState.y = GROUND_Y;
              }
              cameraXRef.current = Math.max(0, WORLD_W - CANVAS_W);
              zoneBannerRef.current = {
                title: "PERKAMPUNGAN MENARA SINYAL",
                subtitle: "LEMBAH MENARA PEMANCAR & KABEL FIBER OPTIK",
                timer: 180,
              };
              return;
            }

            if (nearestPromptObj.id === "krl_menara_to_bekasi") {
              sound.playTrainChime();
              onTriggerDialogue("krl_station_1");
              return;
            }

            if (nearestPromptObj.id === "krl_bekasi_to_menara") {
              sound.playTrainChime();
              onTriggerDialogue("krl_bekasi_to_menara_1");
              return;
            }

            if (nearestPromptObj.id === "exit_stasiun_bekasi") {
              sound.playInteract();
              onTriggerDialogue("exit_stasiun_bekasi_1");
              return;
            }

            if (nearestPromptObj.id === "masuk_stasiun_bekasi") {
              sound.playInteract();
              onTriggerDialogue("enter_stasiun_bekasi_1");
              return;
            }

            if (nearestPromptObj.id === "cat_oyen") {
              sound.playPurr();
            }
            if (nearestPromptObj.id === "adif_tower") {
              if (adifState.onTower && !adifState.isRappelling) {
                adifState.isRappelling = true;
                adifState.y = GROUND_Y - 225;
                onTriggerDialogue("adif_tower_1");
                return;
              }
            }
            if (nearestPromptObj.id === "panci_misterius") {
              if (!monsterRef.current.isActive) {
                monsterRef.current.isActive = true;
                monsterRef.current.isEmerging = true;
                monsterRef.current.emergeFrame = 0;
                monsterRef.current.emergeTimer = 0;
                screenShakeRef.current = 12;
                sound.playStomp();
              }
            }
            let targetDialogue = nearestPromptObj.dialogueId;
            if (nearestPromptObj.id === "panci_misterius" && monsterRef.current.isDefeated) {
              targetDialogue = "panci_defeat";
            } else if (nearestPromptObj.id === "adif_tower" && duelState.isDefeated) {
              targetDialogue = "adif_hairi_defeat_2";
              hairiState.isFriend = true;
              hairiState.state = "idle";
              damageNumbersRef.current.push({
                x: hairiState.x,
                y: hairiState.y - 85,
                text: "🤝 HAIRI BERGABUNG SEBAGAI REKAN!",
                color: "#38bdf8",
                life: 60,
                maxLife: 60,
                vy: -1.5,
                isCrit: true,
              });
            }
            if (targetDialogue) {
              onTriggerDialogue(targetDialogue);
            }
          }
        }
      }

      // Layer 7.5: Combo Counter HUD (Top Right Screen)
      if (comboRef.current.count > 0) {
        ctx.save();
        const combo = comboRef.current.count;
        const comboText = `⚔️ ${combo} HIT COMBO!`;
        const comboX = CANVAS_W - 130;
        const comboY = 40;

        // Pulse scale
        const scale = 1 + Math.sin(globalTimer * 0.4) * 0.06;
        ctx.translate(comboX, comboY);
        ctx.scale(scale, scale);

        // Pill background
        ctx.fillStyle = "rgba(10, 15, 26, 0.88)";
        ctx.strokeStyle = combo >= 10 ? "#ef4444" : combo >= 5 ? "#f59e0b" : "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-65, -16, 130, 32, 16);
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.font = "bold 12px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = combo >= 10 ? "#f87171" : combo >= 5 ? "#fbbf24" : "#7dd3fc";
        ctx.fillText(comboText, 0, 0);
        ctx.restore();
      }

      // Layer 7.6: Grand Boss Monster HP Bar (Top Center HUD) - Losari Zone Only
      const boss = monsterRef.current;
      if (currentZone === "losari" && boss.isActive && !boss.isDefeated) {
        ctx.save();
        const barW = 340;
        const barH = 14;
        const centerX = CANVAS_W / 2;
        const barY = 24;
        const hpRatio = Math.max(0, boss.hp / boss.maxHp);

        // Frame / Banner Background
        ctx.fillStyle = "rgba(10, 12, 22, 0.94)";
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - barW / 2 - 14, barY - 16, barW + 28, barH + 32, 10);
        ctx.fill();
        ctx.stroke();

        // Monster Title & Icon
        ctx.font = "bold 11px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fde047";
        ctx.fillText("👹 BATARA SILUMAN PANCI PURBA 👹", centerX, barY - 4);

        // Sub-caption
        ctx.font = "italic 8px 'Courier New', monospace";
        ctx.fillStyle = "#c084fc";
        ctx.fillText("★ ANCIENT MYTHICAL CAULDRON BEAST ★", centerX, barY + 22);

        // Health Bar Track
        ctx.fillStyle = "rgba(30, 27, 46, 0.95)";
        ctx.fillRect(centerX - barW / 2, barY, barW, barH);

        // Health Bar Fill
        const barGrad = ctx.createLinearGradient(centerX - barW / 2, barY, centerX + barW / 2, barY);
        barGrad.addColorStop(0, "#dc2626");
        barGrad.addColorStop(0.5, "#9333ea");
        barGrad.addColorStop(1, "#c084fc");
        ctx.fillStyle = barGrad;
        ctx.fillRect(centerX - barW / 2, barY, barW * hpRatio, barH);

        // Golden divider notches
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        for (let seg = 1; seg < 5; seg++) {
          ctx.fillRect(centerX - barW / 2 + (barW * seg) / 5, barY, 1.5, barH);
        }

        // HP Numbers Overlay
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${boss.hp} / ${boss.maxHp} HP`, centerX, barY + barH / 2);

        ctx.restore();
      }

      // Layer 7.65: Dual Boss Bar HUD (Adif & Hairi) - Perkampungan Zone Only
      if (currentZone === "perkampungan" && duelState.inCombat && !duelState.isDefeated) {
        ctx.save();
        const barW = 340;
        const barH = 14;
        const centerX = CANVAS_W / 2;
        const barY = 24;

        // Banner Frame
        ctx.fillStyle = "rgba(10, 12, 22, 0.94)";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - barW / 2 - 14, barY - 16, barW + 28, barH + 34, 10);
        ctx.fill();
        ctx.stroke();

        // Title
        ctx.font = "bold 11px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fef08a";
        ctx.fillText("⚔️ DUEL PERSAHABATAN: ADIF & HAIRI ⚔️", centerX, barY - 4);

        // Half width for each
        const halfW = (barW - 10) / 2;

        // Adif (Cowboy) HP Bar - Left
        const adifRatio = Math.max(0, adifState.hp / adifState.maxHp);
        ctx.fillStyle = "rgba(30, 27, 46, 0.95)";
        ctx.fillRect(centerX - barW / 2, barY, halfW, barH);
        const adifGrad = ctx.createLinearGradient(centerX - barW / 2, barY, centerX - barW / 2 + halfW, barY);
        adifGrad.addColorStop(0, "#d97706");
        adifGrad.addColorStop(1, "#fbbf24");
        ctx.fillStyle = adifGrad;
        ctx.fillRect(centerX - barW / 2, barY, halfW * adifRatio, barH);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`🤠 ADIF ${adifState.hp}/300`, centerX - barW / 2 + halfW / 2, barY + barH / 2 + 3);

        // Hairi (XL Shield & Boxing Glove) HP Bar - Right
        const hairiRatio = Math.max(0, hairiState.hp / hairiState.maxHp);
        const rightX = centerX + 5;
        ctx.fillStyle = "rgba(30, 27, 46, 0.95)";
        ctx.fillRect(rightX, barY, halfW, barH);
        const hairiGrad = ctx.createLinearGradient(rightX, barY, rightX + halfW, barY);
        if (hairiState.phase === 3) {
          hairiGrad.addColorStop(0, "#7c3aed");
          hairiGrad.addColorStop(0.5, "#a855f7");
          hairiGrad.addColorStop(1, "#06b6d4");
        } else if (hairiState.phase === 2) {
          hairiGrad.addColorStop(0, "#0891b2");
          hairiGrad.addColorStop(0.5, "#06b6d4");
          hairiGrad.addColorStop(1, "#38bdf8");
        } else if (hairiState.isEnraged) {
          hairiGrad.addColorStop(0, "#ef4444");
          hairiGrad.addColorStop(0.5, "#f97316");
          hairiGrad.addColorStop(1, "#fbbf24");
        } else {
          hairiGrad.addColorStop(0, "#dc2626");
          hairiGrad.addColorStop(1, "#3b82f6");
        }
        ctx.fillStyle = hairiGrad;
        ctx.fillRect(rightX, barY, halfW * hairiRatio, barH);
        ctx.font = "bold 8px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        const hairiLabel = hairiState.phase === 3
          ? `🔮 CYBER MAGE (LV.3) ${hairiState.hp}/${hairiState.maxHp}`
          : hairiState.phase === 2
          ? `⚡ SUPER HAIRI ${hairiState.hp}/${hairiState.maxHp}`
          : hairiState.isEnraged
          ? `🔥 HAIRI ${hairiState.hp}/${hairiState.maxHp}`
          : `🛡️ HAIRI (LV.1) ${hairiState.hp}/${hairiState.maxHp}`;
        ctx.fillText(hairiLabel, rightX + halfW / 2, barY + barH / 2 + 3);

        ctx.restore();
      }

      // Layer 7.66: Key Boss Bar HUD (Mage Penguasa Sampah Bantar Gebang) - Bekasi Zone Only
      if (currentZone === "bekasi" && keyCombatState.inCombat && !keyCombatState.isDefeated) {
        ctx.save();
        const barW = 340;
        const barH = 16;
        const centerX = CANVAS_W / 2;
        const barY = 24;

        // Banner Frame
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - barW / 2 - 14, barY - 16, barW + 28, barH + 34, 10);
        ctx.fill();
        ctx.stroke();

        // Title
        ctx.font = "bold 11px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#e9d5ff";
        ctx.fillText("⚔️ PERTARUNGAN PENDEKAR BEKASI: KEY • MAGE BANTAR GEBANG ⚔️", centerX, barY - 4);

        // Key HP Bar
        const keyRatio = Math.max(0, keyState.hp / keyState.maxHp);
        ctx.fillStyle = "rgba(30, 27, 46, 0.95)";
        ctx.fillRect(centerX - barW / 2, barY, barW, barH);

        const keyGrad = ctx.createLinearGradient(centerX - barW / 2, barY, centerX + barW / 2, barY);
        keyGrad.addColorStop(0, "#9333ea");
        keyGrad.addColorStop(0.5, "#a855f7");
        keyGrad.addColorStop(1, "#10b981");
        ctx.fillStyle = keyGrad;
        ctx.fillRect(centerX - barW / 2, barY, barW * keyRatio, barH);

        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`💜 KEY • MAGE BANTAR GEBANG [LV.BOSS OP] ${keyState.hp}/${keyState.maxHp} HP`, centerX, barY + barH / 2 + 3);
        ctx.restore();
      }

      // Layer 8: Retro Vignette & Atmosphere
      const vignette = ctx.createRadialGradient(
        CANVAS_W / 2,
        CANVAS_H / 2,
        CANVAS_W * 0.3,
        CANVAS_W / 2,
        CANVAS_H / 2,
        CANVAS_W * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(5, 7, 12, 0.35)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Layer 8.2: Zone Notification Banner
      if (zoneBannerRef.current.timer > 0) {
        zoneBannerRef.current.timer--;
        const b = zoneBannerRef.current;
        const alpha = Math.min(1, b.timer / 30);
        ctx.save();
        ctx.globalAlpha = alpha;
        const bW = 490;
        const bH = 46;
        const bX = CANVAS_W / 2;
        const bY = 75;
        ctx.fillStyle = "rgba(10, 14, 26, 0.94)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bX - bW / 2, bY - bH / 2, bW, bH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = "#fde047";
        ctx.textAlign = "center";
        ctx.fillText(`📍 ${b.title}`, bX, bY - 4);

        ctx.font = "10px 'Courier New', monospace";
        ctx.fillStyle = "#93c5fd";
        ctx.fillText(b.subtitle, bX, bY + 14);
        ctx.restore();
      }

      // Layer 8.3: Teleport Dimensional Flash Effect
      if (teleportFlashRef.current > 0) {
        teleportFlashRef.current--;
        const flashAlpha = teleportFlashRef.current / 24;
        ctx.save();
        ctx.fillStyle = `rgba(192, 132, 252, ${flashAlpha * 0.75})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }

      // Restore camera screen shake
      ctx.restore();

      // Layer 9: Scanlines (if enabled, fixed CRT screen overlay)
      if (scanlines) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        for (let y = 0; y < CANVAS_H; y += 3) {
          ctx.fillRect(0, y, CANVAS_W, 1.5);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeCharacter, isDialogueOpen, onSwitchCharacter, onTriggerDialogue, scanlines, virtualInput]);

  return (
    <div className="relative w-full aspect-[16/9] max-h-[70vh] flex items-center justify-center overflow-hidden bg-[#05070c]">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full h-full object-contain image-rendering-pixelated cursor-pointer"
        onClick={() => {
          if (!isDialogueOpen) {
            keysRef.current.interact = true;
            setTimeout(() => (keysRef.current.interact = false), 150);
          }
        }}
      />
    </div>
  );
};
