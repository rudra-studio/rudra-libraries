import React, {
  useMemo,
  useState,
} from "react";

import {
  Check,
  Circle,
  X,
} from "lucide-react";

export type StepperOrientation =
  | "horizontal"
  | "vertical";

export type StepperStatus =
  | "pending"
  | "active"
  | "completed"
  | "error";

export interface StepperItem {
  id: string;

  label: string;

  description?: string;

  /**
   * Optional explicit status.
   *
   * If omitted, status is derived
   * from activeStep.
   */
  status?: StepperStatus;

  disabled?: boolean;

  optional?: boolean;

  data?: any;
}

export interface StepperRenderContext {
  item: StepperItem | null;

  index: number;

  status: StepperStatus;

  active: boolean;

  completed: boolean;

  disabled: boolean;

  goTo: () => void;
}

export interface StepperProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  /**
   * Steps.
   *
   * @type|complex
   * @schema {
   *   "type":"array",
   *   "items":{
   *     "type":"object",
   *     "required":["id","label"],
   *     "properties":{
   *       "id":{"type":"string"},
   *       "label":{"type":"string"},
   *       "description":{"type":"string"},
   *       "status":{
   *         "type":"string",
   *         "enum":[
   *           "pending",
   *           "active",
   *           "completed",
   *           "error"
   *         ]
   *       },
   *       "disabled":{"type":"boolean"},
   *       "optional":{"type":"boolean"},
   *       "data":{"type":"object"}
   *     }
   *   }
   * }
   */
  items?: StepperItem[];

  /**
   * Custom step content.
   *
   * @nodeFunction
   */
  children?:
    | React.ReactNode
    | ((
        context: StepperRenderContext
      ) => React.ReactNode);

  /**
   * Controlled active step index.
   */
  activeStep?: number;

  /**
   * Initial active step.
   */
  defaultActiveStep?: number;

  /**
   * @select|horizontal|vertical
   */
  orientation?: StepperOrientation;

  /**
   * Allow clicking steps.
   */
  clickable?: boolean;

  /**
   * Allow clicking future steps.
   */
  allowFutureSteps?: boolean;

  /**
   * Show step descriptions.
   */
  showDescription?: boolean;

  /**
   * Show "Optional" label.
   */
  showOptionalLabel?: boolean;

  /**
   * Display connector lines.
   */
  showConnector?: boolean;

  /**
   * Display step number instead of
   * the pending circle icon.
   */
  showStepNumber?: boolean;

  /**
   * Diameter of step indicator.
   */
  indicatorSize?: number;

  /**
   * @color
   */
  activeColor?: string;

  /**
   * @color
   */
  completedColor?: string;

  /**
   * @color
   */
  pendingColor?: string;

  /**
   * @color
   */
  errorColor?: string;

  /**
   * @color
   */
  connectorColor?: string;

  /**
   * @color
   */
  completedConnectorColor?: string;

  emptyText?: string;

  /**
   * @type|class
   */
  className?: string;

  /**
   * @type|class
   */
  stepClassName?: string;

  /**
   * @type|class
   */
  labelClassName?: string;

  /**
   * @type|class
   */
  descriptionClassName?: string;

  /**
   * @type|class
   */
  indicatorClassName?: string;

  /**
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
  onStepClick?: (
    item: StepperItem,
    index: number
  ) => void;

  /**
   * @type|function
   */
  onActiveStepChange?: (
    index: number,
    item: StepperItem
  ) => void;
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}

export default function Stepper({
  items = [],

  children,

  activeStep,

  defaultActiveStep = 0,

  orientation = "horizontal",

  clickable = true,

  allowFutureSteps = false,

  showDescription = true,

  showOptionalLabel = true,

  showConnector = true,

  showStepNumber = true,

  indicatorSize = 32,

  activeColor = "#2563eb",

  completedColor = "#16a34a",

  pendingColor = "#9ca3af",

  errorColor = "#dc2626",

  connectorColor = "#e5e7eb",

  completedConnectorColor = "#16a34a",

  emptyText = "Add steps",

  className = "w-full",

  stepClassName = "",

  labelClassName = "",

  descriptionClassName = "",

  indicatorClassName = "",

  customAttributes = {},

  onStepClick,

  onActiveStepChange,

  style,

  ...props
}: StepperProps) {
  const [
    internalActiveStep,
    setInternalActiveStep,
  ] = useState(
    defaultActiveStep
  );

  const controlled =
    activeStep !== undefined;

  const resolvedActiveStep =
    items.length === 0
      ? 0
      : clamp(
          controlled
            ? activeStep
            : internalActiveStep,
          0,
          items.length - 1
        );

  const vertical =
    orientation ===
    "vertical";

  const statuses =
    useMemo(
      () =>
        items.map(
          (
            item,
            index
          ): StepperStatus => {
            if (
              item.status
            ) {
              return item.status;
            }

            if (
              index <
              resolvedActiveStep
            ) {
              return "completed";
            }

            if (
              index ===
              resolvedActiveStep
            ) {
              return "active";
            }

            return "pending";
          }
        ),
      [
        items,
        resolvedActiveStep,
      ]
    );

  const goToStep = (
    item: StepperItem,
    index: number
  ) => {
    if (
      item.disabled ||
      !clickable
    ) {
      return;
    }

    if (
      !allowFutureSteps &&
      index >
        resolvedActiveStep
    ) {
      return;
    }

    if (!controlled) {
      setInternalActiveStep(
        index
      );
    }

    onActiveStepChange?.(
      index,
      item
    );

    onStepClick?.(
      item,
      index
    );
  };

  const getStatusColor = (
    status: StepperStatus
  ) => {
    if (
      status ===
      "completed"
    ) {
      return completedColor;
    }

    if (
      status ===
      "active"
    ) {
      return activeColor;
    }

    if (
      status ===
      "error"
    ) {
      return errorColor;
    }

    return pendingColor;
  };

  const renderIndicator = (
    item: StepperItem,
    index: number,
    status: StepperStatus
  ) => {
    const color =
      getStatusColor(
        status
      );

    const completed =
      status ===
      "completed";

    const error =
      status ===
      "error";

    return (
      <div
        className={
          indicatorClassName
        }
        style={{
          position:
            "relative",

          width:
            indicatorSize,

          height:
            indicatorSize,

          flexShrink: 0,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          borderRadius:
            "50%",

          border:
            `2px solid ${color}`,

          background:
            status ===
              "active" ||
            completed ||
            error
              ? color
              : "#ffffff",

          color:
            status ===
              "active" ||
            completed ||
            error
              ? "#ffffff"
              : color,

          fontSize:
            12,

          fontWeight:
            700,

          boxSizing:
            "border-box",

          zIndex: 2,
        }}
      >
        {completed ? (
          <Check
            size={
              Math.max(
                14,
                indicatorSize *
                  0.5
              )
            }
            strokeWidth={
              2.5
            }
          />
        ) : error ? (
          <X
            size={
              Math.max(
                14,
                indicatorSize *
                  0.5
              )
            }
            strokeWidth={
              2.5
            }
          />
        ) : showStepNumber ? (
          index + 1
        ) : (
          <Circle
            size={
              Math.max(
                8,
                indicatorSize *
                  0.3
              )
            }
            fill={
              status ===
              "active"
                ? "currentColor"
                : "none"
            }
          />
        )}
      </div>
    );
  };

  if (
    items.length === 0
  ) {
    return (
      <div
        className={
          className
        }
        {...customAttributes}
        {...props}
        style={{
          width:
            "100%",

          padding:
            14,

          border:
            "1px dashed #d1d5db",

          borderRadius:
            8,

          color:
            "#9ca3af",

          fontSize:
            13,

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {typeof children ===
        "function"
          ? children({
              item: null,
              index: 0,
              status:
                "pending",
              active:
                false,
              completed:
                false,
              disabled:
                false,
              goTo:
                () => {},
            })
          : emptyText}
      </div>
    );
  }

  return (
    <div
      className={
        className
      }
      {...customAttributes}
      {...props}
      style={{
        position:
          "relative",

        display:
          vertical
            ? "flex"
            : "grid",

        flexDirection:
          vertical
            ? "column"
            : undefined,

        gridTemplateColumns:
          vertical
            ? undefined
            : `repeat(${items.length}, minmax(0, 1fr))`,

        width:
          "100%",

        boxSizing:
          "border-box",

        ...style,
      }}
    >
      {items.map(
        (
          item,
          index
        ) => {
          const status =
            statuses[index];

          const active =
            status ===
            "active";

          const completed =
            status ===
            "completed";

          const disabled =
            Boolean(
              item.disabled
            );

          const hasNext =
            index <
            items.length - 1;

          const nextStatus =
            statuses[
              index + 1
            ];

          const connectorCompleted =
            completed &&
            (
              nextStatus ===
                "completed" ||
              nextStatus ===
                "active"
            );

          const futureStep =
            index >
            resolvedActiveStep;

          const canClick =
            clickable &&
            !disabled &&
            (
              allowFutureSteps ||
              !futureStep
            );

          const context:
            StepperRenderContext = {
            item,
            index,
            status,
            active,
            completed,
            disabled,

            goTo:
              () =>
                goToStep(
                  item,
                  index
                ),
          };

          return (
            <div
              key={
                item.id
              }
              className={
                stepClassName
              }
              style={{
                position:
                  "relative",

                display:
                  "flex",

                flexDirection:
                  vertical
                    ? "row"
                    : "column",

                alignItems:
                  vertical
                    ? "flex-start"
                    : "center",

                width:
                  "100%",

                minWidth: 0,

                boxSizing:
                  "border-box",
              }}
            >
              {/*
               * Horizontal connector.
               */}
              {!vertical &&
                showConnector &&
                index > 0 && (
                  <div
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",

                      top:
                        indicatorSize /
                        2,

                      right:
                        "50%",

                      width:
                        "50%",

                      height:
                        2,

                      background:
                        statuses[
                          index -
                            1
                        ] ===
                        "completed"
                          ? completedConnectorColor
                          : connectorColor,

                      transform:
                        "translateY(-50%)",

                      zIndex: 0,
                    }}
                  />
                )}

              {!vertical &&
                showConnector &&
                hasNext && (
                  <div
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",

                      top:
                        indicatorSize /
                        2,

                      left:
                        "50%",

                      width:
                        "50%",

                      height:
                        2,

                      background:
                        connectorCompleted
                          ? completedConnectorColor
                          : connectorColor,

                      transform:
                        "translateY(-50%)",

                      zIndex: 0,
                    }}
                  />
                )}

              <button
                type="button"
                disabled={
                  !canClick
                }
                onClick={() =>
                  goToStep(
                    item,
                    index
                  )
                }
                aria-current={
                  active
                    ? "step"
                    : undefined
                }
                style={{
                  position:
                    "relative",

                  display:
                    "flex",

                  flexDirection:
                    vertical
                      ? "row"
                      : "column",

                  alignItems:
                    vertical
                      ? "flex-start"
                      : "center",

                  gap:
                    vertical
                      ? 12
                      : 8,

                  width:
                    vertical
                      ? "100%"
                      : "auto",

                  padding: 0,

                  border: 0,

                  background:
                    "transparent",

                  color:
                    "inherit",

                  textAlign:
                    vertical
                      ? "left"
                      : "center",

                  cursor:
                    canClick
                      ? "pointer"
                      : "default",

                  opacity:
                    disabled
                      ? 0.45
                      : 1,

                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    position:
                      "relative",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      "center",

                    flexShrink: 0,
                  }}
                >
                  {renderIndicator(
                    item,
                    index,
                    status
                  )}

                  {vertical &&
                    showConnector &&
                    hasNext && (
                      <div
                        aria-hidden="true"
                        style={{
                          width: 2,

                          minHeight:
                            showDescription
                              ? 50
                              : 32,

                          flex: 1,

                          marginTop:
                            4,

                          background:
                            connectorCompleted
                              ? completedConnectorColor
                              : connectorColor,
                        }}
                      />
                    )}
                </div>

                <div
                  style={{
                    minWidth: 0,

                    paddingTop:
                      vertical
                        ? 5
                        : 0,

                    paddingBottom:
                      vertical &&
                      hasNext
                        ? 20
                        : 0,
                  }}
                >
                  {typeof children ===
                  "function" ? (
                    children(
                      context
                    )
                  ) : children ? (
                    children
                  ) : (
                    <>
                      <div
                        className={
                          labelClassName
                        }
                        style={{
                          color:
                            status ===
                            "error"
                              ? errorColor
                              : active
                                ? activeColor
                                : completed
                                  ? "#111827"
                                  : "#6b7280",

                          fontSize:
                            14,

                          fontWeight:
                            active
                              ? 700
                              : 600,

                          lineHeight:
                            1.35,

                          whiteSpace:
                            vertical
                              ? "normal"
                              : "nowrap",

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {item.label}

                        {item.optional &&
                          showOptionalLabel && (
                            <span
                              style={{
                                marginLeft:
                                  5,

                                color:
                                  "#9ca3af",

                                fontSize:
                                  11,

                                fontWeight:
                                  400,
                              }}
                            >
                              Optional
                            </span>
                          )}
                      </div>

                      {showDescription &&
                        item.description && (
                          <div
                            className={
                              descriptionClassName
                            }
                            style={{
                              marginTop:
                                3,

                              color:
                                "#9ca3af",

                              fontSize:
                                12,

                              fontWeight:
                                400,

                              lineHeight:
                                1.45,

                              whiteSpace:
                                vertical
                                  ? "normal"
                                  : "nowrap",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {
                              item.description
                            }
                          </div>
                        )}
                    </>
                  )}
                </div>
              </button>
            </div>
          );
        }
      )}
    </div>
  );
}