import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';

export interface PortalProps {
  children?: React.ReactNode;
  container?: Element | DocumentFragment | null;
  containerId?: string;
  createContainer?: boolean;
  disabled?: boolean;
  portalClassName?: string;
  onMount?: () => void /* @type|function|return:void */;
  onUnmount?: () => void /* @type|function|return:void */;
}

export default function Portal({
  children,
  container,
  containerId = 'rudra-portal-root',
  createContainer = true,
  disabled = false,
  portalClassName = '',
  onMount,
  onUnmount,
}: PortalProps) {
  const [target, setTarget] = useState<Element | DocumentFragment | null>(null);

  useEffect(() => {
    if (disabled || typeof document === 'undefined') return;

    let resolvedTarget = container || document.getElementById(containerId);
    let createdElement: HTMLElement | null = null;

    if (!resolvedTarget && createContainer) {
      createdElement = document.createElement('div');
      createdElement.id = containerId;
      createdElement.dataset.rudraPortalContainer = 'true';
      document.body.appendChild(createdElement);
      resolvedTarget = createdElement;
    }

    setTarget(resolvedTarget);
    onMount?.();

    return () => {
      setTarget(null);
      onUnmount?.();
      if (createdElement && createdElement.childElementCount === 0) {
        createdElement.remove();
      }
    };
  }, [container, containerId, createContainer, disabled, onMount, onUnmount]);

  if (disabled) return <>{children}</>;
  if (!target) return null;

  return createPortal(
    <div
      className={[styles.portalRoot, portalClassName].filter(Boolean).join(' ')}
      data-rudra-portal-root=""
    >
      {children}
    </div>,
    target,
  );
}
