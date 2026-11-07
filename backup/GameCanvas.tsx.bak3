"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { sound } from "@/lib/sound";
import { drawDaniMatrix, drawMalaysianItem, DANI_POSES, MALAYSIAN_ITEMS, DANI_PALETTE } from "@/lib/daniSprites";
import { drawPixelMatrix, SPRITES, PALETTE } from "@/lib/sprites";
import { Player, Enemy, Platform, Particle, LevelData, DaniPoseState } from "@/lib/gameTypes";
import { LEVELS } from "@/lib/levels";

const VIEW_W = 640;
const VIEW_H = 360;
const GRAVITY = 0.52;
const JUMP_FORCE = -10.6;
const MOVE_SPEED = 3.6;

interface GameCanvasProps {
  currentLevelIndex: number;
  onLevelComplete: (nextLevel: number, currentScore: number) => void;
  onGameOver: (finalScore: number) => void;
  onStatsUpdate: (stats: {
    health: number;
    karipapCount: number;
    tehTarikCount: number;
    score: number;
    levelName: string;
    fps: number;
    currentPose: DaniPoseState;
  }) => void;
  isPaused: boolean;
  scanlines: boolean;
  virtualInput: { left: boolean; right: boolean; jump: boolean };
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevelIndex,
  onLevelComplete,
  onGameOver,
  onStatsUpdate,
  isPaused,
  scanlines,
  virtualInput,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[currentLevelIndex] || LEVELS[0])));

  const playerRef = useRef<Player>({
    x: 60,
    y: 240,
    width: 28,
    height: 36,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facingLeft: false,
    health: 3,
    maxHealth: 3,
    karipapCount: 0,
    tehTarikCount: 0,
    score: 0,
    pose: "idle_1",
    poseTimer: 0,
    invincibleTimer: 0,
  });

  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const lastFpsCheckRef = useRef<number>(performance.now());
  const framesThisSecRef = useRef<number>(0);

  const initLevel = useCallback((lvlIndex: number) => {
    const rawLevel = LEVELS[lvlIndex] || LEVELS[0];
    const cloned = JSON.parse(JSON.stringify(rawLevel));
    levelRef.current = cloned;

    playerRef.current.x = cloned.spawn.x;
    playerRef.current.y = cloned.spawn.y;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.isGrounded = false;
    playerRef.current.invincibleTimer = 0;
    playerRef.current.pose = "idle_1";
    cameraXRef.current = 0;
    particlesRef.current = [];
  }, []);

  useEffect(() => {
    initLevel(currentLevelIndex);
  }, [currentLevelIndex, initLevel]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = true;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        keysRef.current.jump = true;
        const p = playerRef.current;
        if (p.isGrounded) {
          p.vy = JUMP_FORCE;
          p.isGrounded = false;
          p.pose = "jump_takeoff";
          sound.playJump();
          createDustParticles(p.x + p.width / 2, p.y + p.height, "#ffffff", 6);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = false;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keysRef.current.jump = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Sync virtual touch input
  useEffect(() => {
    const p = playerRef.current;
    if (virtualInput.jump && p.isGrounded) {
      p.vy = JUMP_FORCE;
      p.isGrounded = false;
      p.pose = "jump_takeoff";
      sound.playJump();
      createDustParticles(p.x + p.width / 2, p.y + p.height, "#ffffff", 6);
    }
  }, [virtualInput.jump]);

  const createDustParticles = (x: number, y: number, color: string, count: number = 6) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2.5,
        color,
        size: Math.random() * 3 + 2,
        life: 0,
        maxLife: Math.floor(Math.random() * 15 + 10),
      });
    }
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const gameLoop = (timestamp: number) => {
      animId = requestAnimationFrame(gameLoop);

      framesThisSecRef.current++;
      if (timestamp - lastFpsCheckRef.current >= 1000) {
        fpsRef.current = framesThisSecRef.current;
        framesThisSecRef.current = 0;
        lastFpsCheckRef.current = timestamp;
      }

      if (!isPaused) {
        frameCountRef.current++;
        updatePhysics();
      }

      renderScene(ctx);

      if (frameCountRef.current % 10 === 0) {
        const p = playerRef.current;
        const lvl = levelRef.current;
        onStatsUpdate({
          health: p.health,
          karipapCount: p.karipapCount,
          tehTarikCount: p.tehTarikCount,
          score: p.score,
          levelName: lvl.name,
          fps: fpsRef.current,
          currentPose: p.pose,
        });
      }
    };

    const updatePhysics = () => {
      const p = playerRef.current;
      const lvl = levelRef.current;

      if (p.invincibleTimer > 0) p.invincibleTimer--;

      const moveLeft = keysRef.current.left || virtualInput.left;
      const moveRight = keysRef.current.right || virtualInput.right;

      if (moveLeft && !moveRight) {
        p.vx = -MOVE_SPEED;
        p.facingLeft = true;
      } else if (moveRight && !moveLeft) {
        p.vx = MOVE_SPEED;
        p.facingLeft = false;
      } else {
        p.vx *= 0.65;
        if (Math.abs(p.vx) < 0.2) p.vx = 0;
      }

      // Vertical physics & Gravity
      p.vy += GRAVITY;
      if (p.vy > 9) p.vy = 9;

      p.x += p.vx;
      if (p.x < 0) p.x = 0;
      if (p.x + p.width > lvl.worldWidth) p.x = lvl.worldWidth - p.width;

      p.y += p.vy;
      const wasGrounded = p.isGrounded;
      p.isGrounded = false;

      // Platform Collisions (AABB)
      lvl.platforms.forEach((plat: Platform) => {
        if (plat.type === "bamboo" || plat.type === "floating") {
          const prevY = p.y - p.vy;
          if (
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            prevY + p.height <= plat.y + 4 &&
            p.y + p.height >= plat.y &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
          }
        } else {
          if (
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            p.y + p.height >= plat.y &&
            p.y < plat.y + plat.height
          ) {
            if (p.vy > 0 && p.y + p.height - p.vy <= plat.y + 10) {
              p.y = plat.y - p.height;
              p.vy = 0;
              p.isGrounded = true;
            }
          }
        }
      });

      // Just landed impact trigger
      if (!wasGrounded && p.isGrounded) {
        p.pose = "land_impact";
        p.poseTimer = 6;
        createDustParticles(p.x + p.width / 2, p.y + p.height, "#ffffff", 5);
      }

      // Compute 12-Pose State Machine
      if (p.poseTimer > 0) {
        p.poseTimer--;
      } else {
        if (!p.isGrounded) {
          if (p.vy < -3) {
            p.pose = "jump_takeoff";
          } else if (p.vy >= -3 && p.vy <= 2) {
            p.pose = "jump_apex";
          } else {
            p.pose = "jump_fall";
          }
        } else {
          if (Math.abs(p.vx) > 0.3) {
            // 4-step fluid run cycle
            const runCycle = Math.floor(frameCountRef.current / 5) % 4;
            if (runCycle === 0) p.pose = "run_1";
            else if (runCycle === 1) p.pose = "run_2";
            else if (runCycle === 2) p.pose = "run_3";
            else p.pose = "run_4";
          } else {
            // Idle breathing / blinking
            const idleCycle = Math.floor(frameCountRef.current / 30) % 6;
            p.pose = idleCycle === 5 ? "idle_2" : "idle_1";
          }
        }
      }

      // Abyss check
      if (p.y > VIEW_H + 50) {
        p.health -= 1;
        sound.playHurt();
        screenShakeRef.current = 15;
        if (p.health <= 0) {
          onGameOver(p.score);
        } else {
          p.x = lvl.spawn.x;
          p.y = lvl.spawn.y;
          p.vx = 0;
          p.vy = 0;
          p.invincibleTimer = 90;
        }
      }

      // Collectibles Collision (Karipap, Teh Tarik, Bunga Raya)
      lvl.items.forEach((item) => {
        if (!item.collected) {
          if (
            p.x + p.width > item.x &&
            p.x < item.x + item.width &&
            p.y + p.height > item.y &&
            p.y < item.y + item.height
          ) {
            item.collected = true;
            if (item.type === "karipap") {
              p.karipapCount += 1;
              p.score += 150;
              createDustParticles(item.x + 8, item.y + 8, DANI_PALETTE.KP_GOLD, 8);
            } else if (item.type === "tehTarik") {
              p.tehTarikCount += 1;
              p.score += 200;
              createDustParticles(item.x + 8, item.y + 8, DANI_PALETTE.TT_TEA, 8);
            } else if (item.type === "bungaRaya") {
              p.score += 300;
              if (p.health < p.maxHealth) p.health += 1; // Heal with hibiscus!
              createDustParticles(item.x + 8, item.y + 8, DANI_PALETTE.HIB_RED, 10);
            }
            sound.playCoin();
          }
        }
      });

      // Enemy Patrol & Stomp Collision
      lvl.enemies.forEach((enemy: Enemy) => {
        if (!enemy.isAlive) {
          if (enemy.squishTimer > 0) enemy.squishTimer--;
          return;
        }

        enemy.x += enemy.vx;
        if (enemy.x > enemy.startX + enemy.distance || enemy.x < enemy.startX) {
          enemy.vx = -enemy.vx;
        }

        if (
          p.x + p.width > enemy.x &&
          p.x < enemy.x + enemy.width &&
          p.y + p.height > enemy.y &&
          p.y < enemy.y + enemy.height
        ) {
          if (p.vy > 0 && p.y + p.height <= enemy.y + 14) {
            // Stomp maneuver!
            enemy.isAlive = false;
            enemy.squishTimer = 30;
            p.vy = -7.5;
            p.pose = "stomp";
            p.poseTimer = 10;
            p.score += 250;
            sound.playStomp();
            createDustParticles(enemy.x + enemy.width / 2, enemy.y + 10, PALETTE.green, 12);
          } else if (p.invincibleTimer === 0) {
            p.health -= 1;
            p.invincibleTimer = 70;
            p.vy = -5;
            p.vx = p.facingLeft ? 4 : -4;
            screenShakeRef.current = 14;
            sound.playHurt();
            createDustParticles(p.x + p.width / 2, p.y + p.height / 2, PALETTE.red, 10);

            if (p.health <= 0) {
              onGameOver(p.score);
            }
          }
        }
      });

      // Exit Gateway Check (Wau Bulan / Gapura Portal)
      const ex = lvl.exit;
      if (
        p.x + p.width > ex.x &&
        p.x < ex.x + ex.width &&
        p.y + p.height > ex.y &&
        p.y < ex.y + ex.height
      ) {
        p.pose = "victory";
        sound.playWin();
        p.score += 1000;
        onLevelComplete(currentLevelIndex + 1, p.score);
      }

      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.life < pt.maxLife);

      const targetCamX = p.x - VIEW_W / 2 + p.width / 2;
      const clampedTarget = Math.max(0, Math.min(targetCamX, lvl.worldWidth - VIEW_W));
      cameraXRef.current += (clampedTarget - cameraXRef.current) * 0.1;

      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.3) screenShakeRef.current = 0;
      }
    };

    const renderScene = (c: CanvasRenderingContext2D) => {
      const lvl = levelRef.current;
      const camX = cameraXRef.current;
      const shakeOffset = (Math.random() - 0.5) * screenShakeRef.current;

      c.save();
      c.translate(shakeOffset, shakeOffset);

      // 1. Sky Gradient
      const skyGrad = c.createLinearGradient(0, 0, 0, VIEW_H);
      skyGrad.addColorStop(0, lvl.skyGradient[0]);
      skyGrad.addColorStop(1, lvl.skyGradient[1]);
      c.fillStyle = skyGrad;
      c.fillRect(0, 0, VIEW_W, VIEW_H);

      // 2. Parallax Far Background: Malaysian Landscapes
      c.save();
      if (lvl.theme === "kampung") {
        // Distant sea horizon & stars
        c.fillStyle = "rgba(255, 255, 255, 0.3)";
        for (let s = 0; s < 30; s++) {
          const starX = (s * 53 - camX * 0.04) % VIEW_W;
          const normX = starX < 0 ? starX + VIEW_W : starX;
          c.fillRect(normX, (s * 27) % 140, 1.5, 1.5);
        }
        // Distant gentle hills & coconut palm silhouettes
        c.fillStyle = "#0c2822";
        c.beginPath();
        c.moveTo(0, VIEW_H);
        for (let h = 0; h <= VIEW_W; h += 80) {
          const worldH = h + camX * 0.15;
          const hillY = 140 + Math.sin(worldH * 0.008) * 35;
          c.lineTo(h, VIEW_H - hillY);
        }
        c.lineTo(VIEW_W, VIEW_H);
        c.closePath();
        c.fill();
      } else if (lvl.theme === "klcc") {
        // Kuala Lumpur Night Skyline with Petronas Twin Towers silhouette!
        c.fillStyle = "#120a24";
        for (let b = -50; b < lvl.worldWidth; b += 140) {
          const screenB = b - camX * 0.2;
          if (screenB > -80 && screenB < VIEW_W + 80) {
            c.fillRect(screenB, 120, 60, VIEW_H - 120);
          }
        }
        // Petronas Twin Towers Silhouette
        const klccX = 400 - camX * 0.12;
        if (klccX > -100 && klccX < VIEW_W + 100) {
          c.fillStyle = "#1a0f35";
          // Tower 1 & 2
          c.fillRect(klccX, 70, 24, 180);
          c.fillRect(klccX + 34, 70, 24, 180);
          // Spire
          c.fillRect(klccX + 11, 40, 2, 30);
          c.fillRect(klccX + 45, 40, 2, 30);
          // Skybridge
          c.fillRect(klccX + 24, 130, 10, 8);
          // Windows glow
          c.fillStyle = "rgba(0, 240, 255, 0.4)";
          c.fillRect(klccX + 8, 80, 8, 4);
          c.fillRect(klccX + 42, 80, 8, 4);
        }
      } else if (lvl.theme === "kinabalu") {
        // Mount Kinabalu Jagged Granite Peak Silhouette
        c.fillStyle = "#260c38";
        c.beginPath();
        c.moveTo(0, VIEW_H);
        for (let k = 0; k <= VIEW_W; k += 40) {
          const worldK = k + camX * 0.12;
          const peakY = 170 + Math.abs(Math.sin(worldK * 0.015)) * 90;
          c.lineTo(k, VIEW_H - peakY);
        }
        c.lineTo(VIEW_W, VIEW_H);
        c.closePath();
        c.fill();
      }
      c.restore();

      // Camera Transform for World Objects
      c.save();
      c.translate(-Math.floor(camX), 0);

      // 3. Render Platforms
      lvl.platforms.forEach((plat) => {
        if (plat.type === "ground") {
          // Village ground / grass path
          c.fillStyle = "#0c3325";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);
          c.fillStyle = "#10b981"; // Fresh green grass edge
          c.fillRect(plat.x, plat.y, plat.width, 4);
        } else if (plat.type === "bamboo") {
          // Traditional bamboo / wooden stilt bridge
          c.fillStyle = "#78350f";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);
          c.fillStyle = "#f59e0b"; // Bamboo highlight
          c.fillRect(plat.x, plat.y, plat.width, 3);
          for (let bx = plat.x; bx < plat.x + plat.width; bx += 12) {
            c.fillStyle = "#451a03";
            c.fillRect(bx, plat.y, 2, plat.height);
          }
        } else if (plat.type === "roof") {
          // KLCC city rooftop
          c.fillStyle = "#1e1b4b";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);
          c.fillStyle = "#00f0ff"; // Neon cyber edge
          c.fillRect(plat.x, plat.y, plat.width, 3);
        } else if (plat.type === "granite") {
          // Kinabalu granite stone
          c.fillStyle = "#334155";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);
          c.fillStyle = "#94a3b8"; // Mist granite edge
          c.fillRect(plat.x, plat.y, plat.width, 3);
        } else {
          // Floating block
          c.fillStyle = "#1e293b";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);
          c.fillStyle = "#38bdf8";
          c.fillRect(plat.x, plat.y, plat.width, 3);
        }
      });

      // 4. Render Malaysian Traditional Collectibles (Karipap, Teh Tarik, Bunga Raya)
      lvl.items.forEach((item) => {
        if (!item.collected) {
          const floatY = Math.sin(frameCountRef.current * 0.08 + item.id) * 3;
          let spriteMatrix = MALAYSIAN_ITEMS.karipap;
          if (item.type === "tehTarik") spriteMatrix = MALAYSIAN_ITEMS.tehTarik;
          else if (item.type === "bungaRaya") spriteMatrix = MALAYSIAN_ITEMS.bungaRaya;

          drawMalaysianItem(c, spriteMatrix, item.x, item.y + floatY, 2);
        }
      });

      // 5. Render Exit Gateway (Portal Gapura / Wau Bulan)
      const ex = lvl.exit;
      const portalGlow = (Math.sin(frameCountRef.current * 0.1) + 1) * 0.5;
      c.save();
      c.shadowColor = DANI_PALETTE.HIB_RED;
      c.shadowBlur = 10 + portalGlow * 15;
      drawPixelMatrix(c, SPRITES.portal, ex.x, ex.y, 3);
      c.restore();

      // 6. Render Enemies
      lvl.enemies.forEach((enemy) => {
        if (!enemy.isAlive) {
          if (enemy.squishTimer > 0) {
            c.fillStyle = PALETTE.green;
            c.fillRect(enemy.x, enemy.y + 12, enemy.width, 6);
          }
          return;
        }

        const slimeFrame = Math.floor(frameCountRef.current / 12) % 2 === 0 ? SPRITES.slime.frame1 : SPRITES.slime.frame2;
        drawPixelMatrix(c, slimeFrame, enemy.x, enemy.y, 2, enemy.vx > 0);
      });

      // 7. Render Dani with active 12-Pose Engine
      const p = playerRef.current;
      const isFlicker = p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 4) % 2 === 0;

      if (!isFlicker) {
        const poseMatrix = DANI_POSES[p.pose] || DANI_POSES.idle_1;
        drawDaniMatrix(c, poseMatrix, p.x, p.y, 2, p.facingLeft);
      }

      // 8. Render Particles
      particlesRef.current.forEach((pt) => {
        const alpha = 1 - pt.life / pt.maxLife;
        c.fillStyle = pt.color;
        c.globalAlpha = Math.max(0, alpha);
        c.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      c.globalAlpha = 1;

      c.restore(); // Restore camera

      // 9. CRT Scanlines & Vignette
      if (scanlines) {
        c.fillStyle = "rgba(0, 0, 0, 0.18)";
        for (let y = 0; y < VIEW_H; y += 4) {
          c.fillRect(0, y, VIEW_W, 1.5);
        }
        const vignette = c.createRadialGradient(
          VIEW_W / 2,
          VIEW_H / 2,
          VIEW_W * 0.35,
          VIEW_W / 2,
          VIEW_H / 2,
          VIEW_W * 0.65
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.45)");
        c.fillStyle = vignette;
        c.fillRect(0, 0, VIEW_W, VIEW_H);
      }

      c.restore(); // Restore shake
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, scanlines, onLevelComplete, onGameOver, onStatsUpdate, virtualInput]);

  return (
    <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto overflow-hidden rounded-[1.5rem] bg-black ring-1 ring-white/10 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={VIEW_W}
        height={VIEW_H}
        className="w-full h-full object-contain block select-none"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
