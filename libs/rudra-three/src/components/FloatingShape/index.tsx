import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FloatingShapeProps {
  shape?: 'cube' | 'sphere' | 'torus' | 'icosahedron';
  meshColor?: string;
  wireframe?: boolean;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

function AnimatedMesh({ shape, meshColor, wireframe, speed, velocityRef, isDraggingRef, interactive }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (interactive) {
      meshRef.current.rotation.x += velocityRef.current.x;
      meshRef.current.rotation.y += velocityRef.current.y;

      if (!isDraggingRef.current) {
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;

        if (Math.abs(velocityRef.current.x) < 0.001 && Math.abs(velocityRef.current.y) < 0.001) {
          meshRef.current.rotation.x += 0.002 * speed;
          meshRef.current.rotation.y += 0.005 * speed;
        }
      }
    } else {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
    }

    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      {shape === 'cube' && <boxGeometry args={[2, 2, 2]} />}
      {shape === 'sphere' && <sphereGeometry args={[1.5, 32, 32]} />}
      {shape === 'torus' && <torusGeometry args={[1, 0.4, 16, 50]} />}
      {shape === 'icosahedron' && <icosahedronGeometry args={[1.5, 0]} />}
      
      <meshStandardMaterial 
        color={meshColor} 
        wireframe={wireframe} 
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function FloatingShape({
  shape = 'torus',
  meshColor = '#8b5cf6',
  wireframe = false,
  speed = 1,
  interactive = true,
  className = '',
}: FloatingShapeProps) {
  
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    velocityRef.current.y = deltaX * 0.005; 
    velocityRef.current.x = deltaY * 0.005; 
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <Canvas 
      className={`${interactive ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#4338ca" />
      
      <AnimatedMesh 
        shape={shape} 
        meshColor={meshColor} 
        wireframe={wireframe} 
        speed={speed} 
        interactive={interactive}
        velocityRef={velocityRef}
        isDraggingRef={isDraggingRef}
      />
    </Canvas>
  );
}