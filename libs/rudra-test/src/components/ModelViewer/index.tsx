import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import styles from './styles.module.scss';

export interface ModelViewerProps {
  modelUrl?: string;
  autoRotate?: boolean;
  intensity?: number;
  children?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}

function Model({ url }: { url: string }) {
  // Using a mock duck model from Khronos Group as default
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({
  modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
  autoRotate = true,
  intensity = 0.5,
  children,
  loadingSlot = <div className={styles.loadingText}>Loading 3D Model...</div>,
  className = '',
  style,
  onClick,
}: ModelViewerProps) {
  return (
    <div className={`${styles.viewerContainer} ${className}`} style={style} onClick={onClick}>
      <Suspense fallback={<div className={styles.loader}>{loadingSlot}</div>}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} className={styles.canvas}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <Stage intensity={intensity} environment="city" adjustCamera={true} shadows={true}>
            <Model url={modelUrl} />
          </Stage>

          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} far={2} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2} 
            autoRotate={autoRotate} 
          />
        </Canvas>
      </Suspense>
      
      {children && <div className={styles.overlaySlot}>{children}</div>}
    </div>
  );
}
