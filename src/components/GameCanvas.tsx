"use client";

import React, { useEffect, useRef } from "react";
import { sound } from "@/lib/sound";
import { CharacterId, CharacterPose, InteractiveObject, CloudLayer, FlyingBird } from "@/lib/gameTypes";

const CANVAS_W = 960;
const CANVAS_H = 540;
const WORLD_W = 3000;
const GROUND_Y = 430;

interface GameCanvasProps {
  activeCharacter: CharacterId;
  onSwitchCharacter: () => void;
  onTriggerDialogue: (dialogueId: string) => void;
  isDialogueOpen: boolean;
  currentDialogueId?: string | null;
  scanlines: boolean;
  virtualInput: { left: boolean; right: boolean; run: boolean; interact: boolean; attack: boolean };
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  activeCharacter,
  onSwitchCharacter,
  onTriggerDialogue,
  isDialogueOpen,
  currentDialogueId,
  scanlines,
  virtualInput,
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
  });

  // Adif (Brown Cowboy on Tower) State
  const adifRef = useRef<{
    onTower: boolean;
    isRappelling: boolean;
    x: number;
    y: number;
    vx: number;
    facingLeft: boolean;
    state: "climb" | "rappel" | "idle" | "run" | "combat" | "defeated";
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
  }>({
    onTower: true,
    isRappelling: false,
    x: 2700,
    y: GROUND_Y - 240,
    vx: 0,
    facingLeft: true,
    state: "climb",
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
  });

  // Hairi (Angry Gray Shirt Guy with Red Face) State
  const hairiRef = useRef<{
    x: number;
    y: number;
    vx: number;
    facingLeft: boolean;
    state: "walk_angry" | "idle_angry" | "combat" | "hurt" | "defeated";
    animFrame: number;
    animTimer: number;
    hp: number;
    maxHp: number;
    hitFlash: number;
    shake: number;
    attackCooldown: number;
    isAttacking: boolean;
    isShieldBlocking: boolean;
    shieldBlockFlash: number;
    isEnraged: boolean;
    enragedTriggered: boolean;
    bashShockwave: { active: boolean; x: number; y: number; dir: number; timer: number } | null;
  }>({
    x: 2620,
    y: GROUND_Y,
    vx: -1.0,
    facingLeft: true,
    state: "walk_angry",
    animFrame: 0,
    animTimer: 0,
    hp: 300,
    maxHp: 300,
    hitFlash: 0,
    shake: 0,
    attackCooldown: 45,
    isAttacking: false,
    isShieldBlocking: false,
    shieldBlockFlash: 0,
    isEnraged: false,
    enragedTriggered: false,
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

  // Interactive Objects
  const interactiveObjects: InteractiveObject[] = [
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
      id: "adif_tower",
      type: "pier_edge",
      x: 2700,
      y: GROUND_Y - 140,
      width: 120,
      height: 180,
      prompt: "Panggil Adif di Atas Tower Listrik",
      interacted: false,
      dialogueId: "adif_tower_1",
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
      prompt: "Buka Tutup Panci Misterius",
      interacted: false,
      dialogueId: "panci_1",
    },
  ];

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
    ]).then(([bg, props, micro, jihanSheet, jihanMaster, jihanCombat, gerobak24, daniSheet, daniMaster, daniCombat, panciProp, cauldronEmergence, monsterMaster, towerListrik, adifMaster, adifCombat, hairiMaster, hairiCombat]) => {
      imagesRef.current = { bg, props, micro, jihanSheet, jihanMaster, jihanCombat, gerobak24, daniSheet, daniMaster, daniCombat, panciProp, cauldronEmergence, monsterMaster, towerListrik, adifMaster, adifCombat, hairiMaster, hairiCombat };
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
    if (!currentDialogueId && pendingBattleRef.current) {
      pendingBattleRef.current = false;
      battleAdifHairiRef.current.inCombat = true;
      adifRef.current.state = "combat";
      hairiRef.current.state = "combat";
      sound.playHitImpact();
      screenShakeRef.current = 8;
    }
  }, [currentDialogueId]);

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
              const baseDmg = isCrit ? Math.floor(85 + Math.random() * 45) : Math.floor(40 + Math.random() * 28);
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
                const baseDmg = isCrit ? Math.floor(75 + Math.random() * 35) : Math.floor(35 + Math.random() * 25);
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
                const baseDmg = isCrit ? Math.floor(80 + Math.random() * 40) : Math.floor(40 + Math.random() * 25);
                comboRef.current.count++;
                comboRef.current.timer = 120;

                // XL Shield Block Stance Check
                const isHairiFacingPlayer = hairiBoss.facingLeft ? active.x <= hairiBoss.x : active.x >= hairiBoss.x;
                const isShieldStance = hairiBoss.state === "combat" && (hairiBoss.animFrame <= 2 || hairiBoss.animFrame === 7);

                if (isHairiFacingPlayer && isShieldStance) {
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
              }
            }

            // Check if both Adif and Hairi defeated
            if (adifBoss.hp <= 0 && hairiBoss.hp <= 0 && !duel.isDefeated) {
              duel.isDefeated = true;
              duel.inCombat = false;
              adifBoss.state = "defeated";
              hairiBoss.state = "defeated";
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
                adifState.attackCooldown = 75;
              }
            }
          } else if (dist < 75 && adifState.attackCooldown <= 0) {
            // Close-Range Knuckle Rush Combo
            adifState.state = "combat";
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
                adifState.attackCooldown = 65;
              }
            }
          } else if (dist > 180 && dist < 650) {
            adifState.state = "run";
            adifState.vx = adifState.facingLeft ? -1.6 : 1.6;
            adifState.x += adifState.vx;
            if (adifState.animTimer % 4 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
          } else {
            adifState.state = "idle";
            if (adifState.animTimer % 6 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
          }

          adifState.x = Math.max(2200, Math.min(2950, adifState.x));
        } else {
          // Calm idle
          adifState.state = "idle";
          adifState.vx = 0;
          if (adifState.animTimer % 7 === 0) adifState.animFrame = (adifState.animFrame + 1) % 8;
        }
      }

      // Hairi AI, Rage Mode, Shield & Flurry logic
      hairiState.animTimer++;
      if (hairiState.hitFlash > 0) hairiState.hitFlash--;
      if (hairiState.shake > 0) hairiState.shake *= 0.85;
      if (hairiState.attackCooldown > 0) hairiState.attackCooldown--;
      if (hairiState.shieldBlockFlash > 0) hairiState.shieldBlockFlash--;

      // Rage Mode Activation at HP <= 150
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

      // Boiling steam puffs from angry face / rage aura
      const steamInterval = hairiState.isEnraged ? 8 : 24;
      if (hairiState.animTimer % steamInterval === 0) {
        combatParticlesRef.current.push({
          x: hairiState.x + (Math.random() - 0.5) * 14,
          y: GROUND_Y - 95,
          vx: (Math.random() - 0.5) * 0.8,
          vy: hairiState.isEnraged ? -1.8 : -1.2,
          color: hairiState.isEnraged ? "#fca5a5" : "#fecdd3",
          size: hairiState.isEnraged ? 4.5 : 3.5,
          life: 24,
          maxLife: 24,
        });
      }

      // Shockwave forward propagation & hit detection
      if (hairiState.bashShockwave && hairiState.bashShockwave.active) {
        const sw = hairiState.bashShockwave;
        sw.x += sw.dir * 5.8;
        sw.timer--;

        // Shockwave trail particles
        if (sw.timer % 3 === 0) {
          combatParticlesRef.current.push({
            x: sw.x,
            y: GROUND_Y + 10,
            vx: -sw.dir * 1.5,
            vy: -0.8,
            color: "#38bdf8",
            size: 3,
            life: 14,
            maxLife: 14,
          });
        }

        if (Math.abs(sw.x - active.x) < 35) {
          // Shockwave hits player!
          sound.playHitImpact();
          screenShakeRef.current = 8;
          active.vx = sw.dir * 5.2;
          active.x += active.vx;
          damageNumbersRef.current.push({
            x: active.x,
            y: active.y - 80,
            text: "🌊 SHIELD BASH!",
            color: "#38bdf8",
            life: 32,
            maxLife: 32,
            vy: -1.6,
            isCrit: true,
          });
          sw.active = false;
        }

        if (sw.timer <= 0) sw.active = false;
      }

      if (duelState.inCombat && !duelState.isDefeated) {
        hairiState.facingLeft = active.x < hairiState.x;
        const dist = Math.abs(active.x - hairiState.x);

        if (hairiState.state === "hurt") {
          if (hairiState.animTimer > 14) {
            hairiState.state = "combat";
            hairiState.animTimer = 0;
          }
        } else if (dist >= 60 && dist <= 145 && hairiState.attackCooldown <= 0) {
          // Shield Bash Charge with Shockwave release
          hairiState.state = "combat";
          hairiState.vx = (hairiState.facingLeft ? -3.0 : 3.0) * hairiSpeedMult;
          hairiState.x += hairiState.vx;

          if (hairiState.animTimer % 4 === 0) {
            hairiState.animFrame++;
            if (hairiState.animFrame === 6) {
              sound.playStomp();
              screenShakeRef.current = 7;
              hairiState.bashShockwave = {
                active: true,
                x: hairiState.x + (hairiState.facingLeft ? -22 : 22),
                y: GROUND_Y - 20,
                dir: hairiState.facingLeft ? -1 : 1,
                timer: 24,
              };
            }
            if (hairiState.animFrame >= 8) {
              hairiState.animFrame = 0;
              hairiState.attackCooldown = Math.floor(65 * hairiCdMult);
            }
          }
        } else if (dist < 60 && hairiState.attackCooldown <= 0) {
          // Devastating Red Boxing Glove 1-2 Hook
          hairiState.state = "combat";
          if (hairiState.animTimer % 4 === 0) {
            hairiState.animFrame++;
            if (hairiState.animFrame === 4) {
              sound.playHitImpact();
              screenShakeRef.current = 7;
              active.vx = (hairiState.facingLeft ? -4.8 : 4.8) * hairiSpeedMult;
              active.x += active.vx;

              damageNumbersRef.current.push({
                x: active.x,
                y: active.y - 75,
                text: "🥊 RED KNOCKOUT!",
                color: "#dc2626",
                life: 32,
                maxLife: 32,
                vy: -1.6,
                isCrit: true,
              });

              for (let p = 0; p < 14; p++) {
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
            }
            if (hairiState.animFrame >= 8) {
              hairiState.animFrame = 0;
              hairiState.attackCooldown = Math.floor(50 * hairiCdMult);
            }
          }
        } else if (dist > 145 && dist < 650) {
          // Approach in defensive shield stance
          hairiState.state = "combat";
          hairiState.vx = (hairiState.facingLeft ? -1.4 : 1.4) * hairiSpeedMult;
          hairiState.x += hairiState.vx;
          if (hairiState.animTimer % 4 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
        } else {
          hairiState.state = "combat";
          if (hairiState.animTimer % 5 === 0) hairiState.animFrame = (hairiState.animFrame + 1) % 8;
        }

        hairiState.x = Math.max(2200, Math.min(2950, hairiState.x));
      } else if (!duelState.isDefeated) {
        // Pacing back and forth angrily with red face at Far End Arena (x = 2520 to 2840)
        hairiState.state = "walk_angry";
        hairiState.x += hairiState.vx;
        if (hairiState.x > 2840) {
          hairiState.vx = -1.1;
          hairiState.facingLeft = true;
        } else if (hairiState.x < 2520) {
          hairiState.vx = 1.1;
          hairiState.facingLeft = false;
        }
        if (hairiState.animTimer % 4 === 0) {
          hairiState.animFrame = (hairiState.animFrame + 1) % 8;
        }
      } else {
        // Defeated / cooled down
        hairiState.state = "defeated";
        hairiState.vx = 0;
        hairiState.animFrame = 7;
      }

      // 3. Update Active Character Physics
      if (!isDialogueOpen && !attack.isAttacking) {
        const speed = isRun ? 4.8 : 2.6;
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
          const compSpeed = Math.min(Math.abs(compDiff) * 0.08, isRun ? 4.6 : 2.5);
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

      // Update clouds
      cloudsRef.current.forEach((c) => {
        c.x += c.speed;
        if (c.x > WORLD_W + 200) c.x = -300;
      });

      // 6. Camera Follow
      const targetCamX = active.x - CANVAS_W / 2;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.1;
      cameraXRef.current = Math.max(0, Math.min(WORLD_W - CANVAS_W, cameraXRef.current));
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

        // High Voltage Transmission Tower ("Tower Listrik") at Far End Arena (x = 2700)
        const towerX = 2700 - camX;
        if (towerListrikImg) {
          const tW = 165;
          const tH = 285;
          ctx.drawImage(towerListrikImg, towerX - tW / 2, GROUND_Y + 16 - tH, tW, tH);
        }

        // Coconut Palms along Pantai Losari
        const palm1X = 100 - camX;
        ctx.drawImage(propsImg, 1020, 150, 335, 600, palm1X, GROUND_Y - 260, 140, 270);
        const palm2X = 2050 - camX;
        ctx.drawImage(propsImg, 1020, 150, 335, 600, palm2X, GROUND_Y - 260, 140, 270);
        const palm3X = 2920 - camX;
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
        // 24 frames arranged in 6 cols x 4 rows with stabilized integer 210x212 grid
        const gFrame = Math.floor(globalTimer / 3) % 24;
        const gCol = gFrame % 6;
        const gRow = Math.floor(gFrame / 6);
        const gFrameW = 210;
        const gFrameH = 212;
        const gSx = gCol * gFrameW;
        const gSy = gRow * gFrameH;
        ctx.drawImage(gerobakImg, gSx, gSy, gFrameW, gFrameH, gerobakX, GROUND_Y - 138, 225, 150);

        // Subtle warm glow halo around the lantern
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

        // Wobble physics on hit
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
      const panciObj = interactiveObjects.find((o) => o.id === "panci_misterius");
      if (panciObj) {
        const panciScreenX = panciObj.x - camX;
        const panciScreenY = panciObj.y;

        if (monster.isActive && monster.isEmerging && cauldronEmergenceImg) {
          // Play 6-frame emergence animation
          const eFrame = Math.min(5, Math.max(0, monster.emergeFrame));
          const frameW = 200;
          const frameH = 200;
          const sx = eFrame * frameW;
          const sy = 0;
          const destW = 140;
          const destH = 140;
          const drawY = panciScreenY - 65;

          ctx.save();
          // Violet shockwave halo
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
          // Resting ancient iron pot with purple simmering steam
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
      }

      // Layer 5.62: Adif (Sang Koboi Menara)
      if (adifMasterImg) {
        const destW = 86;
        const destH = 126;
        const frameW = 150;
        const frameH = 224;

        if (adifState.onTower) {
          const towerScreenX = 2700 - camX;
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

            // Adif rappelling down on rope (Row 3)
            const sx = (adifState.animFrame % 8) * frameW;
            const sy = 3 * frameH;
            const drawX = towerScreenX - destW / 2 - 5;
            const drawY = adifState.y - destH * (219 / 224);
            ctx.drawImage(adifMasterImg, sx, sy, frameW, frameH, drawX, drawY, destW, destH);
          } else {
            // Adif perched on top of Tower Listrik platform (lookout observation animation)
            const lookCol = Math.floor(globalTimer / 36) % 3 === 2 ? 1 : 0;
            const drawX = towerScreenX - destW / 2 + 5;
            const drawY = GROUND_Y - 248;
            ctx.drawImage(adifMasterImg, lookCol * frameW, 3 * frameH, frameW, frameH, drawX, drawY, destW, destH);
          }
        } else {
          // Adif on Ground
          let aRow = 0;
          let aCol = adifState.animFrame % 8;
          if (duelState.inCombat && !duelState.isDefeated) {
            aRow = 2; // Combat with lasso & punch
          } else if (adifState.state === "run") {
            aRow = 1; // Run
          } else if (adifState.state === "defeated") {
            aRow = 3; // Friendly salute & talk
            aCol = 7; // Friendly waving salute pose
            adifState.facingLeft = active.x < adifState.x;
          } else {
            aRow = 0; // Idle (no weapons, natural foot weight shifting)
          }

          const sx = aCol * frameW;
          const sy = aRow * frameH;
          const drawY = adifState.y + 18 - destH * (219 / 224);
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

          // Overhead Spinning Lasso Loop (Frames 0-3 in Combat)
          if (duelState.inCombat && !duelState.isDefeated && aRow === 2 && aCol <= 3) {
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

          const isAdifFighting = duelState.inCombat && !duelState.isDefeated;
          const adifSpriteImg = isAdifFighting && adifCombatImg ? adifCombatImg : adifMasterImg;
          const adifSampleSy = isAdifFighting && adifCombatImg ? 0 : sy;

          if (adifState.facingLeft) {
            ctx.translate(aScreenX, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(adifSpriteImg, sx, adifSampleSy, frameW, frameH, -destW / 2, drawY, destW, destH);
          } else {
            ctx.drawImage(adifSpriteImg, sx, adifSampleSy, frameW, frameH, aScreenX - destW / 2, drawY, destW, destH);
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
          }
        }
      }

      // Layer 5.63: Hairi (Pemuda Kaos Abu-abu Marah)
      if (hairiMasterImg) {
        const destW = 92;
        const destH = 118;
        const frameW = 172;
        const frameH = 192;

        let hRow = 0;
        let hCol = hairiState.animFrame % 8;
        if (duelState.inCombat && !duelState.isDefeated) {
          hRow = 2; // Combat mode with Blue XL Shield + Red Boxing Glove!
        } else if (hairiState.state === "walk_angry") {
          hRow = 1; // Angry stomping walk with red face (no weapons)
        } else if (hairiState.state === "defeated") {
          hRow = 3; // Cool down, peaceful face, ngobrol talk gestures!
          hCol = Math.floor(globalTimer / 10) % 8;
          hairiState.facingLeft = active.x < hairiState.x;
        } else {
          hRow = 0; // Idle angry with red face & clenched fists (no weapons)
        }

        const sx = hCol * frameW;
        const sy = hRow * frameH;
        const drawY = hairiState.y + 18 - destH * (190 / 192);
        const hScreenX = hairiState.x - camX + (hairiState.shake > 0 ? (Math.random() - 0.5) * hairiState.shake : 0);

        ctx.save();

        // Enraged Flaming Red Aura
        if (hairiState.isEnraged && !duelState.isDefeated) {
          const auraPulse = 0.4 + Math.sin(globalTimer * 0.2) * 0.2;
          const aura = ctx.createRadialGradient(hScreenX, drawY + 60, 10, hScreenX, drawY + 60, 68);
          aura.addColorStop(0, `rgba(239, 68, 68, ${auraPulse * 0.8})`);
          aura.addColorStop(0.6, `rgba(249, 115, 22, ${auraPulse * 0.4})`);
          aura.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(hScreenX, drawY + 60, 68, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ground shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.ellipse(hScreenX, hairiState.y + 16, 24, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        if (hairiState.hitFlash > 0 && Math.floor(hairiState.hitFlash / 2) % 2 === 0) {
          ctx.filter = "brightness(2.2)";
        }

        const isHairiFighting = duelState.inCombat && !duelState.isDefeated;
        const hairiSpriteImg = isHairiFighting && hairiCombatImg ? hairiCombatImg : hairiMasterImg;
        const hairiSampleSy = isHairiFighting && hairiCombatImg ? 0 : sy;

        if (hairiState.facingLeft) {
          ctx.translate(hScreenX, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(hairiSpriteImg, sx, hairiSampleSy, frameW, frameH, -destW / 2, drawY, destW, destH);
        } else {
          ctx.drawImage(hairiSpriteImg, sx, hairiSampleSy, frameW, frameH, hScreenX - destW / 2, drawY, destW, destH);
        }
        ctx.restore();

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
          ctx.fillStyle = hairiState.isEnraged ? "#ef4444" : "#f87171";
          ctx.fillRect(hScreenX - barW / 2, drawY - 13, barW * hpRatio, barH);
          ctx.font = "bold 8px 'Courier New', monospace";
          ctx.fillStyle = "#fef2f2";
          ctx.textAlign = "center";
          ctx.fillText(hairiState.isEnraged ? "HAIRI 🔥" : "HAIRI", hScreenX, drawY - 16);
          ctx.restore();
        }
      }

      // Layer 5.7: Boss Monster (Batara Siluman Panci Purba)
      if (monster.isActive && (!monster.isEmerging || monster.isDefeated) && monsterMasterImg) {
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
      let nearestPromptObj: InteractiveObject | null = null;
      for (const obj of interactiveObjects) {
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
              promptText = "Mengobrol dengan Adif & Hairi";
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
              targetDialogue = "adif_hairi_chat_main";
            }
            onTriggerDialogue(targetDialogue);
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

      // Layer 7.6: Grand Boss Monster HP Bar (Top Center HUD)
      const boss = monsterRef.current;
      if (boss.isActive && !boss.isDefeated) {
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

      // Layer 7.65: Dual Boss Bar HUD (Adif & Hairi)
      if (duelState.inCombat && !duelState.isDefeated) {
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
        if (hairiState.isEnraged) {
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
        const hairiLabel = hairiState.isEnraged ? `🔥 HAIRI ${hairiState.hp}/300` : `🛡️ HAIRI ${hairiState.hp}/300`;
        ctx.fillText(hairiLabel, rightX + halfW / 2, barY + barH / 2 + 3);

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
