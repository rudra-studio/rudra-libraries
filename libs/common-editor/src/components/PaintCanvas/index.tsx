import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type PaintCanvasThemeMode = "light" | "dark";
export type PaintCanvasTool = "pen" | "eraser";

export interface PaintCanvasProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: PaintCanvasThemeMode;

  /**
   * Initial stroke color in hex format.
   */
  defaultColor?: string;

  /**
   * Initial brush size in pixels.
   */
  defaultBrushSize?: number;

  /**
   * Drawing surface height in pixels.
   */
  canvasHeight?: number;

  /**
   * Lock drawing interactions when true.
   *
   * @schema {"type":"boolean"}
   */
  readOnly?: boolean;

  /**
   * Show toolbar controls above the canvas.
   *
   * @schema {"type":"boolean"}
   */
  showToolbar?: boolean;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

export default function PaintCanvas({
  themeMode = "light",
  defaultColor = "#2563eb",
  defaultBrushSize = 4,
  canvasHeight = 260,
  readOnly = false,
  showToolbar = true,
  className = "",
  ...props
}: PaintCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<PaintCanvasTool>("pen");
  const [color, setColor] = useState<string>(defaultColor);
  const [brushSize, setBrushSize] = useState<number>(defaultBrushSize);

  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;
  const safeHeight = Math.max(140, canvasHeight);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(200, Math.floor(rect.width));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const prevData = document.createElement("canvas");
      prevData.width = canvas.width;
      prevData.height = canvas.height;
      const prevCtx = prevData.getContext("2d");
      if (prevCtx && canvas.width > 0 && canvas.height > 0) {
        prevCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(safeHeight * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${safeHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (prevCtx && prevData.width > 0 && prevData.height > 0) {
          ctx.drawImage(
            prevData,
            0,
            0,
            prevData.width / dpr,
            prevData.height / dpr
          );
        }
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    return () => observer.disconnect();
  }, [safeHeight]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pt = getPoint(e);
    lastPtRef.current = pt;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, brushSize);
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || readOnly || !lastPtRef.current) return;
    const pt = getPoint(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, brushSize);
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    lastPtRef.current = pt;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPtRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  return (
    <div
      {...props}
      ref={containerRef}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {showToolbar && (
        <div className={styles.toolbar}>
          <div className={styles.group}>
            <button
              type="button"
              disabled={readOnly}
              onClick={() => setTool("pen")}
              className={`${styles.btn} ${tool === "pen" ? styles.active : ""}`}
            >
              Pen
            </button>
            <button
              type="button"
              disabled={readOnly}
              onClick={() => setTool("eraser")}
              className={`${styles.btn} ${tool === "eraser" ? styles.active : ""}`}
            >
              Eraser
            </button>
          </div>

          <div className={styles.group}>
            <label className={styles.controlLabel}>
              Color
              <input
                type="color"
                value={color}
                disabled={readOnly || tool === "eraser"}
                onChange={(e) => setColor(e.target.value)}
                className={styles.colorInput}
              />
            </label>

            <label className={styles.controlLabel}>
              Size
              <input
                type="range"
                min={1}
                max={24}
                value={brushSize}
                disabled={readOnly}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </label>
          </div>

          <button
            type="button"
            disabled={readOnly}
            onClick={handleClear}
            className={styles.clearBtn}
          >
            Clear
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        aria-label="Drawing canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={styles.canvas}
      />
    </div>
  );
}
