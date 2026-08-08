"use client";

import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";

import type { PerspectiveCamera } from "three";

import type { ScrollEasing } from "../ScrollStory";
import useScrollStory from "../../hooks/useScrollStory";
import type { Vec3 } from "../ModelScene";

import {
  sample3DTransform,
  type Transform3DFrame,
} from "../ScrollModel";

export interface CameraFovFrame {
  at: number;
  value: number;
}

export interface ScrollCameraProps {
  frames: readonly Transform3DFrame[];

  easing?: ScrollEasing;

  /**
   * When provided, lookAt overrides rotation keyframes.
   */
  lookAt?: Vec3;

  fovFrames?: readonly CameraFovFrame[];
}

function lerp(
  from: number,
  to: number,
  progress: number,
): number {
  return from + (to - from) * progress;
}

function sampleFov(
  frames: readonly CameraFovFrame[],
  progress: number,
  fallback: number,
): number {
  const orderedFrames = [...frames].sort(
    (a, b) => a.at - b.at,
  );

  if (orderedFrames.length === 0) {
    return fallback;
  }

  if (
    orderedFrames.length === 1 ||
    progress <= orderedFrames[0].at
  ) {
    return orderedFrames[0].value;
  }

  const lastFrame =
    orderedFrames[orderedFrames.length - 1];

  if (progress >= lastFrame.at) {
    return lastFrame.value;
  }

  for (
    let index = 0;
    index < orderedFrames.length - 1;
    index += 1
  ) {
    const left = orderedFrames[index];
    const right = orderedFrames[index + 1];

    if (
      progress >= left.at &&
      progress <= right.at
    ) {
      const distance = Math.max(
        0.000001,
        right.at - left.at,
      );

      const localProgress =
        (progress - left.at) / distance;

      return lerp(
        left.value,
        right.value,
        localProgress,
      );
    }
  }

  return lastFrame.value;
}

export default function ScrollCamera({
  frames,
  easing = "smoothstep",
  lookAt,
  fovFrames,
}: ScrollCameraProps) {
  const { progress } = useScrollStory();
  const { camera } = useThree();

  useFrame(() => {
    const currentProgress = progress.get();

    const transform = sample3DTransform(
      frames,
      currentProgress,
      easing,
    );

    camera.position.set(...transform.position);

    if (lookAt) {
      camera.lookAt(...lookAt);
    } else {
      camera.rotation.set(...transform.rotation);
    }

    if (
      fovFrames &&
      fovFrames.length > 0 &&
      "fov" in camera
    ) {
      const perspectiveCamera =
        camera as PerspectiveCamera;

      perspectiveCamera.fov = sampleFov(
        fovFrames,
        currentProgress,
        perspectiveCamera.fov,
      );

      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}