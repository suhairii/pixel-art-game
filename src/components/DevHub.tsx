"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  MapPin,
  Swords,
  Users,
  MessageSquare,
  Zap,
  ChevronDown,
  ChevronRight,
  Shield,
  Flame,
  Gauge,
  X,
  Play,
  Check,
  Sparkles,
} from "lucide-react";

export interface DevState {
  zone: "losari" | "perkampungan" | "stasiun_menara" | "stasiun_bekasi" | "bekasi";
  playerX: number;
  playerY: number;
  activeChar: "jihan" | "dani";
  isHairiFriend: boolean;
  isAdifFriend: boolean;
  isKeyFriend: boolean;
  godMode: boolean;
  oneHitKill: boolean;
  speedMult: number;
  bossStatus: {
    monster: { active: boolean; hp: number; maxHp: number; defeated: boolean };
    adif: { hp: number; maxHp: number; onTower: boolean };
    hairi: { hp: number; maxHp: number; phase: number };
    key: { inCombat: boolean; hp: number; maxHp: number; defeated: boolean };
  };
}

export interface DevActions {
  warpZone: (zone: "losari" | "perkampungan" | "stasiun_menara" | "stasiun_bekasi" | "bekasi", targetX?: number) => void;
  teleportPlayer: (x: number) => void;
  triggerBoss: (boss: "monster" | "adif_hairi" | "hairi_v2" | "hairi_v3" | "key") => void;
  defeatBoss: (boss: "monster" | "adif_hairi" | "key") => void;
  toggleFriend: (char: "hairi" | "adif" | "key", isFriend?: boolean) => void;
  unlockAllFriends: () => void;
  setGodMode: (enabled: boolean) => void;
  setOneHitKill: (enabled: boolean) => void;
  setSpeedMult: (mult: number) => void;
  triggerDialogue: (dialogueId: string) => void;
  switchActiveChar: () => void;
  getDevState: () => DevState;
}

interface DevHubProps {
  actions: DevActions | null;
  onClose?: () => void;
  isDefaultOpen?: boolean;
}

const DIALOGUE_OPTIONS: Array<{ category: string; id: string; label: string }> = [
  // Intro & Losari
  { category: "1. Intro & Losari", id: "intro_1", label: "Intro 1: Kedatangan di Losari" },
  { category: "1. Intro & Losari", id: "cat_1", label: "Kucing Oyen (Pesisir)" },
  { category: "1. Intro & Losari", id: "pisang_1", label: "Pisang Epe (Gerobak)" },
  { category: "1. Intro & Losari", id: "warkop_1", label: "Warkop Daeng Rauf" },
  { category: "1. Intro & Losari", id: "bench_1", label: "Bangku Memandang Senja" },
  { category: "1. Intro & Losari", id: "pier_1", label: "Ujung Dermaga Barat" },
  { category: "1. Intro & Losari", id: "panci_1", label: "Panci Misterius (Muncul Monster)" },
  { category: "1. Intro & Losari", id: "panci_defeat", label: "Panci Kalah & Muncul Portal" },

  // Perkampungan Menara
  { category: "2. Perkampungan & Duel", id: "adif_tower_1", label: "Adif di Atas Tower Sinyal" },
  { category: "2. Perkampungan & Duel", id: "adif_tower_2", label: "Adif Turun Tali ke Tanah" },
  { category: "2. Perkampungan & Duel", id: "adif_hairi_battle_start", label: "Mulai Duel Adif & Hairi" },
  { category: "2. Perkampungan & Duel", id: "hairi_evolution_1", label: "Evolusi Hairi V2 (Super Cyber)" },
  { category: "2. Perkampungan & Duel", id: "hairi_evolution_v3_1", label: "Evolusi Hairi V3 (Cyber Mage)" },
  { category: "2. Perkampungan & Duel", id: "adif_hairi_defeat", label: "Duel Selesai & Jadi Teman" },
  { category: "2. Perkampungan & Duel", id: "krl_station_1", label: "Stasiun KRL Naik Kereta" },

  // Bekasi Bantar Gebang
  { category: "3. Bekasi & Key", id: "bekasi_arrival_1", label: "Tiba di Stasiun Bekasi TPST" },
  { category: "3. Bekasi & Key", id: "key_encounter_1", label: "Tantangan Pertama Key" },
  { category: "3. Bekasi & Key", id: "key_defeat", label: "Key Kalah & Bergabung Sahabat" },
  { category: "3. Bekasi & Key", id: "key_friend_chat", label: "Ngobrol Akrab dengan Key" },
  { category: "3. Bekasi & Key", id: "supir_truk_1", label: "Pak Bambang (Supir Truk DLH)" },
  { category: "3. Bekasi & Key", id: "gundukan_sampah_1", label: "Mengais Timbunan Sampah" },
  { category: "3. Bekasi & Key", id: "kucing_garong_1", label: "Kucing Garong Belang TPA" },
  { category: "3. Bekasi & Key", id: "burung_bantar_1", label: "Kawanan Burung Gagak & Bangau" },
];

export const DevHub: React.FC<DevHubProps> = ({ actions, onClose, isDefaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const [activeTab, setActiveTab] = useState<"zones" | "bosses" | "squad" | "dialogs" | "cheats">("zones");
  const [customX, setCustomX] = useState("1000");
  const [selectedDialogue, setSelectedDialogue] = useState("intro_1");

  // Local mirror state for display
  const [devState, setDevState] = useState<DevState | null>(null);

  // Poll state every 300ms when open
  useEffect(() => {
    if (!actions || !isOpen) return;
    const interval = setInterval(() => {
      try {
        setDevState(actions.getDevState());
      } catch {}
    }, 250);
    return () => clearInterval(interval);
  }, [actions, isOpen]);

  // Global keyboard hotkey: Press ~ (Backquote) or F2 to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~" || e.key === "F2") {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 text-xs font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer backdrop-blur-md"
        title="Buka Dev & Stage Testing Hub (~ / F2)"
      >
        <Wrench className="w-3.5 h-3.5 animate-spin-slow" />
        <span>DEV HUB</span>
        <span className="text-[10px] text-white/50 bg-black/40 px-1 rounded">~</span>
      </button>
    );
  }

  const currentZone = devState?.zone || "losari";
  const playerX = devState?.playerX || 0;

  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 w-[94vw] sm:w-[420px] max-h-[92vh] flex flex-col rounded-2xl bg-slate-950/95 border border-cyan-500/40 text-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-xl overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-150">
      {/* Dev Hub Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/60 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold tracking-wider text-cyan-300">
                STAGE & DEV TEST HUB
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                PROD
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span>📍 {currentZone.toUpperCase()}</span>
              <span>•</span>
              <span>X: {playerX.toFixed(0)}</span>
              <span>•</span>
              <span className="text-amber-400">HOTKEY: ~</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Minimize Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 p-1 gap-1 text-[11px] font-mono font-bold">
        {[
          { id: "zones", label: "ZONES", icon: MapPin },
          { id: "bosses", label: "BOSSES", icon: Swords },
          { id: "squad", label: "SQUAD", icon: Users },
          { id: "dialogs", label: "DIALOGS", icon: MessageSquare },
          { id: "cheats", label: "CHEATS", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-all ${
                isActive
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-3 overflow-y-auto max-h-[68vh] space-y-3 font-mono text-xs">
        {/* TAB 1: ZONES & WARP */}
        {activeTab === "zones" && (
          <div className="space-y-3">
            {/* Zone 1: Losari */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>🌊 ZONA 1: PANTAI LOSARI</span>
                <span className="text-[10px] text-slate-400">MAKASSAR</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.warpZone("losari", 200)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-left transition-all"
                >
                  📍 Pesisir Awal (x: 200)
                </button>
                <button
                  onClick={() => actions?.warpZone("losari", 1180)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-left transition-all"
                >
                  🍌 Pisang Epe (x: 1180)
                </button>
                <button
                  onClick={() => actions?.warpZone("losari", 1680)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-left transition-all"
                >
                  ☕ Warkop Rauf (x: 1680)
                </button>
                <button
                  onClick={() => actions?.warpZone("losari", 2150)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-left transition-all font-bold text-yellow-300"
                >
                  🍲 Panci Purba (x: 2150)
                </button>
              </div>
            </div>

            {/* Zone 2: Perkampungan */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span>⚡ ZONA 2: PERKAMPUNGAN</span>
                <span className="text-[10px] text-slate-400">MENARA TRANSMISI</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.warpZone("perkampungan", 280)}
                  className="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-left transition-all"
                >
                  🌀 Portal Losari (x: 280)
                </button>
                <button
                  onClick={() => actions?.warpZone("perkampungan", 1080)}
                  className="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-left transition-all"
                >
                  🗼 Tower 02 (x: 1080)
                </button>
                <button
                  onClick={() => actions?.warpZone("perkampungan", 1710)}
                  className="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-left transition-all font-bold text-sky-300"
                >
                  🤠 Tower Adif (x: 1710)
                </button>
                <button
                  onClick={() => actions?.warpZone("perkampungan", 2750)}
                  className="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-left transition-all font-bold text-yellow-300"
                >
                  🌀 Portal Stasiun (x: 2750)
                </button>
              </div>
            </div>

            {/* Zone 3: Stasiun Menara */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>🚉 ZONA 3: STASIUN KAMPUNG MENARA</span>
                <span className="text-[10px] text-slate-400">JALUR 1 COMMUTER</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.warpZone("stasiun_menara", 140)}
                  className="px-2 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-left transition-all"
                >
                  🌀 Portal Keluar (x: 140)
                </button>
                <button
                  onClick={() => actions?.warpZone("stasiun_menara", 620)}
                  className="px-2 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-left transition-all font-bold text-yellow-300"
                >
                  🚪 KRL ke Bekasi (x: 620)
                </button>
              </div>
            </div>

            {/* Zone 4: Stasiun Bekasi */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>🚉 ZONA 4: STASIUN BEKASI</span>
                <span className="text-[10px] text-slate-400">BKS +19M</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.warpZone("stasiun_bekasi", 550)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-left transition-all font-bold text-yellow-300"
                >
                  🚪 KRL ke Menara (x: 550)
                </button>
                <button
                  onClick={() => actions?.warpZone("stasiun_bekasi", 1050)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-left transition-all font-bold text-pink-300"
                >
                  🚪 Pintu Keluar Stasiun (x: 1050)
                </button>
              </div>
            </div>

            {/* Zone 5: Bekasi Bantar Gebang */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>🚛 ZONA 5: KOTA BEKASI</span>
                <span className="text-[10px] text-slate-400">TPST BANTAR GEBANG</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.warpZone("bekasi", 140)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-left transition-all"
                >
                  🚇 Gerbang Stasiun (x: 140)
                </button>
                <button
                  onClick={() => actions?.warpZone("bekasi", 750)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-left transition-all"
                >
                  🚛 Truk Sampah (x: 750)
                </button>
                <button
                  onClick={() => actions?.warpZone("bekasi", 1100)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-left transition-all"
                >
                  🗑️ Gundukan Antik (x: 1100)
                </button>
                <button
                  onClick={() => actions?.warpZone("bekasi", 1450)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-left transition-all font-bold text-pink-300"
                >
                  💜 Boss Key OP (x: 1450)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOSSES & COMBAT */}
        {activeTab === "bosses" && (
          <div className="space-y-3">
            {/* Siluman Panci */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>👹 BATARA SILUMAN PANCI</span>
                <span className="text-[10px] text-slate-400">ZONA 1</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.triggerBoss("monster")}
                  className="px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold transition-all"
                >
                  ⚡ Spawn / Bangkitkan
                </button>
                <button
                  onClick={() => actions?.defeatBoss("monster")}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-bold transition-all"
                >
                  💀 Insta-Kalahkan Panci
                </button>
              </div>
            </div>

            {/* Duel Adif & Hairi */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>⚔️ DUEL ADIF & HAIRI</span>
                <span className="text-[10px] text-slate-400">ZONA 2</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.triggerBoss("adif_hairi")}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold transition-all"
                >
                  🔥 Mulai Duel Lv.1
                </button>
                <button
                  onClick={() => actions?.triggerBoss("hairi_v2")}
                  className="px-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-bold transition-all"
                >
                  ⚡ Super Hairi (Lv.2)
                </button>
                <button
                  onClick={() => actions?.triggerBoss("hairi_v3")}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold transition-all"
                >
                  🔮 Cyber Mage (Lv.3)
                </button>
                <button
                  onClick={() => actions?.defeatBoss("adif_hairi")}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-bold transition-all"
                >
                  🤝 Kalahkan & Jadikan Teman
                </button>
              </div>
            </div>

            {/* Key Bantar Gebang */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>💜 KEY • MAGE BANTAR GEBANG</span>
                <span className="text-[10px] text-slate-400">ZONA 3 (OP)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => actions?.triggerBoss("key")}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold transition-all"
                >
                  ⚔️ Mulai Battle Key OP
                </button>
                <button
                  onClick={() => actions?.defeatBoss("key")}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-bold transition-all"
                >
                  🤝 Kalahkan & Jadikan Teman
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SQUAD CONTROLLER */}
        {activeTab === "squad" && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>👥 ANGGOTA TIM SAHABAT</span>
                <button
                  onClick={() => actions?.switchActiveChar()}
                  className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40"
                >
                  Ganti Lead: {devState?.activeChar?.toUpperCase() || "JIHAN"}
                </button>
              </div>

              {/* Instant 5-Party Full Squad */}
              <button
                onClick={() => actions?.unlockAllFriends()}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-400/50 text-yellow-300 font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AKTIFKAN FULL SQUAD 5 SAHABAT</span>
              </button>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* Hairi Friend Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="font-bold text-white">Hairi (Kaos Abu-abu)</div>
                      <div className="text-[10px] text-slate-400">Pukulan Tinju & Rekan Setia</div>
                    </div>
                  </div>
                  <button
                    onClick={() => actions?.toggleFriend("hairi")}
                    className={`px-3 py-1 rounded-md font-bold text-[11px] border transition-all ${
                      devState?.isHairiFriend
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {devState?.isHairiFriend ? "✓ SAHABAT" : "NONAKTIF"}
                  </button>
                </div>

                {/* Adif Friend Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤠</span>
                    <div>
                      <div className="font-bold text-white">Adif (Koboi Menara)</div>
                      <div className="text-[10px] text-slate-400">Cambuk Laso & Knuckle Rush</div>
                    </div>
                  </div>
                  <button
                    onClick={() => actions?.toggleFriend("adif")}
                    className={`px-3 py-1 rounded-md font-bold text-[11px] border transition-all ${
                      devState?.isAdifFriend
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {devState?.isAdifFriend ? "✓ SAHABAT" : "NONAKTIF"}
                  </button>
                </div>

                {/* Key Friend Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💜</span>
                    <div>
                      <div className="font-bold text-white">Key (Mage Bantar Gebang)</div>
                      <div className="text-[10px] text-slate-400">Teleportasi & Tembakan Sampah</div>
                    </div>
                  </div>
                  <button
                    onClick={() => actions?.toggleFriend("key")}
                    className={`px-3 py-1 rounded-md font-bold text-[11px] border transition-all ${
                      devState?.isKeyFriend
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {devState?.isKeyFriend ? "✓ SAHABAT" : "NONAKTIF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIALOGUE TESTER */}
        {activeTab === "dialogs" && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2.5">
              <div className="text-emerald-400 font-bold">💬 PENGUJIAN DIALOG & CERITA</div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">PILIH CUTSCENE / DIALOG:</label>
                <select
                  value={selectedDialogue}
                  onChange={(e) => setSelectedDialogue(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                >
                  {DIALOGUE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      [{opt.category}] {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => actions?.triggerDialogue(selectedDialogue)}
                className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>MAINKAN DIALOG ({selectedDialogue})</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: CHEATS & DEBUG STATS */}
        {activeTab === "cheats" && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2.5">
              <div className="text-cyan-300 font-bold">⚡ CHEATS & GAMEPLAY MULTIPLIER</div>

              <div className="grid grid-cols-2 gap-2">
                {/* God Mode */}
                <button
                  onClick={() => actions?.setGodMode(!devState?.godMode)}
                  className={`p-2 rounded-lg font-bold border flex flex-col items-center gap-1 transition-all ${
                    devState?.godMode
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : "bg-white/5 text-slate-400 border-white/10"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>GOD MODE {devState?.godMode ? "(ON)" : "(OFF)"}</span>
                </button>

                {/* One Hit Kill */}
                <button
                  onClick={() => actions?.setOneHitKill(!devState?.oneHitKill)}
                  className={`p-2 rounded-lg font-bold border flex flex-col items-center gap-1 transition-all ${
                    devState?.oneHitKill
                      ? "bg-rose-500/20 text-rose-300 border-rose-400/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                      : "bg-white/5 text-slate-400 border-white/10"
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>1-HIT KILL {devState?.oneHitKill ? "(ON)" : "(OFF)"}</span>
                </button>
              </div>

              {/* Speed Multiplier */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">KECEPATAN LARI PLAYER:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 1.5, 2, 3].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => actions?.setSpeedMult(speed)}
                      className={`py-1 rounded font-bold border text-center transition-all ${
                        devState?.speedMult === speed
                          ? "bg-cyan-500/30 text-cyan-200 border-cyan-400"
                          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinate Warp Input */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">TELEPORT KOORDINAT X (0 - 3000):</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="100"
                    max="2900"
                    value={customX}
                    onChange={(e) => setCustomX(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/20 rounded-lg px-2 py-1 text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      const num = parseInt(customX, 10);
                      if (!isNaN(num)) actions?.teleportPlayer(num);
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold"
                  >
                    WARP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-2 bg-black/60 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>Tekan <kbd className="px-1 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">~</kbd> atau <kbd className="px-1 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">F2</kbd> untuk buka/tutup</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-cyan-400 hover:text-cyan-200 underline font-bold"
        >
          Tutup Panel
        </button>
      </div>
    </div>
  );
};
