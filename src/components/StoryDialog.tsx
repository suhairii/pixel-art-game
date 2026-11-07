"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Quote } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-[1.6rem] sm:rounded-[2rem] p-4 sm:p-7 bg-gradient-to-b from-[#131722] via-[#0d1017] to-[#07090e] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-semibold">
              <Compass className="w-3 h-3 text-rose-400" />
              <span>{story.badge}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 tracking-wider uppercase font-medium">
              {story.location}
            </span>
          </div>

          {/* Character & Text Layout */}
          <div className="flex items-start gap-3.5 sm:gap-5 mb-3.5">
            {/* Dani Portrait */}
            <div className="relative shrink-0 w-14 h-14 sm:w-24 sm:h-24 rounded-xl p-0.5 bg-gradient-to-br from-rose-400 via-purple-500 to-cyan-400 shadow-lg">
              <div className="relative w-full h-full rounded-[0.65rem] sm:rounded-[0.8rem] overflow-hidden bg-[#0d1017]">
                <Image
                  src="/dani-portrait.png"
                  alt="Dani"
                  fill
                  sizes="(max-width: 640px) 56px, 96px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Title & Paragraphs */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-white mb-1.5 leading-snug">
                {title}
              </h3>
              <div className="space-y-1.5 text-xs text-white/75 leading-relaxed font-sans">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Quote Banner */}
          {isIntro && (
            <div className="mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs italic text-amber-200/90 font-serif leading-snug">
                {story.quote}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onProceed}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-lg cursor-pointer"
          >
            <span>{isIntro ? "MULAKAN KEMBARA" : "TERUSKAN KEMBARA"}</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
