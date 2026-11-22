import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./styles.module.scss";

export type PolyhedronThemeMode = "light" | "dark";
export type PolyhedronKind = "dodecahedron" | "octahedron" | "icosahedron" | "box";
export type PolyhedronRenderStyle = "solid" | "wireframe";

export interface PolyhedronShowcase3DProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: PolyhedronThemeMode;

  /**
   * Polyhedron geometry type.
   *
   * @select|dodecahedron|octahedron|icosahedron|box
   */
  polyhedron?: PolyhedronKind;

  /**
   * Solid or wireframe material mode.
   *
   * @select|solid|wireframe
   */
  renderStyle?: PolyhedronRenderStyle;

  /**
   * Card heading text.
   *
   * @translate
   */
  title?: string;

  /**
   * Supporting subtitle text.
   *
   * @translate
   */
  subtitle?: string;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function PolyhedronShowcase3D({
  themeMode = "light",
  polyhedron = "icosahedron",
  renderStyle = "wireframe",
  title = "Geometry Inspector",
  subtitle = "Compare solid and wireframe Three.js meshes.",
  className = "",
  ...props
}: PolyhedronShowcase3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [spinning, setSpinning] = useState(true);
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const width = Math.max(240, el.clientWidth || 360);
    const height = Math.max(170, el.clientHeight || 200);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      themeMode === "dark" ? 0x0f172a : 0xf8fafc
    );

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    const geo =
      polyhedron === "box"
        ? new THREE.BoxGeometry(1.5, 1.5, 1.5)
        : polyhedron === "octahedron"
          ? new THREE.OctahedronGeometry(1.2, 0)
          : polyhedron === "dodecahedron"
            ? new THREE.DodecahedronGeometry(1.15, 0)
            : new THREE.IcosahedronGeometry(1.15, 0);

    const mat = new THREE.MeshStandardMaterial({
      color: themeMode === "dark" ? 0x60a5fa : 0x2563eb,
      wireframe: renderStyle === "wireframe",
      roughness: 0.35,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (spinning) {
        mesh.rotation.x += 0.006;
        mesh.rotation.y += 0.011;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [themeMode, polyhedron, renderStyle, spinning]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.card, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.head}>
        <div>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setSpinning((s) => !s)}
          className={styles.btn}
        >
          {spinning ? "Stop" : "Spin"}
        </button>
      </div>
      <div ref={hostRef} className={styles.stage} />
    </div>
  );
}
