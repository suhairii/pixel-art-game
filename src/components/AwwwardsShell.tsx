"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Tv,
  Play,
  Heart,
  Sparkles,
  Compass,
  Users,
  Coffee,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { GameCanvas } from "./GameCanvas";
import { TouchControls } from "./TouchControls";
import { StoryDialog } from "./StoryDialog";
import { DevHub, DevActions } from "./DevHub";
import { DIALOGUES } from "@/lib/storyData";
import { CharacterId, DialogueChoice } from "@/lib/gameTypes";

interface AwwwardsShellProps {
  initialDevMode?: boolean;
  autoStart?: boolean;
}

export const AwwwardsShell: React.FC<AwwwardsShellProps> = ({
  initialDevMode = false,
  autoStart = false,
}) => {
  const [gameState, setGameState] = useState<"menu" | "playing">(autoStart ? "playing" : "menu");
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>("jihan");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [currentDialogueId, setCurrentDialogueId] = useState<string | null>(null);

  // Dev Hub / Testing State
  const [isDevMode, setIsDevMode] = useState<boolean>(initialDevMode);
  const [devActions, setDevActions] = useState<DevActions | null>(null);

  // Hotkey toggle for Dev Hub: ~ (Backquote) or F2
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Backquote" || e.key === "~" || e.key === "`" || e.code === "F2") {
        e.preventDefault();
        setIsDevMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Discovery / Quest Tracker
  const [discoveries, setDiscoveries] = useState<{
    catPetted: boolean;
    pisangEaten: boolean;
    warkopVisited: boolean;
    sunsetWatched: boolean;
    monsterDefeated: boolean;
    adifHairiDefeated: boolean;
  }>({
    catPetted: false,
    pisangEaten: false,
    warkopVisited: false,
    sunsetWatched: false,
    monsterDefeated: false,
    adifHairiDefeated: false,
  });

  const [virtualInput, setVirtualInput] = useState<{
    left: boolean;
    right: boolean;
    run: boolean;
    interact: boolean;
    attack: boolean;
    ultimate: boolean;
  }>({
    left: false,
    right: false,
    run: false,
    interact: false,
    attack: false,
    ultimate: false,
  });

  const handleSoundToggle = () => {
    const enabled = sound.toggleMute();
    setIsMuted(!enabled);
  };

  const handleSwitchCharacter = () => {
    setActiveCharacter((prev) => (prev === "jihan" ? "dani" : "jihan"));
    sound.playInteract();
  };

  const startJourney = () => {
    setGameState("playing");
    setCurrentDialogueId("intro_1");
    sound.playCoin();
  };

  const handleTriggerDialogue = (dialogueId: string) => {
    setCurrentDialogueId(dialogueId);
    if (dialogueId === "cat_1") {
      setDiscoveries((prev) => ({ ...prev, catPetted: true }));
    } else if (dialogueId === "pisang_1") {
      setDiscoveries((prev) => ({ ...prev, pisangEaten: true }));
    } else if (dialogueId === "warkop_1") {
      setDiscoveries((prev) => ({ ...prev, warkopVisited: true }));
    } else if (dialogueId === "bench_1" || dialogueId === "pier_1") {
      setDiscoveries((prev) => ({ ...prev, sunsetWatched: true }));
    } else if (dialogueId === "panci_defeat") {
      setDiscoveries((prev) => ({ ...prev, monsterDefeated: true }));
    } else if (dialogueId === "adif_hairi_defeat" || dialogueId === "adif_hairi_defeat_2") {
      setDiscoveries((prev) => ({ ...prev, adifHairiDefeated: true }));
    }
  };

  const handleDialogNext = (nextId?: string) => {
    if (nextId) {
      setCurrentDialogueId(nextId);
    } else {
      setCurrentDialogueId(null);
    }
  };

  const handleDialogChoice = (choice: DialogueChoice) => {
    if (choice.nextId) {
      setCurrentDialogueId(choice.nextId);
    } else {
      setCurrentDialogueId(null);
    }
  };

  const currentDialogue = currentDialogueId ? DIALOGUES[currentDialogueId] || null : null;
  const isJihan = activeCharacter === "jihan";

  const totalDiscoveries = Object.values(discoveries).filter(Boolean).length;

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#050608] text-white selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden flex flex-col justify-between items-center p-2 sm:p-4 font-sans select-none">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* TOP HEADER BAR: Character Switcher & Story Discovery Tracker */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between px-1 py-1 mb-1 sm:mb-2">
        {/* Active Character Quick Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitchCharacter}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 hover:border-amber-400/40 shadow-md transition-all active:scale-95 cursor-pointer"
            title="Klik untuk ganti karakter [Q]"
          >
            <div
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border p-0.5 ${
                isJihan ? "border-amber-400 bg-amber-500/20" : "border-rose-400 bg-rose-500/20"
              }`}
            >
              <Image
                src={isJihan ? "/jihan-portrait.png" : "/dani-portrait.png"}
                alt={isJihan ? "Jihan" : "Dani"}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-white/50 leading-none">KARAKTER AKTIF</div>
              <div
                className={`text-xs font-bold leading-tight ${
                  isJihan ? "text-amber-300" : "text-rose-300"
                }`}
              >
                {isJihan ? "JIHAN • SULAWESI" : "DANI • MALAYSIA"}
              </div>
            </div>
            <Users className="w-3.5 h-3.5 text-white/40 ml-1" />
          </button>

          {/* Discovery Tracker Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-md text-xs font-mono">
            <span className="text-white/50">EKSPLORASI:</span>
            <span className="font-bold text-amber-400">{totalDiscoveries}/6 Misi</span>
            {totalDiscoveries === 6 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
        </div>

        {/* Quick Buttons: DEV Hub, Sound & CRT Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDevMode(!isDevMode)}
            title="Toggle Mode Dev / Test Hub [~ atau F2]"
            className={`px-2.5 py-1.5 rounded-xl border font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              isDevMode
                ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-black/60 border-white/10 text-white/50 hover:text-amber-300 hover:border-amber-400/40"
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>DEV</span>
          </button>

          <button
            onClick={() => setScanlines(!scanlines)}
            title="Toggle Scanline CRT"
            className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
              scanlines
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "bg-black/60 border-white/10 text-white/40 hover:text-white"
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={handleSoundToggle}
            title="Toggle Suara"
            className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center ${
              !isMuted
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "bg-black/60 border-white/10 text-white/40 hover:text-white"
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* GAME SCREEN CHASSIS */}
      <main className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto gap-2">
        <div className="relative w-full rounded-[1.4rem] sm:rounded-[2rem] p-1.5 sm:p-2 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] ring-1 ring-white/10 shadow-2xl">
          <div className="relative rounded-[calc(1.4rem-0.375rem)] sm:rounded-[calc(2rem-0.5rem)] overflow-hidden bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
            {/* Canvas Narrative Game */}
            <GameCanvas
              activeCharacter={activeCharacter}
              onSwitchCharacter={handleSwitchCharacter}
              onTriggerDialogue={handleTriggerDialogue}
              isDialogueOpen={Boolean(currentDialogueId)}
              currentDialogueId={currentDialogueId}
              scanlines={scanlines}
              virtualInput={virtualInput}
              onRegisterDevActions={setDevActions}
            />

            {/* OVERLAY: MENU UTAMA (A Space for the Unbound Style) */}
            <AnimatePresence>
              {gameState === "menu" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md text-center"
                >
                  {/* Dual Character Portraits */}
                  <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3 sm:mb-4">
                    {/* Jihan Portrait */}
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl">
                      <div className="relative w-full h-full rounded-[0.85rem] sm:rounded-[1rem] overflow-hidden bg-[#0d1017]">
                        <Image
                          src="/jihan-portrait.png"
                          alt="Jihan"
                          fill
                          sizes="96px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>

                    {/* Dani Portrait */}
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br from-rose-400 to-cyan-400 shadow-xl">
                      <div className="relative w-full h-full rounded-[0.85rem] sm:rounded-[1rem] overflow-hidden bg-[#0d1017]">
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
                  </div>

                  {/* Title & Tagline */}
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500">
                    KEMBARA: KISAH DANI & JIHAN
                  </h1>
                  <p className="text-xs sm:text-sm text-white/75 font-serif italic mb-4 sm:mb-6 max-w-md">
                    “Dua Sahabat Lintas Selat • Menelusuri Hangatnya Senja Pesisir Losari”
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 mb-4">
                    <button
                      onClick={startJourney}
                      className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all duration-150 active:scale-95 cursor-pointer"
                    >
                      <span>MULAI PETUALANGAN</span>
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <Play className="w-3 h-3 fill-white" />
                      </div>
                    </button>
                  </div>

                  <p className="text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider">
                    Gunakan [A/D] Berjalan • [Shift] Lari • [E] Interaksi • [Q] Ganti Karakter • [Spasi/J/F] Serang (Combat Mode)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* In-Game Interactive Story Dialogue: Placed OUTSIDE the game canvas so character transform animations are never covered! */}
        <AnimatePresence>
          {currentDialogue && (
            <StoryDialog
              dialogue={currentDialogue}
              onNext={handleDialogNext}
              onClose={() => setCurrentDialogueId(null)}
              onChoice={handleDialogChoice}
            />
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER: Ergonomic Touch Controls */}
      <footer className="relative z-10 w-full max-w-4xl py-1 sm:py-2">
        <TouchControls
          onInput={setVirtualInput}
          currentInput={virtualInput}
          onSwitchCharacter={handleSwitchCharacter}
          activeCharacter={activeCharacter}
        />
      </footer>

      {/* Dev / Stage Testing Hub Overlay */}
      {isDevMode && (
        <DevHub
          actions={devActions}
          onClose={() => setIsDevMode(false)}
          isDefaultOpen={true}
        />
      )}
    </div>
  );
};
