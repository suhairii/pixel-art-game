export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  facingLeft: boolean;
  health: number;
  maxHealth: number;
  coins: number;
  score: number;
  state: "idle" | "run" | "jump" | "hurt";
  invincibleTimer: number;
}

export interface Enemy extends Rect {
  id: number;
  vx: number;
  startX: number;
  distance: number;
  isAlive: boolean;
  squishTimer: number;
}

export interface Coin extends Rect {
  id: number;
  collected: boolean;
  floatOffset: number;
}

export interface Platform extends Rect {
  type: "ground" | "floating" | "brick" | "hazard";
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
  theme: "emerald" | "neon" | "sunset";
  skyGradient: [string, string];
  spawn: { x: number; y: number };
  exit: Rect;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  worldWidth: number;
}
