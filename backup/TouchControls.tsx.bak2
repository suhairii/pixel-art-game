"use client";

import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface TouchControlsProps {
  onInput: (input: { left: boolean; right: boolean; jump: boolean }) => void;
  currentInput: { left: boolean; right: boolean; jump: boolean };
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput, currentInput }) => {
  return (
    <div className="flex w-full max-w-4xl mx-auto items-center justify-between px-2 py-2 select-none touch-none">
      {/* Directional Pad */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, left: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, left: false });
          }}
          onMouseDown={() => onInput({ ...currentInput, left: true })}
          onMouseUp={() => onInput({ ...currentInput, left: false })}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
            currentInput.left
              ? "bg-rose-500/30 border border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 backdrop-blur-md"
          }`}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, right: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, right: false });
          }}
          onMouseDown={() => onInput({ ...currentInput, right: true })}
          onMouseUp={() => onInput({ ...currentInput, right: false })}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
            currentInput.right
              ? "bg-rose-500/30 border border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 backdrop-blur-md"
          }`}
          aria-label="Move Right"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Action / Jump Button */}
      <div>
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, jump: true });
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onInput({ ...currentInput, jump: false });
          }}
          onMouseDown={() => onInput({ ...currentInput, jump: true })}
          onMouseUp={() => onInput({ ...currentInput, jump: false })}
          className={`w-24 h-14 sm:w-28 sm:h-16 rounded-2xl flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer ${
            currentInput.jump
              ? "bg-rose-500/30 border border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 backdrop-blur-md"
          }`}
          aria-label="Jump"
        >
          <ArrowUp className="w-5 h-5" />
          <span>LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
