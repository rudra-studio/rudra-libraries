import React from "react";
import styles from "./styles.module.scss";

export type StructuredGridThemeMode = "light" | "dark";

export interface StructuredGridSlot {
  name: string;
  node?: React.ReactNode;
}

export interface StructuredGridProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: StructuredGridThemeMode;

  /**
   * CSS grid-template-areas rows.
   */
  templateAreas?: string[];

  /**
   * CSS grid-template-columns value.
   */
  templateColumns?: string;

  /**
   * CSS grid-template-rows value.
   */
  templateRows?: string;

  /**
   * Minimum grid height in pixels.
   */
  minHeight?: number;

  /**
   * Slot definitions mapped by area name.
   */
  gridData?: StructuredGridSlot[];

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_AREAS = ['"header header"', '"main sidebar"'];

const DEFAULT_SLOTS: StructuredGridSlot[] = [
  { name: "header" },
  { name: "main" },
  { name: "sidebar" },
];

export default function StructuredGrid({
  themeMode = "light",
  templateAreas = DEFAULT_AREAS,
  templateColumns = "2fr 1fr",
  templateRows = "auto 1fr",
  minHeight = 200,
  gridData = DEFAULT_SLOTS,
  className = "gap-4",
  ...props
}: StructuredGridProps) {
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const areaNames = React.useMemo(() => {
    const names = new Set<string>();
    for (const row of templateAreas) {
      const cleaned = row.replace(/['"]/g, "").trim();
      for (const token of cleaned.split(/\s+/)) {
        if (token && token !== ".") {
          names.add(token);
        }
      }
    }
    for (const slot of gridData) {
      if (slot?.name) {
        names.add(slot.name);
      }
    }
    return Array.from(names);
  }, [templateAreas, gridData]);

  const slotMap = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    for (const slot of gridData) {
      if (slot?.name) {
        map.set(slot.name, slot.node);
      }
    }
    return map;
  }, [gridData]);

  return (
    <div
      {...props}
      data-theme={themeMode}
      style={{
        ...props.style,
        display: "grid",
        gridTemplateAreas: templateAreas.join(" "),
        gridTemplateColumns: templateColumns,
        gridTemplateRows: templateRows,
        minHeight: `${Math.max(120, minHeight)}px`,
      }}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {areaNames.map((areaName) => {
        const content = slotMap.get(areaName);
        return (
          <div
            key={areaName}
            style={{ gridArea: areaName }}
            className={styles.area}
          >
            {content || (
              <div className={styles.emptySlot}>
                <span>{areaName}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
