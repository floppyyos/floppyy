"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TILE = 64;
const MAP_W = 16;
const MAP_H = 16;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const MOVE_SPEED = 3;
const ROT_SPEED = 0.05;
const MAX_DEPTH = 800;
const WEAPON_COOLDOWN = 500;
const ENEMY_SPEED = 1.2;
const ENEMY_ATTACK_RANGE = 80;
const ENEMY_DAMAGE = 10;
const ENEMY_ATTACK_COOLDOWN = 1500;

// 1=wall, 2=wall variant, 3=door, 0=empty
const LEVELS: number[][][] = [
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,2,2,0,0,0,0,2,2,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,2,2,0,0,0,0,2,2,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,1,0,0,1,0,0,0,0,1,0,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,1,0,0,0,0,1,1,0,0,0,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,2],
    [2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,1,0,0,0,0,1,1,0,0,0,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,1,0,0,1,0,0,0,0,1,0,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],
];

const ENEMY_SPAWNS: { x: number; y: number }[][] = [
  [
    { x: 5, y: 5 }, { x: 10, y: 5 }, { x: 7, y: 10 },
    { x: 12, y: 12 }, { x: 3, y: 12 },
  ],
  [
    { x: 3, y: 3 }, { x: 12, y: 3 }, { x: 7, y: 7 },
    { x: 3, y: 12 }, { x: 12, y: 12 }, { x: 8, y: 5 },
    { x: 5, y: 9 },
  ],
  [
    { x: 3, y: 3 }, { x: 12, y: 3 }, { x: 7, y: 7 },
    { x: 3, y: 12 }, { x: 12, y: 12 }, { x: 8, y: 5 },
    { x: 5, y: 9 }, { x: 10, y: 10 }, { x: 6, y: 13 },
  ],
];

type Enemy = {
  x: number;
  y: number;
  health: number;
  alive: boolean;
  lastAttack: number;
  type: "imp" | "demon";
  hitFlash: number;
};

type Pickup = {
  x: number;
  y: number;
  type: "health" | "ammo";
  collected: boolean;
};

type GameState = {
  playerX: number;
  playerY: number;
  playerAngle: number;
  health: number;
  ammo: number;
  score: number;
  level: number;
  enemies: Enemy[];
  pickups: Pickup[];
  shooting: boolean;
  lastShot: number;
  gameOver: boolean;
  won: boolean;
  screenFlash: string | null;
};

function getWallColor(type: number, side: boolean, dist: number): string {
  const shade = Math.max(0.2, 1 - dist / MAX_DEPTH);
  if (type === 1) {
    const r = Math.floor((side ? 139 : 100) * shade);
    const g = Math.floor((side ? 69 : 50) * shade);
    const b = Math.floor((side ? 19 : 10) * shade);
    return `rgb(${r},${g},${b})`;
  }
  if (type === 2) {
    const r = Math.floor((side ? 80 : 60) * shade);
    const g = Math.floor((side ? 80 : 60) * shade);
    const b = Math.floor((side ? 90 : 70) * shade);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.floor((side ? 60 : 45) * shade);
  const g = Math.floor((side ? 100 : 75) * shade);
  const b = Math.floor((side ? 60 : 45) * shade);
  return `rgb(${r},${g},${b})`;
}

export function Doom({ playSound }: { playSound: (name: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [hudState, setHudState] = useState({
    health: 100, ammo: 50, score: 0, level: 1, gameOver: false, won: false,
  });

  const initLevel = useCallback((level: number): GameState => {
    const enemies: Enemy[] = ENEMY_SPAWNS[level].map((spawn, i) => ({
      x: spawn.x * TILE + TILE / 2,
      y: spawn.y * TILE + TILE / 2,
      health: level === 2 ? 40 : 30,
      alive: true,
      lastAttack: 0,
      type: i % 2 === 0 ? "imp" : "demon",
      hitFlash: 0,
    }));

    const pickups: Pickup[] = [
      { x: 7 * TILE + 32, y: 3 * TILE + 32, type: "health", collected: false },
      { x: 12 * TILE + 32, y: 7 * TILE + 32, type: "ammo", collected: false },
      { x: 4 * TILE + 32, y: 11 * TILE + 32, type: "health", collected: false },
      { x: 10 * TILE + 32, y: 13 * TILE + 32, type: "ammo", collected: false },
    ];

    return {
      playerX: 1.5 * TILE,
      playerY: 1.5 * TILE,
      playerAngle: 0,
      health: gameRef.current?.health ?? 100,
      ammo: gameRef.current?.ammo ?? 50,
      score: gameRef.current?.score ?? 0,
      level,
      enemies,
      pickups,
      shooting: false,
      lastShot: 0,
      gameOver: false,
      won: false,
      screenFlash: null,
    };
  }, []);

  const startGame = useCallback(() => {
    gameRef.current = initLevel(0);
    gameRef.current.health = 100;
    gameRef.current.ammo = 50;
    gameRef.current.score = 0;
    setGameStarted(true);
    setHudState({ health: 100, ammo: 50, score: 0, level: 1, gameOver: false, won: false });
    playSound("click");
  }, [initLevel, playSound]);

  const render = useCallback((ctx: CanvasRenderingContext2D, state: GameState) => {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const map = LEVELS[state.level];

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H / 2);
    skyGrad.addColorStop(0, "#1a0000");
    skyGrad.addColorStop(1, "#330000");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H / 2);

    const floorGrad = ctx.createLinearGradient(0, H / 2, 0, H);
    floorGrad.addColorStop(0, "#1a1a1a");
    floorGrad.addColorStop(1, "#333333");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, H / 2, W, H / 2);

    // Raycasting - cast a ray for each column
    const numRays = W;
    const depthBuffer: number[] = new Array(numRays).fill(MAX_DEPTH);

    for (let i = 0; i < numRays; i++) {
      const rayAngle = state.playerAngle - HALF_FOV + (i / numRays) * FOV;
      const sin = Math.sin(rayAngle);
      const cos = Math.cos(rayAngle);

      let dist = 0;
      let hitWall = 0;
      let hitSide = false;

      // DDA raycasting
      while (dist < MAX_DEPTH) {
        dist += 1;
        const testX = state.playerX + cos * dist;
        const testY = state.playerY + sin * dist;
        const mapX = Math.floor(testX / TILE);
        const mapY = Math.floor(testY / TILE);

        if (mapX < 0 || mapX >= MAP_W || mapY < 0 || mapY >= MAP_H) {
          dist = MAX_DEPTH;
          break;
        }

        if (map[mapY][mapX] > 0) {
          hitWall = map[mapY][mapX];
          // Determine which side was hit for shading
          const dx = testX - mapX * TILE;
          const dy = testY - mapY * TILE;
          hitSide = (dx < 1 || dx > TILE - 1);
          break;
        }
      }

      // Fix fisheye
      const correctedDist = dist * Math.cos(rayAngle - state.playerAngle);
      depthBuffer[i] = correctedDist;

      const wallHeight = Math.min(H * 2, (TILE * H) / (correctedDist || 1));
      const wallTop = (H - wallHeight) / 2;

      if (hitWall > 0) {
        ctx.fillStyle = getWallColor(hitWall, hitSide, correctedDist);
        ctx.fillRect(i, wallTop, 1, wallHeight);
      }
    }

    // Sort enemies by distance (far first)
    const enemiesWithDist = state.enemies
      .filter((e) => e.alive)
      .map((e) => {
        const dx = e.x - state.playerX;
        const dy = e.y - state.playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return { ...e, dist, angle };
      })
      .sort((a, b) => b.dist - a.dist);

    for (const enemy of enemiesWithDist) {
      let angleDiff = enemy.angle - state.playerAngle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      if (Math.abs(angleDiff) < HALF_FOV + 0.1) {
        const screenX = (0.5 + angleDiff / FOV) * W;
        const correctedDist = enemy.dist * Math.cos(angleDiff);
        const spriteHeight = Math.min(H * 1.5, (TILE * H) / (correctedDist || 1));
        const spriteWidth = spriteHeight * 0.6;
        const spriteTop = (H - spriteHeight) / 2;
        const spriteLeft = screenX - spriteWidth / 2;

        // Check if sprite is behind wall
        const col = Math.floor(screenX);
        if (col >= 0 && col < W && correctedDist < depthBuffer[col]) {
          const flash = enemy.hitFlash > Date.now() - 100;
          const baseColor = enemy.type === "imp"
            ? (flash ? "#ff8800" : "#8b2500")
            : (flash ? "#ff4444" : "#4a0000");
          const eyeColor = enemy.type === "imp" ? "#ffff00" : "#ff0000";

          ctx.fillStyle = baseColor;
          ctx.fillRect(
            spriteLeft + spriteWidth * 0.2,
            spriteTop + spriteHeight * 0.2,
            spriteWidth * 0.6,
            spriteHeight * 0.7
          );

          ctx.fillStyle = baseColor;
          ctx.beginPath();
          ctx.arc(
            spriteLeft + spriteWidth * 0.5,
            spriteTop + spriteHeight * 0.25,
            spriteWidth * 0.2,
            0, Math.PI * 2
          );
          ctx.fill();

          ctx.fillStyle = eyeColor;
          ctx.fillRect(
            spriteLeft + spriteWidth * 0.38,
            spriteTop + spriteHeight * 0.22,
            spriteWidth * 0.08,
            spriteWidth * 0.08
          );
          ctx.fillRect(
            spriteLeft + spriteWidth * 0.54,
            spriteTop + spriteHeight * 0.22,
            spriteWidth * 0.08,
            spriteWidth * 0.08
          );

          if (enemy.type === "demon") {
            ctx.fillStyle = "#660000";
            ctx.fillRect(
              spriteLeft + spriteWidth * 0.3,
              spriteTop + spriteHeight * 0.1,
              spriteWidth * 0.08,
              spriteHeight * 0.15
            );
            ctx.fillRect(
              spriteLeft + spriteWidth * 0.62,
              spriteTop + spriteHeight * 0.1,
              spriteWidth * 0.08,
              spriteHeight * 0.15
            );
          }

          ctx.fillStyle = baseColor;
          ctx.fillRect(
            spriteLeft + spriteWidth * 0.05,
            spriteTop + spriteHeight * 0.35,
            spriteWidth * 0.15,
            spriteHeight * 0.35
          );
          ctx.fillRect(
            spriteLeft + spriteWidth * 0.8,
            spriteTop + spriteHeight * 0.35,
            spriteWidth * 0.15,
            spriteHeight * 0.35
          );
        }
      }
    }

    const pickupsWithDist = state.pickups
      .filter((p) => !p.collected)
      .map((p) => {
        const dx = p.x - state.playerX;
        const dy = p.y - state.playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return { ...p, dist, angle };
      })
      .sort((a, b) => b.dist - a.dist);

    for (const pickup of pickupsWithDist) {
      let angleDiff = pickup.angle - state.playerAngle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      if (Math.abs(angleDiff) < HALF_FOV) {
        const screenX = (0.5 + angleDiff / FOV) * W;
        const correctedDist = pickup.dist * Math.cos(angleDiff);
        const size = Math.min(60, (TILE * H * 0.3) / (correctedDist || 1));
        const col = Math.floor(screenX);

        if (col >= 0 && col < W && correctedDist < depthBuffer[col]) {
          const py = H / 2 + size;
          ctx.fillStyle = pickup.type === "health" ? "#00ff00" : "#ffaa00";
          ctx.fillRect(screenX - size / 2, py - size, size, size);
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.max(8, size * 0.5)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(
            pickup.type === "health" ? "+" : "A",
            screenX, py - size / 3
          );
        }
      }
    }

    const weaponBob = Math.sin(Date.now() / 200) * 2;
    const shooting = state.shooting && Date.now() - state.lastShot < 150;

    ctx.fillStyle = "#444";
    ctx.fillRect(W / 2 - 8, H - 120 + weaponBob + (shooting ? -8 : 0), 16, 80);
    ctx.fillStyle = "#333";
    ctx.fillRect(W / 2 - 6, H - 120 + weaponBob + (shooting ? -8 : 0), 12, 75);

    ctx.fillStyle = "#5a3a1a";
    ctx.fillRect(W / 2 - 20, H - 50 + weaponBob, 40, 50);
    ctx.fillStyle = "#4a2a0a";
    ctx.fillRect(W / 2 - 16, H - 45 + weaponBob, 32, 45);

    if (shooting) {
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(W / 2, H - 128 + weaponBob, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff8800";
      ctx.beginPath();
      ctx.arc(W / 2, H - 128 + weaponBob, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 10, H / 2);
    ctx.lineTo(W / 2 - 4, H / 2);
    ctx.moveTo(W / 2 + 4, H / 2);
    ctx.lineTo(W / 2 + 10, H / 2);
    ctx.moveTo(W / 2, H / 2 - 10);
    ctx.lineTo(W / 2, H / 2 - 4);
    ctx.moveTo(W / 2, H / 2 + 4);
    ctx.lineTo(W / 2, H / 2 + 10);
    ctx.stroke();

    if (state.screenFlash) {
      ctx.fillStyle = state.screenFlash;
      ctx.fillRect(0, 0, W, H);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const state = gameRef.current;
    if (!canvas || !ctx || !state || state.gameOver || state.won) return;

    const keys = keysRef.current;
    const map = LEVELS[state.level];
    const now = Date.now();

    let moveX = 0;
    let moveY = 0;
    const cos = Math.cos(state.playerAngle);
    const sin = Math.sin(state.playerAngle);

    if (keys.has("w") || keys.has("arrowup")) {
      moveX += cos * MOVE_SPEED;
      moveY += sin * MOVE_SPEED;
    }
    if (keys.has("s") || keys.has("arrowdown")) {
      moveX -= cos * MOVE_SPEED;
      moveY -= sin * MOVE_SPEED;
    }
    if (keys.has("a")) {
      moveX += sin * MOVE_SPEED;
      moveY -= cos * MOVE_SPEED;
    }
    if (keys.has("d")) {
      moveX -= sin * MOVE_SPEED;
      moveY += cos * MOVE_SPEED;
    }
    if (keys.has("arrowleft") || keys.has("q")) {
      state.playerAngle -= ROT_SPEED;
    }
    if (keys.has("arrowright") || keys.has("e")) {
      state.playerAngle += ROT_SPEED;
    }

    // Collision detection with wall sliding
    const margin = 10;
    const newX = state.playerX + moveX;
    const newY = state.playerY + moveY;

    const cellX = Math.floor(newX / TILE);
    const cellY = Math.floor(newY / TILE);
    const currCellX = Math.floor(state.playerX / TILE);
    const currCellY = Math.floor(state.playerY / TILE);

    if (cellX >= 0 && cellX < MAP_W && map[currCellY][cellX] === 0) {
      // Check margin
      const inCellX = newX - cellX * TILE;
      if (inCellX > margin && inCellX < TILE - margin) {
        state.playerX = newX;
      }
    }
    if (cellY >= 0 && cellY < MAP_H && map[cellY][currCellX] === 0) {
      const inCellY = newY - cellY * TILE;
      if (inCellY > margin && inCellY < TILE - margin) {
        state.playerY = newY;
      }
    }

    // ===== SHOOTING =====
    if (keys.has(" ") || keys.has("enter")) {
      if (now - state.lastShot > WEAPON_COOLDOWN && state.ammo > 0) {
        state.shooting = true;
        state.lastShot = now;
        state.ammo--;
        playSound("click");

        // Check if any enemy is hit (center of screen)
        for (const enemy of state.enemies) {
          if (!enemy.alive) continue;
          const dx = enemy.x - state.playerX;
          const dy = enemy.y - state.playerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let angleDiff = Math.atan2(dy, dx) - state.playerAngle;
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          // Hit detection - wider at close range
          const hitWidth = 0.15 + (50 / dist) * 0.1;
          if (Math.abs(angleDiff) < hitWidth && dist < 500) {
            const damage = Math.max(5, 25 - dist / 30);
            enemy.health -= damage;
            enemy.hitFlash = now;
            if (enemy.health <= 0) {
              enemy.alive = false;
              state.score += enemy.type === "demon" ? 200 : 100;
              playSound("click");
            }
            break;
          }
        }
      }
    } else {
      state.shooting = false;
    }

    // ===== ENEMY AI =====
    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      const dx = state.playerX - enemy.x;
      const dy = state.playerY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Move toward player
      if (dist > ENEMY_ATTACK_RANGE) {
        const moveAngle = Math.atan2(dy, dx);
        const newEX = enemy.x + Math.cos(moveAngle) * ENEMY_SPEED;
        const newEY = enemy.y + Math.sin(moveAngle) * ENEMY_SPEED;
        const eCellX = Math.floor(newEX / TILE);
        const eCellY = Math.floor(newEY / TILE);
        if (eCellX >= 0 && eCellX < MAP_W && eCellY >= 0 && eCellY < MAP_H && map[eCellY][eCellX] === 0) {
          enemy.x = newEX;
          enemy.y = newEY;
        }
      } else {
        // Attack player
        if (now - enemy.lastAttack > ENEMY_ATTACK_COOLDOWN) {
          enemy.lastAttack = now;
          state.health -= ENEMY_DAMAGE;
          state.screenFlash = "rgba(255,0,0,0.3)";
          playSound("error");
          if (state.health <= 0) {
            state.health = 0;
            state.gameOver = true;
          }
        }
      }
    }

    // ===== PICKUPS =====
    for (const pickup of state.pickups) {
      if (pickup.collected) continue;
      const dx = pickup.x - state.playerX;
      const dy = pickup.y - state.playerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        pickup.collected = true;
        if (pickup.type === "health") {
          state.health = Math.min(100, state.health + 25);
          state.screenFlash = "rgba(0,255,0,0.2)";
        } else {
          state.ammo = Math.min(99, state.ammo + 15);
          state.screenFlash = "rgba(255,170,0,0.2)";
        }
        playSound("click");
      }
    }

    // ===== CHECK LEVEL COMPLETE =====
    const allDead = state.enemies.every((e) => !e.alive);
    if (allDead) {
      if (state.level < LEVELS.length - 1) {
        // Next level
        const nextLevel = state.level + 1;
        const newState = initLevel(nextLevel);
        newState.health = state.health;
        newState.ammo = state.ammo;
        newState.score = state.score + 500; // Level bonus
        gameRef.current = newState;
        playSound("notification");
      } else {
        state.won = true;
        state.score += 1000;
      }
    }

    // Clear screen flash after a short time
    if (state.screenFlash && now - state.lastShot > 200) {
      state.screenFlash = null;
    }

    // ===== RENDER =====
    render(ctx, state);

    // Update HUD state
    setHudState({
      health: state.health,
      ammo: state.ammo,
      score: state.score,
      level: state.level + 1,
      gameOver: state.gameOver,
      won: state.won,
    });

    animRef.current = requestAnimationFrame(gameLoop);
  }, [render, initLevel, playSound]);

  // ===== EFFECTS =====
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      // Prevent scrolling
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    animRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animRef.current);
    };
  }, [gameStarted, gameLoop]);

  // ===== TITLE SCREEN =====
  if (!gameStarted) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-black p-4 font-mono text-white">
        <div className="mb-6 text-center">
          <pre className="text-[10px] leading-tight text-red-600 sm:text-xs">
{`
 ██████╗  ██████╗  ██████╗ ███╗   ███╗
 ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
 ██║  ██║██║   ██║██║   ██║██╔████╔██║
 ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║
 ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
 ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
`}
          </pre>
          <p className="mt-2 text-sm text-gray-400">Floppyy Edition</p>
        </div>

        <button
          onClick={startGame}
          className="game-button game-button-danger mb-6 text-lg"
        >
          NEW GAME
        </button>

        <div className="max-w-xs space-y-1 text-center text-[11px] text-gray-400">
          <p className="text-yellow-500">═══ CONTROLS ═══</p>
          <p>W/A/S/D or Arrows — Move</p>
          <p>Q/E or ←/→ — Turn</p>
          <p>SPACE or ENTER — Shoot</p>
          <p className="mt-2 text-gray-500">Kill all demons to advance</p>
          <p className="text-gray-500">Collect pickups for health & ammo</p>
        </div>
      </div>
    );
  }

  // ===== GAME OVER / WIN SCREEN =====
  if (hudState.gameOver || hudState.won) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-black p-4 font-mono text-white">
        <h2 className={`mb-4 text-3xl font-bold ${hudState.won ? "text-green-500" : "text-red-600"}`}>
          {hudState.won ? "YOU WIN!" : "GAME OVER"}
        </h2>
        <p className="mb-2 text-lg">Score: {hudState.score}</p>
        {hudState.won && <p className="mb-4 text-yellow-400">All demons vanquished!</p>}
        <button
          onClick={startGame}
          className="game-button game-button-danger"
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  // ===== GAME VIEW =====
  return (
    <div className="flex h-full flex-col bg-black">
      {/* Game Canvas */}
      <div className="relative min-h-0 flex-1">
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="h-full w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* HUD - Doom style status bar */}
      <div className="flex h-[52px] shrink-0 items-stretch border-t-2 border-[#555] bg-[#4a4a4a] font-mono text-xs font-bold text-white">
        {/* Ammo */}
        <div className="flex w-[80px] flex-col items-center justify-center border-r border-[#333] bg-[#3a3a3a]">
          <span className="text-[9px] text-gray-400">AMMO</span>
          <span className={`text-lg ${hudState.ammo < 10 ? "text-red-500" : "text-yellow-400"}`}>
            {hudState.ammo}
          </span>
        </div>

        {/* Health */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-[9px] text-gray-400">HEALTH</span>
          <div className="flex items-center gap-1">
            <div className="h-3 w-24 border border-[#222] bg-[#222]">
              <div
                className="h-full transition-all"
                style={{
                  width: `${hudState.health}%`,
                  backgroundColor: hudState.health > 60 ? "#00cc00" : hudState.health > 30 ? "#cccc00" : "#cc0000",
                }}
              />
            </div>
            <span className={hudState.health > 60 ? "text-green-400" : hudState.health > 30 ? "text-yellow-400" : "text-red-500"}>
              {hudState.health}%
            </span>
          </div>
        </div>

        {/* Face (Doom guy) */}
        <div className="flex w-[52px] items-center justify-center border-x border-[#333] bg-[#3a3a3a]">
          <span className="text-xl">
            {hudState.health > 75 ? "😈" : hudState.health > 40 ? "😠" : hudState.health > 15 ? "😰" : "💀"}
          </span>
        </div>

        {/* Score & Level */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-[9px] text-gray-400">SCORE</span>
          <span className="text-yellow-400">{hudState.score}</span>
        </div>

        <div className="flex w-[60px] flex-col items-center justify-center border-l border-[#333] bg-[#3a3a3a]">
          <span className="text-[9px] text-gray-400">LEVEL</span>
          <span className="text-green-400">{hudState.level}/3</span>
        </div>
      </div>
    </div>
  );
}
