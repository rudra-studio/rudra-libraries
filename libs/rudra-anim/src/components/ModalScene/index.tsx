"use client";

import {
  Suspense,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import ScrollStoryContext from "../ScrollStoryContext";

export type Vec3 = readonly [
  number,
  number,
  number,
];

export interface ModelSceneProps {
  children: ReactNode;

  cameraPosition?: Vec3;
  fov?: number;

  background?: string;

  environment?:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse"
    | false;

  ambientIntensity?: number;
  directionalIntensity?: number;
  directionalPosition?: Vec3;

  shadows?: boolean;
  dpr?: number | readonly [number, number];

  className?: string;
  style?: CSSProperties;

  fallback?: ReactNode;
}

export default function ModelScene({
  children,
  cameraPosition = [0, 0, 5],
  fov = 45,
  background = "#050505",
  environment = "city",
  ambientIntensity = 0.7,
  directionalIntensity = 2,
  directionalPosition = [4, 6, 4],
  shadows = true,
  dpr = [1, 1.5],
  className,
  style,
  fallback = null,
}: ModelSceneProps) {
  const scrollStoryContext = useContext(
    ScrollStoryContext,
  );

  const sceneContent = (
    <>
      <color
        attach="background"
        args={[background]}
      />

      <ambientLight intensity={ambientIntensity} />

      <directionalLight
        castShadow={shadows}
        intensity={directionalIntensity}
        position={[...directionalPosition]}
      />

      {environment ? (
        <Environment preset={environment} />
      ) : null}

      <Suspense fallback={null}>
        {children}
      </Suspense>
    </>
  );

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background,
        ...style,
      }}
    >
      <Canvas
        shadows={shadows}
        dpr={dpr as number | [number, number]}
        camera={{
          position: [...cameraPosition],
          fov,
        }}
        fallback={fallback}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {scrollStoryContext ? (
          <ScrollStoryContext.Provider
            value={scrollStoryContext}
          >
            {sceneContent}
          </ScrollStoryContext.Provider>
        ) : (
          sceneContent
        )}
      </Canvas>
    </div>
  );
}