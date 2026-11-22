import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./styles.module.scss";

export type TorusKnotThemeMode = "light" | "dark";
export type TorusKnotCameraAngle = "angled" | "top";

export interface TorusKnotStage3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: TorusKnotThemeMode;

  /**
   * Accent hex color for the torus knot.
   */
  accentHex?: string;

  /**
   * Spin speed multiplier.
   */
  spinSpeed?: number;

  /**
   * Camera viewpoint preset.
   *
   * @select|angled|top
   */
  cameraAngle?: TorusKnotCameraAngle;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function TorusKnotStage3D({
  themeMode = "light",
  accentHex = "#7c3aed",
  spinSpeed = 1,
  cameraAngle = "angled",
  className = "",
  ...props
}: TorusKnotStage3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const speed = Number(spinSpeed) || 1;

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
    if (cameraAngle === "top") {
      camera.position.set(0, 5.2, 0.01);
    } else {
      camera.position.set(0, 1.4, 4.6);
    }
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(4, 6, 4);
    scene.add(key);

    const geo = new THREE.TorusKnotGeometry(0.85, 0.26, 96, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentHex || "#7c3aed"),
      roughness: 0.25,
      metalness: 0.45,
    });

    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      knot.rotation.x += 0.008 * speed;
      knot.rotation.y += 0.012 * speed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [themeMode, accentHex, speed, cameraAngle]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        <span className={styles.title}>Torus Knot 3D Stage</span>
        <span className={styles.meta}>{cameraAngle}</span>
      </div>
      <div ref={hostRef} className={styles.stage} />
    </div>
  );
}
