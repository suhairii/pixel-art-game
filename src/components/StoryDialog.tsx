"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, ChevronRight, Check } from "lucide-react";
import { DialogueLine, DialogueChoice } from "@/lib/gameTypes";
import { sound } from "@/lib/sound";

interface StoryDialogProps {
  dialogue: DialogueLine | null;
  onNext: (nextId?: string) => void;
  onClose: () => void;
  onChoice: (choice: DialogueChoice) => void;
}

export const StoryDialog: React.FC<StoryDialogProps> = ({
  dialogue,
  onNext,
  onClose,
  onChoice,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!dialogue) {
      setDisplayedText("");
      return;
    }

    const fullText = dialogue.text;
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        if (index % 3 === 0) {
          sound.playTypewriter();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [dialogue]);

  if (!dialogue) return null;

  const handleSkipOrNext = () => {
    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      if (dialogue.nextId) {
        onNext(dialogue.nextId);
      } else if (!dialogue.choices || dialogue.choices.length === 0) {
        onClose();
      }
    }
  };

  const isJihan = dialogue.speaker === "jihan";
  const isDani = dialogue.speaker === "dani";
  const isCat = dialogue.speaker === "kucing_oyen";
  const isDaeng = dialogue.speaker === "daeng_rauf";
  const isAdif = dialogue.speaker === "adif";
  const isHairi = dialogue.speaker === "hairi";
  const isKey = dialogue.speaker === "key";

  const speakerBadge = isJihan
    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
    : isDani
    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
    : isCat
    ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
    : isAdif
    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
    : isHairi
    ? "bg-red-500/20 text-red-300 border-red-500/40"
    : isKey
    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";

  const portraitBorder = isJihan
    ? "from-amber-400 via-yellow-500 to-amber-600"
    : isDani
    ? "from-rose-400 via-pink-500 to-cyan-400"
    : isAdif
    ? "from-blue-400 via-indigo-500 to-sky-400"
    : isHairi
    ? "from-red-500 via-orange-500 to-amber-500"
    : isKey
    ? "from-purple-500 via-fuchsia-500 to-emerald-400"
    : "from-amber-500 to-orange-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-6 z-40 flex flex-col items-center select-none"
    >
      <div
        onClick={handleSkipOrNext}
        className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-[#090b10]/95 backdrop-blur-xl border border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.85)] cursor-pointer overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-20 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3 sm:gap-5">
          {/* Character Portrait */}
          <div
            className={`relative shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl p-0.5 bg-gradient-to-br ${portraitBorder} shadow-lg`}
          >
            <div className="relative w-full h-full rounded-[0.85rem] sm:rounded-[1rem] overflow-hidden bg-[#12151f]">
              <Image
                src={dialogue.portrait}
                alt={dialogue.speakerName}
                fill
                sizes="(max-width: 640px) 64px, 96px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Dialogue Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[4.5rem] sm:min-h-[5.5rem]">
            {/* Header / Name Tag */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-wide uppercase ${speakerBadge}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{dialogue.speakerName}</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
                [Klik / Enter untuk Lanjut]
              </span>
            </div>

            {/* Text Box */}
            <p className="text-xs sm:text-base text-white/90 leading-relaxed font-sans mb-2 font-medium">
              {displayedText}
              {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />}
            </p>

            {/* Choices or Next Indicator */}
            {dialogue.choices && dialogue.choices.length > 0 && !isTyping ? (
              <div className="flex flex-wrap gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                {dialogue.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playInteract();
                      onChoice(choice);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/50 text-white hover:text-amber-200 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>{choice.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex justify-end items-center gap-1 text-[11px] font-mono text-amber-400/80">
                <span>{dialogue.nextId ? "Lanjut" : "Selesai"}</span>
                <ChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
