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
  Compass,
  Sparkles,
  BookOpen,
  Coffee,
  Cookie,
  Award,
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
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dani_journey_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSoundToggle = () => {
    const enabled = sound.toggleMute();
    setIsMuted(!enabled);
  };

  // Launch journey -> show chapter intro story first!
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
    // Show story clear cutscene
    setGameState("story_clear");
  };

  const proceedFromStoryClear = () => {
    const nextLvl = currentLevel + 1;
    if (nextLvl < LEVELS.length) {
      setCurrentLevel(nextLvl);
      setGameState("story_intro");
    } else {
      // Finished all 3 stages! Back to menu with victory
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
    <div className="relative min-h-[100dvh] w-full bg-[#050608] text-white selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden font-sans">
      {/* Ambient Gradient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -left-32 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[60%] -right-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        {/* Subtle Songket Motif Grid overlay */}
        <div
          className="fixed inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] px-4 py-8 md:py-12 max-w-6xl mx-auto">
        {/* TOP FLOATING CONSOLE BAR (Awwwards Header) */}
        <header className="w-full max-w-4xl flex items-center justify-between py-2 px-4 mb-6 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Brand & Dani Avatar */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden p-[1px] bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#07090e]">
                <Image
                  src="/dani-portrait.png"
                  alt="Dani"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-semibold block">
                KEMBARA DANI • MALAYSIA
              </span>
              <h1 className="text-sm font-semibold tracking-tight text-white/90">DANI&apos;S JOURNEY</h1>
            </div>
          </div>

          {/* Engine Telemetry & Active Pose Monitor */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-white/50">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <span className="text-[10px] text-white/40 uppercase">POSE:</span>
              <span className="font-bold uppercase text-[11px]">{stats.currentPose.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80">{stats.fps} FPS</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="text-white/40">TIME:</span>
              <span className="text-white/80">{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Audio & CRT Controls */}
          <div className="flex items-center gap-2">
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

            <button
              onClick={handleSoundToggle}
              title="Toggle 8-Bit Chiptune Sound"
              className={`p-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                !isMuted
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
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

          {/* Stage Name Badge */}
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[11px] tracking-wider uppercase font-medium">
            {stats.levelName}
          </div>

          {/* Malaysian Collectibles: Karipap & Teh Tarik */}
          <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1 text-amber-400" title="Karipap Emas">
              <Cookie className="w-3.5 h-3.5" />
              <span>{stats.karipapCount}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400" title="Teh Tarik Kaw">
              <Coffee className="w-3.5 h-3.5" />
              <span>{stats.tehTarikCount}</span>
            </div>
            <div className="text-white/90">
              <span className="text-white/40 text-[10px] mr-1">SKOR</span>
              <span className="font-bold">{stats.score.toString().padStart(5, "0")}</span>
            </div>
          </div>
        </div>

        {/* HARDWARE DOUBLE-BEZEL CONSOLE CHASSIS */}
        <div className="relative w-full max-w-4xl rounded-[2.2rem] p-2 sm:p-2.5 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
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
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md text-center"
                >
                  {/* Portrait Avatar in Start Screen */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(244,114,182,0.4)] mb-4">
                    <div className="relative w-full h-full rounded-[0.8rem] overflow-hidden bg-[#0d1017]">
                      <Image
                        src="/dani-portrait.png"
                        alt="Dani"
                        fill
                        sizes="96px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono tracking-widest uppercase mb-2">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span>PERJALANAN GADIS MALAYSIA BERHIJAB</span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/50">
                    KEMBARA DANI
                  </h2>

                  <p className="text-xs sm:text-sm text-white/70 max-w-md mb-6 leading-relaxed">
                    Sertai Dani menjelajahi 3 babak kembara: dari rumah panggung Kampung Warisan, merentasi metropolitan
                    Kuala Lumpur, hingga menawan Puncak Kinabalu!
                  </p>

                  <button
                    onClick={startJourney}
                    className="group relative inline-flex items-center gap-4 px-8 py-3.5 rounded-full bg-rose-500 text-white font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:bg-rose-400 transition-all duration-300 active:scale-95"
                  >
                    <span>MULAKAN KEMBARA</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                  </button>

                  <div className="mt-6 flex items-center gap-6 text-[11px] font-mono text-white/40">
                    <span>[A / D / ◄ ►] LARI</span>
                    <span>•</span>
                    <span>[SPACE / W / ▲] LOMPAT</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OVERLAY: STORY INTRO DIALOG CUTSCENE */}
            <AnimatePresence>
              {gameState === "story_intro" && (
                <StoryDialog
                  story={currentStory}
                  mode="intro"
                  onProceed={proceedFromStoryIntro}
                />
              )}
            </AnimatePresence>

            {/* OVERLAY: STORY CLEAR DIALOG CUTSCENE */}
            <AnimatePresence>
              {gameState === "story_clear" && (
                <StoryDialog
                  story={currentStory}
                  mode="clear"
                  onProceed={proceedFromStoryClear}
                />
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
                    TENAGA BERKURANGAN
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black text-rose-500 tracking-tight mb-2">REHAT SEBENTAR</h3>
                  <p className="text-xs text-white/60 font-mono mb-8">SKOR AKHIR: {stats.score}</p>

                  <button
                    onClick={restartCurrentLevel}
                    className="group inline-flex items-center gap-3 px-7 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                    <span>CUBA LAGI</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE ON-SCREEN TOUCH CONTROLLER */}
        <TouchControls onInput={setVirtualInput} currentInput={virtualInput} />

        {/* 10+ POSE ANIMATION GALLERY & MALAYSIAN STORY BREAKDOWN (Awwwards Showcase) */}
        <section className="w-full max-w-4xl mt-12 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold tracking-tight text-white">SISTEM 12 POSE ANIMASI KARAKTER DANI</h3>
            </div>
            <span className="text-xs font-mono text-white/40 uppercase">16-BIT PROCEDURAL ENGINE</span>
          </div>

          {/* 12 Poses Interactive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-mono">
            {[
              { id: "idle_1", name: "01. IDLE NAFAS", desc: "Berdiri tegak, hijab beralun tenang" },
              { id: "idle_2", name: "02. IDLE KEDIP", desc: "Fokus mata & tekad melangkah" },
              { id: "run_1", name: "03. RUN LANGKAH 1", desc: "Kaki kanan menjejak, tangan ayun" },
              { id: "run_2", name: "04. RUN PASSING", desc: "Transisi ayunan badan & momentum" },
              { id: "run_3", name: "05. RUN LANGKAH 2", desc: "Kaki kiri menjejak, langkah tegap" },
              { id: "run_4", name: "06. RUN PUSH-OFF", desc: "Dorongan pecutan & hijab berkibar" },
              { id: "jump_takeoff", name: "07. JUMP TOLAKAN", desc: "Lutut membengkok, lonjakan naik" },
              { id: "jump_apex", name: "08. JUMP APEX", desc: "Puncak anti-gravitasi melayang" },
              { id: "jump_fall", name: "09. JUMP MELAYANG", desc: "Tangan mengimbangi penurunan" },
              { id: "land_impact", name: "10. LANDING MEREDAM", desc: "Squat redaman & debu partikel" },
              { id: "stomp", name: "11. STOMP INJAK", desc: "Akrobatik memijak rintangan" },
              { id: "victory", name: "12. VICTORY DADAH", desc: "Lambaian riang & senyum ceria" },
            ].map((pose) => (
              <div
                key={pose.id}
                className={`p-3 rounded-2xl border transition-all duration-200 ${
                  stats.currentPose === pose.id
                    ? "bg-rose-500/20 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-rose-200"
                    : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px] text-white/90">{pose.name}</span>
                  {stats.currentPose === pose.id && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-white/40 leading-snug">{pose.desc}</p>
              </div>
            ))}
          </div>

          {/* Malaysian Cultural Story Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <Cookie className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white/90 mb-1">Karipap Emas & Teh Tarik</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Kutipan khas kuliner tradisi nusantara yang memberi skor dan tenaga untuk Dani meneruskan perjalanan.
              </p>
            </div>

            <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white/90 mb-1">Narasi Visual Novel</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Setiap babak dibuka dengan dialog puitis dan motivasi khas Melayu yang menggambarkan kecekalan Dani.
              </p>
            </div>

            <div className="rounded-[1.6rem] p-5 bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white/90 mb-1">Landskap Unik Malaysia</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Parallax scrolling Kampung Pantai Timur, siluet Menara KLCC di waktu malam, dan puncak batu Gunung Kinabalu.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 text-center text-xs font-mono text-white/30">
          <span>KEMBARA DANI • PERJALANAN GADIS BERHIJAB ASAL MALAYSIA • NEXT.JS 14</span>
        </footer>
      </div>
    </div>
  );
};
