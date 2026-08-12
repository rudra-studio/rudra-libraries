import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";

export interface PanoramaRegion {
  /**
   * Unique region id.
   */
  id: string;

  /**
   * Horizontal view angle.
   */
  longitude: number;

  /**
   * Optional vertical view angle.
   */
  latitude?: number;

  /**
   * Allowed distance from longitude
   * in either direction.
   *
   * Example:
   * longitude = 90
   * longitudeRange = 20
   *
   * Active between roughly
   * 70° and 110°.
   */
  longitudeRange?: number;

  /**
   * Allowed vertical distance
   * from latitude.
   */
  latitudeRange?: number;

  /**
   * Region is active only when
   * FOV is >= this value.
   */
  minFov?: number;

  /**
   * Region is active only when
   * FOV is <= this value.
   *
   * Useful for triggering content
   * when the user zooms in.
   */
  maxFov?: number;

  data?: any;
}

export interface PanoramaHotspot {
  /**
   * Unique hotspot id.
   */
  id: string;

  /**
   * Hotspot horizontal position.
   */
  longitude: number;

  /**
   * Hotspot vertical position.
   */
  latitude?: number;

  label?: string;

  /**
   * @color
   */
  color?: string;

  size?: number;

  disabled?: boolean;

  visible?: boolean;

  /**
   * Optional zoom visibility.
   */
  minFov?: number;

  /**
   * Optional zoom visibility.
   */
  maxFov?: number;

  data?: any;
}

export interface PanoramaViewerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "onLoad" | "onError"
  > {
  /**
   * Equirectangular 360° image.
   */
  src?: string;

  /**
   * Initial horizontal view.
   */
  initialLongitude?: number;

  /**
   * Initial vertical view.
   */
  initialLatitude?: number;

  /**
   * Initial camera field of view.
   */
  initialFov?: number;

  /**
   * Minimum FOV.
   *
   * Smaller FOV = more zoomed in.
   */
  minFov?: number;

  /**
   * Maximum FOV.
   */
  maxFov?: number;

  draggable?: boolean;

  zoomable?: boolean;

  autoRotate?: boolean;

  /**
   * Degrees per second.
   */
  autoRotateSpeed?: number;

  pauseAutoRotateOnInteraction?: boolean;

  dragSensitivity?: number;

  zoomSensitivity?: number;

  height?: number;

  /**
   * Regions that react to
   * camera direction and zoom.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","longitude"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "longitude":{"type":"number"},
   *       "latitude":{"type":"number"},
   *       "longitudeRange":{"type":"number"},
   *       "latitudeRange":{"type":"number"},
   *       "minFov":{"type":"number"},
   *       "maxFov":{"type":"number"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  regions?: PanoramaRegion[];

  /**
   * Clickable markers positioned
   * inside the panorama.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","longitude"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "longitude":{"type":"number"},
   *       "latitude":{"type":"number"},
   *       "label":{"type":"string"},
   *       "color":{"type":"string"},
   *       "size":{"type":"number"},
   *       "disabled":{"type":"boolean"},
   *       "visible":{"type":"boolean"},
   *       "minFov":{"type":"number"},
   *       "maxFov":{"type":"number"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  hotspots?: PanoramaHotspot[];

  showHotspotLabels?: boolean;

  /**
   * Default hotspot size.
   */
  hotspotSize?: number;

  /**
   * @color
   */
  hotspotColor?: string;

  /**
   * @color
   */
  hotspotTextColor?: string;

  /**
   * @color
   */
  backgroundColor?: string;

  loadingText?: string;

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  hotspotClassName?: string;

  /**
   * Dynamic HTML attributes.
   *
   * @type|complex
   * @schema {"type":"object"}
   */
  customAttributes?: Record<
    string,
    string
  >;

  /**
   * @type|function
   */
  onLoad?: () => void;

  /**
   * @type|function
   */
  onError?: (
    error: unknown
  ) => void;

  /**
   * Triggered as the view changes.
   *
   * @type|function
   */
  onViewChange?: (
    longitude: number,
    latitude: number,
    fov: number
  ) => void;

  /**
   * Triggered when zoom changes.
   *
   * @type|function
   */
  onZoomChange?: (
    fov: number
  ) => void;

  /**
   * Triggered once when the camera
   * enters a region.
   *
   * @type|function
   */
  onRegionEnter?: (
    region: PanoramaRegion,
    index: number
  ) => void;

  /**
   * Triggered once when the camera
   * leaves a region.
   *
   * @type|function
   */
  onRegionLeave?: (
    region: PanoramaRegion,
    index: number
  ) => void;

  /**
   * Triggered whenever the complete
   * active-region collection changes.
   *
   * @type|function
   */
  onActiveRegionsChange?: (
    regions: PanoramaRegion[]
  ) => void;

  /**
   * @type|function
   */
  onHotspotClick?: (
    hotspot: PanoramaHotspot,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onHotspotHover?: (
    hotspot: PanoramaHotspot,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onHotspotHoverEnd?: (
    hotspot: PanoramaHotspot,
    index: number
  ) => void;
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}

function normalizeLongitude(
  value: number
) {
  let result =
    value % 360;

  if (
    result > 180
  ) {
    result -= 360;
  }

  if (
    result < -180
  ) {
    result += 360;
  }

  return result;
}

function angularDistance(
  first: number,
  second: number
) {
  return Math.abs(
    normalizeLongitude(
      first -
        second
    )
  );
}

function sphericalToVector(
  longitude: number,
  latitude: number,
  radius = 500
) {
  const phi =
    (
      90 -
      latitude
    ) *
    (Math.PI /
      180);

  const theta =
    longitude *
    (Math.PI /
      180);

  return new Vector3(
    radius *
      Math.sin(phi) *
      Math.cos(theta),

    radius *
      Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta)
  );
}

function isFovVisible(
  minFov: number | undefined,
  maxFov: number | undefined,
  fov: number
) {
  if (
    typeof minFov ===
      "number" &&
    fov < minFov
  ) {
    return false;
  }

  if (
    typeof maxFov ===
      "number" &&
    fov > maxFov
  ) {
    return false;
  }

  return true;
}

function isRegionActive(
  region: PanoramaRegion,
  longitude: number,
  latitude: number,
  fov: number
) {
  const longitudeRange =
    Math.max(
      0,
      region.longitudeRange ??
        15
    );

  if (
    angularDistance(
      longitude,
      region.longitude
    ) >
    longitudeRange
  ) {
    return false;
  }

  if (
    typeof region.latitude ===
    "number"
  ) {
    const latitudeRange =
      Math.max(
        0,
        region.latitudeRange ??
          15
      );

    if (
      Math.abs(
        latitude -
          region.latitude
      ) >
      latitudeRange
    ) {
      return false;
    }
  }

  return isFovVisible(
    region.minFov,
    region.maxFov,
    fov
  );
}

export default function PanoramaViewer({
  src,

  initialLongitude = 0,

  initialLatitude = 0,

  initialFov = 75,

  minFov = 30,

  maxFov = 100,

  draggable = true,

  zoomable = true,

  autoRotate = false,

  autoRotateSpeed = 3,

  pauseAutoRotateOnInteraction = true,

  dragSensitivity = 0.12,

  zoomSensitivity = 0.05,

  height = 420,

  regions = [],

  hotspots = [],

  showHotspotLabels = true,

  hotspotSize = 14,

  hotspotColor = "#2563eb",

  hotspotTextColor = "#ffffff",

  backgroundColor = "#111827",

  loadingText =
    "Loading panorama...",

  emptyText =
    "Add a panorama image",

  className =
    "w-full overflow-hidden rounded-xl",

  hotspotClassName = "",

  customAttributes = {},

  onLoad,

  onError,

  onViewChange,

  onZoomChange,

  onRegionEnter,

  onRegionLeave,

  onActiveRegionsChange,

  onHotspotClick,

  onHotspotHover,

  onHotspotHoverEnd,

  style,

  ...props
}: PanoramaViewerProps) {
  const rootRef =
    useRef<HTMLDivElement>(
      null
    );

  const canvasHostRef =
    useRef<HTMLDivElement>(
      null
    );

  const rendererRef =
    useRef<WebGLRenderer | null>(
      null
    );

  const cameraRef =
    useRef<PerspectiveCamera | null>(
      null
    );

  const sceneRef =
    useRef<Scene | null>(
      null
    );

  const meshRef =
    useRef<Mesh | null>(
      null
    );

  const textureRef =
    useRef<Texture | null>(
      null
    );

  const animationRef =
    useRef<number | null>(
      null
    );

  const lastFrameRef =
    useRef<number | null>(
      null
    );

  const lastViewEmitRef =
    useRef(0);

  const longitudeRef =
    useRef(
      initialLongitude
    );

  const latitudeRef =
    useRef(
      initialLatitude
    );

  const interactingRef =
    useRef(false);

  const pointerRef =
    useRef({
      x: 0,
      y: 0,
      longitude: 0,
      latitude: 0,
    });

  /*
   * DOM references for hotspot
   * overlays.
   */
  const hotspotElementsRef =
    useRef<
      Map<
        string,
        HTMLButtonElement
      >
    >(
      new Map()
    );

  /*
   * Currently active regions.
   */
  const activeRegionsRef =
    useRef<
      Map<
        string,
        PanoramaRegion
      >
    >(
      new Map()
    );

  /*
   * Keep animation loop values current
   * without recreating Three.js.
   */
  const autoRotateRef =
    useRef(autoRotate);

  const autoRotateSpeedRef =
    useRef(
      autoRotateSpeed
    );

  const pauseAutoRotateRef =
    useRef(
      pauseAutoRotateOnInteraction
    );

  const regionsRef =
    useRef(regions);

  const hotspotsRef =
    useRef(hotspots);

  const onViewChangeRef =
    useRef(onViewChange);

  const onRegionEnterRef =
    useRef(onRegionEnter);

  const onRegionLeaveRef =
    useRef(onRegionLeave);

  const onActiveRegionsChangeRef =
    useRef(
      onActiveRegionsChange
    );

  autoRotateRef.current =
    autoRotate;

  autoRotateSpeedRef.current =
    autoRotateSpeed;

  pauseAutoRotateRef.current =
    pauseAutoRotateOnInteraction;

  regionsRef.current =
    regions;

  hotspotsRef.current =
    hotspots;

  onViewChangeRef.current =
    onViewChange;

  onRegionEnterRef.current =
    onRegionEnter;

  onRegionLeaveRef.current =
    onRegionLeave;

  onActiveRegionsChangeRef.current =
    onActiveRegionsChange;

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState(false);

  const resolvedMinFov =
    Math.max(
      10,
      Math.min(
        minFov,
        maxFov
      )
    );

  const resolvedMaxFov =
    Math.min(
      120,
      Math.max(
        minFov,
        maxFov
      )
    );

  const safeHotspots =
    useMemo(
      () =>
        Array.isArray(
          hotspots
        )
          ? hotspots
          : [],
      [hotspots]
    );

  /*
   * Check region enter/leave state.
   */
  const evaluateRegions =
    (
      longitude: number,
      latitude: number,
      fov: number
    ) => {
      const nextActive =
        new Map<
          string,
          PanoramaRegion
        >();

      regionsRef.current.forEach(
        (
          region,
          index
        ) => {
          if (
            !region?.id
          ) {
            return;
          }

          const active =
            isRegionActive(
              region,
              longitude,
              latitude,
              fov
            );

          if (!active) {
            return;
          }

          nextActive.set(
            region.id,
            region
          );

          if (
            !activeRegionsRef.current.has(
              region.id
            )
          ) {
            onRegionEnterRef.current?.(
              region,
              index
            );
          }
        }
      );

      activeRegionsRef.current.forEach(
        (
          previousRegion,
          id
        ) => {
          if (
            nextActive.has(
              id
            )
          ) {
            return;
          }

          const index =
            regionsRef.current.findIndex(
              (
                region
              ) =>
                region.id ===
                id
            );

          onRegionLeaveRef.current?.(
            previousRegion,
            index
          );
        }
      );

      const previousIds =
        [
          ...activeRegionsRef.current.keys(),
        ];

      const nextIds =
        [
          ...nextActive.keys(),
        ];

      const changed =
        previousIds.length !==
          nextIds.length ||
        nextIds.some(
          (
            id
          ) =>
            !activeRegionsRef.current.has(
              id
            )
        );

      activeRegionsRef.current =
        nextActive;

      if (changed) {
        onActiveRegionsChangeRef.current?.(
          [
            ...nextActive.values(),
          ]
        );
      }
    };

  /*
   * Position HTML hotspots over
   * their 3D locations.
   */
  const updateHotspots =
    () => {
      const camera =
        cameraRef.current;

      const root =
        rootRef.current;

      if (
        !camera ||
        !root
      ) {
        return;
      }

      const width =
        root.clientWidth;

      const currentHeight =
        root.clientHeight;

      if (
        width <= 0 ||
        currentHeight <= 0
      ) {
        return;
      }

      const cameraDirection =
        new Vector3();

      camera.getWorldDirection(
        cameraDirection
      );

      hotspotsRef.current.forEach(
        (
          hotspot
        ) => {
          const element =
            hotspotElementsRef.current.get(
              hotspot.id
            );

          if (!element) {
            return;
          }

          const fov =
            camera.fov;

          const zoomVisible =
            isFovVisible(
              hotspot.minFov,
              hotspot.maxFov,
              fov
            );

          if (
            hotspot.visible ===
              false ||
            !zoomVisible ||
            !textureRef.current
          ) {
            element.style.display =
              "none";

            return;
          }

          const worldPosition =
            sphericalToVector(
              hotspot.longitude,
              hotspot.latitude ??
                0
            );

          const direction =
            worldPosition
              .clone()
              .normalize();

          const facingCamera =
            direction.dot(
              cameraDirection
            ) > 0;

          if (
            !facingCamera
          ) {
            element.style.display =
              "none";

            return;
          }

          const projected =
            worldPosition
              .clone()
              .project(
                camera
              );

          const visible =
            projected.z >=
              -1 &&
            projected.z <=
              1 &&
            projected.x >=
              -1.15 &&
            projected.x <=
              1.15 &&
            projected.y >=
              -1.15 &&
            projected.y <=
              1.15;

          if (!visible) {
            element.style.display =
              "none";

            return;
          }

          const screenX =
            (
              projected.x *
                0.5 +
              0.5
            ) *
            width;

          const screenY =
            (
              -projected.y *
                0.5 +
              0.5
            ) *
            currentHeight;

          element.style.display =
            "flex";

          element.style.left =
            `${screenX}px`;

          element.style.top =
            `${screenY}px`;
        }
      );
    };

  /*
   * Initialize Three.js only once.
   */
  useEffect(() => {
    const root =
      rootRef.current;

    const host =
      canvasHostRef.current;

    if (
      !root ||
      !host
    ) {
      return;
    }

    const scene =
      new Scene();

    const camera =
      new PerspectiveCamera(
        clamp(
          initialFov,
          resolvedMinFov,
          resolvedMaxFov
        ),
        1,
        0.1,
        1100
      );

    const renderer =
      new WebGLRenderer({
        antialias: true,
        alpha: false,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,
        2
      )
    );

    renderer.setClearColor(
      backgroundColor,
      1
    );

    renderer.domElement.style.display =
      "block";

    renderer.domElement.style.width =
      "100%";

    renderer.domElement.style.height =
      "100%";

    renderer.domElement.style.touchAction =
      "none";

    host.appendChild(
      renderer.domElement
    );

    sceneRef.current =
      scene;

    cameraRef.current =
      camera;

    rendererRef.current =
      renderer;

    const resize =
      () => {
        const width =
          root.clientWidth;

        const currentHeight =
          root.clientHeight;

        if (
          width <= 0 ||
          currentHeight <= 0
        ) {
          return;
        }

        renderer.setSize(
          width,
          currentHeight,
          false
        );

        camera.aspect =
          width /
          currentHeight;

        camera.updateProjectionMatrix();
      };

    resize();

    const resizeObserver =
      new ResizeObserver(
        resize
      );

    resizeObserver.observe(
      root
    );

    const animate =
      (
        time: number
      ) => {
        const previousTime =
          lastFrameRef.current ??
          time;

        const delta =
          Math.min(
            (
              time -
              previousTime
            ) /
              1000,
            0.1
          );

        lastFrameRef.current =
          time;

        if (
          autoRotateRef.current &&
          !(
            pauseAutoRotateRef.current &&
            interactingRef.current
          )
        ) {
          longitudeRef.current +=
            autoRotateSpeedRef.current *
            delta;
        }

        longitudeRef.current =
          normalizeLongitude(
            longitudeRef.current
          );

        latitudeRef.current =
          clamp(
            latitudeRef.current,
            -85,
            85
          );

        const target =
          sphericalToVector(
            longitudeRef.current,
            latitudeRef.current
          );

        camera.lookAt(
          target
        );

        renderer.render(
          scene,
          camera
        );

        evaluateRegions(
          longitudeRef.current,
          latitudeRef.current,
          camera.fov
        );

        updateHotspots();

        /*
         * Auto-rotation view updates
         * are throttled so Rudra doesn't
         * receive 60 events/second.
         */
        if (
          autoRotateRef.current &&
          time -
            lastViewEmitRef.current >=
            100
        ) {
          lastViewEmitRef.current =
            time;

          onViewChangeRef.current?.(
            longitudeRef.current,
            latitudeRef.current,
            camera.fov
          );
        }

        animationRef.current =
          requestAnimationFrame(
            animate
          );
      };

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      resizeObserver.disconnect();

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      textureRef.current?.dispose();

      if (
        meshRef.current
      ) {
        meshRef.current.geometry.dispose();

        const material =
          meshRef.current.material;

        if (
          Array.isArray(
            material
          )
        ) {
          material.forEach(
            (
              item
            ) =>
              item.dispose()
          );
        } else {
          material.dispose();
        }
      }

      renderer.dispose();

      renderer.domElement.remove();

      rendererRef.current =
        null;

      cameraRef.current =
        null;

      sceneRef.current =
        null;

      meshRef.current =
        null;

      textureRef.current =
        null;

      lastFrameRef.current =
        null;

      activeRegionsRef.current.clear();
    };
  }, []);

  /*
   * Update renderer background.
   */
  useEffect(() => {
    rendererRef.current?.setClearColor(
      backgroundColor,
      1
    );
  }, [
    backgroundColor,
  ]);

  /*
   * Keep current FOV valid if
   * min/max props change.
   */
  useEffect(() => {
    const camera =
      cameraRef.current;

    if (!camera) {
      return;
    }

    camera.fov =
      clamp(
        camera.fov,
        resolvedMinFov,
        resolvedMaxFov
      );

    camera.updateProjectionMatrix();
  }, [
    resolvedMinFov,
    resolvedMaxFov,
  ]);

  /*
   * Load / replace panorama.
   */
  useEffect(() => {
    const scene =
      sceneRef.current;

    if (!scene) {
      return;
    }

    if (
      meshRef.current
    ) {
      scene.remove(
        meshRef.current
      );

      meshRef.current.geometry.dispose();

      const previousMaterial =
        meshRef.current.material;

      if (
        Array.isArray(
          previousMaterial
        )
      ) {
        previousMaterial.forEach(
          (
            material
          ) =>
            material.dispose()
        );
      } else {
        previousMaterial.dispose();
      }

      meshRef.current =
        null;
    }

    textureRef.current?.dispose();

    textureRef.current =
      null;

    if (!src) {
      setLoading(false);
      setError(false);

      return;
    }

    let cancelled =
      false;

    setLoading(true);
    setError(false);

    const loader =
      new TextureLoader();

    loader.setCrossOrigin(
      "anonymous"
    );

    loader.load(
      src,

      (
        texture
      ) => {
        if (cancelled) {
          texture.dispose();
          return;
        }

        texture.colorSpace =
          SRGBColorSpace;

        /*
         * Negative X scale is the
         * standard Three.js approach
         * for viewing an equirectangular
         * texture from inside a sphere.
         */
        const geometry =
          new SphereGeometry(
            500,
            64,
            40
          );

        geometry.scale(
          -1,
          1,
          1
        );

        const material =
          new MeshBasicMaterial({
            map: texture,
          });

        const mesh =
          new Mesh(
            geometry,
            material
          );

        scene.add(
          mesh
        );

        textureRef.current =
          texture;

        meshRef.current =
          mesh;

        setLoading(false);
        setError(false);

        onLoad?.();
      },

      undefined,

      (
        loadError
      ) => {
        if (cancelled) {
          return;
        }

        setLoading(false);
        setError(true);

        onError?.(
          loadError
        );
      }
    );

    return () => {
      cancelled =
        true;
    };
  }, [
    src,
  ]);

  /*
   * Drag interaction.
   */
  useEffect(() => {
    const renderer =
      rendererRef.current;

    if (!renderer) {
      return;
    }

    const canvas =
      renderer.domElement;

    if (!draggable) {
      canvas.style.cursor =
        "default";

      return;
    }

    canvas.style.cursor =
      "grab";

    const pointerDown =
      (
        event: PointerEvent
      ) => {
        interactingRef.current =
          true;

        pointerRef.current = {
          x:
            event.clientX,

          y:
            event.clientY,

          longitude:
            longitudeRef.current,

          latitude:
            latitudeRef.current,
        };

        canvas.setPointerCapture?.(
          event.pointerId
        );

        canvas.style.cursor =
          "grabbing";
      };

    const pointerMove =
      (
        event: PointerEvent
      ) => {
        if (
          !interactingRef.current
        ) {
          return;
        }

        const deltaX =
          event.clientX -
          pointerRef.current.x;

        const deltaY =
          event.clientY -
          pointerRef.current.y;

        longitudeRef.current =
          normalizeLongitude(
            pointerRef.current
              .longitude -
              deltaX *
                dragSensitivity
          );

        latitudeRef.current =
          clamp(
            pointerRef.current
              .latitude +
              deltaY *
                dragSensitivity,
            -85,
            85
          );

        onViewChange?.(
          longitudeRef.current,
          latitudeRef.current,
          cameraRef.current
            ?.fov ??
            initialFov
        );
      };

    const pointerEnd =
      (
        event: PointerEvent
      ) => {
        interactingRef.current =
          false;

        canvas.releasePointerCapture?.(
          event.pointerId
        );

        canvas.style.cursor =
          "grab";
      };

    canvas.addEventListener(
      "pointerdown",
      pointerDown
    );

    canvas.addEventListener(
      "pointermove",
      pointerMove
    );

    canvas.addEventListener(
      "pointerup",
      pointerEnd
    );

    canvas.addEventListener(
      "pointercancel",
      pointerEnd
    );

    return () => {
      canvas.removeEventListener(
        "pointerdown",
        pointerDown
      );

      canvas.removeEventListener(
        "pointermove",
        pointerMove
      );

      canvas.removeEventListener(
        "pointerup",
        pointerEnd
      );

      canvas.removeEventListener(
        "pointercancel",
        pointerEnd
      );
    };
  }, [
    draggable,
    dragSensitivity,
    initialFov,
    onViewChange,
  ]);

  /*
   * Wheel zoom.
   */
  useEffect(() => {
    const renderer =
      rendererRef.current;

    const camera =
      cameraRef.current;

    if (
      !renderer ||
      !camera ||
      !zoomable
    ) {
      return;
    }

    const canvas =
      renderer.domElement;

    const wheel =
      (
        event: WheelEvent
      ) => {
        event.preventDefault();

        camera.fov =
          clamp(
            camera.fov +
              event.deltaY *
                zoomSensitivity,
            resolvedMinFov,
            resolvedMaxFov
          );

        camera.updateProjectionMatrix();

        onZoomChange?.(
          camera.fov
        );

        onViewChange?.(
          longitudeRef.current,
          latitudeRef.current,
          camera.fov
        );
      };

    canvas.addEventListener(
      "wheel",
      wheel,
      {
        passive: false,
      }
    );

    return () => {
      canvas.removeEventListener(
        "wheel",
        wheel
      );
    };
  }, [
    zoomable,
    zoomSensitivity,
    resolvedMinFov,
    resolvedMaxFov,
    onZoomChange,
    onViewChange,
  ]);

  return (
    <div
      ref={rootRef}
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        width:
          "100%",

        height,

        overflow:
          "hidden",

        background:
          backgroundColor,

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {/*
       * Dedicated Three.js host.
       */}
      <div
        ref={
          canvasHostRef
        }
        style={{
          position:
            "absolute",

          inset: 0,
        }}
      />

      {/*
       * Hotspots.
       *
       * Their screen position is
       * updated directly from the
       * Three.js animation loop.
       */}
      {src &&
        !error && (
          <div
            style={{
              position:
                "absolute",

              inset: 0,

              pointerEvents:
                "none",

              overflow:
                "hidden",

              zIndex: 5,
            }}
          >
            {safeHotspots.map(
              (
                hotspot,
                index
              ) => {
                const size =
                  Math.max(
                    6,
                    hotspot.size ??
                      hotspotSize
                  );

                const color =
                  hotspot.color ??
                  hotspotColor;

                return (
                  <button
                    key={
                      hotspot.id
                    }
                    ref={(
                      element
                    ) => {
                      if (
                        element
                      ) {
                        hotspotElementsRef.current.set(
                          hotspot.id,
                          element
                        );
                      } else {
                        hotspotElementsRef.current.delete(
                          hotspot.id
                        );
                      }
                    }}
                    type="button"
                    disabled={
                      hotspot.disabled
                    }
                    className={
                      hotspotClassName
                    }
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      if (
                        hotspot.disabled
                      ) {
                        return;
                      }

                      onHotspotClick?.(
                        hotspot,
                        index
                      );
                    }}
                    onMouseEnter={() => {
                      if (
                        hotspot.disabled
                      ) {
                        return;
                      }

                      onHotspotHover?.(
                        hotspot,
                        index
                      );
                    }}
                    onMouseLeave={() => {
                      if (
                        hotspot.disabled
                      ) {
                        return;
                      }

                      onHotspotHoverEnd?.(
                        hotspot,
                        index
                      );
                    }}
                    style={{
                      position:
                        "absolute",

                      display:
                        "none",

                      alignItems:
                        "center",

                      gap: 7,

                      transform:
                        "translate(-50%, -50%)",

                      padding:
                        showHotspotLabels &&
                        hotspot.label
                          ? "6px 9px 6px 6px"
                          : 5,

                      border:
                        "1px solid rgba(255,255,255,0.75)",

                      borderRadius:
                        999,

                      background:
                        "rgba(17,24,39,0.78)",

                      color:
                        hotspotTextColor,

                      cursor:
                        hotspot.disabled
                          ? "not-allowed"
                          : "pointer",

                      opacity:
                        hotspot.disabled
                          ? 0.45
                          : 1,

                      pointerEvents:
                        "auto",

                      whiteSpace:
                        "nowrap",

                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.24)",

                      backdropFilter:
                        "blur(8px)",

                      WebkitBackdropFilter:
                        "blur(8px)",

                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        width:
                          size,

                        height:
                          size,

                        flexShrink:
                          0,

                        borderRadius:
                          "50%",

                        background:
                          color,

                        border:
                          "2px solid white",

                        boxShadow:
                          `0 0 0 3px ${color}55`,
                      }}
                    />

                    {showHotspotLabels &&
                      hotspot.label && (
                        <span
                          style={{
                            fontSize:
                              12,

                            fontWeight:
                              600,

                            lineHeight:
                              1,
                          }}
                        >
                          {
                            hotspot.label
                          }
                        </span>
                      )}
                  </button>
                );
              }
            )}
          </div>
        )}

      {!src && (
        <div
          style={{
            position:
              "absolute",

            inset: 0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            color:
              "#9ca3af",

            fontSize:
              14,

            pointerEvents:
              "none",

            zIndex: 10,
          }}
        >
          {emptyText}
        </div>
      )}

      {loading && (
        <div
          style={{
            position:
              "absolute",

            inset: 0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              backgroundColor,

            color:
              "#d1d5db",

            fontSize:
              14,

            pointerEvents:
              "none",

            zIndex: 20,
          }}
        >
          {loadingText}
        </div>
      )}

      {error && (
        <div
          style={{
            position:
              "absolute",

            inset: 0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              backgroundColor,

            color:
              "#ef4444",

            fontSize:
              14,

            pointerEvents:
              "none",

            zIndex: 20,
          }}
        >
          Unable to load
          panorama
        </div>
      )}
    </div>
  );
}