import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  KeyboardControls,
  useKeyboardControls,
  Environment,
  ContactShadows,
  Html,
  Float,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';

// --- TYPES & DEFAULT DATA ---
export interface ZoneData {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  text: string;
}

interface ProfileRPGProps {
  zones?: ZoneData[];
  onExit?: () => void;
  className?: string;
}

const DEFAULT_ZONES: ZoneData[] = [
  { id: 'about', title: '01 // ABOUT ME', subtitle: 'Voxel Architect', color: '#38bdf8', text: 'Full-Stack Engineer obsessed with the bridge between high-performance web apps and real-time 3D graphics.' },
  { id: 'experience', title: '02 // EXPERIENCE', subtitle: '6+ Years Shipped', color: '#10b981', text: 'Senior Scalable Systems. I build developer tools that feel like toys, and user interfaces that feel like video games.' },
  { id: 'education', title: '03 // EDUCATION', subtitle: 'Continuous R&D', color: '#a855f7', text: 'Lifelong autodidact. Currently deep-diving into WebGPU computational shaders and AI-assisted procedural generation.' }
];

const ZONE_GAP = 35;
const X_POSITIONS = [-6, 6, 0, -5, 5];

// --- TRAFFIC GENERATOR ---
const generateTraffic = (maxDepth: number) => {
  const cars = Array.from({ length: 4 }).map((_, i) => ({
    id: `car-${i}`, type: 'car',
    x: [-6, -2, 2, 6][i],
    z: -25 - (i * 40),
    speed: 13 + (i * 1.5), currentSpeed: 13,
    width: 2.5, height: 1.4, length: 4.0,
    hitTimer: 0, reaction: ""
  }));

  const persons = Array.from({ length: 10 }).map((_, i) => ({
    id: `person-${i}`, type: 'person',
    x: (Math.random() - 0.5) * 18,
    z: -10 - (i * 16),
    speed: 1.8 + Math.random(),
    dir: Math.random() > 0.5 ? 1 : -1,
    width: 0.8, height: 1.3, length: 0.8,
    hitTimer: 0, reaction: ""
  }));

  return [...cars, ...persons];
};

// --- MODELS & SCENERY ---

// THE FIX: Added zIndexRange and a CSS zIndex: 9999 to guarantee it pops over the titles
const LiveBubble = ({ data, offsetY = 1.8, bg = 'bg-white', text = 'text-slate-950', border = 'border-slate-900', isPaused }: any) => {
  const elRef = useRef<HTMLDivElement>(null);
  useFrame(() => {
    if (!elRef.current || isPaused) return;
    if (data.hitTimer > 0) {
      elRef.current.style.opacity = '1';
      elRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      elRef.current.innerText = data.reaction;
    } else {
      elRef.current.style.opacity = '0';
      elRef.current.style.transform = 'translate(-50%, -50%) scale(0.7)';
    }
  });

  return (
    <Html position={[0, offsetY, 0]} zIndexRange={[100, 0]}>
      <div
        ref={elRef}
        className={`${bg} ${text} font-black px-2.5 py-1 rounded shadow-2xl whitespace-nowrap text-xs border-2 ${border} transition-all duration-100 select-none pointer-events-none absolute left-0 top-0`}
        style={{ opacity: 0, transform: 'translate(-50%, -50%) scale(0.7)', zIndex: 9999 }}
      />
    </Html>
  );
};

const CyberCar = ({ data, isPaused }: { data: any, isPaused: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current && !isPaused) ref.current.position.set(data.x, 0.6, data.z);
  });
  const isBraking = data.currentSpeed < data.speed * 0.4;

  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[2.5, 0.8, 4]} /><meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} /></mesh>
      <mesh position={[0, 0.6, 0.5]}><boxGeometry args={[2, 0.4, 2]} /><meshStandardMaterial color="#000000" roughness={0.1} /></mesh>
      <mesh position={[0.9, 0, 2.01]}><boxGeometry args={[0.5, 0.2, 0.1]} /><meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={3} /></mesh>
      <mesh position={[-0.9, 0, 2.01]}><boxGeometry args={[0.5, 0.2, 0.1]} /><meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={3} /></mesh>
      <mesh position={[0, 0, -2.01]}><boxGeometry args={[2.2, 0.1, 0.1]} /><meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={isBraking ? 6 : 1} /></mesh>
      {[-1.3, 1.3].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.4, 1.2]}><boxGeometry args={[0.2, 0.6, 0.8]} /><meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} /></mesh>
          <mesh position={[x, -0.4, -1.2]}><boxGeometry args={[0.2, 0.6, 0.8]} /><meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} /></mesh>
        </group>
      ))}
      <LiveBubble data={data} offsetY={2.0} bg="bg-red-600" text="text-white" border="border-white" isPaused={isPaused} />
    </group>
  );
};

const CyberPerson = ({ data, isPaused }: { data: any, isPaused: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || isPaused) return;
    ref.current.position.set(data.x, 0.5, data.z);
    if (data.hitTimer <= 0) ref.current.position.y += Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.2;
  });

  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0.3, 0]}><boxGeometry args={[0.6, 0.8, 0.4]} /><meshStandardMaterial color="#334155" /></mesh>
      <mesh castShadow position={[0, 0.9, 0]}><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[data.dir > 0 ? 0.21 : -0.21, 0.9, 0]}><boxGeometry args={[0.05, 0.1, 0.3]} /><meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} /></mesh>
      <LiveBubble data={data} offsetY={1.8} bg="bg-white" text="text-slate-950" border="border-slate-900" isPaused={isPaused} />
    </group>
  );
};

// --- COMPONENT: THE PLAYER & AI ENGINE ---
const Player = ({ onZoneEnter, touch, trafficData, processedZones, maxZDepth, isPaused }: any) => {
  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const boardRef = useRef<THREE.Mesh>(null);
  const [, getKeys] = useKeyboardControls();

  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const gravity = 55;
  const jumpPower = 18;

  useFrame((state, delta) => {
    if (!playerRef.current || !bodyRef.current || !boardRef.current) return;
    if (isPaused) return;

    const k = getKeys();
    const t = touch.current;

    const fwd = k.forward || t.up;
    const bwd = k.backward || t.down;
    const lft = k.left || t.left;
    const rgt = k.right || t.right;
    const jmp = k.jump || t.jump;
    const dsh = k.shift || t.dash;

    const speed = dsh ? 20 : 12;
    const turnSensitivity = 1.25;
    const time = state.clock.elapsedTime;
    const pos = playerRef.current.position;
    const rot = playerRef.current.rotation.y;

    // 1. Steering & Movement
    if (lft) playerRef.current.rotation.y += turnSensitivity * delta;
    if (rgt) playerRef.current.rotation.y -= turnSensitivity * delta;

    let moveDir = 0;
    if (fwd) moveDir = 1;
    if (bwd) moveDir = -0.6;

    if (moveDir !== 0) {
      pos.x += -Math.sin(rot) * moveDir * speed * delta;
      pos.z += -Math.cos(rot) * moveDir * speed * delta;
      pos.x = THREE.MathUtils.clamp(pos.x, -16, 16);
      pos.z = Math.max(pos.z, -maxZDepth - 10);
    }
    boardRef.current.rotation.z = THREE.MathUtils.lerp(boardRef.current.rotation.z, lft ? 0.25 : (rgt ? -0.25 : 0), 0.1);

    // 2. Physics
    velocityY.current -= gravity * delta;
    pos.y += velocityY.current * delta;

    if (pos.y <= 0) {
      pos.y = 0; velocityY.current = 0; isGrounded.current = true;
    }
    if (jmp && isGrounded.current) {
      velocityY.current = jumpPower; isGrounded.current = false;
    }

    // 3. MASTER TRAFFIC AI & REACTION ENGINE
    const persons = trafficData.current.filter((tr: any) => tr.type === 'person');
    trafficData.current.forEach((obs: any) => {
      if (obs.hitTimer > 0) obs.hitTimer -= delta;

      const dxPlayer = Math.abs(pos.x - obs.x);
      const dzPlayer = pos.z - obs.z;

      if (obs.type === 'car') {
        const blockingCar = dxPlayer < 1.7 && dzPlayer > 0 && dzPlayer < 14 && pos.y < obs.height;
        if (blockingCar) {
          obs.currentSpeed = THREE.MathUtils.lerp(obs.currentSpeed, 0, 0.2);
          if (obs.hitTimer <= 0 && obs.currentSpeed < 2) {
            obs.reaction = "Move away! 😡";
            obs.hitTimer = 2.0;
          }
        } else {
          obs.currentSpeed = THREE.MathUtils.lerp(obs.currentSpeed, obs.speed, 0.05);
        }

        obs.z += obs.currentSpeed * delta;
        if (obs.z > 15) {
          obs.z = -maxZDepth - 20;
          obs.x = [-6, -2, 2, 6][Math.floor(Math.random() * 4)];
        }

        persons.forEach((p: any) => {
          if (Math.abs(obs.x - p.x) < 1.5 && Math.abs(obs.z - p.z) < 2.5) {
            if (p.hitTimer <= 0) { p.reaction = "Ow! 💥"; p.hitTimer = 1.5; }
          }
        });

        if (dxPlayer < 1.8 && Math.abs(dzPlayer) < 2.2 && pos.y < obs.height) pos.z += dzPlayer > 0 ? 0.1 : -0.1;

      } else {
        if (obs.hitTimer <= 0) {
          obs.x += obs.speed * obs.dir * delta;
          if (obs.x > 14) obs.dir = -1;
          if (obs.x < -14) obs.dir = 1;
        }
        if (dxPlayer < 1.1 && Math.abs(pos.z - obs.z) < 1.1 && pos.y < obs.height) {
          if (obs.hitTimer <= 0) { obs.reaction = "Watch it! 💢"; obs.hitTimer = 2.0; }
        }
      }
    });

    // 4. Stance
    boardRef.current.scale.setScalar(THREE.MathUtils.lerp(boardRef.current.scale.x, (dsh && moveDir !== 0) ? 1 : 0, 0.15));

    if (!isGrounded.current) {
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0.8, 0.2);
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0.2, 0.2);
    } else if (dsh && moveDir !== 0) {
      bodyRef.current.position.y = Math.sin(time * 25) * 0.05 + 0.35;
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -0.5, 0.2);
    } else if (moveDir !== 0) {
      bodyRef.current.position.y = Math.sin(time * 15) * 0.06 + 0.45;
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -0.1, 0.2);
    } else {
      bodyRef.current.position.y = Math.sin(time * 3) * 0.03 + 0.45;
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.2);
    }

    // 5. Rotating Chase Camera
    const camOffset = new THREE.Vector3(0, 4.5, 8.5).applyEuler(new THREE.Euler(0, rot, 0));
    state.camera.position.lerp(pos.clone().add(camOffset), 0.08);
    state.camera.lookAt(pos.x, pos.y + 1, pos.z);

    // 6. Zone Detection
    let found = null;
    for (const z of processedZones) {
      if (Math.hypot(pos.x - z.position[0], pos.z - z.position[2]) < 3.5) { found = z; break; }
    }
    onZoneEnter(found);
  });

  return (
    <group ref={playerRef} position={[0, 0, 4]}>
      <mesh ref={boardRef} position={[0, 0.15, 0]} castShadow><boxGeometry args={[0.7, 0.08, 1.5]} /><meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1.5} /></mesh>
      <group ref={bodyRef} position={[0, 0.45, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.55, 0.7, 0.4]} /><meshStandardMaterial color="#e2e8f0" roughness={0.2} /></mesh>
        <mesh position={[0, 0.85, 0]} castShadow><boxGeometry args={[0.4, 0.35, 0.45]} /><meshStandardMaterial color="#334155" /></mesh>
        <mesh position={[0, 0.88, -0.23]}><boxGeometry args={[0.3, 0.1, 0.05]} /><meshBasicMaterial color="#38bdf8" /></mesh>
      </group>
    </group>
  );
};

// --- SCENERY ---
const CitySkyline = ({ maxZDepth }: { maxZDepth: number }) => {
  const buildings = useMemo(() => {
    const list = [];
    for (let i = -80; i <= 80; i += 6) list.push({ x: i + (Math.random() - 0.5) * 3, z: -maxZDepth - 30, w: Math.random() * 5 + 3, h: Math.random() * 30 + 10 });
    return list;
  }, [maxZDepth]);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 2, b.z]}><boxGeometry args={[b.w, b.h, 6]} /><meshBasicMaterial color="#080c16" /></mesh>
      ))}
    </group>
  );
};

// THE FIX: Set zIndexRange={[10, 0]} on the title so it sits properly in the background layer
const HoloPedestal = ({ data, active }: { data: any, active: boolean }) => {
  const signRef = useRef<THREE.Group>(null);

  // Smoothly shrink the floating signboard into nothing when the player stands on the pad
  useFrame(() => {
    if (!signRef.current) return;
    const targetScale = active ? 0 : 1;
    // Lerp handles the smooth transition between scale 1 (visible) and 0 (hidden)
    signRef.current.scale.setScalar(THREE.MathUtils.lerp(signRef.current.scale.x, targetScale, 0.15));
  });

  return (
    <group position={data.position as any}>
      {/* 1. Ground Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial color={data.color} transparent opacity={active ? 0.35 : 0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.9, 3.0, 32]} />
        <meshBasicMaterial color={data.color} />
      </mesh>

      {/* 2. Light Pillar */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.05, 3, 8, 16, 1, true]} />
        <meshBasicMaterial color={data.color} transparent opacity={active ? 0.2 : 0.03} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* 3. The Floating Signboard (Now inside a scalable group) */}
      <group ref={signRef}>
        <Float speed={2} floatIntensity={0.5} position={[0, 2.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 1.2, 0.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            <Html position={[0, 0, 0.11]} center transform distanceFactor={8} zIndexRange={[10, 0]}>
              <div className="px-4 py-2 border-l-4 bg-slate-950/90 text-white select-none whitespace-nowrap shadow-2xl" style={{ borderColor: data.color }}>
                <div className="text-[10px] font-mono tracking-widest opacity-75" style={{ color: data.color }}>{data.subtitle}</div>
                <div className="text-sm font-black tracking-wider">{data.title}</div>
              </div>
            </Html>
          </mesh>
        </Float>
      </group>
    </group>
  );
};

// --- MAIN EXPORT COMPONENT ---
export const ProfileRPG = ({ zones = DEFAULT_ZONES, onExit, className }: ProfileRPGProps) => {
  const [activeZone, setActiveZone] = useState<any>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<'start' | 'explore' | 'done' | 'paused'>('start');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const touch = useRef({ up: false, down: false, left: false, right: false, jump: false, dash: false });

  const processedZones = useMemo(() => zones.map((zone, index) => ({
    ...zone,
    position: [X_POSITIONS[index % X_POSITIONS.length], 0, -20 - (index * ZONE_GAP)]
  })), [zones]);

  const maxZDepth = useMemo(() => (processedZones.length * ZONE_GAP) + 50, [processedZones]);
  const roadCenterZ = -(maxZDepth / 2) + 10;

  const trafficData = useRef(generateTraffic(maxZDepth));

  const setT = (k: keyof typeof touch.current, v: boolean) => { touch.current[k] = v; };
  const bindTouch = (k: keyof typeof touch.current) => ({
    onPointerDown: () => setT(k, true),
    onPointerUp: () => setT(k, false),
    onPointerLeave: () => setT(k, false),
    onPointerCancel: () => setT(k, false)
  });

  useEffect(() => { wrapperRef.current?.focus(); }, [gameState]);

  const handleZone = (z: any) => {
    setActiveZone(z);
    if (z && !explored.has(z.id)) {
      const next = new Set(explored).add(z.id);
      setExplored(next);
      if (next.size === processedZones.length) setTimeout(() => setGameState('done'), 800);
    }
  };

  const handleExit = () => {
    setGameState('start');
    setExplored(new Set());
    setActiveZone(null);
    trafficData.current = generateTraffic(maxZDepth); // Reset cars
    if (onExit) onExit();
  };

  const keyMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'shift', keys: ['ShiftLeft', 'ShiftRight'] },
  ], []);

  const isPaused = gameState === 'paused';

  return (
    <div
      ref={wrapperRef}
      onClick={() => { if (gameState === 'explore') wrapperRef.current?.focus(); }}
      className={`relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl font-sans select-none outline-none touch-none ${className}`}
    >
      {/* --- HUD --- */}
      <div className="absolute top-5 left-5 right-5 z-10 flex flex-col md:flex-row justify-between items-start pointer-events-none gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
            DEV<span className="text-sky-400">.EXPLORER</span>
          </h1>
          <div className="flex gap-1.5 mt-1 flex-wrap w-48 md:w-auto">
            {processedZones.map(z => (
              <div key={z.id} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${explored.has(z.id) ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8]' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>

        <div className={`w-full md:w-96 pointer-events-auto transition-all duration-300 transform ${activeZone ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          {activeZone && (
            <div className="bg-slate-900/95 border border-slate-700/80 p-4 rounded-xl backdrop-blur-md shadow-2xl border-t-4" style={{ borderTopColor: activeZone.color }}>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">{activeZone.subtitle}</span>
              <h3 className="text-lg font-bold text-white mt-1">{activeZone.title}</h3>
              <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-normal">{activeZone.text}</p>
            </div>
          )}
        </div>
      </div>

      {/* PAUSE MENU BUTTON */}
      {gameState === 'explore' && (
        <button
          onClick={() => setGameState('paused')}
          className="absolute top-5 right-5 z-20 w-10 h-10 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white rounded-xl shadow-lg flex items-center justify-center pointer-events-auto transition active:scale-95"
          title="Pause Game"
        >
          <div className="flex gap-1">
            <div className="w-1 h-3.5 bg-white rounded-full"></div>
            <div className="w-1 h-3.5 bg-white rounded-full"></div>
          </div>
        </button>
      )}

      {/* --- MENU OVERLAYS --- */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 animate-bounce">▲</div>
          <h2 className="text-3xl font-black text-white tracking-tight">SYSTEM INITIALIZED</h2>
          <p className="text-slate-400 text-sm max-w-xs mt-1 mb-6">Steer [A/D]. Accelerate [W]. Jump traffic [SPACE]. Find the {processedZones.length} databanks.</p>
          <button onClick={() => setGameState('explore')} className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-black text-sm tracking-wider rounded-xl transition shadow-[0_0_25px_rgba(14,165,233,0.4)] cursor-pointer pointer-events-auto">
            ENTER DRIVE
          </button>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <h2 className="text-4xl font-black text-white tracking-tight mb-8">PAUSED</h2>
          <button onClick={() => setGameState('explore')} className="mb-4 px-8 py-3.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-black text-sm tracking-wider rounded-xl transition cursor-pointer pointer-events-auto w-64 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            RESUME
          </button>
          <button onClick={handleExit} className="px-8 py-3 bg-slate-800 hover:bg-red-500 hover:text-white active:scale-95 text-slate-300 font-black text-sm tracking-wider rounded-xl transition cursor-pointer pointer-events-auto w-64 border border-slate-700 hover:border-red-500">
            EXIT GAME
          </button>
        </div>
      )}

      {gameState === 'done' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="text-emerald-400 font-mono text-xs tracking-widest mb-1">// 100% COMPILED</div>
          <h2 className="text-4xl font-black text-white tracking-tight">EXPLORATION COMPLETE</h2>
          <p className="text-slate-300 text-xs mt-2 mb-8 max-w-sm">You have uncovered all profile sectors. You are free to keep skating the grid.</p>
          <button onClick={() => setGameState('explore')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-widest rounded-xl transition border border-slate-600 cursor-pointer pointer-events-auto">
            CONTINUE FREE ROAM
          </button>
        </div>
      )}

      {/* --- MOBILE TOUCH CONTROLS --- */}
      {gameState === 'explore' && (
        <>
          <div className="md:hidden absolute bottom-5 left-5 z-20 flex flex-col gap-1.5 opacity-75">
            <div className="flex justify-center"><button {...bindTouch('up')} className="w-12 h-12 bg-slate-800/80 active:bg-sky-500 text-white rounded-lg border border-slate-700 flex items-center justify-center font-bold">W</button></div>
            <div className="flex gap-8">
              <button {...bindTouch('left')} className="w-12 h-12 bg-slate-800/80 active:bg-sky-500 text-white rounded-lg border border-slate-700 flex items-center justify-center font-bold">A</button>
              <button {...bindTouch('right')} className="w-12 h-12 bg-slate-800/80 active:bg-sky-500 text-white rounded-lg border border-slate-700 flex items-center justify-center font-bold">D</button>
            </div>
            <div className="flex justify-center"><button {...bindTouch('down')} className="w-12 h-12 bg-slate-800/80 active:bg-sky-500 text-white rounded-lg border border-slate-700 flex items-center justify-center font-bold">S</button></div>
          </div>
          <div className="md:hidden absolute bottom-6 right-5 z-20 flex gap-3 opacity-85">
            <button {...bindTouch('dash')} className="w-14 h-14 rounded-full bg-sky-500 active:bg-sky-400 text-slate-950 font-black text-[10px] tracking-tighter shadow-lg flex items-center justify-center border-2 border-white/20">DASH</button>
            <button {...bindTouch('jump')} className="w-14 h-14 rounded-full bg-slate-800 active:bg-slate-700 text-white font-bold text-[10px] tracking-tighter shadow-lg flex items-center justify-center border border-slate-600">JUMP</button>
          </div>
        </>
      )}

      {/* --- 3D CANVAS --- */}
      <KeyboardControls map={keyMap}>
        <Canvas shadows camera={{ position: [0, 4, 10], fov: 50 }}>
          <color attach="background" args={['#060913']} />
          <fog attach="fog" args={['#060913', 15, 60]} />

          <ambientLight intensity={0.7} />
          <directionalLight position={[20, 30, 20]} castShadow intensity={2.2} shadow-mapSize={[1024, 1024]} />
          <Sky distance={450000} sunPosition={[0, -1, -20]} inclination={0.2} azimuth={180} />
          <Environment preset="night" />

          <Suspense fallback={null}>
            <CitySkyline maxZDepth={maxZDepth} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, roadCenterZ]} receiveShadow><planeGeometry args={[22, maxZDepth + 30]} /><meshStandardMaterial color="#0f172a" roughness={0.6} /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, 0, roadCenterZ]}><planeGeometry args={[0.1, maxZDepth + 30]} /><meshBasicMaterial color="#38bdf8" opacity={0.4} transparent /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11, 0, roadCenterZ]}><planeGeometry args={[0.1, maxZDepth + 30]} /><meshBasicMaterial color="#38bdf8" opacity={0.4} transparent /></mesh>

            {trafficData.current.map((obs: any) => (
              obs.type === 'car' ? <CyberCar key={obs.id} data={obs} isPaused={isPaused} /> : <CyberPerson key={obs.id} data={obs} isPaused={isPaused} />
            ))}

            <Player onZoneEnter={handleZone} touch={touch} trafficData={trafficData} processedZones={processedZones} maxZDepth={maxZDepth} isPaused={isPaused} />

            {processedZones.map(z => <HoloPedestal key={z.id} data={z} active={activeZone?.id === z.id} />)}

            <ContactShadows position={[0, 0, 0]} scale={35} blur={2} opacity={0.6} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default ProfileRPG;