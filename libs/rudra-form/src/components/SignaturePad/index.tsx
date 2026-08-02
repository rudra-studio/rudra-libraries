import React, { useEffect, useId, useRef, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper from '../FieldWrapper';
import styles from './styles.module.scss';
interface Point { x: number; y: number } interface Stroke { points: Point[] }
export interface SignatureMetadata { type: string; size: number; width: number; height: number; updatedAt: number }
export interface SignaturePadProps {
  name: string; label?: string; width?: number; height?: number; lineWidth?: number; penColor?: string; backgroundColor?: string;
  onChange?: (blob: Blob, metadata: SignatureMetadata) => void; onClear?: () => void; clearLabel?: string; undoLabel?: string;
  disabled?: boolean; required?: boolean; error?: string; className?: string;
}
export default function SignaturePad({ name, label, width = 720, height = 240, lineWidth = 2.5, penColor = '#0f172a', backgroundColor = '#ffffff', onChange, onClear, clearLabel = 'Clear', undoLabel = 'Undo', disabled, required, error, className }: SignaturePadProps) {
  const form = useRudraForm(); const id = useId(); const canvasRef = useRef<HTMLCanvasElement>(null); const strokes = useRef<Stroke[]>([]); const drawing = useRef(false); const [revision, setRevision] = useState(0); const resolvedError = error ?? form?.errors?.[name];
  const drawAll = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, width, height); ctx.strokeStyle = penColor; ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const stroke of strokes.current) { if (stroke.points.length < 2) continue; ctx.beginPath(); ctx.moveTo(stroke.points[0].x, stroke.points[0].y); stroke.points.slice(1).forEach(point => ctx.lineTo(point.x, point.y)); ctx.stroke() } };
  useEffect(drawAll, [backgroundColor, height, lineWidth, penColor, width, revision]);
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (width / rect.width), y: (event.clientY - rect.top) * (height / rect.height) } };
  const emit = () => { const canvas = canvasRef.current; if (!canvas) return; canvas.toBlob(blob => { if (!blob) return; const metadata = { type: blob.type, size: blob.size, width, height, updatedAt: Date.now() }; form?.handleChange(name, metadata); onChange?.(blob, metadata) }, 'image/png') };
  const clear = () => { strokes.current = []; setRevision(value => value + 1); form?.handleChange(name, null); onClear?.() };
  const undo = () => { strokes.current.pop(); setRevision(value => value + 1); if (strokes.current.length) window.setTimeout(emit, 0); else form?.handleChange(name, null) };
  return <FieldWrapper label={label} error={resolvedError} required={required} className={styles.wrapper}><div className={[styles.root, resolvedError ? styles.invalid : '', disabled ? styles.disabled : '', className ?? ''].filter(Boolean).join(' ')}>
    <canvas ref={canvasRef} id={`rudra-signature-${id}`} width={width} height={height} className={styles.canvas} role="img" aria-label={label ?? 'Signature drawing area'} onPointerDown={event => { if (disabled) return; event.currentTarget.setPointerCapture(event.pointerId); drawing.current = true; strokes.current.push({ points: [point(event)] }) }} onPointerMove={event => { if (!drawing.current || disabled) return; const stroke = strokes.current[strokes.current.length - 1]; const next = point(event); const previous = stroke.points[stroke.points.length - 1]; stroke.points.push(next); const ctx = event.currentTarget.getContext('2d'); if (ctx) { ctx.strokeStyle = penColor; ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(previous.x, previous.y); ctx.lineTo(next.x, next.y); ctx.stroke() } }} onPointerUp={() => { if (!drawing.current) return; drawing.current = false; emit() }} onPointerCancel={() => { drawing.current = false }} />
    <div className={styles.actions}><button type="button" disabled={disabled || strokes.current.length === 0} onClick={undo}>{undoLabel}</button><button type="button" disabled={disabled || strokes.current.length === 0} onClick={clear}>{clearLabel}</button></div>
    <span className={styles.note}>Signature data is returned as a PNG Blob; only metadata is stored in form state.</span>
  </div></FieldWrapper>
}
