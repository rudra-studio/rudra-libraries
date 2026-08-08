import {
  useEffect,
  useRef,
} from "react";

import { useFrame } from "@react-three/fiber";

import {
  Clone,
  useGLTF,
} from "@react-three/drei";

import type {
  Group,
  Material,
  Mesh,
  Object3D,
} from "three";

import type { ScrollEasing } from "./ScrollStory";
import useScrollStory  from "../../hooks/useScrollStory";
import type { Vec3 } from "./ModelScene";

export interface Transform3DFrame {
  /**
   * ScrollStory progress between 0 and 1.
   */
  at: number;

  position?: Vec3;
  rotation?: Vec3;

  scale?: number | Vec3;
  opacity?: number;
}

export interface ScrollModelProps {
  src: string;
  frames: readonly Transform3DFrame[];

  easing?: ScrollEasing;

  castShadow?: boolean;
  receiveShadow?: boolean;

  deepClone?:
    | boolean
    | "materialsOnly"
    | "geometriesOnly";

  name?: string;
}

export interface Sampled3DTransform {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  opacity: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(
  from: number,
  to: number,
  progress: number,
): number {
  return from + (to - from) * progress;
}

function applyEasing(
  progress: number,
  easing: ScrollEasing,
): number {
  const value = clamp01(progress);

  switch (easing) {
    case "easeIn":
      return value * value;

    case "easeOut":
      return 1 - (1 - value) * (1 - value);

    case "easeInOut":
      return value < 0.5
        ? 2 * value * value
        : 1 - Math.pow(-2 * value + 2, 2) / 2;

    case "smoothstep":
      return value * value * (3 - 2 * value);

    case "linear":
    default:
      return value;
  }
}

function normalizeScale(
  scale: number | Vec3,
): Vec3 {
  if (typeof scale === "number") {
    return [scale, scale, scale];
  }

  return scale;
}

function interpolateVec3(
  from: Vec3,
  to: Vec3,
  progress: number,
): Vec3 {
  return [
    lerp(from[0], to[0], progress),
    lerp(from[1], to[1], progress),
    lerp(from[2], to[2], progress),
  ];
}

function sampleVec3Property(
  frames: readonly Transform3DFrame[],
  property: "position" | "rotation",
  progress: number,
  fallback: Vec3,
  easing: ScrollEasing,
): Vec3 {
  const propertyFrames = frames
    .filter((frame) => frame[property] !== undefined)
    .map((frame) => ({
      at: clamp01(frame.at),
      value: frame[property] as Vec3,
    }))
    .sort((a, b) => a.at - b.at);

  if (propertyFrames.length === 0) {
    return fallback;
  }

  if (
    propertyFrames.length === 1 ||
    progress <= propertyFrames[0].at
  ) {
    return propertyFrames[0].value;
  }

  const lastFrame =
    propertyFrames[propertyFrames.length - 1];

  if (progress >= lastFrame.at) {
    return lastFrame.value;
  }

  for (
    let index = 0;
    index < propertyFrames.length - 1;
    index += 1
  ) {
    const left = propertyFrames[index];
    const right = propertyFrames[index + 1];

    if (
      progress >= left.at &&
      progress <= right.at
    ) {
      const distance = Math.max(
        0.000001,
        right.at - left.at,
      );

      const localProgress = applyEasing(
        (progress - left.at) / distance,
        easing,
      );

      return interpolateVec3(
        left.value,
        right.value,
        localProgress,
      );
    }
  }

  return lastFrame.value;
}

function sampleScale(
  frames: readonly Transform3DFrame[],
  progress: number,
  easing: ScrollEasing,
): Vec3 {
  const propertyFrames = frames
    .filter((frame) => frame.scale !== undefined)
    .map((frame) => ({
      at: clamp01(frame.at),
      value: normalizeScale(
        frame.scale as number | Vec3,
      ),
    }))
    .sort((a, b) => a.at - b.at);

  if (propertyFrames.length === 0) {
    return [1, 1, 1];
  }

  if (
    propertyFrames.length === 1 ||
    progress <= propertyFrames[0].at
  ) {
    return propertyFrames[0].value;
  }

  const lastFrame =
    propertyFrames[propertyFrames.length - 1];

  if (progress >= lastFrame.at) {
    return lastFrame.value;
  }

  for (
    let index = 0;
    index < propertyFrames.length - 1;
    index += 1
  ) {
    const left = propertyFrames[index];
    const right = propertyFrames[index + 1];

    if (
      progress >= left.at &&
      progress <= right.at
    ) {
      const distance = Math.max(
        0.000001,
        right.at - left.at,
      );

      const localProgress = applyEasing(
        (progress - left.at) / distance,
        easing,
      );

      return interpolateVec3(
        left.value,
        right.value,
        localProgress,
      );
    }
  }

  return lastFrame.value;
}

function sampleOpacity(
  frames: readonly Transform3DFrame[],
  progress: number,
  easing: ScrollEasing,
): number {
  const propertyFrames = frames
    .filter((frame) => frame.opacity !== undefined)
    .map((frame) => ({
      at: clamp01(frame.at),
      value: frame.opacity as number,
    }))
    .sort((a, b) => a.at - b.at);

  if (propertyFrames.length === 0) {
    return 1;
  }

  if (
    propertyFrames.length === 1 ||
    progress <= propertyFrames[0].at
  ) {
    return propertyFrames[0].value;
  }

  const lastFrame =
    propertyFrames[propertyFrames.length - 1];

  if (progress >= lastFrame.at) {
    return lastFrame.value;
  }

  for (
    let index = 0;
    index < propertyFrames.length - 1;
    index += 1
  ) {
    const left = propertyFrames[index];
    const right = propertyFrames[index + 1];

    if (
      progress >= left.at &&
      progress <= right.at
    ) {
      const distance = Math.max(
        0.000001,
        right.at - left.at,
      );

      const localProgress = applyEasing(
        (progress - left.at) / distance,
        easing,
      );

      return lerp(
        left.value,
        right.value,
        localProgress,
      );
    }
  }

  return lastFrame.value;
}

export function sample3DTransform(
  frames: readonly Transform3DFrame[],
  progress: number,
  easing: ScrollEasing,
): Sampled3DTransform {
  return {
    position: sampleVec3Property(
      frames,
      "position",
      progress,
      [0, 0, 0],
      easing,
    ),

    rotation: sampleVec3Property(
      frames,
      "rotation",
      progress,
      [0, 0, 0],
      easing,
    ),

    scale: sampleScale(
      frames,
      progress,
      easing,
    ),

    opacity: sampleOpacity(
      frames,
      progress,
      easing,
    ),
  };
}

function collectMaterials(
  root: Object3D,
): Material[] {
  const materials = new Set<Material>();

  root.traverse((object) => {
    const mesh = object as Mesh;

    if (!mesh.material) {
      return;
    }

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => {
        materials.add(material);
      });
    } else {
      materials.add(mesh.material);
    }
  });

  return [...materials];
}

export default function ScrollModel({
  src,
  frames,
  easing = "smoothstep",
  castShadow = true,
  receiveShadow = true,
  deepClone = "materialsOnly",
  name,
}: ScrollModelProps) {
  const groupRef = useRef<Group>(null);
  const materialsRef = useRef<Material[]>([]);

  const { progress } = useScrollStory();
  const { scene } = useGLTF(src);

  useEffect(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    materialsRef.current = collectMaterials(group);

    materialsRef.current.forEach((material) => {
      material.transparent = true;
      material.needsUpdate = true;
    });
  }, [scene, deepClone]);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const transform = sample3DTransform(
      frames,
      progress.get(),
      easing,
    );

    group.position.set(...transform.position);
    group.rotation.set(...transform.rotation);
    group.scale.set(...transform.scale);

    group.visible = transform.opacity > 0.001;

    materialsRef.current.forEach((material) => {
      material.opacity = transform.opacity;
    });
  });

  return (
    <group ref={groupRef} name={name}>
      <Clone
        object={scene}
        deep={deepClone}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
    </group>
  );
}