import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  KeyboardControls, 
  useKeyboardControls,
  Environment, 
  ContactShadows, 
  Grid, 
  Float, 
  Html 
} from '@react-three/drei';
import * as THREE from 'three';

// --- DATA: PROFILE SECTIONS & PLATFORMS ---
const ZONES = [
  { id: 'about', title: 'About Me', color: '#3b82f6', position: new THREE.Vector3(0, 0, -4), text: 'Passionate Full-Stack Developer exploring the intersection of web tech and 3D graphics.' },
  { id: 'experience', title: 'Experience', color: '#10b981', position: new THREE.Vector3(-8, 3, -10), text: '6+ Years building scalable applications. I love building tools that feel like games.' },
  { id: 'education', title: 'Education', color: '#8b5cf6', position: new THREE.Vector3(8, 6, -12), text: 'Lifelong learner exploring UI engineering, AI-assisted development, and game physics.' }
];

const PLATFORMS = [
  // Center start area is just the ground (y=0)
  { pos: [-8, 1.5, -10], size: [6, 3, 6], color: '#1e293b' }, // Experience Platform (Height 3)
  { pos: [8, 3, -12], size: [6, 6, 6], color: '#1e293b' },    // Education Platform (Height 6)
  { pos: [0, 1, -10], size: [2, 2, 2], color: '#334155' },    // Stepping stone
];

const BOUNCE_PADS = [
  { pos: [-4, 0, -8], power: 12 }, // Launches you to Experience
  { pos: [4, 0, -10], power: 16 }, // Launches you to Education
];

// --- COMPONENT: PROCEDURAL PLAYER ---
const ProceduralPlayer = ({ onZoneEnter }: { onZoneEnter: (zone: any) => void }) => {
  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const boardRef = useRef<THREE.Mesh>(null); // The Hoverboard
  
  const [, getKeys] = useKeyboardControls();
  
  // Physics State
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  const gravity = 25;
  const jumpPower = 10;

  useFrame((state, delta) => {
    if (!playerRef.current || !bodyRef.current || !leftHandRef.current || !rightHandRef.current || !boardRef.current) return;
    
    const keys = getKeys();
    const isDashing = keys.shift;
    const speed = isDashing ? 12 : 6; // Double speed on hoverboard
    const time = state.clock.elapsedTime;
    const pos = playerRef.current.position;

    // --- 1. HORIZONTAL MOVEMENT ---
    let isMoving = false;
    const moveDir = new THREE.Vector3(0, 0, 0);

    if (keys.forward) moveDir.z -= 1;
    if (keys.backward) moveDir.z += 1;
    if (keys.left) moveDir.x -= 1;
    if (keys.right) moveDir.x += 1;

    if (moveDir.length() > 0) {
      isMoving = true;
      moveDir.normalize().multiplyScalar(speed * delta);
      pos.add(moveDir);

      // Smooth rotation
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      playerRef.current.rotation.y += (targetRotation - playerRef.current.rotation.y) * 10 * delta;
    }

    // --- 2. PHYSICS & COLLISIONS (Vertical Movement) ---
    // Apply gravity
    velocity.current.y -= gravity * delta;
    pos.y += velocity.current.y * delta;

    // Calculate Ground / Platform Collisions
    let floorHeight = 0;
    
    // Check Platforms
    for (const p of PLATFORMS) {
      const halfW = p.size[0] / 2;
      const halfD = p.size[2] / 2;
      // If player is inside the X/Z bounds of the platform
      if (pos.x > p.pos[0] - halfW && pos.x < p.pos[0] + halfW && pos.z > p.pos[2] - halfD && pos.z < p.pos[2] + halfD) {
        floorHeight = Math.max(floorHeight, p.pos[1] + p.size[1] / 2); // Top of the platform
      }
    }

    // Land on the floor/platform
    if (pos.y <= floorHeight) {
      pos.y = floorHeight;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    // Check Bounce Pads
    for (const pad of BOUNCE_PADS) {
      if (Math.abs(pos.x - pad.pos[0]) < 1 && Math.abs(pos.z - pad.pos[2]) < 1 && pos.y <= pad.pos[1] + 0.5) {
        velocity.current.y = pad.power; // BOING!
        isGrounded.current = false;
      }
    }

    // Jump
    if (keys.jump && isGrounded.current) {
      velocity.current.y = jumpPower;
      isGrounded.current = false;
    }

    // --- 3. PROCEDURAL ANIMATIONS ---
    // Hoverboard Deploy Animation
    const targetBoardScale = (isDashing && isMoving) ? 1 : 0;
    boardRef.current.scale.setScalar(THREE.MathUtils.lerp(boardRef.current.scale.x, targetBoardScale, 0.15));

    if (!isGrounded.current) {
      // JUMPING / FALLING ANIMATION: Arms up, body stretched
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0.2, 0.1);
      leftHandRef.current.position.y = THREE.MathUtils.lerp(leftHandRef.current.position.y, 0.5, 0.1);
      rightHandRef.current.position.y = THREE.MathUtils.lerp(rightHandRef.current.position.y, 0.5, 0.1);
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.1);
    } else if (isDashing && isMoving) {
      // HOVERBOARD DASHING: Lean far forward, arms back
      bodyRef.current.position.y = Math.sin(time * 20) * 0.05 - 0.2; // Lower stance
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -0.4, 0.1);
      leftHandRef.current.position.z = THREE.MathUtils.lerp(leftHandRef.current.position.z, 0.5, 0.1); // Arms stream behind
      rightHandRef.current.position.z = THREE.MathUtils.lerp(rightHandRef.current.position.z, 0.5, 0.1);
    } else if (isMoving) {
      // WALKING: Bobbing and swinging
      bodyRef.current.position.y = Math.sin(time * 15) * 0.1; 
      leftHandRef.current.position.z = Math.sin(time * 10) * 0.5;
      rightHandRef.current.position.z = Math.cos(time * 10) * 0.5;
      leftHandRef.current.position.y = 0;
      rightHandRef.current.position.y = 0;
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -0.1, 0.1);
    } else {
      // IDLE: Slow hover
      bodyRef.current.position.y = Math.sin(time * 3) * 0.05;
      leftHandRef.current.position.set(-0.6, 0, 0);
      rightHandRef.current.position.set(0.6, 0, 0);
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.1);
    }

    // --- 4. CAMERA FOLLOW ---
    const cameraTarget = new THREE.Vector3(pos.x, pos.y + 6, pos.z + 10);
    state.camera.position.lerp(cameraTarget, 0.08);
    state.camera.lookAt(pos.x, pos.y + 1, pos.z);

    // --- 5. ZONE DETECTION ---
    let activeZone = null;
    for (const zone of ZONES) {
      if (pos.distanceTo(zone.position) < 2.5) {
        activeZone = zone;
        break;
      }
    }
    onZoneEnter(activeZone);
  });

  return (
    <group ref={playerRef} dispose={null}>
      
      {/* The Hoverboard (Hidden by default, scales up on dash) */}
      <mesh ref={boardRef} position={[0, -0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 0.1, 1.8]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1.5} />
      </mesh>

      <group ref={bodyRef} position={[0, 1, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.75, 0.36]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.05]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh ref={leftHandRef} position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh ref={rightHandRef} position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
};

// --- COMPONENT: ENVIRONMENT (Platforms & Zones) ---
const LevelEnvironment = ({ activeZoneId }: { activeZoneId: string | null }) => {
  return (
    <>
      {/* Render Platforms */}
      {PLATFORMS.map((plat, i) => (
        <mesh key={`plat-${i}`} position={plat.pos as any} receiveShadow castShadow>
          <boxGeometry args={plat.size as any} />
          <meshStandardMaterial color={plat.color} roughness={0.8} />
        </mesh>
      ))}

      {/* Render Bounce Pads */}
      {BOUNCE_PADS.map((pad, i) => (
        <group key={`pad-${i}`} position={pad.pos as any}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* Render Zones */}
      {ZONES.map((zone) => (
        <group key={zone.id} position={zone.position}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={activeZoneId === zone.id ? 2 : 0.5} transparent opacity={0.8} />
          </mesh>
          <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[0, 1.5, 0]}>
            <mesh castShadow>
              <octahedronGeometry args={[0.4]} />
              <meshStandardMaterial color={zone.color} wireframe />
            </mesh>
          </Float>
          <Html position={[0, 3, 0]} center transform sprite>
            <div className={`px-4 py-1 rounded-full text-white font-bold text-sm tracking-wider transition-all duration-300 ${activeZoneId === zone.id ? 'bg-white/30 scale-125' : 'bg-black/50'}`} style={{ border: `2px solid ${zone.color}` }}>
              {zone.title}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
};

// --- MAIN WRAPPER COMPONENT ---
export const ProfileRPG = () => {
  const [activeZone, setActiveZone] = useState<any | null>(null);

  // Keyboard mappings with Jump and Dash
  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'shift', keys: ['ShiftLeft', 'ShiftRight'] },
  ], []);

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl font-sans">
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">
          PROFILE<span className="text-blue-500">.RPG</span>
        </h1>
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-slate-300 font-mono text-xs bg-black/60 px-2 py-1 rounded w-max backdrop-blur-sm">
            [W,A,S,D] Move
          </p>
          <p className="text-slate-300 font-mono text-xs bg-black/60 px-2 py-1 rounded w-max backdrop-blur-sm">
            [SPACE] Jump
          </p>
          <p className="text-blue-300 font-mono text-xs bg-blue-900/60 px-2 py-1 rounded w-max backdrop-blur-sm border border-blue-500/30">
            [SHIFT] Hoverboard Dash
          </p>
        </div>
      </div>

      {/* Dynamic Profile Card */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-md transition-all duration-500 transform ${activeZone ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        {activeZone && (
          <div className="bg-slate-900/90 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-t-4" style={{ borderTopColor: activeZone.color }}>
            <h2 className="text-2xl font-bold text-white mb-2">{activeZone.title}</h2>
            <p className="text-slate-300 leading-relaxed">{activeZone.text}</p>
          </div>
        )}
      </div>

      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} castShadow intensity={1.5} shadow-mapSize={[2048, 2048]} />
          <Environment preset="city" /> 

          <Suspense fallback={null}>
            {/* Grid Floor */}
            <Grid infiniteGrid fadeDistance={40} sectionColor="#334155" cellColor="#1e293b" position={[0, -0.01, 0]} />
            <ContactShadows position={[0, 0, 0]} scale={20} blur={2} opacity={0.4} far={10} />

            <ProceduralPlayer onZoneEnter={setActiveZone} />
            <LevelEnvironment activeZoneId={activeZone?.id || null} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default ProfileRPG;