"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Zap, MessageCircle, Users } from "lucide-react";

interface TouchControlsProps {
  onInput: (input: { left: boolean; right: boolean; run: boolean; interact: boolean }) => void;
  currentInput: { left: boolean; right: boolean; run: boolean; interact: boolean };
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

      {/* Action Buttons (Interact [E] & Switch [Q]) */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Switch Character Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            onSwitchCharacter();
          }}
          className={`px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-90 cursor-pointer shadow-lg ${
            isJihan
              ? "bg-amber-500/20 border-amber-400/50 text-amber-200"
              : "bg-rose-500/20 border-rose-400/50 text-rose-200"
          }`}
          title="Ganti Karakter (Q)"
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">KONTROL: {isJihan ? "JIHAN" : "DANI"}</span>
          <span className="text-[10px] opacity-60 font-mono">[Q]</span>
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
          onMouseDown={() => {
            triggerHaptic(25);
            onInput({ ...currentInput, interact: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, interact: false })}
          className={`h-16 px-5 sm:h-20 sm:px-7 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-75 active:scale-95 cursor-pointer shadow-xl ${
            currentInput.interact
              ? "bg-gradient-to-r from-amber-400 to-orange-500 scale-95 shadow-[0_0_30px_rgba(245,158,11,0.8)]"
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border border-amber-300/40"
          }`}
          aria-label="Interaksi [E]"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>INTERAKSI [E]</span>
        </button>
      </div>
    </div>
  );
};
