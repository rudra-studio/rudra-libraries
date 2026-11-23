import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./styles.module.scss";

export type TurntableThemeMode = "light" | "dark";

export interface TurntableArena3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TurntableThemeMode;

  /**
   * Primary object color hex string.
   */
  objectHex?: string;

  /**
   * Show orbiting satellite ring around the center object.
   *
   * @schema {"type":"boolean"}
   */
  showOrbitRing?: boolean;

  /**
   * Turntable angular speed.
   */
  turntableSpeed?: number;

  /**
   * Arena label text.
   *
   * @translate
   */
  title?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function TurntableArena3D({
  themeMode = "light",
  objectHex = "#059669",
  showOrbitRing = true,
  turntableSpeed = 1,
  title = "3D Turntable Arena",
  className = "",
  ...props
}: TurntableArena3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const width = Math.max(240, el.clientWidth || 380);
    const height = Math.max(180, el.clientHeight || 220);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      themeMode === "dark" ? 0x0f172a : 0xf8fafc
    );

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(4, 6, 4);
    scene.add(dir);

    const disposables: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const padGeo = new THREE.CylinderGeometry(1.55, 1.7, 0.18, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: themeMode === "dark" ? 0x1e293b : 0xe2e8f0,
      roughness: 0.45,
    });
    disposables.push(padGeo);
    materials.push(padMat);
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = -0.75;
    scene.add(padMesh);

    const heroGeo = new THREE.OctahedronGeometry(0.92, 0);
    const heroMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(objectHex || "#059669"),
      roughness: 0.25,
      metalness: 0.35,
    });
    disposables.push(heroGeo);
    materials.push(heroMat);
    const heroMesh = new THREE.Mesh(heroGeo, heroMat);
    heroMesh.position.y = 0.2;
    scene.add(heroMesh);

    let ringMesh: THREE.Mesh | null = null;
    if (showOrbitRing) {
      const ringGeo = new THREE.TorusGeometry(1.38, 0.035, 12, 48);
      ringGeo.rotateX(Math.PI / 2.4);
      const ringMat = new THREE.MeshStandardMaterial({
        color: themeMode === "dark" ? 0x94a3b8 : 0x64748b,
        roughness: 0.3,
      });
      disposables.push(ringGeo);
      materials.push(ringMat);
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.2;
      scene.add(ringMesh);
    }

    const speed = Number(turntableSpeed) || 1;
    let rafId = 0;
    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (autoRotate) {
        heroMesh.rotation.y += 0.014 * speed;
        padMesh.rotation.y += 0.006 * speed;
        if (ringMesh) {
          ringMesh.rotation.z += 0.01 * speed;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      disposables.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [themeMode, objectHex, showOrbitRing, turntableSpeed, autoRotate]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button
          type="button"
          onClick={() => setAutoRotate((r) => !r)}
          className={styles.btn}
        >
          {autoRotate ? "Pause" : "Rotate"}
        </button>
      </div>
      <div ref={hostRef} className={styles.stage} />
    </div>
  );
}
