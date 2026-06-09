import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import styles from './styles.module.scss';

export interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  intensity?: number;
  shadows?: boolean;
  environment?: 'city' | 'apartment' | 'lobby' | 'night' | 'studio' | 'sunset' | 'warehouse';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onModelClick?: (e: any) => void;
}

function Model({ url, onClick }: { url: string; onClick?: (e: any) => void }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} onClick={onClick} />;
}

export default function ModelViewer({
  modelUrl = "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/Lantern/glTF-Binary/Lantern.glb",
  autoRotate = true,
  intensity = 1,
  shadows = true,
  environment = 'city',
  className = '',
  style,
  children,
  onModelClick
}: ModelViewerProps) {
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      // Apply the container styles directly to the Canvas
      className={`${styles.container} ${className}`} 
      style={style}
    >
      <Suspense fallback={null}>
        <Stage 
          intensity={intensity} 
          environment={environment} 
          shadows={shadows ? 'contact' : false} 
          adjustCamera={false} // Disabled to prevent infinite zoom loops
        >
          <Model url={modelUrl} onClick={onModelClick} />
        </Stage>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <OrbitControls 
          autoRotate={autoRotate} 
          enablePan={true} 
          enableZoom={true} 
          makeDefault 
        />
      </Suspense>
      {/* Note: If 'children' are DOM elements, you cannot put them inside <Canvas>. 
         If they are Three.js components, they belong inside the Suspense.
         If they are DOM elements, consider using a React Portal or 
         keeping a minimal wrapper if DOM-to-Canvas layering is required.
      */}
    </Canvas>
  );
}