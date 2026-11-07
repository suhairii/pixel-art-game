"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Tv,
  RotateCcw,
  Play,
  Trophy,
  Heart,
  Coins,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  Gamepad2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { GameCanvas } from "./GameCanvas";
import { TouchControls } from "./TouchControls";
import { LEVELS } from "@/lib/levels";

export const AwwwardsShell: React.FC = () => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "level_clear" | "game_over">("menu");
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [virtualInput, setVirtualInput] = useState<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  const [stats, setStats] = useState({
    health: 3,
    coins: 0,
    score: 0,
    levelName: LEVELS[0].name,
    fps: 60,
  });

  const [highScore, setHighScore] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Load highscore
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pixel_game_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Timer while playing
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Format timer
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSoundToggle = () => {
    const enabled = sound.toggleMute();
    setIsMuted(!enabled);
  };

  const startGame = () => {
    setGameState("playing");
    setTimerSeconds(0);
    sound.playCoin();
  };

  const handleLevelComplete = (nextLevel: number, totalScore: number) => {
    if (totalScore > highScore) {
      setHighScore(totalScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("pixel_game_highscore", totalScore.toString());
      }
    }

    if (nextLevel < LEVELS.length) {
      setCurrentLevel(nextLevel);
      setGameState("level_clear");
    } else {
      // Completed all levels!
      setGameState("level_clear");
    }
  };

  const handleGameOver = (finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("pixel_game_highscore", finalScore.toString());
      }
    }
    setGameState("game_over");
  };

  const restartCurrentLevel = () => {
    setGameState("playing");
    sound.playCoin();
  };

  const restartFromBeginning = () => {
    setCurrentLevel(0);
    setTimerSeconds(0);
    setGameState("playing");
    sound.playCoin();
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#050608] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[60%] -right-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        {/* Subtle Noise / Film Grain texture overlay */}
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] px-4 py-8 md:py-12 max-w-6xl mx-auto">
        {/* TOP FLOATING ISLAND BAR (Awwwards Header) */}
        <header className="w-full max-w-4xl flex items-center justify-between py-2 px-4 mb-6 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Brand & Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#07090e] rounded-full flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold block">
                EXPERIMENT_08
              </span>
              <h1 className="text-sm font-semibold tracking-tight text-white/90">PIXEL RUNNER</h1>
            </div>
          </div>

          {/* Quick Status / Engine Telemetry */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-white/50">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80">{stats.fps} FPS</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="text-white/40">TIME:</span>
              <span className="text-white/80">{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Controls: Audio & CRT */}
          <div className="flex items-center gap-2">
            {/* CRT Scanline Toggle */}
            <button
              onClick={() => setScanlines(!scanlines)}
              title="Toggle CRT Scanline Effect"
              className={`p-2 rounded-full border transition-all duration-300 ${
                scanlines
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
              }`}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Chiptune Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title="Toggle 8-Bit Chiptune Sound"
              className={`p-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                !isMuted
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* HUD TELEMETRY BAR (Above Screen) */}
        <div className="w-full max-w-4xl flex items-center justify-between px-2 mb-3 text-xs font-mono">
          {/* Hearts / Health */}
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-white/40 mr-1 text-[10px] tracking-wider uppercase">VITAL</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-transform duration-300 ${
                  i < stats.health ? "text-rose-500 fill-rose-500 scale-100" : "text-white/20 scale-90"
                }`}
              />
            ))}
          </div>

          {/* Level Badge */}
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-[11px] tracking-wider uppercase font-medium">
            {stats.levelName}
          </div>

          {/* Coins & Score */}
          <div className="flex items-center gap-4 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Coins className="w-4 h-4" />
              <span>{stats.coins}</span>
            </div>
            <div className="text-white/90">
              <span className="text-white/40 text-[10px] mr-1">PTS</span>
              <span className="font-bold">{stats.score.toString().padStart(5, "0")}</span>
            </div>
          </div>
        </div>

        {/* HARDWARE DOUBLE-BEZEL CONSOLE CHASSIS (Machined Aluminum / OLED Glass) */}
        <div className="relative w-full max-w-4xl rounded-[2.2rem] p-2 sm:p-2.5 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
          {/* Inner Core Display */}
          <div className="relative rounded-[calc(2.2rem-0.6rem)] overflow-hidden bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
            {/* Canvas Game Component */}
            <GameCanvas
              currentLevelIndex={currentLevel}
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
              onStatsUpdate={setStats}
              isPaused={gameState !== "playing"}
              scanlines={scanlines}
              virtualInput={virtualInput}
            />

            {/* OVERLAY: START SCREEN */}
            <AnimatePresence>
              {gameState === "menu" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-md text-center"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono tracking-widest uppercase mb-4">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>NEXT.JS RETRO ENGINE</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40">
                    PIXEL RUNNER
                  </h2>

                  <p className="text-xs sm:text-sm text-white/60 max-w-md mb-8 leading-relaxed">
                    Menjelajahi dunia 2D retro. Berlari, melompati platform, mengumpulkan koin emas, dan injak musuh slime
                    dari atas!
                  </p>

                  {/* Primary CTA (Button-in-Button Pattern) */}
                  <button
                    onClick={startGame}
                    className="group relative inline-flex items-center gap-4 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-white/90 transition-all duration-300 active:scale-95"
                  >
                    <span>START RUN</span>
                    <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                      <Play className="w-3.5 h-3.5 fill-black" />
                    </div>
                  </button>

                  {/* Controls Hint */}
                  <div className="mt-8 flex items-center gap-6 text-[11px] font-mono text-white/40">
                    <span>[A / D / ◄ ►] LARI</span>
                    <span>•</span>
                    <span>[SPACE / W / ▲] LOMPAT</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OVERLAY: LEVEL CLEAR */}
            <AnimatePresence>
              {gameState === "level_clear" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Trophy className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">STAGE CLEARED!</h3>
                  <p className="text-xs text-white/60 mb-6 font-mono">SECTOR COMPLETE WITH {stats.score} PTS</p>

                  {currentLevel < LEVELS.length - 1 ? (
                    <button
                      onClick={restartCurrentLevel}
                      className="group inline-flex items-center gap-3 px-7 py-3 rounded-full bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:bg-cyan-300 transition-all duration-200 active:scale-95"
                    >
                      <span>NEXT SECTOR</span>
                      <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowUpRight className="w-4 h-4 text-black" />
                      </div>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-yellow-300 font-mono">CONGRATULATIONS! ALL SECTORS CONQUERED</p>
                      <button
                        onClick={restartFromBeginning}
                        className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider"
                      >
                        PLAY AGAIN
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* OVERLAY: GAME OVER */}
            <AnimatePresence>
              {gameState === "game_over" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md text-center"
                >
                  <span className="text-xs font-mono text-rose-500 uppercase tracking-widest font-bold mb-2">
                    CRITICAL DAMAGE
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black text-rose-500 tracking-tight mb-2">SYSTEM FAULT</h3>
                  <p className="text-xs text-white/60 font-mono mb-8">FINAL SCORE: {stats.score}</p>

                  <button
                    onClick={restartCurrentLevel}
                    className="group inline-flex items-center gap-3 px-7 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                    <span>RESPAWN</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE ON-SCREEN CONTROLS */}
        <TouchControls onInput={setVirtualInput} currentInput={virtualInput} />

        {/* ARCHITECTURE & FEATURE BENTO (Awwwards Showcase Section) */}
        <section className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Canvas Engine */}
          <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors duration-300">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white/90 mb-1">Crisp 60 FPS Canvas</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Rendering internal 640x360 dengan integer scaling <code className="text-cyan-400">pixelated</code> tanpa
              blur, stabil pada 60 frame per detik.
            </p>
          </div>

          {/* Card 2: Procedural Sprites */}
          <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors duration-300">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white/90 mb-1">Procedural Pixel Matrix</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Hero, slime, koin emas, dan platform disintesis dari matriks biner tanpa dependensi gambar eksternal yang
              rawan gagal muat.
            </p>
          </div>

          {/* Card 3: Chiptune Synthesizer */}
          <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors duration-300">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Volume2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white/90 mb-1">Web Audio Synthesizer</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Efek suara lompatan, koin ding, injak musuh, dan kemenangan disintesis langsung menggunakan Web Audio API
              Square/Sawtooth wave.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-xs font-mono text-white/30">
          <span>PIXEL ART PLATFORMER • BUILT WITH NEXT.JS & WEB AUDIO API</span>
        </footer>
      </div>
    </div>
  );
};
