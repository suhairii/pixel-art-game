"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface TouchControlsProps {
  onInput: (input: { left: boolean; right: boolean; jump: boolean }) => void;
  currentInput: { left: boolean; right: boolean; jump: boolean };
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput, currentInput }) => {
  const triggerHaptic = (pattern: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if vibration not permitted
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-6 py-2 select-none touch-none">
      {/* Directional Pad (Left & Right Buttons - Extra Large & Chunky) */}
      <div className="flex items-center gap-3 sm:gap-4">
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
          onContextMenu={(e) => e.preventDefault()}
          className={`w-18 h-18 sm:w-22 sm:h-22 min-w-[72px] min-h-[72px] sm:min-w-[88px] sm:min-h-[88px] rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform duration-75 active:scale-90 cursor-pointer shadow-xl ${
            currentInput.left
              ? "bg-rose-500 border-2 border-rose-300 text-white shadow-[0_0_25px_rgba(244,63,94,0.7)] scale-95"
              : "bg-white/10 hover:bg-white/20 active:bg-rose-500/30 border-2 border-white/20 text-white backdrop-blur-lg"
          }`}
          aria-label="Lari Kiri"
        >
          <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10 pointer-events-none drop-shadow" />
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
          onContextMenu={(e) => e.preventDefault()}
          className={`w-18 h-18 sm:w-22 sm:h-22 min-w-[72px] min-h-[72px] sm:min-w-[88px] sm:min-h-[88px] rounded-2xl sm:rounded-3xl flex items-center justify-center transition-transform duration-75 active:scale-90 cursor-pointer shadow-xl ${
            currentInput.right
              ? "bg-rose-500 border-2 border-rose-300 text-white shadow-[0_0_25px_rgba(244,63,94,0.7)] scale-95"
              : "bg-white/10 hover:bg-white/20 active:bg-rose-500/30 border-2 border-white/20 text-white backdrop-blur-lg"
          }`}
          aria-label="Lari Kanan"
        >
          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 pointer-events-none drop-shadow" />
        </button>
      </div>

      {/* Action / Jump Button (Extra Wide & Ergonomic for Right Thumb) */}
      <div>
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic(20);
            onInput({ ...currentInput, jump: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, jump: false });
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, jump: false });
          }}
          onMouseDown={() => {
            triggerHaptic(20);
            onInput({ ...currentInput, jump: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, jump: false })}
          onMouseLeave={() => onInput({ ...currentInput, jump: false })}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-32 h-18 sm:w-44 sm:h-22 min-w-[128px] min-h-[72px] sm:min-w-[176px] sm:min-h-[88px] rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 font-mono text-sm sm:text-base uppercase font-black tracking-widest transition-transform duration-75 active:scale-90 cursor-pointer shadow-xl ${
            currentInput.jump
              ? "bg-rose-500 border-2 border-rose-300 text-white shadow-[0_0_30px_rgba(244,63,94,0.8)] scale-95"
              : "bg-gradient-to-r from-rose-500/30 to-rose-600/30 hover:from-rose-500/40 hover:to-rose-600/40 border-2 border-rose-400/60 text-white backdrop-blur-lg"
          }`}
          aria-label="Lompat"
        >
          <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8 pointer-events-none drop-shadow" />
          <span className="pointer-events-none drop-shadow">LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
