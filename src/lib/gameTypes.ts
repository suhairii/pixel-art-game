export type CharacterId = "jihan" | "dani";

export type CharacterPose =
  | "idle_stand"
  | "idle_look"
  | "walk_1"
  | "walk_2"
  | "walk_3"
  | "run_1"
  | "run_2"
  | "inspect"
  | "talk"
  | "happy";

export interface InteractiveObject {
  id: string;
  type: "cat" | "pisang_epe" | "warkop" | "bench" | "bicycle" | "pier_edge";
  x: number;
  y: number;
  width: number;
  height: number;
  prompt: string;
  interacted: boolean;
  dialogueId: string;
}

export interface DialogueChoice {
  text: string;
  nextId?: string;
  action?: "eat_pisang_epe" | "pet_cat" | "drink_saraba" | "switch_character";
}

export interface DialogueLine {
  id: string;
  speaker: "jihan" | "dani" | "daeng_rauf" | "kucing_oyen" | "narator" | "adif" | "hairi" | "key";
  speakerName: string;
  portrait: string;
  text: string;
  emotion?: "happy" | "warm" | "surprised" | "thoughtful";
  choices?: DialogueChoice[];
  nextId?: string;
}

export interface CloudLayer {
  x: number;
  y: number;
  speed: number;
  scale: number;
  variant: 0 | 1 | 2; // cumulus, cirrus, tuft
}

export interface FlyingBird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  frame: number;
  timer: number;
}

// Legacy Platformer types for backwards-compatibility
export type DaniPoseState = CharacterPose | "idle_1" | "idle_2" | "run_3" | "run_4" | "jump_takeoff" | "jump_apex" | "jump_fall" | "land_impact" | "stomp" | "victory";
export interface Rect { x: number; y: number; width: number; height: number; }
export interface Player extends Rect { vx: number; vy: number; isGrounded: boolean; facingLeft: boolean; health: number; maxHealth: number; karipapCount: number; tehTarikCount: number; score: number; pose: DaniPoseState; poseTimer: number; invincibleTimer: number; }
export interface Enemy extends Rect { id: number; vx: number; startX: number; distance: number; isAlive: boolean; squishTimer: number; enemyType: "slime" | "drone" | "stone"; }
export interface CollectibleItem extends Rect { id: number; type: "karipap" | "tehTarik" | "bungaRaya"; collected: boolean; floatOffset: number; }
export interface Platform extends Rect { type: "ground" | "floating" | "bamboo" | "roof" | "granite"; }
export interface Particle { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number; maxLife: number; }
export interface LevelData { id: number; name: string; subtitle: string; locationTag: string; theme: "kampung" | "klcc" | "kinabalu"; skyGradient: [string, string]; spawn: { x: number; y: number }; exit: Rect; platforms: Platform[]; items: CollectibleItem[]; enemies: Enemy[]; worldWidth: number; }

