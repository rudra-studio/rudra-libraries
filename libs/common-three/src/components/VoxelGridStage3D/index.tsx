import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./styles.module.scss";

export type VoxelGridThemeMode = "light" | "dark";

export interface VoxelGridStage3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: VoxelGridThemeMode;

  /**
   * Grid dimension along X and Z axes (2 to 8).
   */
  gridSize?: number;

  /**
   * Highlighted voxel color hex string.
   */
  highlightHex?: string;

  /**
   * Animate wave height across voxels.
   *
   * @schema {"type":"boolean"}
   */
  animateWave?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function VoxelGridStage3D({
  themeMode = "light",
  gridSize = 5,
  highlightHex = "#2563eb",
  animateWave = true,
  className = "",
  ...props
}: VoxelGridStage3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [selectedCell, setSelectedCell] = useState("2,2");
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const dim = Math.max(2, Math.min(8, Math.floor(Number(gridSize) || 5)));

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
    const span = dim * 1.15;
    camera.position.set(span * 0.85, span * 0.95, span * 1.1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(5, 8, 6);
    scene.add(dir);

    const boxGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const baseMat = new THREE.MeshStandardMaterial({
      color: themeMode === "dark" ? 0x334155 : 0xcbd5e1,
      roughness: 0.35,
    });
    const activeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(highlightHex || "#2563eb"),
      roughness: 0.25,
    });

    const voxels: { mesh: THREE.Mesh; ix: number; iz: number }[] = [];
    const offset = (dim - 1) / 2;

    for (let ix = 0; ix < dim; ix++) {
      for (let iz = 0; iz < dim; iz++) {
        const key = `${ix},${iz}`;
        const mesh = new THREE.Mesh(
          boxGeo,
          key === selectedCell ? activeMat : baseMat
        );
        mesh.position.set((ix - offset) * 0.95, 0, (iz - offset) * 0.95);
        scene.add(mesh);
        voxels.push({ mesh, ix, iz });
      }
    }

    let rafId = 0;
    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate);
      for (const v of voxels) {
        if (animateWave) {
          v.mesh.position.y =
            Math.sin(now * 0.003 + v.ix * 0.7 + v.iz * 0.5) * 0.22;
        } else {
          v.mesh.position.y = 0;
        }
      }
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      window.cancelAnimationFrame(rafId);
      boxGeo.dispose();
      baseMat.dispose();
      activeMat.dispose();
      renderer.dispose();
    };
  }, [themeMode, dim, highlightHex, animateWave, selectedCell]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.header}>
        <span className={styles.title}>3D Voxel Grid ({dim}x{dim})</span>
        <span className={styles.badge}>Cell {selectedCell}</span>
      </div>
      <div ref={hostRef} className={styles.stage} />
      <div className={styles.pickerRow}>
        {Array.from({ length: dim }, (_, idx) => {
          const coord = `${idx},${idx}`;
          return (
            <button
              key={coord}
              type="button"
              onClick={() => setSelectedCell(coord)}
              className={[
                styles.chip,
                selectedCell === coord ? styles.activeChip : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {coord}
            </button>
          );
        })}
      </div>
    </div>
  );
}
