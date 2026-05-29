import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface DinoRunner3DProps extends React.HTMLAttributes<HTMLDivElement> {
  playerColor?: string; /* @color */
  obstacleColor?: string; /* @color */
  gridColor?: string; /* @color */
  skyColor?: string; /* @color */
  baseSpeed?: number;
}

// --- CORE GAME ENGINE ----
function GameScene({ 
  playerColor, obstacleColor, gridColor, baseSpeed, 
  onGameOver, onScore, isGameOver 
}: any) {
  const playerRef = useRef<THREE.Mesh>(null);
  const obstacleRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.GridHelper>(null);
  const { camera } = useThree();
  
  // Game State Refs (avoiding useState inside useFrame for locked 60fps)
  const state = useRef({
    velocityY: 0,
    isJumping: false,
    gravity: -0.018,
    jumpStrength: 0.38,
    speed: baseSpeed * 0.1,
    score: 0,
    shakeTime: 0
  });

  // Handle Jump Input
  useEffect(() => {
    const handleJump = (e?: KeyboardEvent) => {
      if (e && e.code !== 'Space') return;
      if (!state.current.isJumping && !isGameOver) {
        state.current.velocityY = state.current.jumpStrength;
        state.current.isJumping = true;
      }
    };
    window.addEventListener('keydown', handleJump);
    return () => window.removeEventListener('keydown', handleJump);
  }, [isGameOver]);

  useFrame(() => {
    // 1. Camera Shake on Game Over
    if (isGameOver) {
      if (state.current.shakeTime < 20) {
        camera.position.x = (Math.random() - 0.5) * 0.5;
        camera.position.y = 3 + (Math.random() - 0.5) * 0.5;
        state.current.shakeTime++;
      } else {
        camera.position.set(0, 3, 10); // Reset camera after shake
      }
      return; // Pause game logic
    }

    const player = playerRef.current;
    const obstacle = obstacleRef.current;
    const grid = gridRef.current;
    if (!player || !obstacle || !grid) return;

    // 2. Animate the Synthwave Grid (Endless Scrolling)
    grid.position.z += state.current.speed;
    if (grid.position.z > 1) {
      grid.position.z = 0; // Loop seamlessly
    }

    // 3. Player Physics (Gravity & Front Flips)
    if (state.current.isJumping) {
      player.position.y += state.current.velocityY;
      state.current.velocityY += state.current.gravity;
      
      // The Cool Factor: Spin the cube rapidly while in the air
      player.rotation.x -= 0.15; 

      // Hit the ground
      if (player.position.y <= 0.5) {
        player.position.y = 0.5;
        state.current.isJumping = false;
        state.current.velocityY = 0;
        
        // Snap rotation flat on landing
        player.rotation.x = Math.round(player.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
      }
    }

    // 4. Move Obstacle & Increase Difficulty
    obstacle.position.z += state.current.speed;

    if (obstacle.position.z > 5) {
      obstacle.position.z = -20; // Reset far back
      // Randomize obstacle X position slightly for variety (-1, 0, or 1)
      obstacle.position.x = Math.floor(Math.random() * 3) - 1; 
      
      state.current.score += 10;
      state.current.speed += 0.002; // Gradually increase speed
      onScore(state.current.score);
    }

    // 5. Dynamic Camera (Pulls back as you get faster)
    const targetZ = 10 + (state.current.speed * 10);
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    // 6. Collision Detection (AABB)
    const pZ = player.position.z;
    const pY = player.position.y;
    const pX = player.position.x;
    const oZ = obstacle.position.z;
    const oX = obstacle.position.x;
    
    // Check if within hitting distance on Z axis, X axis, and Y axis
    if (Math.abs(pZ - oZ) < 1.0 && Math.abs(pX - oX) < 0.8) {
      if (pY < 1.4) {
        onGameOver();
      }
    }
  });

  return (
    <group>
      {/* Moving Neon Grid */}
      <gridHelper 
        ref={gridRef} 
        args={[40, 40, gridColor, gridColor]} 
        position={[0, 0, 0]} 
      />

      {/* Player Box (Glowing) */}
      <mesh ref={playerRef} position={[0, 0.5, 3]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={playerColor} 
          emissive={playerColor} 
          emissiveIntensity={0.5} 
          roughness={0.2}
        />
      </mesh>

      {/* Obstacle Box (Danger Glowing) */}
      <mesh ref={obstacleRef} position={[0, 0.5, -20]} castShadow>
        <boxGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial 
          color={obstacleColor} 
          emissive={obstacleColor} 
          emissiveIntensity={0.6}
          roughness={0.2} 
        />
      </mesh>

      {/* Solid Dark Ground below the grid */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 100]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// --- THE BUILDER WRAPPER ---
export default function DinoRunner3D({
  playerColor = '#06b6d4',   // Cyan
  obstacleColor = '#ec4899', // Pink
  gridColor = '#8b5cf6',     // Purple
  skyColor = '#0f0a1f',      // Very Dark Violet
  baseSpeed = 2.5,
  className = '',
  ...props
}: DinoRunner3DProps) {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const restartGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGameOver(false);
    setScore(0);
    setGameKey(prev => prev + 1);
  };

  return (
    <div 
      className={`relative w-full h-[450px] rounded-xl overflow-hidden shadow-2xl select-none cursor-pointer border border-zinc-800 ${className}`} 
      style={{ backgroundColor: skyColor }}
      onClick={() => {
        // Trigger spacebar event for mobile/mouse tapping
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      }}
      {...props}
    >
      {/* Synthwave Retro UI */}
      <div className="absolute top-6 left-6 z-10 font-mono text-cyan-400 text-2xl font-black tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
        {String(score).padStart(5, '0')}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <h2 className="text-5xl font-black text-pink-500 mb-2 font-mono tracking-widest drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            SYSTEM FAILURE
          </h2>
          <p className="text-cyan-400 font-mono mb-8">FINAL SCORE: {score}</p>
          <button 
            onClick={restartGame}
            className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold tracking-widest font-mono rounded hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            REBOOT SEQUENCE
          </button>
        </div>
      )}

      {/* WebGL Canvas */}
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 55 }}>
        {/* Fog fades the grid out in the distance */}
        <fog attach="fog" args={[skyColor, 15, 40]} />
        
        <ambientLight intensity={0.4} />
        
        {/* Main dramatic lighting */}
        <directionalLight 
          position={[5, 10, -5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow 
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Under-glow lighting */}
        <pointLight position={[0, -2, 5]} intensity={2} color={playerColor} />

        <GameScene 
          key={gameKey} 
          playerColor={playerColor}
          obstacleColor={obstacleColor}
          gridColor={gridColor}
          baseSpeed={baseSpeed}
          onScore={setScore}
          isGameOver={isGameOver}
          onGameOver={() => setIsGameOver(true)}
        />
      </Canvas>
    </div>
  );
}