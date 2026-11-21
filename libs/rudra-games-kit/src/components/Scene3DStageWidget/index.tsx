import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './styles.module.scss';

export interface Scene3DStageWidgetProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @select|arena|crystal|orbit */
  preset?: 'arena' | 'crystal' | 'orbit';
  /** @schema {"type":"number"} */
  speed?: number;
}

export function Scene3DStageWidget({
  themeMode = 'dark',
  title = '3D Adventure Arena',
  preset = 'arena',
  speed = 1,
}: Scene3DStageWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spinSpeed, setSpinSpeed] = useState(Number(speed) || 1);

  useEffect(() => {
    setSpinSpeed(Number(speed) || 1);
  }, [speed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = Math.max(240, el.clientWidth || 360);
    const height = Math.max(180, el.clientHeight || 220);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeMode === 'light' ? 0xf1f5f9 : 0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = '';
    el.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf472b6, 1.6);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    const geometry =
      preset === 'crystal'
        ? new THREE.OctahedronGeometry(1.1, 0)
        : preset === 'orbit'
        ? new THREE.TorusKnotGeometry(0.8, 0.26, 80, 16)
        : new THREE.DodecahedronGeometry(1.05, 0);

    const material = new THREE.MeshStandardMaterial({
      color: preset === 'crystal' ? 0x38bdf8 : preset === 'orbit' ? 0xf472b6 : 0x6366f1,
      roughness: 0.25,
      metalness: 0.55,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.008 * spinSpeed;
      mesh.rotation.y += 0.014 * spinSpeed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [themeMode, preset, spinSpeed]);

  return (
    <div className={`${styles.box} ${styles[`mode_${themeMode}`] || styles.mode_dark}`}>
      <div className={styles.top}>
        <span className={styles.title}>{title}</span>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => setSpinSpeed((s) => (s > 0 ? 0 : 1))}>
            {spinSpeed > 0 ? 'Pause 3D' : 'Resume 3D'}
          </button>
        </div>
      </div>
      <div ref={containerRef} className={styles.canvasHost} />
    </div>
  );
}
export default Scene3DStageWidget;
