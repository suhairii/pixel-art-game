export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DaniPoseState =
  | "idle_1"
  | "idle_2"
  | "run_1"
  | "run_2"
  | "run_3"
  | "run_4"
  | "jump_takeoff"
  | "jump_apex"
  | "jump_fall"
  | "land_impact"
  | "stomp"
  | "victory";

export interface Player extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  facingLeft: boolean;
  health: number;
  maxHealth: number;
  karipapCount: number;
  tehTarikCount: number;
  score: number;
  pose: DaniPoseState;
  poseTimer: number;
  invincibleTimer: number;
}

export interface Enemy extends Rect {
  id: number;
  vx: number;
  startX: number;
  distance: number;
  isAlive: boolean;
  squishTimer: number;
  enemyType: "slime" | "drone" | "stone";
}

export interface CollectibleItem extends Rect {
  id: number;
  type: "karipap" | "tehTarik" | "bungaRaya";
  collected: boolean;
  floatOffset: number;
}

export interface Platform extends Rect {
  type: "ground" | "floating" | "bamboo" | "roof" | "granite";
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  locationTag: string;
  theme: "kampung" | "klcc" | "kinabalu";
  skyGradient: [string, string];
  spawn: { x: number; y: number };
  exit: Rect;
  platforms: Platform[];
  items: CollectibleItem[];
  enemies: Enemy[];
  worldWidth: number;
}
