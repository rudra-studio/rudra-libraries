import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// --- 1. THE 3D TARGET COMPONENT ----
function Target({ id, position, color, onHit, onMiss }) {
  const meshRef = useRef<any>(null);
  const scaleRef = useRef(1);

  // useFrame runs at 60FPS. We use it to shrink the target.
  useFrame((_, delta) => {
    // Shrink speed. Adjust to make the game harder!
    scaleRef.current -= delta * 0.35; 
    
    if (scaleRef.current <= 0) {
      onMiss(id); // Target disappeared before being clicked
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(scaleRef.current);
      // Rotate the target so it looks cool
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      // R3F handles the complex 3D Raycasting for us here!
      onClick={(e) => {
        e.stopPropagation(); // Prevents clicking objects behind this one
        onHit(id);
      }}
      onPointerOver={() => document.body.style.cursor = 'crosshair'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

// --- 2. THE MAIN GAME ENGINE ---
export default function ReactionGame() {
  const [targets, setTargets] = useState([{ id: 0, position: [0, 0, -2], color: '#ff0055' }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(1);

  // Spawns a new geometric target at a random 3D coordinate
  const spawnTarget = () => {
    const x = (Math.random() - 0.5) * 8;
    const y = (Math.random() - 0.5) * 6;
    const z = -Math.random() * 3 - 2; 
    
    const colors = ['#ff0055', '#00ffcc', '#aa00ff', '#ffaa00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const id = nextId.current++;
    setTargets(prev => [...prev, { id, position: [x, y, z], color }]);
  };

  const handleHit = (id: number) => {
    if (gameOver) return;
    setScore(s => s + 100);
    setTargets(prev => prev.filter(t => t.id !== id));
    
    // Spawn 1 to 2 new targets to increase difficulty as you play
    spawnTarget();
    if (Math.random() > 0.6) spawnTarget();
  };

  const handleMiss = (id: number) => {
    setGameOver(true);
    document.body.style.cursor = 'default';
  };

  const restartGame = () => {
    setScore(0);
    setTargets([{ id: nextId.current++, position: [0, 0, -2], color: '#00ffcc' }]);
    setGameOver(false);
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0f0f13', position: 'relative', overflow: 'hidden' }}>
      
      {/* HTML Overlay: HUD */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: '#fff', fontFamily: 'sans-serif' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}>SCORE: {score}</h1>
        <p style={{ margin: '5px 0', color: '#888' }}>Click the shapes before they vanish!</p>
      </div>

      {/* HTML Overlay: Game Over Screen */}
      {gameOver && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', zIndex: 20, display: 'flex', 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'sans-serif'
        }}>
          <h2 style={{ fontSize: '48px', color: '#ff0055', margin: '0 0 20px 0' }}>GAME OVER</h2>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>Final Score: {score}</p>
          <button 
            onClick={restartGame}
            style={{
              padding: '12px 24px', fontSize: '18px', background: '#00ffcc', 
              color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer',
              fontWeight: 'bold', textTransform: 'uppercase'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} color="#aa00ff" intensity={2} />
        
        {!gameOver && targets.map(t => (
          <Target 
            key={t.id} 
            id={t.id} 
            position={t.position} 
            color={t.color}
            onHit={handleHit} 
            onMiss={handleMiss} 
          />
        ))}
      </Canvas>
    </div>
  );
}