"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface TouchControlsProps {
  onInput: (input: { left: boolean; right: boolean; jump: boolean }) => void;
  currentInput: { left: boolean; right: boolean; jump: boolean };
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput, currentInput }) => {
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore if not permitted
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 select-none touch-none">
      {/* Directional Pad (Left & Right) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic();
            onInput({ ...currentInput, left: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, left: false });
          }}
          onMouseDown={() => {
            triggerHaptic();
            onInput({ ...currentInput, left: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, left: false })}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer shadow-md ${
            currentInput.left
              ? "bg-rose-500/40 border-2 border-rose-400 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.5)]"
              : "bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 backdrop-blur-md"
          }`}
          aria-label="Lari Kiri"
        >
          <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic();
            onInput({ ...currentInput, right: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, right: false });
          }}
          onMouseDown={() => {
            triggerHaptic();
            onInput({ ...currentInput, right: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, right: false })}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer shadow-md ${
            currentInput.right
              ? "bg-rose-500/40 border-2 border-rose-400 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.5)]"
              : "bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 backdrop-blur-md"
          }`}
          aria-label="Lari Kanan"
        >
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Action / Jump Button */}
      <div>
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            triggerHaptic();
            onInput({ ...currentInput, jump: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, jump: false });
          }}
          onMouseDown={() => {
            triggerHaptic();
            onInput({ ...currentInput, jump: true });
          }}
          onMouseUp={() => onInput({ ...currentInput, jump: false })}
          className={`w-24 h-13 sm:w-32 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm uppercase font-bold tracking-wider transition-all duration-100 active:scale-90 cursor-pointer shadow-md ${
            currentInput.jump
              ? "bg-rose-500/40 border-2 border-rose-400 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.5)]"
              : "bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 backdrop-blur-md"
          }`}
          aria-label="Lompat"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
