import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  /** Controls visibility */
  isOpen?: boolean;
  
  /** Triggers when the user clicks the X or the overlay */
  onClose?: () => void; /* @action */
  
  /** The Header content */
  title?: React.ReactNode; /* @node */
  
  /** The Body content */
  children?: React.ReactNode; /* @node */
  
  /** * THE BUILDER FLAG:
   * 'contained' = Absolute position, mounts inline (Stays inside the Rudra Canvas).
   * 'fullscreen' = Fixed position, mounts to document.body via Portal (Production ready).
   */
  mode?: 'contained' | 'fullscreen'; /* @select|contained|fullscreen */
  
  /** Width constraints */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; /* @select|sm|md|lg|xl|full */
  
  /** Should clicking the dark background close the modal? */
  closeOnOverlayClick?: boolean;
  
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onClose,
  title = "Modal Title",
  children,
  mode = 'contained',
  size = 'md',
  closeOnOverlayClick = true,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by ensuring portals only render on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when in fullscreen production mode
  useEffect(() => {
    if (mode === 'fullscreen' && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mode, isOpen]);

  if (!isOpen || !mounted) return null;

  // --- STYLE DICTIONARIES ---
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[95%] h-[95vh]',
  };

  // 'absolute' binds the modal to the nearest relative parent (your builder canvas).
  // 'fixed' binds it to the browser viewport.
  const overlayPosition = mode === 'contained' ? 'absolute' : 'fixed';

  // --- THE MODAL PAYLOAD ---
  const modalContent = (
    <div 
      className={`${overlayPosition} inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200`}
      aria-modal="true"
      role="dialog"
    >
      {/* The Dark Overlay */}
      <div 
        className={`${overlayPosition} inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity`} 
        onClick={() => closeOnOverlayClick && onClose?.()}
        aria-hidden="true"
      />

      {/* The Modal Dialog Box */}
      <div 
        className={`relative flex flex-col w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="text-lg font-bold text-slate-900">
            {title}
          </div>
          <button 
            onClick={() => onClose?.()}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Uses custom scrollbar logic from previous components) */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-50 min-h-[100px]">
          {children ? children : (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-mono">
              Drop Content Here
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- RENDER STRATEGY ---
  // In production (fullscreen), we portal the modal directly to the <body> tag 
  // so it isn't clipped by any overflow:hidden parents.
  // In the builder (contained), we render it inline where it was dropped.
  
  if (mode === 'fullscreen') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default Modal;