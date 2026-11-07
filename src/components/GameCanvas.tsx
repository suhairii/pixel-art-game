"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { sound } from "@/lib/sound";
import { drawPixelMatrix, SPRITES, PALETTE } from "@/lib/sprites";
import { Player, Enemy, Platform, Particle, LevelData } from "@/lib/gameTypes";
import { LEVELS } from "@/lib/levels";

// Internal logical canvas resolution (Crisp retro ratio)
const VIEW_W = 640;
const VIEW_H = 360;
const GRAVITY = 0.52;
const JUMP_FORCE = -10.5;
const MOVE_SPEED = 3.6;

interface GameCanvasProps {
  currentLevelIndex: number;
  onLevelComplete: (nextLevel: number, currentScore: number) => void;
  onGameOver: (finalScore: number) => void;
  onStatsUpdate: (stats: { health: number; coins: number; score: number; levelName: string; fps: number }) => void;
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

  // Keyboard keys tracker
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Current active level data clone
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[currentLevelIndex] || LEVELS[0])));

  // Player state
  const playerRef = useRef<Player>({
    x: 60,
    y: 240,
    width: 24,
    height: 32,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facingLeft: false,
    health: 3,
    maxHealth: 3,
    coins: 0,
    score: 0,
    state: "idle",
    invincibleTimer: 0,
  });

  // Particles & Visual feedback
  const particlesRef = useRef<Particle[]>([]);
  const cameraXRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const lastFpsCheckRef = useRef<number>(performance.now());
  const framesThisSecRef = useRef<number>(0);

  // Reset or initialize level
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
    cameraXRef.current = 0;
    particlesRef.current = [];
  }, []);

  // Update level when prop changes
  useEffect(() => {
    initLevel(currentLevelIndex);
  }, [currentLevelIndex, initLevel]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = true;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = true;
      }
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        keysRef.current.jump = true;
        // Jump trigger immediately
        const p = playerRef.current;
        if (p.isGrounded) {
          p.vy = JUMP_FORCE;
          p.isGrounded = false;
          sound.playJump();
          // Dust particles
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

  // Sync virtual touch inputs
  useEffect(() => {
    const p = playerRef.current;
    if (virtualInput.jump && p.isGrounded) {
      p.vy = JUMP_FORCE;
      p.isGrounded = false;
      sound.playJump();
      createDustParticles(p.x + p.width / 2, p.y + p.height, "#ffffff", 6);
    }
  }, [virtualInput.jump]);

  // Particle helper
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

  // Main Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const gameLoop = (timestamp: number) => {
      animId = requestAnimationFrame(gameLoop);

      // FPS Calculation
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

      // Report stats periodically
      if (frameCountRef.current % 10 === 0) {
        const p = playerRef.current;
        const lvl = levelRef.current;
        onStatsUpdate({
          health: p.health,
          coins: p.coins,
          score: p.score,
          levelName: lvl.name,
          fps: fpsRef.current,
        });
      }
    };

    // Update Physics
    const updatePhysics = () => {
      const p = playerRef.current;
      const lvl = levelRef.current;

      // Invincible cooldown
      if (p.invincibleTimer > 0) {
        p.invincibleTimer--;
      }

      // Input resolution
      const moveLeft = keysRef.current.left || virtualInput.left;
      const moveRight = keysRef.current.right || virtualInput.right;

      if (moveLeft && !moveRight) {
        p.vx = -MOVE_SPEED;
        p.facingLeft = true;
        p.state = "run";
      } else if (moveRight && !moveLeft) {
        p.vx = MOVE_SPEED;
        p.facingLeft = false;
        p.state = "run";
      } else {
        p.vx *= 0.65;
        if (Math.abs(p.vx) < 0.2) p.vx = 0;
        p.state = "idle";
      }

      // Gravity
      p.vy += GRAVITY;
      if (p.vy > 9) p.vy = 9;

      if (!p.isGrounded) {
        p.state = "jump";
      }

      // Horizontal movement & boundary
      p.x += p.vx;
      if (p.x < 0) p.x = 0;
      if (p.x + p.width > lvl.worldWidth) p.x = lvl.worldWidth - p.width;

      // Vertical movement & Platform collision
      p.y += p.vy;
      p.isGrounded = false;

      // Platform Collisions (AABB)
      lvl.platforms.forEach((plat: Platform) => {
        // One-way jumping through floating platforms:
        if (plat.type === "floating") {
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
          // Solid ground collision
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

      // Pit fall check (Fell into the abyss)
      if (p.y > VIEW_H + 50) {
        p.health -= 1;
        sound.playHurt();
        screenShakeRef.current = 15;
        if (p.health <= 0) {
          onGameOver(p.score);
        } else {
          // Respawn at level start
          p.x = lvl.spawn.x;
          p.y = lvl.spawn.y;
          p.vx = 0;
          p.vy = 0;
          p.invincibleTimer = 90;
        }
      }

      // Coins Collection
      lvl.coins.forEach((coin) => {
        if (!coin.collected) {
          if (
            p.x + p.width > coin.x &&
            p.x < coin.x + coin.width &&
            p.y + p.height > coin.y &&
            p.y < coin.y + coin.height
          ) {
            coin.collected = true;
            p.coins += 1;
            p.score += 100;
            sound.playCoin();
            createDustParticles(coin.x + 8, coin.y + 8, PALETTE.yellow, 8);
          }
        }
      });

      // Enemy Patrol & Collision
      lvl.enemies.forEach((enemy: Enemy) => {
        if (!enemy.isAlive) {
          if (enemy.squishTimer > 0) enemy.squishTimer--;
          return;
        }

        // Patrol logic
        enemy.x += enemy.vx;
        if (enemy.x > enemy.startX + enemy.distance || enemy.x < enemy.startX) {
          enemy.vx = -enemy.vx;
        }

        // Check player collision with enemy
        if (
          p.x + p.width > enemy.x &&
          p.x < enemy.x + enemy.width &&
          p.y + p.height > enemy.y &&
          p.y < enemy.y + enemy.height
        ) {
          // Stomp from above!
          if (p.vy > 0 && p.y + p.height <= enemy.y + 14) {
            enemy.isAlive = false;
            enemy.squishTimer = 30;
            p.vy = -7.5; // Stomp bounce
            p.score += 250;
            sound.playStomp();
            createDustParticles(enemy.x + enemy.width / 2, enemy.y + 10, PALETTE.green, 12);
          } else if (p.invincibleTimer === 0) {
            // Player hit by enemy
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

      // Exit Portal Check
      const ex = lvl.exit;
      if (
        p.x + p.width > ex.x &&
        p.x < ex.x + ex.width &&
        p.y + p.height > ex.y &&
        p.y < ex.y + ex.height
      ) {
        sound.playWin();
        p.score += 1000;
        onLevelComplete(currentLevelIndex + 1, p.score);
      }

      // Update Particles
      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.life < pt.maxLife);

      // Camera Lerp (Follow player horizontally with deadzone)
      const targetCamX = p.x - VIEW_W / 2 + p.width / 2;
      const clampedTarget = Math.max(0, Math.min(targetCamX, lvl.worldWidth - VIEW_W));
      cameraXRef.current += (clampedTarget - cameraXRef.current) * 0.1;

      // Screen Shake Decay
      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.3) screenShakeRef.current = 0;
      }
    };

    // Render Scene
    const renderScene = (c: CanvasRenderingContext2D) => {
      const lvl = levelRef.current;
      const camX = cameraXRef.current;
      const shakeOffset = (Math.random() - 0.5) * screenShakeRef.current;

      c.save();
      c.translate(shakeOffset, shakeOffset);

      // 1. Sky Gradient Background
      const skyGrad = c.createLinearGradient(0, 0, 0, VIEW_H);
      skyGrad.addColorStop(0, lvl.skyGradient[0]);
      skyGrad.addColorStop(1, lvl.skyGradient[1]);
      c.fillStyle = skyGrad;
      c.fillRect(0, 0, VIEW_W, VIEW_H);

      // 2. Parallax Layer 1: Distant Cyber Mountains / Stars
      c.save();
      c.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let s = 0; s < 40; s++) {
        const starX = (s * 47 - camX * 0.05) % VIEW_W;
        const normStarX = starX < 0 ? starX + VIEW_W : starX;
        const starY = (s * 31) % (VIEW_H - 120);
        c.fillRect(normStarX, starY, 1.5, 1.5);
      }

      // Mountain silhouette
      c.fillStyle = "rgba(10, 16, 26, 0.65)";
      c.beginPath();
      c.moveTo(0, VIEW_H);
      for (let m = 0; m <= VIEW_W; m += 60) {
        const worldM = m + camX * 0.15;
        const mHeight = 120 + Math.sin(worldM * 0.01) * 40 + Math.cos(worldM * 0.02) * 20;
        c.lineTo(m, VIEW_H - mHeight);
      }
      c.lineTo(VIEW_W, VIEW_H);
      c.closePath();
      c.fill();
      c.restore();

      // 3. Parallax Layer 2: Midground Pixel Pillars / Skyline
      c.save();
      c.fillStyle = "rgba(15, 24, 38, 0.85)";
      for (let p = -100; p < lvl.worldWidth; p += 180) {
        const screenP = p - camX * 0.4;
        if (screenP > -100 && screenP < VIEW_W + 100) {
          c.fillRect(screenP, 180, 50, VIEW_H - 180);
          // Neon window lights
          c.fillStyle = "rgba(0, 240, 255, 0.15)";
          c.fillRect(screenP + 12, 200, 8, 8);
          c.fillRect(screenP + 30, 220, 8, 8);
          c.fillRect(screenP + 12, 240, 8, 8);
          c.fillStyle = "rgba(15, 24, 38, 0.85)";
        }
      }
      c.restore();

      // Camera Transform for World Objects
      c.save();
      c.translate(-Math.floor(camX), 0);

      // 4. Render Platforms
      lvl.platforms.forEach((plat) => {
        if (plat.type === "ground") {
          // Crisp ground with grass/neon trim
          c.fillStyle = lvl.theme === "neon" ? "#1e1b4b" : lvl.theme === "sunset" ? "#31102b" : "#062b1b";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Top Neon Accent Edge
          c.fillStyle = lvl.theme === "neon" ? "#00f0ff" : lvl.theme === "sunset" ? "#f43f5e" : "#10b981";
          c.fillRect(plat.x, plat.y, plat.width, 4);

          // Pixel grid detail
          c.fillStyle = "rgba(255, 255, 255, 0.06)";
          for (let px = plat.x; px < plat.x + plat.width; px += 16) {
            c.fillRect(px, plat.y + 4, 1, plat.height - 4);
          }
        } else {
          // Floating Platform
          c.fillStyle = "#1e293b";
          c.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Glowing top border
          c.fillStyle = lvl.theme === "neon" ? "#a855f7" : lvl.theme === "sunset" ? "#fbbf24" : "#34d399";
          c.fillRect(plat.x, plat.y, plat.width, 3);

          // Bezel rivet dots
          c.fillStyle = "#0f172a";
          c.fillRect(plat.x + 3, plat.y + 6, 4, 4);
          c.fillRect(plat.x + plat.width - 7, plat.y + 6, 4, 4);
        }
      });

      // 5. Render Coins
      const coinFrame = Math.floor(frameCountRef.current / 8) % SPRITES.coin.length;
      lvl.coins.forEach((coin) => {
        if (!coin.collected) {
          const floatY = Math.sin(frameCountRef.current * 0.08 + coin.id) * 3;
          drawPixelMatrix(c, SPRITES.coin[coinFrame], coin.x, coin.y + floatY, 2);
        }
      });

      // 6. Render Exit Portal
      const ex = lvl.exit;
      const portalGlow = (Math.sin(frameCountRef.current * 0.1) + 1) * 0.5;
      c.save();
      c.shadowColor = PALETTE.neonCyan;
      c.shadowBlur = 10 + portalGlow * 15;
      drawPixelMatrix(c, SPRITES.portal, ex.x, ex.y, 3);
      c.restore();

      // 7. Render Enemies
      lvl.enemies.forEach((enemy) => {
        if (!enemy.isAlive) {
          if (enemy.squishTimer > 0) {
            // Squished pancake pose
            c.fillStyle = PALETTE.green;
            c.fillRect(enemy.x, enemy.y + 12, enemy.width, 6);
          }
          return;
        }

        const slimeFrame = Math.floor(frameCountRef.current / 12) % 2 === 0 ? SPRITES.slime.frame1 : SPRITES.slime.frame2;
        drawPixelMatrix(c, slimeFrame, enemy.x, enemy.y, 2, enemy.vx > 0);
      });

      // 8. Render Player
      const p = playerRef.current;
      const isFlicker = p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 4) % 2 === 0;

      if (!isFlicker) {
        let currentSprite = SPRITES.hero.idle;
        if (p.state === "jump") {
          currentSprite = SPRITES.hero.jump;
        } else if (p.state === "run") {
          const runFrame = Math.floor(frameCountRef.current / 6) % 2 === 0 ? SPRITES.hero.run1 : SPRITES.hero.run2;
          currentSprite = runFrame;
        }

        drawPixelMatrix(c, currentSprite, p.x, p.y, 2, p.facingLeft);
      }

      // 9. Render Particles
      particlesRef.current.forEach((pt) => {
        const alpha = 1 - pt.life / pt.maxLife;
        c.fillStyle = pt.color;
        c.globalAlpha = Math.max(0, alpha);
        c.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      c.globalAlpha = 1;

      c.restore(); // Restore camera transform

      // 10. Optional CRT Scanlines Effect
      if (scanlines) {
        c.fillStyle = "rgba(0, 0, 0, 0.18)";
        for (let y = 0; y < VIEW_H; y += 4) {
          c.fillRect(0, y, VIEW_W, 1.5);
        }
        // Vignette
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

    return () => {
      cancelAnimationFrame(animId);
    };
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
