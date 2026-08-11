import React from "react";
import styles from "./styles.module.scss";

export type InteractionWrapperElement =
  | "div"
  | "span"
  | "section"
  | "article";

export type InteractionType =
  | "click"
  | "doubleClick"
  | "hoverStart"
  | "hoverEnd"
  | "pointerDown"
  | "pointerUp"
  | "focus"
  | "blur"
  | "keyDown"
  | "contextMenu";

export interface InteractionEvent {
  componentId: string;
  type: InteractionType;
  pointerType?: string;
  x?: number;
  y?: number;
  button?: number;
  key?: string;
  code?: string;
  repeat?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  metadata?: Record<string, unknown>;
}

export interface InteractionWrapperProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    | "children"
    | "className"
    | "role"
    | "onClick"
    | "onDoubleClick"
    | "onPointerEnter"
    | "onPointerLeave"
    | "onPointerDown"
    | "onPointerUp"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "onContextMenu"
  > {
  id?: string;
  children?: React.ReactNode;

  /** @select|div|span|section|article */
  as?: InteractionWrapperElement;

  role?: string;

  /** @translate */
  ariaLabel?: string;

  disabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;

  /** @type|json */
  metadata?: Record<string, unknown>;

  /**
   * @type|complex
   * @schema {"type":"object"}
   */
  additionalAttributes?: Record<
    string,
    string | number | boolean | undefined
  >;

  /**
   * @type|class
   * @schema [{"key":"Display","prefix":"","type":"select","options":[{"key":"block","label":"Block"},{"key":"inline-block","label":"Inline Block"},{"key":"inline-flex","label":"Inline Flex"},{"key":"flex","label":"Flex"},{"key":"contents","label":"Contents"}]},{"key":"Cursor","prefix":"cursor","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"default","label":"Default"},{"key":"pointer","label":"Pointer"},{"key":"grab","label":"Grab"},{"key":"text","label":"Text"},{"key":"not-allowed","label":"Not Allowed"}]},{"key":"Width","prefix":"w","type":"select","options":[{"key":"auto","label":"Auto"},{"key":"full","label":"Full Width"}]},{"key":"Radius","prefix":"rounded","type":"select","options":[{"key":"none","label":"None"},{"key":"sm","label":"Small"},{"key":"md","label":"Medium"},{"key":"lg","label":"Large"},{"key":"xl","label":"Extra Large"},{"key":"full","label":"Full"}]}]
   */
  className?: string;

  /** @type|function */
  onClick?: (event: InteractionEvent) => void;

  /** @type|function */
  onDoubleClick?: (event: InteractionEvent) => void;

  /** @type|function */
  onHoverStart?: (event: InteractionEvent) => void;

  /** @type|function */
  onHoverEnd?: (event: InteractionEvent) => void;

  /** @type|function */
  onPointerDown?: (event: InteractionEvent) => void;

  /** @type|function */
  onPointerUp?: (event: InteractionEvent) => void;

  /** @type|function */
  onFocus?: (event: InteractionEvent) => void;

  /** @type|function */
  onBlur?: (event: InteractionEvent) => void;

  /** @type|function */
  onKeyDown?: (event: InteractionEvent) => void;

  /** @type|function */
  onContextMenu?: (event: InteractionEvent) => void;
}

export default function InteractionWrapper({
  id = "rudra-interaction",
  children,
  as = "div",
  role,
  ariaLabel,
  disabled = false,
  preventDefault = false,
  stopPropagation = false,
  metadata,
  additionalAttributes = {},
  className = "",
  onClick,
  onDoubleClick,
  onHoverStart,
  onHoverEnd,
  onPointerDown,
  onPointerUp,
  onFocus,
  onBlur,
  onKeyDown,
  onContextMenu,
  ...props
}: InteractionWrapperProps) {
  const Element = as;

  const prepareEvent = (event: React.SyntheticEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }

    if (stopPropagation) {
      event.stopPropagation();
    }
  };

  const createPointerEvent = (
    type: InteractionType,
    event: React.MouseEvent | React.PointerEvent
  ): InteractionEvent => ({
    componentId: id,
    type,
    pointerType:
      "pointerType" in event && event.pointerType
        ? event.pointerType
        : undefined,
    x: event.clientX,
    y: event.clientY,
    button: event.button,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    metaKey: event.metaKey,
    metadata,
  });

  const createFocusEvent = (
    type: "focus" | "blur"
  ): InteractionEvent => ({
    componentId: id,
    type,
    metadata,
  });

  const createKeyboardEvent = (
    event: React.KeyboardEvent
  ): InteractionEvent => ({
    componentId: id,
    type: "keyDown",
    key: event.key,
    code: event.code,
    repeat: event.repeat,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    metaKey: event.metaKey,
    metadata,
  });

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onClick?.(createPointerEvent("click", event));
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onDoubleClick?.(createPointerEvent("doubleClick", event));
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onHoverStart?.(createPointerEvent("hoverStart", event));
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onHoverEnd?.(createPointerEvent("hoverEnd", event));
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onPointerDown?.(createPointerEvent("pointerDown", event));
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onPointerUp?.(createPointerEvent("pointerUp", event));
  };

  const handleFocus = (event: React.FocusEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onFocus?.(createFocusEvent("focus"));
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onBlur?.(createFocusEvent("blur"));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onKeyDown?.(createKeyboardEvent(event));
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (disabled) return;

    prepareEvent(event);
    onContextMenu?.(createPointerEvent("contextMenu", event));
  };

  const resolvedClassName = [styles.wrapper, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Element
      {...additionalAttributes}
      {...props}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={resolvedClassName}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
    >
      {children}
    </Element>
  );
}