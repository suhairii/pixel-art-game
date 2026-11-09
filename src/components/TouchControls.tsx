"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Zap, MessageCircle, Users, Sword, Sparkles, Flame } from "lucide-react";

interface TouchControlsProps {
  onInput: (input: { left: boolean; right: boolean; run: boolean; interact: boolean; attack: boolean; ultimate: boolean; transform: boolean }) => void;
  currentInput: { left: boolean; right: boolean; run: boolean; interact: boolean; attack: boolean; ultimate: boolean; transform: boolean };
  onSwitchCharacter: () => void;
  activeCharacter: "jihan" | "dani";
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInput,
  currentInput,
  onSwitchCharacter,
  activeCharacter,
}) => {
  const triggerHaptic = (pattern: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if vibration not permitted
      }
    }
  };

  const isJihan = activeCharacter === "jihan";

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-6 py-1 select-none touch-none">
      {/* Directional Pad (Left & Right Buttons) */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Tombol Kiri */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(15);
            onInput({ ...currentInput, left: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, left: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, left: false });
          }}
          onMouseDown={() => {
            triggerHaptic(15);
            onInput({ ...currentInput, left: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, left: false })}
          onMouseLeave={() => onInput({ ...currentInput, left: false })}
          className={`w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] sm:min-w-[80px] sm:min-h-[80px] rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-75 active:scale-90 cursor-pointer shadow-xl ${
            currentInput.left
              ? "bg-amber-500 border-2 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-95"
              : "bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white backdrop-blur-lg"
          }`}
          aria-label="Jalan Kiri"
        >
          <ArrowLeft className="w-7 h-7 sm:w-9 sm:h-9 pointer-events-none drop-shadow" />
        </button>

        {/* Tombol Kanan */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(15);
            onInput({ ...currentInput, right: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, right: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, right: false });
          }}
          onMouseDown={() => {
            triggerHaptic(15);
            onInput({ ...currentInput, right: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, right: false })}
          onMouseLeave={() => onInput({ ...currentInput, right: false })}
          className={`w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] sm:min-w-[80px] sm:min-h-[80px] rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-75 active:scale-90 cursor-pointer shadow-xl ${
            currentInput.right
              ? "bg-amber-500 border-2 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-95"
              : "bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white backdrop-blur-lg"
          }`}
          aria-label="Jalan Kanan"
        >
          <ArrowRight className="w-7 h-7 sm:w-9 sm:h-9 pointer-events-none drop-shadow" />
        </button>

        {/* Run / Jog Toggle */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onInput({ ...currentInput, run: !currentInput.run });
          }}
          className={`px-3 py-2 rounded-xl sm:rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer shadow-md ${
            currentInput.run
              ? "bg-orange-500/30 border-orange-400 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="hidden xs:inline">{currentInput.run ? "LARI" : "JALAN"}</span>
        </button>
      </div>

      {/* Action Buttons (Attack [J / Space], Interact [E] & Switch [Q]) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch Character Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            onSwitchCharacter();
          }}
          className={`px-2.5 sm:px-4 py-2 sm:py-3.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition-all active:scale-90 cursor-pointer shadow-lg ${
            isJihan
              ? "bg-amber-500/20 border-amber-400/50 text-amber-200"
              : "bg-rose-500/20 border-rose-400/50 text-rose-200"
          }`}
          title="Ganti Karakter (Q)"
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden md:inline">KONTROL: {isJihan ? "JIHAN" : "DANI"}</span>
          <span className="text-[10px] opacity-60 font-mono">[Q]</span>
        </button>

        {/* Combat / Attack Button [Space / J / F] */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(25);
            onInput({ ...currentInput, attack: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, attack: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, attack: false });
          }}
          onMouseDown={() => {
            triggerHaptic(25);
            onInput({ ...currentInput, attack: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, attack: false })}
          onMouseLeave={() => onInput({ ...currentInput, attack: false })}
          className={`h-14 px-3 sm:h-18 sm:px-5 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-1 sm:gap-1.5 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-75 active:scale-95 cursor-pointer shadow-xl ${
            currentInput.attack
              ? "bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 scale-95 shadow-[0_0_25px_rgba(244,63,94,0.9)]"
              : "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 border border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          }`}
          aria-label="Serang [J / Spasi]"
          title="Serang [J / Spasi]"
        >
          <Sword className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden xs:inline">SERANG</span>
          <span className="text-[10px] opacity-75 font-mono">[J]</span>
        </button>

        {/* Ultimate Skill Button [U / K] */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(40);
            onInput({ ...currentInput, ultimate: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, ultimate: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, ultimate: false });
          }}
          onMouseDown={() => {
            triggerHaptic(40);
            onInput({ ...currentInput, ultimate: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, ultimate: false })}
          onMouseLeave={() => onInput({ ...currentInput, ultimate: false })}
          className={`h-14 px-2.5 sm:h-18 sm:px-4 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-1 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-75 active:scale-95 cursor-pointer shadow-xl ${
            currentInput.ultimate
              ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 scale-95 shadow-[0_0_35px_rgba(250,204,21,1)] text-slate-950 font-black ring-2 ring-white"
              : isJihan
              ? "bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white border border-yellow-300/60 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              : "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-500 hover:from-amber-500 hover:to-orange-400 text-white border border-yellow-300/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          }`}
          aria-label="Ultimate [U]"
          title="Ultimate Skill [U]"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-yellow-300" />
          <span className="hidden xs:inline">ULTI</span>
          <span className="text-[10px] opacity-80 font-mono">[U]</span>
        </button>

        {/* Transform / Awakening Skill Button [T] */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(45);
            onInput({ ...currentInput, transform: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, transform: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, transform: false });
          }}
          onMouseDown={() => {
            triggerHaptic(45);
            onInput({ ...currentInput, transform: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, transform: false })}
          onMouseLeave={() => onInput({ ...currentInput, transform: false })}
          className={`h-14 px-2.5 sm:h-18 sm:px-4 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-1 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-75 active:scale-95 cursor-pointer shadow-xl ${
            currentInput.transform
              ? "bg-gradient-to-r from-amber-400 via-red-500 to-purple-600 scale-95 shadow-[0_0_35px_rgba(239,68,68,1)] text-white font-black ring-2 ring-yellow-300"
              : isJihan
              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 text-white border border-pink-300/60 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
              : "bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border border-amber-300/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          }`}
          aria-label="Transform [T]"
          title="Transform Awakening [T]"
        >
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-bounce" />
          <span className="hidden xs:inline">TRANS</span>
          <span className="text-[10px] opacity-80 font-mono">[T]</span>
        </button>

        {/* Interact / Action Button [E] */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(25);
            onInput({ ...currentInput, interact: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, interact: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, interact: false });
          }}
          onMouseDown={() => {
            triggerHaptic(25);
            onInput({ ...currentInput, interact: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, interact: false })}
          onMouseLeave={() => onInput({ ...currentInput, interact: false })}
          className={`h-14 px-3.5 sm:h-18 sm:px-6 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-1.5 sm:gap-2 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-75 active:scale-95 cursor-pointer shadow-xl ${
            currentInput.interact
              ? "bg-gradient-to-r from-amber-400 to-orange-500 scale-95 shadow-[0_0_30px_rgba(245,158,11,0.8)]"
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border border-amber-300/40"
          }`}
          aria-label="Interaksi [E]"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden xs:inline">INTERAKSI</span>
          <span className="text-[10px] opacity-75 font-mono">[E]</span>
        </button>
      </div>
    </div>
  );
};
