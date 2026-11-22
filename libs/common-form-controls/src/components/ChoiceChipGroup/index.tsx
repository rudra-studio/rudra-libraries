import React, { useState } from "react";
import styles from "./styles.module.scss";

export type ChoiceChipThemeMode = "light" | "dark";

export interface ChoiceChipItem {
  id: string;
  label: string;
}

export interface ChoiceChipGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "className" | "children"
  > {
  /**
   * Theme appearance mode.
   *
   * @select|light|dark
   */
  themeMode?: ChoiceChipThemeMode;

  /**
   * Optional group label.
   *
   * @translate
   */
  label?: string;

  /**
   * Selectable chip items.
   */
  chips?: ChoiceChipItem[];

  /**
   * Allow selecting multiple chips at once.
   *
   * @schema {"type":"boolean"}
   */
  multiple?: boolean;

  /**
   * Controlled selected chip IDs.
   */
  selectedIds?: string[];

  /**
   * Emits selected chip IDs on change.
   */
  onSelectionChange?: (ids: string[]) => void;

  /**
   * Root container customization.
   *
   * @type|class
   */
  className?: string;
}

const DEFAULT_CHIPS: ChoiceChipItem[] = [
  { id: "react", label: "React" },
  { id: "nextjs", label: "Next.js" },
  { id: "go", label: "Go" },
  { id: "postgres", label: "PostgreSQL" },
];

export default function ChoiceChipGroup({
  themeMode = "light",
  label = "Stack Tags",
  chips = DEFAULT_CHIPS,
  multiple = true,
  selectedIds,
  onSelectionChange,
  className = "",
  ...props
}: ChoiceChipGroupProps) {
  const list = Array.isArray(chips) && chips.length > 0 ? chips : DEFAULT_CHIPS;
  const [internalSelected, setInternalSelected] = useState<string[]>(
    Array.isArray(selectedIds) ? selectedIds : [list[0]?.id || "react"]
  );
  const current = Array.isArray(selectedIds) ? selectedIds : internalSelected;
  const modeClass =
    themeMode === "dark" ? styles.mode_dark : styles.mode_light;

  const toggleChip = (id: string) => {
    let next: string[];
    if (multiple) {
      next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
    } else {
      next = current.includes(id) ? [] : [id];
    }
    setInternalSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div
      {...props}
      data-theme={themeMode}
      className={[styles.root, modeClass, "w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row} role="group" aria-label={label || "Chips"}>
        {list.map((chip, idx) => {
          const isSelected = current.includes(chip.id);
          return (
            <button
              key={chip.id || idx}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleChip(chip.id)}
              className={[styles.chip, isSelected ? styles.selected : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
