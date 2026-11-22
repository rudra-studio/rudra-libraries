import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./styles.module.scss";

export type OrbitStageThemeMode = "light" | "dark";
export type OrbitGeometryShape = "dodecahedron" | "octahedron" | "icosahedron" | "torus";
export type OrbitCameraPreset = "close" | "medium" | "far";

export interface OrbitStage3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: OrbitStageThemeMode;

  /**
   * 3D mesh shape in the stage.
   *
   * @select|dodecahedron|octahedron|icosahedron|torus
   */
  shape?: OrbitGeometryShape;

  /**
   * Accent color hex string for the mesh.
   */
  accentHex?: string;

  /**
   * Rotation speed multiplier.
   */
  rotationSpeed?: number;

  /**
   * Camera distance preset.
   *
   * @select|close|medium|far
   */
  cameraDistance?: OrbitCameraPreset;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const CAMERA_Z: Record<OrbitCameraPreset, number> = {
  close: 3.1,
  medium: 4.3,
  far: 5.8,
};

export default function OrbitStage3D({
  themeMode = "light",
  shape = "dodecahedron",
  accentHex = "#2563eb",
  rotationSpeed = 1,
  cameraDistance = "medium",
  className = "",
  ...props
}: OrbitStage3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const speed = paused ? 0 : Number(rotationSpeed) || 1;
  const camZ = CAMERA_Z[cameraDistance] || 4.3;

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
    camera.position.set(0, 1.1, camZ);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const geometry =
      shape === "octahedron"
        ? new THREE.OctahedronGeometry(1.15, 0)
        : shape === "icosahedron"
          ? new THREE.IcosahedronGeometry(1.15, 0)
          : shape === "torus"
            ? new THREE.TorusGeometry(0.9, 0.34, 20, 40)
            : new THREE.DodecahedronGeometry(1.12, 0);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentHex || "#2563eb"),
      roughness: 0.3,
      metalness: 0.4,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.007 * speed;
      mesh.rotation.y += 0.013 * speed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [themeMode, shape, accentHex, speed, camZ]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.top}>
        <span className={styles.title}>3D Orbit Stage ({shape})</span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className={styles.btn}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <div ref={hostRef} className={styles.viewport} />
    </div>
  );
}
