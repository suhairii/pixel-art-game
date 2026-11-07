"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, Quote } from "lucide-react";
import { StoryBeat } from "@/lib/storyData";

interface StoryDialogProps {
  story: StoryBeat;
  mode: "intro" | "clear";
  onProceed: () => void;
}

export const StoryDialog: React.FC<StoryDialogProps> = ({ story, mode, onProceed }) => {
  const isIntro = mode === "intro";
  const title = isIntro ? story.introTitle : story.clearTitle;
  const paragraphs = isIntro ? story.introText : story.clearText;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-xl rounded-[2rem] p-6 sm:p-8 bg-gradient-to-b from-[#131722] via-[#0d1017] to-[#07090e] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle Decorative Songket Grid Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-mono tracking-widest uppercase font-semibold">
            <Compass className="w-3 h-3 text-rose-400" />
            <span>{story.badge}</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase font-medium">
            {story.location}
          </span>
        </div>

        {/* Character Portrait & Intro Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
          {/* Dani's Portrait Frame */}
          <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            <div className="relative w-full h-full rounded-[0.85rem] overflow-hidden bg-[#0d1017]">
              <Image
                src="/dani-portrait.png"
                alt="Dani - Pengembara Berhijab Asal Malaysia"
                fill
                sizes="(max-width: 768px) 96px, 112px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-[9px] font-mono uppercase font-bold text-white shadow-md">
              DANI
            </div>
          </div>

          {/* Narrative Content */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
              {title}
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Quote Banner */}
        {isIntro && (
          <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs italic text-amber-200/90 font-serif leading-snug">
              {story.quote}
            </p>
          </div>
        )}

        {/* Action Button (Button-in-Button Pattern) */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onProceed}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-[0_0_25px_rgba(244,63,94,0.4)]"
          >
            <span>{isIntro ? "MULAKAN KEMBARA" : "TERUSKAN KEMBARA"}</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
