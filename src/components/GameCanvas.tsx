"use client";

import React, { useEffect, useRef } from "react";
import { sound } from "@/lib/sound";
import { CharacterId, CharacterPose, InteractiveObject, CloudLayer, FlyingBird } from "@/lib/gameTypes";

const CANVAS_W = 960;
const CANVAS_H = 540;
const WORLD_W = 2400;
const GROUND_Y = 430;

interface GameCanvasProps {
  activeCharacter: CharacterId;
  onSwitchCharacter: () => void;
  onTriggerDialogue: (dialogueId: string) => void;
  isDialogueOpen: boolean;
  scanlines: boolean;
  virtualInput: { left: boolean; right: boolean; run: boolean; interact: boolean };
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  activeCharacter,
  onSwitchCharacter,
  onTriggerDialogue,
  isDialogueOpen,
  scanlines,
  virtualInput,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard input state
  const keysRef = useRef<{ left: boolean; right: boolean; run: boolean; interact: boolean }>({
    left: false,
    right: false,
    run: false,
    interact: false,
  });

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
    jihanWalk24: HTMLImageElement | null;
    gerobak24: HTMLImageElement | null;
    daniSheet: HTMLImageElement | null;
    daniMaster: HTMLImageElement | null;
  }>({
    bg: null,
    props: null,
    micro: null,
    jihanSheet: null,
    jihanWalk24: null,
    gerobak24: null,
    daniSheet: null,
    daniMaster: null,
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
      loadImage("/jihan_walk_24frames_transparent.png"),
      loadImage("/gerobak_animated_24frames_transparent.png"),
      loadImage("/dani_spritesheet_10poses_transparent.png"),
      loadImage("/dani_master_sheet_8frames.png"),
    ]).then(([bg, props, micro, jihanSheet, jihanWalk24, gerobak24, daniSheet, daniMaster]) => {
      imagesRef.current = { bg, props, micro, jihanSheet, jihanWalk24, gerobak24, daniSheet, daniMaster };
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
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onSwitchCharacter]);

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

      // 2. Active & Companion Reference
      const isJihanActive = activeCharacter === "jihan";
      const active = isJihanActive ? jihanPosRef.current : daniPosRef.current;
      const companion = isJihanActive ? daniPosRef.current : jihanPosRef.current;

      // 3. Update Active Character Physics
      if (!isDialogueOpen) {
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
        active.x = Math.max(100, Math.min(WORLD_W - 120, active.x));

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
        jihanWalk24: jihanWalkImg,
        gerobak24: gerobakImg,
        daniSheet: daniImg,
        daniMaster: daniMasterImg,
      } = imagesRef.current;

      // Layer 1: Background Panorama with Parallax
      if (bgImg) {
        const bgParallaxX = -camX * 0.45;
        ctx.drawImage(bgImg, bgParallaxX, 0, WORLD_W * 0.75, CANVAS_H);
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

        // Utility Pole
        const poleX = 1420 - camX;
        ctx.drawImage(propsImg, 20, 300, 280, 450, poleX, GROUND_Y - 220, 120, 230);

        // Coconut Palms
        const palm1X = 100 - camX;
        ctx.drawImage(propsImg, 1020, 150, 335, 600, palm1X, GROUND_Y - 260, 140, 270);
        const palm2X = 2050 - camX;
        ctx.drawImage(propsImg, 1020, 150, 335, 600, palm2X, GROUND_Y - 260, 140, 270);

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

      // Layer 6: Draw Characters with 24-Frame Walk Engine
      const renderCharacter = (
        charId: CharacterId,
        pos: { x: number; y: number; vx: number; facingLeft: boolean; pose: CharacterPose; walkTimer: number; walk24Frame: number; animTimer: number },
        isCurrentActive: boolean
      ) => {
        const isMoving = Math.abs(pos.vx) > 0.1;
        const screenX = pos.x - camX;
        const screenY = pos.y - 100;

        // Special emote check (dialogue talk, inspect, happy) -> use 10-pose sheet
        const isSpecialEmote = pos.pose === "talk" || pos.pose === "inspect" || pos.pose === "happy";

        // 1. Dani rendering with master 8-frame sheet (IDLE, WALK, RUN)
        if (charId === "dani" && daniMasterImg && !isSpecialEmote) {
          let col = 0;
          let row = 0;
          if (isMoving) {
            if (isRun) {
              row = 2; // RUN
              col = Math.floor(pos.walkTimer / 3) % 8;
            } else {
              row = 1; // WALK
              col = Math.floor(pos.walkTimer / 6) % 8;
            }
          } else {
            row = 0; // IDLE breathing & blink cycle
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
            ctx.drawImage(daniMasterImg, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
          } else {
            ctx.drawImage(daniMasterImg, sx, sy, frameW, frameH, screenX - destW / 2, screenY, destW, destH);
          }
          ctx.restore();
        } else if (charId === "jihan" && jihanWalkImg && !isSpecialEmote) {
          // Jihan rendering with 24-frame walk sheet
          let col = 0;
          let row = 0;
          if (isMoving) {
            const frame24 = pos.walk24Frame % 24;
            col = frame24 % 6;
            row = Math.floor(frame24 / 6);
          } else {
            col = 0;
            row = 0;
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
            ctx.drawImage(jihanWalkImg, sx, sy, frameW, frameH, -destW / 2, 0, destW, destH);
          } else {
            ctx.drawImage(jihanWalkImg, sx, sy, frameW, frameH, screenX - destW / 2, screenY, destW, destH);
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
        const promptX = nearestPromptObj.x - camX;
        const promptY = GROUND_Y - 120;

        ctx.save();
        ctx.fillStyle = "rgba(9, 11, 16, 0.9)";
        ctx.strokeStyle = "rgba(245, 158, 11, 0.8)";
        ctx.lineWidth = 2;
        const text = `[E] ${nearestPromptObj.prompt}`;
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
          onTriggerDialogue(nearestPromptObj.dialogueId);
        }
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

      // Layer 9: Scanlines (if enabled)
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
