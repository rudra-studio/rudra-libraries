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
    <div className={`${styles.container} ${className}`} style={style}>
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage 
            intensity={intensity} 
            environment={environment} 
            shadows={shadows ? 'contact' : false} 
            adjustCamera={true}
          >
            <Model url={modelUrl} onClick={onModelClick} />
          </Stage>
          <OrbitControls 
            autoRotate={autoRotate} 
            enablePan={true} 
            enableZoom={true} 
            makeDefault 
          />
        </Suspense>
        {children}
      </Canvas>
    </div>
  );
}
