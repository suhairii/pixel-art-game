"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Tv,
  RotateCcw,
  Play,
  Heart,
  Coffee,
  Cookie,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { GameCanvas } from "./GameCanvas";
import { TouchControls } from "./TouchControls";
import { StoryDialog } from "./StoryDialog";
import { LEVELS } from "@/lib/levels";
import { DANI_STORY } from "@/lib/storyData";
import { DaniPoseState } from "@/lib/gameTypes";

export const AwwwardsShell: React.FC = () => {
  const [gameState, setGameState] = useState<"menu" | "story_intro" | "playing" | "story_clear" | "game_over">("menu");
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
    karipapCount: 0,
    tehTarikCount: 0,
    score: 0,
    levelName: LEVELS[0].name,
    fps: 60,
    currentPose: "idle_1" as DaniPoseState,
  });

  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dani_journey_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  const handleSoundToggle = () => {
    const enabled = sound.toggleMute();
    setIsMuted(!enabled);
  };

  const startJourney = () => {
    setGameState("story_intro");
    sound.playCoin();
  };

  const proceedFromStoryIntro = () => {
    setGameState("playing");
    sound.playCoin();
  };

  const handleLevelComplete = (nextLevel: number, totalScore: number) => {
    if (totalScore > highScore) {
      setHighScore(totalScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("dani_journey_highscore", totalScore.toString());
      }
    }
    setGameState("story_clear");
  };

  const proceedFromStoryClear = () => {
    const nextLvl = currentLevel + 1;
    if (nextLvl < LEVELS.length) {
      setCurrentLevel(nextLvl);
      setGameState("story_intro");
    } else {
      setCurrentLevel(0);
      setGameState("menu");
    }
    sound.playCoin();
  };

  const handleGameOver = (finalScore: number) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("dani_journey_highscore", finalScore.toString());
      }
    }
    setGameState("game_over");
  };

  const restartCurrentLevel = () => {
    setGameState("playing");
    sound.playCoin();
  };

  const currentStory = DANI_STORY[currentLevel] || DANI_STORY[0];

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#050608] text-white selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden flex flex-col justify-between items-center p-2 sm:p-4 font-sans select-none">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-rose-500/10 rounded-full blur-[140px]" />
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* TOP MINI BAR: Only essential HUD & Sound/CRT Toggle */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between px-1 py-1 mb-1 sm:mb-2">
        {/* Vitals & Score HUD */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Health Hearts */}
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 shadow-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                  i < stats.health ? "text-rose-500 fill-rose-500 scale-100" : "text-white/20 scale-90"
                }`}
              />
            ))}
          </div>

          {/* Collectibles Pill */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 shadow-md text-[11px] sm:text-xs font-mono">
            <div className="flex items-center gap-1 text-amber-400" title="Karipap">
              <Cookie className="w-3.5 h-3.5" />
              <span>{stats.karipapCount}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400" title="Teh Tarik">
              <Coffee className="w-3.5 h-3.5" />
              <span>{stats.tehTarikCount}</span>
            </div>
            <span className="text-white/30 hidden xs:inline">|</span>
            <span className="font-bold text-white/90 hidden xs:inline">{stats.score.toString().padStart(5, "0")}</span>
          </div>
        </div>

        {/* Quick Buttons: Sound & CRT Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setScanlines(!scanlines)}
            title="Toggle Scanline"
            className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
              scanlines
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                : "bg-black/60 border-white/10 text-white/40 hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={handleSoundToggle}
            title="Toggle Sound"
            className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center ${
              !isMuted
                ? "bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                : "bg-black/60 border-white/10 text-white/40 hover:text-white"
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* GAME SCREEN CHASSIS */}
      <main className="relative z-10 w-full max-w-4xl flex-1 flex items-center justify-center my-auto">
        <div className="relative w-full rounded-[1.4rem] sm:rounded-[2rem] p-1.5 sm:p-2 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] ring-1 ring-white/10 shadow-2xl">
          <div className="relative rounded-[calc(1.4rem-0.375rem)] sm:rounded-[calc(2rem-0.5rem)] overflow-hidden bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
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

            {/* OVERLAY: CLEAN MOBILE-RESPONSIVE START SCREEN */}
            <AnimatePresence>
              {gameState === "menu" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md text-center"
                >
                  <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-xl p-0.5 bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-400 shadow-md mb-2 sm:mb-3">
                    <div className="relative w-full h-full rounded-[0.55rem] sm:rounded-[0.7rem] overflow-hidden bg-[#0d1017]">
                      <Image
                        src="/dani-portrait.png"
                        alt="Dani"
                        fill
                        sizes="80px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-3 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/50">
                    KEMBARA DANI
                  </h2>

                  <button
                    onClick={startJourney}
                    className="group inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-rose-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:bg-rose-400 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>MAIN SEKARANG</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-150">
                      <Play className="w-3 h-3 fill-white" />
                    </div>
                  </button>
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
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md text-center"
                >
                  <h3 className="text-2xl sm:text-4xl font-black text-rose-500 tracking-tight mb-1 sm:mb-2">GAME OVER</h3>
                  <p className="text-[11px] sm:text-xs text-white/60 font-mono mb-4 sm:mb-6">SKOR: {stats.score}</p>

                  <button
                    onClick={restartCurrentLevel}
                    className="group inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-all duration-150 active:scale-95 shadow-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                    <span>CUBA LAGI</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* OVERLAY: FULL-VIEWPORT STORY CUTSCENES (Never squished inside canvas!) */}
      <AnimatePresence>
        {gameState === "story_intro" && (
          <StoryDialog
            story={currentStory}
            mode="intro"
            onProceed={proceedFromStoryIntro}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "story_clear" && (
          <StoryDialog
            story={currentStory}
            mode="clear"
            onProceed={proceedFromStoryClear}
          />
        )}
      </AnimatePresence>

      {/* ON-SCREEN BUTTONS (Docked thumb-friendly bottom bar) */}
      <footer className="relative z-10 w-full max-w-4xl py-1">
        <TouchControls onInput={setVirtualInput} currentInput={virtualInput} />
      </footer>
    </div>
  );
};
