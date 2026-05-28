import React, { useRef, useState, useEffect } from 'react';
import { Trash2, PenTool, Eraser } from 'lucide-react';

export interface PaintCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultColor?: string; /* @color */
  defaultBrushSize?: number;
  canvasHeight?: string;
  readOnly?: boolean;
}

export default function PaintCanvas({
  defaultColor = '#3b82f6',
  defaultBrushSize = 4,
  canvasHeight = '400px',
  readOnly = false,
  className = '',
  ...props
}: PaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  
  // Local state for the floating toolbar
  const [color, setColor] = useState(defaultColor);
  const [brushSize, setBrushSize] = useState(defaultBrushSize);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (canvas && wrapper) {
      // Setup high-DPI canvas for crisp lines
      const rect = wrapper.getBoundingClientRect();
      
      // We multiply by 2 for retina displays, then scale it down via CSS
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
        setContext(ctx);
      }
    }
  }, []);

  // Update brush settings when state changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = isEraser ? '#ffffff' : color;
      context.lineWidth = brushSize;
    }
  }, [context, color, brushSize, isEraser]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: (e as React.MouseEvent).clientX - rect.left,
      offsetY: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly || !context) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    // Draw a single dot if they just click
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || readOnly || !context) return;
    e.preventDefault(); // Prevent scrolling on touch devices while drawing
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (context) context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, rect.width, rect.height);
    }
  };

  return (
    <div 
      ref={wrapperRef}
      className={`relative w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white shadow-sm ${className}`} 
      style={{ height: canvasHeight }} 
      {...props}
    >
      {/* Floating Toolbar */}
      {!readOnly && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
          
          <input 
            type="color" 
            value={color}
            onChange={(e) => { setColor(e.target.value); setIsEraser(false); }}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0 overflow-hidden"
          />
          
          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          <button 
            onClick={() => setIsEraser(false)} 
            className={`p-1.5 rounded transition-colors ${!isEraser ? 'bg-blue-100 text-blue-600' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <PenTool size={16} />
          </button>

          <button 
            onClick={() => setIsEraser(true)} 
            className={`p-1.5 rounded transition-colors ${isEraser ? 'bg-blue-100 text-blue-600' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <Eraser size={16} />
          </button>

          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          <input 
            type="range" 
            min="1" 
            max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 accent-blue-500"
          />
          <span className="text-[10px] font-mono text-zinc-500 w-6">{brushSize}px</span>

          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          <button 
            onClick={clearCanvas} 
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Clear Canvas"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* The actual drawing surface */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`touch-none ${isEraser ? 'cursor-cell' : 'cursor-crosshair'} ${readOnly ? 'cursor-default' : ''}`}
      />
    </div>
  );
}